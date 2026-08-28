from __future__ import annotations

import asyncio
import base64
import concurrent.futures
import hashlib
import json
import mimetypes
import os
import re
import tempfile
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid
from pathlib import Path
from typing import Any

import folder_paths
from aiohttp import web
from server import PromptServer


USER_DEFAULT_DIR = Path(__file__).resolve().parents[2] / "user" / "default"
DEEPSEEK_ENV_PATH = USER_DEFAULT_DIR / "deepseek_api.env"
ARK_ENV_PATH = USER_DEFAULT_DIR / "doubao_vision_api.env"
DEEPSEEK_BASE_URL = "https://api.deepseek.com"
OFFICIAL_DEEPSEEK_MODEL = "deepseek-v4-flash"
DEFAULT_VISION_MODEL = "doubao-seed-2-1-pro-260628"
DEFAULT_VISION_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3"
MAX_VISION_IMAGE_BYTES = 8 * 1024 * 1024
MAX_VISION_NOTE_CHARS = 3200
VISION_CACHE_DIR = USER_DEFAULT_DIR / "minimax_h3_vision_cache"
PROMPT_API_CONFIG_VERSION = 5
PROMPT_API_CONFIG_LOCK = threading.RLock()
PROMPT_API_FORMATS = {"openai", "responses", "gemini", "ollama"}
PROMPT_API_MAX_MODELS = 500
PROMPT_API_MAX_OUTPUT_TOKENS = 6000
STORYBOARD_SKILL_DIR = Path(__file__).resolve().parents[1] / "nanfeng_prompt_nodes" / "storyboard-skill"
STORYBOARD_VISION_CACHE_DIR = USER_DEFAULT_DIR / "minimax_h3_storyboard_vision_cache"
STORYBOARD_VISION_CACHE_LIMIT = 64
STORYBOARD_MODES = {
    "ref2va": "多参 Ref2VA",
    "i2va": "I2VA（首帧生视频）",
    "t2va": "T2VA（文生视频）",
    "fl2va": "FL2VA（首尾帧生视频）",
    "l2va": "L2VA（尾帧生视频）",
}
_STORYBOARD_JOBS: dict[str, dict[str, Any]] = {}
_STORYBOARD_JOB_LOCK = threading.Lock()


class StoryboardCancelled(RuntimeError):
    pass


class _RequestAbortController:
    """Owns live upstream responses so DELETE can close the real model stream."""

    def __init__(self) -> None:
        self.event = threading.Event()
        self._lock = threading.Lock()
        self._responses: set[Any] = set()

    def raise_if_cancelled(self) -> None:
        if self.event.is_set():
            raise StoryboardCancelled("分镜生成已终止")

    def track(self, response: Any) -> None:
        with self._lock:
            self.raise_if_cancelled()
            self._responses.add(response)

    def untrack(self, response: Any) -> None:
        with self._lock:
            self._responses.discard(response)

    def cancel(self) -> int:
        self.event.set()
        with self._lock:
            responses = list(self._responses)
        closed = 0
        for response in responses:
            try:
                response.close()
                closed += 1
            except Exception:
                pass
        return closed

VISION_SYSTEM_PROMPT = """You are an auxiliary vision model for a MiniMax H3 video-prompt writer.
Analyze only what is visibly supported by the supplied image. Do not invent identity, motion, backstory, or hidden details.
Describe people carefully, including apparent gender presentation only when visually clear, plus clothing, hair, pose, expression, framing, environment, lighting, readable text, and important object relationships.
Return only one valid JSON object without Markdown."""

BASE_TEMPLATE = """integrated_multimodal_description: [Shot 1] 按时间顺序详细描述目标视频的画面和声音。

overall_soundscape: 描述连续的环境氛围和物理动作声音。

non_diegetic_music: 描述只有观众能听到的背景音乐；没有则写 N/A。"""

BASE_TEMPLATE_EN = """integrated_multimodal_description: [Shot 1] Describe the target video's visuals and sounds in chronological order.

overall_soundscape: Describe the continuous ambience and physical action sounds.

non_diegetic_music: Describe music heard only by the audience; use N/A when absent."""

REF_TEMPLATE = """subject_definitions:
定义下文使用的每个主体、图片、视频和音频引用标签。

summary:
[reference generation] 概述目标视频以及各引用素材之间的关系。

retention_analysis:
描述每个引用标签的内容如何被保留、迁移或借鉴。

detailed_description:
按播放顺序逐镜头描述目标视频，包括构图、主体、环境、动作、镜头、声音和引用标签。

overall_soundscape: 描述贯穿视频的环境氛围和物理声音。

non_diegetic_music: 描述只有观众能听到的背景音乐；没有则写 N/A。"""

REF_TEMPLATE_EN = """subject_definitions:
Define every subject, image, video, and audio reference label used below.

summary:
[reference generation] Summarize the target video and the relationships among all referenced media.

retention_analysis:
Describe how the content of every reference label is retained, transferred, or adapted.

detailed_description:
Describe the target video shot by shot in playback order, including composition, subjects, environment, actions, camera, sound, and reference labels.

overall_soundscape: Describe the ambience and physical sounds throughout the video.

non_diegetic_music: Describe music heard only by the audience; use N/A when absent."""


def _read_env_file(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        return values
    for raw in path.read_text(encoding="utf-8-sig").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
            value = value[1:-1]
        values[key.strip()] = value
    return values


def _read_deepseek_env() -> dict[str, str]:
    return _read_env_file(DEEPSEEK_ENV_PATH)


def _prompt_api_config_path() -> Path:
    # Keep the private settings beside this merged package. The file is
    # intentionally ignored by Git, but survives normal source updates.
    return Path(__file__).resolve().with_name("prompt_optimizer.json")


def _as_bool(value: Any, default: bool = False) -> bool:
    if isinstance(value, str):
        return value.strip().lower() in {"1", "true", "yes", "on"}
    if value is None:
        return default
    return bool(value)


def _normalize_prompt_api_config(value: Any) -> dict[str, Any]:
    source = value if isinstance(value, dict) else {}
    def provider(prefix: str) -> dict[str, Any]:
        key = f"{prefix}_" if prefix else ""
        api_format = str(source.get(f"{key}api_format") or "openai").strip().lower()
        if api_format not in PROMPT_API_FORMATS:
            api_format = "openai"
        available_models: list[str] = []
        for item in source.get(f"{key}available_models") or []:
            model_id = str(item or "").strip()
            if model_id and model_id not in available_models:
                available_models.append(model_id)
            if len(available_models) >= PROMPT_API_MAX_MODELS:
                break
        selected_model = str(source.get(f"{key}model") or "").strip()
        if selected_model and selected_model not in available_models:
            available_models.insert(0, selected_model)
        return {
            f"{key}api_format": api_format,
            f"{key}api_url": str(source.get(f"{key}api_url") or "").strip(),
            f"{key}api_key": str(source.get(f"{key}api_key") or ""),
            f"{key}model": selected_model,
            f"{key}available_models": available_models,
        }
    return {
        "version": PROMPT_API_CONFIG_VERSION,
        **provider(""),
        **provider("vision"),
        "read_media": _as_bool(source.get("read_media"), False),
        "optimize_on_run": _as_bool(source.get("optimize_on_run"), False),
        "unload_ollama_after_optimize": _as_bool(source.get("unload_ollama_after_optimize"), True),
    }


def _read_prompt_api_config() -> dict[str, Any]:
    path = _prompt_api_config_path()
    with PROMPT_API_CONFIG_LOCK:
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except (FileNotFoundError, OSError, TypeError, ValueError, json.JSONDecodeError):
            payload = {}
    return _normalize_prompt_api_config(payload)


def _write_prompt_api_config(value: Any) -> dict[str, Any]:
    normalized = _normalize_prompt_api_config(value)
    path = _prompt_api_config_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = ""
    with PROMPT_API_CONFIG_LOCK:
        try:
            with tempfile.NamedTemporaryFile(
                mode="w",
                encoding="utf-8",
                dir=path.parent,
                prefix=".prompt_api.",
                suffix=".tmp",
                delete=False,
            ) as handle:
                temporary_path = handle.name
                json.dump(normalized, handle, ensure_ascii=False, indent=2)
                handle.write("\n")
            os.replace(temporary_path, path)
        finally:
            if temporary_path and os.path.exists(temporary_path):
                try:
                    os.remove(temporary_path)
                except OSError:
                    pass
    return normalized


def _normalize_api_base_url(value: str) -> str:
    raw = str(value or "").strip()
    if not raw:
        raise RuntimeError("请填写 API 地址")
    if not re.match(r"^https?://", raw, flags=re.I):
        raw = "https://" + raw
    parsed = urllib.parse.urlsplit(raw)
    return urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, parsed.path.rstrip("/"), parsed.query, ""))


def _strip_generation_endpoint(url: str) -> str:
    parsed = urllib.parse.urlsplit(_normalize_api_base_url(url))
    path = parsed.path.rstrip("/")
    patterns = (
        r"/(?:v1/)?chat/completions$",
        r"/(?:v1/)?responses$",
        r"/(?:v1beta|v1)/models/[^/]+:(?:generateContent|streamGenerateContent)$",
    )
    for pattern in patterns:
        path = re.sub(pattern, "", path, flags=re.I)
    return urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, path.rstrip("/"), parsed.query, ""))


def _url_with_path(base: str, suffix: str) -> str:
    parsed = urllib.parse.urlsplit(base)
    path = parsed.path.rstrip("/")
    suffix = "/" + suffix.strip("/")
    # OpenAI-compatible providers may expose a version other than /v1.
    # Volcengine Ark, for example, uses /api/v3 and expects /api/v3/models,
    # /api/v3/chat/completions, or /api/v3/responses without an extra /v1.
    if re.search(r"/v\d+$", path, flags=re.I) and suffix.lower().startswith("/v1/"):
        suffix = suffix[3:]
    return urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, path + suffix, parsed.query, ""))


def _api_headers(api_key: str, api_format: str, *, json_content: bool = False) -> dict[str, str]:
    headers = {"Accept": "application/json", "User-Agent": "ComfyUI-MiniMaxH3-PromptWriter/2.0"}
    if json_content:
        headers["Content-Type"] = "application/json"
    key = str(api_key or "").strip()
    if key:
        if api_format == "gemini":
            headers["x-goog-api-key"] = key
        else:
            headers["Authorization"] = f"Bearer {key}"
    return headers


def _http_json(
    url: str,
    api_key: str,
    api_format: str,
    *,
    method: str = "GET",
    body: Any = None,
    timeout: float = 60,
) -> Any:
    data = None if body is None else json.dumps(body, ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=data,
        headers=_api_headers(api_key, api_format, json_content=body is not None),
        method=method,
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8", "replace"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "replace")[:1000]
        raise RuntimeError(f"API HTTP {exc.code}: {detail}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"API 连接失败：{exc.reason}") from exc
    except json.JSONDecodeError as exc:
        raise RuntimeError("API 返回的不是有效 JSON") from exc


def _models_endpoint(api_url: str, api_format: str) -> str:
    base = _strip_generation_endpoint(api_url)
    parsed = urllib.parse.urlsplit(base)
    path = parsed.path.rstrip("/")
    if api_format == "ollama":
        if path.lower().endswith("/v1"):
            path = path[:-3].rstrip("/")
        return urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, path + "/api/tags", parsed.query, ""))
    if api_format == "gemini":
        path = re.sub(r"/(?:v1beta|v1)(?:/models)?$", "", path, flags=re.I).rstrip("/")
        return urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, path + "/v1beta/models", parsed.query, ""))
    suffix = "/models" if re.search(r"/v\d+$", path, flags=re.I) else "/v1/models"
    return urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, path + suffix, parsed.query, ""))


def _fetch_prompt_models(api_format: str, api_url: str, api_key: str) -> list[str]:
    api_format = str(api_format or "openai").strip().lower()
    if api_format not in PROMPT_API_FORMATS:
        raise RuntimeError("不支持的 API 格式")
    payload = _http_json(_models_endpoint(api_url, api_format), api_key, api_format, timeout=45)
    candidates: list[Any]
    if api_format == "ollama":
        candidates = [item.get("name") for item in payload.get("models", []) if isinstance(item, dict)]
    else:
        candidates = []
        for item in payload.get("data", payload.get("models", [])) if isinstance(payload, dict) else []:
            if isinstance(item, str):
                candidates.append(item)
                continue
            if not isinstance(item, dict):
                continue
            if api_format == "gemini":
                methods = item.get("supportedGenerationMethods") or []
                if methods and "generateContent" not in methods:
                    continue
                candidates.append(str(item.get("name") or "").removeprefix("models/"))
            else:
                candidates.append(item.get("id") or item.get("name"))
    models = sorted({str(item or "").strip() for item in candidates if str(item or "").strip()}, key=str.lower)
    if not models:
        raise RuntimeError("API 没有返回可用模型")
    return models[:PROMPT_API_MAX_MODELS]


def _vision_config() -> dict[str, str]:
    cfg = _read_env_file(ARK_ENV_PATH)
    model_id = (
        os.environ.get("ARK_VISION_MODEL", "").strip()
        or cfg.get("ARK_VISION_MODEL", "").strip()
        or DEFAULT_VISION_MODEL
    )
    api_key = (
        os.environ.get("ARK_API_KEY", "").strip()
        or cfg.get("ARK_API_KEY", "").strip()
    )
    base_url = (
        os.environ.get("ARK_BASE_URL", "").strip()
        or cfg.get("ARK_BASE_URL", "").strip()
        or DEFAULT_VISION_BASE_URL
    )
    return {"model": model_id, "provider": "volcengine-ark", "base_url": base_url, "api_key": api_key}


def _sniff_image_mime(data: bytes) -> str:
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if data.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if data.startswith((b"GIF87a", b"GIF89a")):
        return "image/gif"
    if len(data) >= 12 and data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"
    if data.startswith(b"BM"):
        return "image/bmp"
    raise RuntimeError("仅支持 PNG、JPEG、WebP、GIF 或 BMP 图片")


def _resolve_comfy_image(reference: dict[str, Any]) -> tuple[Path, bytes, str]:
    filename = str(reference.get("filename", "")).strip()
    subfolder = str(reference.get("subfolder", "")).strip().replace("\\", "/")
    storage_type = str(reference.get("type", "input")).strip().lower()
    if storage_type not in {"input", "output", "temp"}:
        raise RuntimeError("图片来源类型无效")
    if not filename or "\x00" in filename or "\x00" in subfolder:
        raise RuntimeError("没有取得图片文件名")
    base_dir = folder_paths.get_directory_by_type(storage_type)
    if not base_dir:
        raise RuntimeError(f"ComfyUI 不支持图片来源目录：{storage_type}")
    relative_name = str(Path(subfolder) / filename) if subfolder else filename
    path = Path(folder_paths.get_annotated_filepath(relative_name, base_dir))
    if not path.is_file():
        raise RuntimeError(f"找不到图片：{relative_name}")
    size = path.stat().st_size
    if size <= 0:
        raise RuntimeError(f"图片为空：{relative_name}")
    if size > MAX_VISION_IMAGE_BYTES:
        raise RuntimeError(f"图片超过 8 MB：{relative_name}")
    data = path.read_bytes()
    return path, data, _sniff_image_mime(data)


def _vision_cache_path(data: bytes, model: str) -> Path:
    digest = hashlib.sha256()
    digest.update(data)
    digest.update(model.encode("utf-8", "replace"))
    return VISION_CACHE_DIR / f"{digest.hexdigest()}.json"


def _vision_user_prompt(tag: str) -> str:
    return f"""Analyze this reference image ({tag}) for another text-only model that will write a MiniMax H3 video prompt.
Return exactly one JSON object with these keys:
{{
  "image_overview": "what the image visibly depicts",
  "visible_text": ["important readable text"],
  "objects_and_layout": "subjects, apparent gender presentation when clear, clothing, appearance, pose, expression, objects, positions, counts, framing, scene and lighting",
  "user_request_answer": "the most important visible facts a video-prompt writer must preserve",
  "evidence": "visual evidence supporting the description",
  "uncertainty": "anything unclear or uncertain"
}}
Do not propose a new story or motion. Do not identify a real person. If gender presentation is unclear, say it is unclear instead of guessing."""


def _vision_response_text(payload: dict[str, Any]) -> str:
    choices = payload.get("choices") or []
    message = choices[0].get("message", {}) if choices and isinstance(choices[0], dict) else {}
    content = message.get("content") if isinstance(message, dict) else ""
    if isinstance(content, list):
        content = "".join(str(item.get("text") or "") for item in content if isinstance(item, dict) and item.get("type") == "text")
    return _strip_markdown_fence(str(content or "")).strip()


def _format_vision_note(tag: str, text: str) -> str:
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"{tag} 的识图结果不是有效 JSON") from exc
    if not isinstance(parsed, dict):
        raise RuntimeError(f"{tag} 的识图结果格式无效")
    visible_text = parsed.get("visible_text")
    if isinstance(visible_text, list):
        visible_text = "；".join(str(item).strip() for item in visible_text if str(item).strip()) or "无"
    parts = [
        f"{tag} 视觉内容：{str(parsed.get('image_overview') or '').strip()}",
        f"主体与构图：{str(parsed.get('objects_and_layout') or '').strip()}",
        f"与用户想法相关的可见信息：{str(parsed.get('user_request_answer') or '').strip()}",
        f"可见文字：{str(visible_text or '无').strip()}",
        f"视觉依据：{str(parsed.get('evidence') or '').strip()}",
        f"不确定项：{str(parsed.get('uncertainty') or '无').strip()}",
    ]
    return "\n".join(parts)[:MAX_VISION_NOTE_CHARS]


def _analyze_one_image(reference: dict[str, Any], user_prompt: str) -> str:
    del user_prompt
    tag = str(reference.get("tag", "<Picture>")).strip()
    if not re.fullmatch(r"<Picture \d+>", tag):
        raise RuntimeError("图片引用标签无效")
    _, data, mime_type = _resolve_comfy_image(reference)
    config = _vision_config()
    if not config["api_key"]:
        raise RuntimeError(f"尚未填写豆包识图 API Key；请打开 {ARK_ENV_PATH}，填写 ARK_API_KEY 后重启 ComfyUI")
    cache_path = _vision_cache_path(data, config["model"])
    try:
        cached = json.loads(cache_path.read_text(encoding="utf-8"))
        note = str(cached.get("note", "")).strip() if isinstance(cached, dict) else ""
        if note:
            return note
    except (OSError, ValueError, TypeError):
        pass
    endpoint = config["base_url"].rstrip("/")
    if not endpoint.endswith("/chat/completions"):
        endpoint = f"{endpoint}/chat/completions"
    body = {
        "model": config["model"],
        "messages": [
            {"role": "system", "content": VISION_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": _vision_user_prompt(tag)},
                    {"type": "image_url", "image_url": {"url": f"data:{mime_type};base64,{base64.b64encode(data).decode('ascii')}"}},
                ],
            },
        ],
        "max_tokens": 2400,
        "temperature": 0.1,
        "stream": False,
    }
    request = urllib.request.Request(
        endpoint,
        data=json.dumps(body, ensure_ascii=False).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {config['api_key']}",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "ComfyUI-MiniMaxH3-PromptWriter/vision-1.0",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            payload = json.loads(response.read().decode("utf-8", "replace"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "replace")[:400]
        if exc.code == 429:
            raise RuntimeError(f"{tag} 的豆包识图接口当前限流，请稍后重试；已连接的图片没有交给 DeepSeek 盲猜") from exc
        raise RuntimeError(f"{tag} 识图 HTTP {exc.code}: {detail}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"{tag} 识图连接失败：{exc.reason}") from exc
    text = _vision_response_text(payload if isinstance(payload, dict) else {})
    if not text:
        raise RuntimeError(f"{tag} 识图模型返回了空内容")
    note = _format_vision_note(tag, text)
    VISION_CACHE_DIR.mkdir(parents=True, exist_ok=True)
    temp_path = cache_path.with_suffix(f".tmp-{os.getpid()}-{time.time_ns()}")
    temp_path.write_text(json.dumps({"note": note}, ensure_ascii=False), encoding="utf-8")
    temp_path.replace(cache_path)
    return note


def _analyze_image_references(references: Any, user_prompt: str) -> tuple[str, int]:
    if not isinstance(references, list):
        return "", 0
    normalized = [item for item in references if isinstance(item, dict)][:15]
    if not normalized:
        return "", 0
    notes = [_analyze_one_image(reference, user_prompt) for reference in normalized]
    return "VISUAL ANALYSIS OF CONNECTED PICTURES (treat these visible facts as authoritative):\n" + "\n\n".join(notes), len(notes)


def _strip_markdown_fence(text: str) -> str:
    text = text.strip()
    match = re.fullmatch(r"```(?:text|markdown)?\s*(.*?)\s*```", text, flags=re.IGNORECASE | re.DOTALL)
    return match.group(1).strip() if match else text


_REFERENCE_MENTION_RE = re.compile(
    r"@\s*(?:<\s*)?(picture|video|audio|图片|视频|音频)\s*[_-]?\s*(\d+)\s*>?",
    flags=re.IGNORECASE,
)

def _normalize_reference_mentions(text: str) -> str:
    """Convert the editor's @ references to the official H3 reference labels."""
    names = {
        "picture": "Picture",
        "图片": "Picture",
        "video": "Video",
        "视频": "Video",
        "audio": "Audio",
        "音频": "Audio",
    }

    def replace(match: re.Match[str]) -> str:
        kind = names[match.group(1).lower()]
        return f"<{kind} {int(match.group(2))}>"

    return _REFERENCE_MENTION_RE.sub(replace, str(text or ""))


def _normalize_prompt(prompt_mode: str, text: str, duration: float) -> str:
    """Restore mandatory H3 alignment lines if the LLM paraphrases them."""
    text = text.strip()
    if prompt_mode == "I2VA":
        line = "For the target video, at 0.00 seconds into the target video, <Picture 1> (from [Shot 1]) is fully referenced."
        if not text.startswith(line):
            text = f"{line}\n\n{text}"
    elif prompt_mode == "FL2VA":
        line = (
            "How the reference pictures align with the target video — Picture 1 (from Shot 1) aligns with the 0.00-second mark of the target video; "
            f"Picture 2 (from Shot 1) aligns with the {duration:.2f}-second mark of the target video."
        )
        if not text.startswith("How the reference pictures align with the target video"):
            text = f"{line}\n\n{text}"
    elif prompt_mode == "L2VA":
        line = (
            "How the reference pictures align with the target video — <Picture 1> (from [Shot 1]) aligns with the "
            f"{duration:.2f}-second mark of the target video."
        )
        if not text.startswith("How the reference pictures align with the target video"):
            text = f"{line}\n\n{text}"
    return text


def _system_prompt(prompt_mode: str, duration: float, output_language: str = "zh") -> str:
    output_language = "en" if str(output_language).lower() == "en" else "zh"
    if prompt_mode == "Ref2VA":
        structure = REF_TEMPLATE_EN if output_language == "en" else REF_TEMPLATE
        mode_rules = (
            "STRICT SIX-SECTION CONTRACT: output exactly these six top-level fields, exactly once each, "
            "in this order and with these literal names: subject_definitions:, summary:, retention_analysis:, "
            "detailed_description:, overall_soundscape:, non_diegetic_music:. Do not omit, rename, translate, "
            "merge, duplicate, or reorder a field. Do not add any other top-level field, title, preface, epilogue, "
            "notes, or summary. Keep every <Picture N>, <Video N>, and <Audio N> label consistent across all six fields."
        )
    else:
        structure = BASE_TEMPLATE_EN if output_language == "en" else BASE_TEMPLATE
        mode_rules = (
            "STRICT THREE-FIELD CONTRACT: output exactly these three top-level fields, exactly once each, "
            "in this order and with these literal names: integrated_multimodal_description:, overall_soundscape:, "
            "non_diegetic_music:. Do not omit, rename, translate, merge, duplicate, or reorder a field. Do not add "
            "any other top-level field, title, preface, epilogue, notes, or summary. A mandatory image-alignment "
            "instruction for I2VA, FL2VA, or L2VA is not a fourth field; place only that exact instruction before "
            "integrated_multimodal_description:, then output the three required fields without any other section."
        )

    alignment = {
        "T2VA": "Build the complete audiovisual timeline from text without an image-alignment instruction.",
        "I2VA": "Start with the exact first-frame alignment instruction for <Picture 1>, then develop forward from it.",
        "FL2VA": "Start with the exact first-and-last-frame alignment instruction for Picture 1 and Picture 2, then describe the continuous path between them.",
        "L2VA": "Start with the exact last-frame alignment instruction for <Picture 1>, using the effective duration formatted to two decimals, then converge toward it.",
        "Ref2VA": "Use the full-reference relationship format and do not invent labels that are absent from the supplied reference list.",
    }[prompt_mode]

    prose_rule = (
        "Write all descriptive prose in English."
        if output_language == "en"
        else "Write all descriptive prose in Simplified Chinese."
    )
    dialogue_example = (
        "for example: (S1) she whispers: <d>[Chinese] 我不会回去。</d>."
        if output_language == "en"
        else "for example: (S1) 她低声说：<d>[Chinese] 我不会回去。</d>."
    )

    return f"""You are a MiniMax H3 video-prompt writer.
Rewrite the user's plain-language video idea into a final prompt for MiniMax H3.
Return only the final prompt. Do not return analysis, explanations, headings outside the required format, or Markdown code fences.
{prose_rule} Keep the required field names, reference labels, shot markers, language tags, and N/A exactly as specified. Preserve dialogue, lyrics, and visible scene text in the original language requested by the user. The selected descriptive output language applies to prose only and must not translate those user-specified contents. Shot markers and cut-time notation are fixed official English structural tokens in every output language. Use exactly [Shot 1] for the opening shot with no timestamp. Start each later shot with the exact prefix [Shot N] At MM:SS.mmm, using a strictly increasing zero-padded timestamp within the target duration; a valid prefix is [Shot 2] At 00:02.500, followed immediately by the shot description. Never translate or rewrite this structure as 【镜头2】（约2.5秒）, 镜头2, Scene 2, an approximate duration, or any other localized form.
The target video duration is exactly {duration:.2f} seconds.
{alignment}
{mode_rules}
Describe shots in playback order. The first shot has no timestamp; later cuts use the exact official [Shot N] At MM:SS.mmm, notation with strictly increasing cut times within the duration. Include composition, subjects, environment, actions, camera motion, and synchronized diegetic sound.
DIALOGUE MARKUP IS MANDATORY whenever the output contains actual audible human-language content. Every character line, narration or voice-over line, whispered line, chant, and sung lyric must put the complete utterance inside a closed <d>[Language] ...</d> tag, with the real language written explicitly, {dialogue_example} Use stable speaker IDs such as (S1), and keep all speaker IDs, delivery descriptions, and actions outside the <d> tag. Never write spoken or sung words as bare text, in quotation marks, or after a speech verb without the tag. Do not invent a <d> tag when the video has no audible linguistic content; nonverbal sounds such as breathing, laughter, crying, or a sigh remain ordinary sound descriptions unless they include actual words.
Choose the shot count and pacing naturally from the user's idea and the short target duration. Do not force a minimum or maximum number of shots, and do not add extra cuts merely to demonstrate multiple-shot formatting. Follow an explicitly requested shot style naturally without mechanically expanding the number of shots.
Before returning the answer, silently self-check the required top-level format, official English shot/timestamp notation, and dialogue markup in this same response: Ref2VA has exactly the six required fields once each in the required order; every other mode has exactly the three required fields once each in the required order, with only the mode's mandatory alignment instruction allowed before them. Ensure the opening marker is [Shot 1] with no timestamp and every later marker is [Shot N] At MM:SS.mmm, with a strictly increasing cut time; remove every localized or approximate shot heading. Then scan every actual spoken, narrated, whispered, chanted, or sung utterance and correct it so it is fully enclosed in one closed <d>[Language] ...</d> tag with an explicit language. Correct any mismatch before responding. Do not reveal this self-check or add a checklist, analysis, or explanation to the final answer.
overall_soundscape summarizes ambience and physical sounds; non_diegetic_music describes only music the characters cannot hear, or uses N/A.
The user idea may contain @ references such as @Picture 1, @Video 1, @Audio 1, @图片1, @视频1, or @音频1. Treat these as explicit references and write the corresponding official labels (<Picture 1>, <Video 1>, <Audio 1>) in the final prompt. Never leave the @ form in the final prompt.
When AVAILABLE REFERENCE LABELS contains a VISUAL ANALYSIS section, treat its visible facts as authoritative for the corresponding <Picture N>. Preserve the depicted subject, apparent gender presentation, appearance, clothing, setting, framing, and visible text unless the user explicitly requests a change. Do not contradict the image analysis or replace the depicted person with a different person.

The required output shape is:
{structure}
"""


def _image_media_parts(image_references: Any, api_format: str) -> list[tuple[str, dict[str, Any]]]:
    result: list[tuple[str, dict[str, Any]]] = []
    if not isinstance(image_references, list):
        return result
    for reference in image_references[:9]:
        if not isinstance(reference, dict):
            continue
        tag = str(reference.get("tag") or "").strip()
        if not re.fullmatch(r"<Picture \d+>", tag):
            continue
        _path, data, mime = _resolve_comfy_image(reference)
        encoded = base64.b64encode(data).decode("ascii")
        if api_format == "gemini":
            part = {"inlineData": {"mimeType": mime, "data": encoded}}
        elif api_format == "responses":
            part = {"type": "input_image", "image_url": f"data:{mime};base64,{encoded}"}
        else:
            part = {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{encoded}"}}
        result.append((tag, part))
    return result


def _generation_endpoint(api_url: str, api_format: str, model: str) -> str:
    base = _strip_generation_endpoint(api_url)
    if api_format == "gemini":
        parsed = urllib.parse.urlsplit(base)
        path = re.sub(r"/(?:v1beta|v1)(?:/models)?$", "", parsed.path.rstrip("/"), flags=re.I).rstrip("/")
        model_id = urllib.parse.quote(str(model).removeprefix("models/"), safe="._-")
        return urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, f"{path}/v1beta/models/{model_id}:generateContent", parsed.query, ""))
    if api_format == "responses":
        return _url_with_path(base, "/v1/responses")
    return _url_with_path(base, "/v1/chat/completions")


def _response_text(payload: Any, api_format: str) -> str:
    if not isinstance(payload, dict):
        return ""
    if api_format == "gemini":
        candidates = payload.get("candidates") or []
        if not candidates:
            return ""
        parts = ((candidates[0].get("content") or {}).get("parts") or []) if isinstance(candidates[0], dict) else []
        return "".join(str(part.get("text") or "") for part in parts if isinstance(part, dict))
    if api_format == "responses":
        if isinstance(payload.get("output_text"), str):
            return payload["output_text"]
        chunks: list[str] = []
        for item in payload.get("output") or []:
            if not isinstance(item, dict):
                continue
            for part in item.get("content") or []:
                if isinstance(part, dict) and isinstance(part.get("text"), str):
                    chunks.append(part["text"])
        return "".join(chunks)
    choices = payload.get("choices") or []
    content = ((choices[0].get("message") or {}).get("content") or "") if choices and isinstance(choices[0], dict) else ""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        return "".join(str(item.get("text") or "") for item in content if isinstance(item, dict))
    return ""


def _stream_chunk_text(payload: Any, api_format: str) -> str:
    if not isinstance(payload, dict):
        return ""
    if api_format == "responses":
        if payload.get("type") == "response.output_text.delta":
            return str(payload.get("delta") or "")
        return ""
    if api_format == "gemini":
        return _response_text(payload, api_format)
    choices = payload.get("choices") or []
    if choices and isinstance(choices[0], dict):
        delta = choices[0].get("delta") or {}
        content = delta.get("content") if isinstance(delta, dict) else ""
        if isinstance(content, str):
            return content
        if isinstance(content, list):
            return "".join(str(item.get("text") or "") for item in content if isinstance(item, dict))
    message = payload.get("message")
    if isinstance(message, dict) and isinstance(message.get("content"), str):
        return message["content"]
    return ""


def _stream_generation_endpoint(endpoint: str, api_format: str) -> str:
    if api_format != "gemini":
        return endpoint
    parsed = urllib.parse.urlsplit(endpoint)
    path = parsed.path.replace(":generateContent", ":streamGenerateContent")
    query = urllib.parse.parse_qsl(parsed.query, keep_blank_values=True)
    if not any(key == "alt" for key, _value in query):
        query.append(("alt", "sse"))
    return urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, path, urllib.parse.urlencode(query), ""))


def _http_stream_text(
    url: str,
    api_key: str,
    api_format: str,
    body: dict[str, Any],
    abort_controller: _RequestAbortController,
    *,
    timeout: float = 600,
) -> str:
    abort_controller.raise_if_cancelled()
    headers = _api_headers(api_key, api_format, json_content=True)
    headers["Accept"] = "text/event-stream, application/x-ndjson, application/json"
    request = urllib.request.Request(
        _stream_generation_endpoint(url, api_format),
        data=json.dumps(body, ensure_ascii=False).encode("utf-8"),
        headers=headers,
        method="POST",
    )
    response = None
    try:
        response = urllib.request.urlopen(request, timeout=timeout)
        abort_controller.track(response)
        content_type = str(response.headers.get("Content-Type") or "").lower()
        if "application/json" in content_type and "stream" not in content_type and "ndjson" not in content_type:
            payload = json.loads(response.read().decode("utf-8", "replace"))
            abort_controller.raise_if_cancelled()
            return _response_text(payload, api_format)
        chunks: list[str] = []
        final_payload: Any = None
        while True:
            abort_controller.raise_if_cancelled()
            line = response.readline()
            if not line:
                break
            text = line.decode("utf-8", "replace").strip()
            if not text or text.startswith(":") or text.startswith("event:"):
                continue
            if text.startswith("data:"):
                text = text[5:].strip()
            if text == "[DONE]":
                break
            try:
                payload = json.loads(text)
            except json.JSONDecodeError:
                continue
            final_payload = payload
            chunk = _stream_chunk_text(payload, api_format)
            if chunk:
                chunks.append(chunk)
        abort_controller.raise_if_cancelled()
        if chunks:
            return "".join(chunks)
        return _response_text(final_payload, api_format)
    except urllib.error.HTTPError as exc:
        if abort_controller.event.is_set():
            raise StoryboardCancelled("分镜生成已终止") from exc
        detail = exc.read().decode("utf-8", "replace")[:1000]
        raise RuntimeError(f"API HTTP {exc.code}: {detail}") from exc
    except urllib.error.URLError as exc:
        if abort_controller.event.is_set():
            raise StoryboardCancelled("分镜生成已终止") from exc
        raise RuntimeError(f"API 连接失败：{exc.reason}") from exc
    except (OSError, ValueError) as exc:
        if abort_controller.event.is_set():
            raise StoryboardCancelled("分镜生成已终止") from exc
        raise
    finally:
        if response is not None:
            abort_controller.untrack(response)
            try:
                response.close()
            except Exception:
                pass


def _request_prompt_api(
    settings: dict[str, Any],
    system_prompt: str,
    user_message: str,
    image_references: Any,
    *,
    temperature: float = 0.2,
    max_output_tokens: int = PROMPT_API_MAX_OUTPUT_TOKENS,
    enable_reasoning: bool = False,
    abort_controller: _RequestAbortController | None = None,
) -> str:
    api_format = settings["api_format"]
    api_url = settings["api_url"]
    api_key = settings["api_key"]
    model = settings["model"]
    media = _image_media_parts(image_references, api_format) if settings.get("read_media") else []
    endpoint = _generation_endpoint(api_url, api_format, model)
    if api_format == "gemini":
        parts: list[dict[str, Any]] = [{"text": system_prompt + "\n\n" + user_message}]
        for tag, media_part in media:
            parts.extend([{"text": f"REFERENCE IMAGE {tag}:"}, media_part])
        body = {
            "contents": [{"role": "user", "parts": parts}],
            "generationConfig": {"temperature": temperature, "maxOutputTokens": max_output_tokens},
        }
    elif api_format == "responses":
        content: list[dict[str, Any]] = [{"type": "input_text", "text": user_message}]
        for tag, media_part in media:
            content.extend([{"type": "input_text", "text": f"REFERENCE IMAGE {tag}:"}, media_part])
        body = {
            "model": model,
            "instructions": system_prompt,
            "input": [{"role": "user", "content": content}],
            "store": False,
            "stream": abort_controller is not None,
            "temperature": temperature,
            "max_output_tokens": max_output_tokens,
        }
    else:
        if media:
            content: str | list[dict[str, Any]] = [{"type": "text", "text": user_message}]
            for tag, media_part in media:
                content.extend([{"type": "text", "text": f"REFERENCE IMAGE {tag}:"}, media_part])
        else:
            content = user_message
        body = {
            "model": model,
            "messages": [{"role": "system", "content": system_prompt}, {"role": "user", "content": content}],
            "stream": abort_controller is not None,
            "temperature": temperature,
            "max_tokens": max_output_tokens,
        }
        if api_format == "openai" and not enable_reasoning:
            body["thinking"] = {"type": "disabled"}
    if abort_controller is not None:
        result_text = _http_stream_text(endpoint, api_key, api_format, body, abort_controller, timeout=600)
    else:
        payload = _http_json(endpoint, api_key, api_format, method="POST", body=body, timeout=600)
        result_text = _response_text(payload, api_format)
    result = _strip_markdown_fence(result_text)
    if not result:
        raise RuntimeError("提示词 API 返回了空内容")
    return result


def _call_zen(
    prompt_mode: str,
    user_prompt: str,
    duration: float,
    reference_context: str,
    image_references: Any = None,
    output_language: str = "zh",
) -> tuple[str, int, str]:
    output_language = "en" if str(output_language).lower() == "en" else "zh"
    settings = _read_prompt_api_config()
    if not settings["api_url"] or not settings["model"]:
        raise RuntimeError("请先打开提示词优化 API 设置，填写地址和 Key，拉取并选择模型")
    if not user_prompt.strip():
        raise RuntimeError("请输入视频想法")
    user_message = (
        f"PROMPT MODE: {prompt_mode}\n"
        f"DESCRIPTIVE OUTPUT LANGUAGE: {'English' if output_language == 'en' else 'Simplified Chinese'}\n"
        f"TARGET DURATION: {duration:.2f} seconds\n"
        f"AVAILABLE REFERENCE LABELS:\n{reference_context.strip() or 'No external references are used.'}\n\n"
        f"USER VIDEO IDEA:\n{_normalize_reference_mentions(user_prompt.strip())}"
    )
    attached_count = len(image_references or []) if settings.get("read_media") and isinstance(image_references, list) else 0
    evidence_rule = (
        f"\n\nACTUAL IMAGE EVIDENCE: {attached_count} image(s) are attached. Inspect each attached image directly and bind it to the immediately preceding <Picture N> label. Visible facts are authoritative; do not replace or contradict the depicted subject."
        if attached_count
        else "\n\nACTUAL IMAGE EVIDENCE: no images are attached to this request. Preserve reference labels but never invent their unseen contents."
    )
    raw = _request_prompt_api(settings, _system_prompt(prompt_mode, duration, output_language) + evidence_rule, user_message, image_references)
    result = _normalize_reference_mentions(_normalize_prompt(prompt_mode, raw, duration))
    return result, attached_count, settings["model"]


def _storyboard_skill(mode: str) -> str:
    skill_path = STORYBOARD_SKILL_DIR / "SKILL.md"
    if not skill_path.is_file():
        raise RuntimeError(f"找不到南风分镜规则：{skill_path}")
    reference_name = "ref-en.txt" if mode == "ref2va" else "base-en.txt"
    reference_path = STORYBOARD_SKILL_DIR / "references" / reference_name
    sections = [skill_path.read_text(encoding="utf-8")]
    if reference_path.is_file():
        sections.append(f"\n\n---\n\n# Embedded reference: {reference_name}\n\n{reference_path.read_text(encoding='utf-8')}")
    return "".join(sections)


def _storyboard_mode_contract(mode: str, count: int, duration: float) -> str:
    common = (
        f"严格输出{count}段。从段1开始依次编号到段{count}；每个标题行只能写对应的‘段N’，"
        "不得写范围或其他文字。段之间用---分隔。每段必须是可直接复制使用的完整官方提示词。"
    )
    if mode == "ref2va":
        return common + "当前模式为Ref2VA多参。每段严格依次输出subject_definitions、summary、retention_analysis、detailed_description、overall_soundscape、non_diegetic_music六段，使用<Subject N>/<Picture N>/<Video N>/<Audio N>。"
    if mode == "i2va":
        return common + "当前模式为I2VA首帧生视频。每段先写官方首帧对齐句：For the target video, at 0.00 seconds into the target video, <Picture 1> (from [Shot 1]) is fully referenced. 然后依次输出integrated_multimodal_description、overall_soundscape、non_diegetic_music。"
    if mode == "fl2va":
        return common + f"当前模式为FL2VA首尾帧。每段先写官方首尾对齐句：How the reference pictures align with the target video — Picture 1 (from Shot 1) aligns with the 0.00-second mark of the target video; Picture 2 (from Shot N) aligns with the {duration:.2f}-second mark of the target video. 然后依次输出integrated_multimodal_description、overall_soundscape、non_diegetic_music。"
    if mode == "l2va":
        return common + f"当前模式为L2VA尾帧生视频。<Picture 1>只锚定最终画面，必须从合理的更早状态逐步收束到它。每段先写官方尾帧对齐句：How the reference pictures align with the target video — <Picture 1> (from [Shot N]) aligns with the {duration:.2f}-second mark of the target video. 然后依次输出integrated_multimodal_description、overall_soundscape、non_diegetic_music。"
    return common + (
        "当前模式为T2VA文生视频。不得写任何Picture/Video/Audio引用或对齐句；每段严格依次输出"
        "integrated_multimodal_description、overall_soundscape、non_diegetic_music。"
    )


def _storyboard_language_contract(output_language: str) -> str:
    prose = "Write descriptive prose inside the official fields in English." if output_language == "en" else "Write descriptive prose inside the official fields in Simplified Chinese."
    return (
        "# Runtime Output Language Contract\n" + prose + "\n"
        "For descriptive-prose language only, this runtime contract overrides any earlier English-only rule in the embedded Skill. "
        "Always keep official field names, section order, separators, reference labels, shot markers, speaker IDs, language tags, timestamps, N/A, and official alignment syntax in English and unchanged. "
        "Preserve dialogue, lyrics, and visible text in their requested or original language and use the matching English language tag."
    )


def _storyboard_self_contained_segments_contract(enabled: bool) -> str:
    if not enabled:
        return ""
    return (
        "# MiniMaxH3Easy v1.07 Standalone Segment Contract (highest priority)\n"
        "每一段都会作为完全独立的视频生成任务执行，执行当前段的模型看不到其他段的提示词、视频或结尾画面。"
        "连续性账本只能用于把上一段结尾转换成当前段可直接观察的开场事实，不得在最终提示词中引用不存在的跨段记忆。\n"
        "1. 所有正式字段都禁止出现‘承接段N’、‘延续上一段/前一段’、‘与段N相同/一致’、‘保持上一段’、"
        "‘机位与段N相同’及任何同义英文表达。不得要求当前视频自行回忆其他分镜。\n"
        "2. 每段必须完全自包含。开场要用绝对文字重新写清场景、机位、构图、人物位置、朝向、姿势、视线、"
        "道具归属与状态；不得用跨段指代替代这些事实。\n"
        "3. 如果场景没有变化，先在该场景首次出现的段落建立一条规范化场景锚点；后续仍在同一场景的每一段，"
        "必须在 detailed_description（其他模式为 integrated_multimodal_description）的开头逐字复写同一条锚点，"
        "不得改写为‘目标视频延续……’。例如应重复写‘目标视频为写实乡村风格，土路地面为压实黄泥，两侧有低矮杂草与田埂，自然日光，画面略带暖黄调。’\n"
        "4. 场景发生变化时，从变化段开始写一条新的完整场景锚点；只要后续场景不再变化，就逐字复写这条新锚点。\n"
        "5. 镜头连续时也必须写成绝对机位事实，例如‘全景，镜头高度略低于站立视线，机位位于土路侧面’，"
        "禁止写‘机位与段1相同’。人物动作连续时同样把当前可见状态完整写出。\n"
        "6. summary 也必须独立成立，不得用段号或上一段作为语义前提。只有实际提供并引用 <Video N> 时才能声明 video continuation；"
        "只有实际图片承担具体首帧、尾帧或关键帧锚点时才能声明 keyframe completion。纯剧情上的前后段关系不属于这两类。"
    )


def _storyboard_validate_images(mode: str, references: list[dict[str, Any]]) -> None:
    count = len(references)
    required = {"t2va": 0, "i2va": 1, "fl2va": 2, "l2va": 1}
    if mode in required and count != required[mode]:
        labels = {
            "t2va": "T2VA文生视频不能使用参考图片",
            "i2va": "I2VA首帧生视频必须且只能使用1张图片",
            "fl2va": "FL2VA首尾帧必须依次使用首帧和尾帧2张图片",
            "l2va": "L2VA尾帧生视频必须且只能使用1张尾帧图片",
        }
        raise RuntimeError(labels[mode])
    if mode == "ref2va" and count < 1:
        raise RuntimeError("Ref2VA多参分镜至少需要1张参考图片")


def _storyboard_vision_settings(settings: dict[str, Any]) -> dict[str, Any]:
    vision = {
        "api_format": str(settings.get("vision_api_format") or "openai"),
        "api_url": str(settings.get("vision_api_url") or "").strip(),
        "api_key": str(settings.get("vision_api_key") or ""),
        "model": str(settings.get("vision_model") or "").strip(),
        "available_models": list(settings.get("vision_available_models") or []),
        "read_media": True,
    }
    if not vision["api_url"] or not vision["model"]:
        raise RuntimeError("当前模式需要识图，请先在‘提示词优化 API 设置’中配置图片识别模型")
    return vision


def _clean_storyboard_vision_result(value: Any) -> str:
    return re.sub(r"^\s*@图片\d+\s*[:：]\s*", "", str(value or "")).strip()


def _prune_storyboard_vision_cache() -> None:
    try:
        entries = sorted(
            (path for path in STORYBOARD_VISION_CACHE_DIR.glob("*.json") if path.is_file()),
            key=lambda path: path.stat().st_mtime_ns,
            reverse=True,
        )
        for path in entries[STORYBOARD_VISION_CACHE_LIMIT:]:
            try:
                path.unlink()
            except OSError:
                pass
    except OSError:
        pass


def _storyboard_analyze_one(
    settings: dict[str, Any],
    reference: dict[str, Any],
    index: int,
    abort_controller: _RequestAbortController,
) -> str:
    abort_controller.raise_if_cancelled()
    settings = _storyboard_vision_settings(settings)
    _path, data, _mime = _resolve_comfy_image(reference)
    digest = hashlib.sha256()
    digest.update(data)
    digest.update(str(settings.get("api_format", "")).encode("utf-8"))
    digest.update(str(settings.get("api_url", "")).encode("utf-8"))
    digest.update(str(settings.get("model", "")).encode("utf-8"))
    cache_path = STORYBOARD_VISION_CACHE_DIR / f"{digest.hexdigest()}.json"
    try:
        cached = json.loads(cache_path.read_text(encoding="utf-8"))
        text = _clean_storyboard_vision_result(cached.get("text", "")) if isinstance(cached, dict) else ""
        if text:
            return f"@图片{index}：{text}"
    except (OSError, ValueError, TypeError):
        pass
    system = "你是南风H3分镜的逐图分析器。只描述图片中可见且有证据支持的内容，不编造身份、动作、背景故事或画外信息。只输出分析结果，不要Markdown。"
    user = (
        f"当前只分析固定编号@图片{index}。严格归类为人物图、场景图、产品或道具图之一；"
        "提取人物外貌、服装、姿态、朝向和构图，或场景空间、光线、时间天气，或道具材质、颜色、朝向和状态。"
        "不要关联其他图片，不要添加其他图片编号。"
    )
    text = _clean_storyboard_vision_result(
        _request_prompt_api(
            settings,
            system,
            user,
            [reference],
            temperature=0.0,
            max_output_tokens=1600,
            abort_controller=abort_controller,
        )
    )
    if not text:
        raise RuntimeError(f"@图片{index} 的识图模型返回了空内容")
    STORYBOARD_VISION_CACHE_DIR.mkdir(parents=True, exist_ok=True)
    temporary = cache_path.with_suffix(f".tmp-{os.getpid()}-{time.time_ns()}")
    temporary.write_text(json.dumps({"text": text}, ensure_ascii=False), encoding="utf-8")
    temporary.replace(cache_path)
    _prune_storyboard_vision_cache()
    return f"@图片{index}：{text}"


def _storyboard_analyze_images(
    settings: dict[str, Any],
    references: list[dict[str, Any]],
    abort_controller: _RequestAbortController,
) -> str:
    if not references:
        return ""
    abort_controller.raise_if_cancelled()
    with concurrent.futures.ThreadPoolExecutor(max_workers=min(3, len(references))) as executor:
        futures = [
            executor.submit(_storyboard_analyze_one, settings, reference, index, abort_controller)
            for index, reference in enumerate(references, 1)
        ]
        return "\n\n".join(future.result() for future in futures)


def _storyboard_parse(text: str, count: int) -> dict[str, Any]:
    raw = re.sub(r"```(?:text)?|```", "", str(text)).strip()
    global_match = re.search(r"全局提示词\s*[:：]\s*([\s\S]*?)(?=\n\s*(?:---\s*)?\n?\s*段\s*1\b|$)", raw)
    global_prompt = global_match.group(1).strip() if global_match else ""
    matches = list(re.finditer(r"(?m)^\s*段\s*(\d+)\s*[:：]?\s*$", raw))
    if any(int(match.group(1)) != index for index, match in enumerate(matches, 1)):
        raise RuntimeError("模型返回的段号存在跳号、重复或顺序错误")
    segments: list[str] = []
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(raw)
        segments.append(raw[match.start():end].strip().rstrip("-").strip())
    if len(segments) != count:
        if count == 1 and not matches and raw:
            segments = [raw]
        else:
            blocks = [item.strip() for item in re.split(r"(?m)^\s*---+\s*$", raw) if item.strip()]
            if len(blocks) == count:
                segments = [f"段{index}\n\n{block}" for index, block in enumerate(blocks, 1)]
            else:
                raise RuntimeError(f"模型返回{len(segments)}段，但要求{count}段；已保留本次结果且不会自动重复付费请求")
    return {"global": global_prompt, "segments": segments, "raw": raw}


def _storyboard_generate(payload: dict[str, Any], abort_controller: _RequestAbortController) -> dict[str, Any]:
    abort_controller.raise_if_cancelled()
    settings = _read_prompt_api_config()
    if not settings.get("api_url") or not settings.get("model"):
        raise RuntimeError("请先打开原‘提示词优化 API 设置’，填写地址并选择模型")
    idea = str(payload.get("idea", "")).strip()
    if not idea:
        raise RuntimeError("请输入视频想法")
    count = int(payload.get("segment_count", 1))
    if count < 1 or count > 12:
        raise RuntimeError("分镜段数必须为1到12")
    duration = float(payload.get("duration_seconds", 5.0))
    if duration < 1.0 or duration > 30.0:
        raise RuntimeError("视频时长必须为1到30秒")
    mode = str(payload.get("mode", "ref2va")).strip().lower()
    if mode not in STORYBOARD_MODES:
        raise RuntimeError("提示词模式无效")
    output_language = "en" if str(payload.get("output_language", "zh")).lower() == "en" else "zh"
    enable_reasoning = payload.get("enable_reasoning", False)
    if not isinstance(enable_reasoning, bool):
        raise RuntimeError("思考模式参数必须是布尔值")
    self_contained_segments = payload.get("self_contained_segments", False)
    if not isinstance(self_contained_segments, bool):
        raise RuntimeError("独立分镜规则参数必须是布尔值")
    references = [item for item in (payload.get("image_references") or []) if isinstance(item, dict)][:9]
    _storyboard_validate_images(mode, references)
    analysis = _storyboard_analyze_images(settings, references, abort_controller)
    abort_controller.raise_if_cancelled()
    manifest = "\n".join(f"@图片{index}：{Path(_resolve_comfy_image(reference)[0]).name}" for index, reference in enumerate(references, 1)) or "无图片"
    reference_context = str(payload.get("reference_context", "")).strip() or "无其他引用"
    system = (
        "严格执行下面的H3官方提示词Skill和当前模式契约，只输出正式结果，不解释。\n\n"
        + _storyboard_skill(mode) + "\n\n" + _storyboard_language_contract(output_language)
        + ("\n\n" + _storyboard_self_contained_segments_contract(True) if self_contained_segments else "")
    )
    user = (
        f"当前官方模式：{STORYBOARD_MODES[mode]}\n"
        f"硬性时长先决条件：每个分镜对应{duration:g}秒视频。必须先按这个准确时长重新规划动作密度、镜头数量、对白长度、动作收束和段尾状态。\n"
        f"{_storyboard_mode_contract(mode, count, duration)}\n\n"
        f"用户想法：\n{_normalize_reference_mentions(idea)}\n\n"
        f"可用图片槽位：\n{manifest}\n\n其他固定引用标签：\n{reference_context}\n\n逐图看图结果：\n{analysis or '无'}\n\n"
        "禁止追问。图片编号严格绑定上传槽位，不重排、不编造；用户原有对白必须保留说话人、原意和顺序。"
    )
    budget = min(24000, 4200 + 1800 * count)
    raw = _request_prompt_api(
        settings,
        system,
        user,
        [],
        temperature=0.7,
        max_output_tokens=budget,
        enable_reasoning=enable_reasoning,
        abort_controller=abort_controller,
    )
    result = _storyboard_parse(raw, count)
    result.update({"model": settings["model"], "vision_count": len(references)})
    return result


def _run_storyboard_job(job_id: str, payload: dict[str, Any]) -> None:
    with _STORYBOARD_JOB_LOCK:
        job = _STORYBOARD_JOBS[job_id]
        abort_controller = job["_abort_controller"]
        job.update(status="running", stage="逐图分析并生成完整分镜")
    try:
        result = _storyboard_generate(payload, abort_controller)
        with _STORYBOARD_JOB_LOCK:
            if abort_controller.event.is_set():
                job.update(status="cancelled", stage="已终止", error="")
            else:
                job.update(status="completed", stage="完成", result=result)
    except StoryboardCancelled:
        with _STORYBOARD_JOB_LOCK:
            job.update(status="cancelled", stage="已终止", error="")
    except Exception as exc:
        with _STORYBOARD_JOB_LOCK:
            if abort_controller.event.is_set():
                job.update(status="cancelled", stage="已终止", error="")
            else:
                job.update(status="failed", stage="返回内容需要检查，未自动重复付费生成", error=str(exc))


class MiniMaxH3PromptStudio:
    @classmethod
    def INPUT_TYPES(cls) -> dict[str, Any]:
        return {
            "required": {
                "prompt_mode": (["T2VA", "I2VA", "FL2VA", "L2VA", "Ref2VA"], {"default": "Ref2VA"}),
                "user_prompt": ("STRING", {"multiline": True, "default": "", "dynamicPrompts": False}),
                "duration_seconds": ("FLOAT", {"default": 5.0, "min": 1.0, "max": 30.0, "step": 1.0}),
                "reference_context": (
                    "STRING",
                    {
                        "multiline": True,
                        "default": "<Picture 1>: first connected image\n<Video 1>: first connected video\n<Audio 1>: synchronized audio from <Video 1>\n<Audio 2>: first standalone audio",
                        "dynamicPrompts": False,
                    },
                ),
                "edited_template": (
                    "STRING",
                    {"multiline": True, "default": REF_TEMPLATE, "dynamicPrompts": False},
                ),
            }
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("prompt",)
    FUNCTION = "run"
    CATEGORY = "MiniMax H3 Easy/Prompt"

    def run(
        self,
        prompt_mode: str,
        user_prompt: str,
        duration_seconds: float,
        reference_context: str,
        edited_template: str,
    ) -> tuple[str]:
        del prompt_mode, duration_seconds, reference_context
        value = edited_template.strip() or user_prompt.strip()
        value = _normalize_reference_mentions(value)
        return (value,)


@PromptServer.instance.routes.post("/minimax_h3/prompt_writer")
async def minimax_h3_prompt_writer(request: web.Request) -> web.Response:
    try:
        data = await request.json()
        prompt_mode = str(data.get("prompt_mode", "Ref2VA"))
        user_prompt = str(data.get("user_prompt", ""))
        duration = float(data.get("duration_seconds", 5.0))
        reference_context = str(data.get("reference_context", ""))
        image_references = data.get("image_references", [])
        output_language = "en" if str(data.get("output_language", "zh")).lower() == "en" else "zh"
        loop = asyncio.get_running_loop()
        result, vision_count, model = await loop.run_in_executor(
            None, _call_zen, prompt_mode, user_prompt, duration, reference_context, image_references, output_language
        )
        return web.json_response({"prompt": result, "model": model, "vision_count": vision_count})
    except Exception as exc:
        return web.json_response({"error": str(exc)}, status=400)


@PromptServer.instance.routes.post("/minimax_h3/storyboard/jobs")
async def minimax_h3_storyboard_create_job(request: web.Request) -> web.Response:
    try:
        payload = await request.json()
        job_id = uuid.uuid4().hex
        abort_controller = _RequestAbortController()
        with _STORYBOARD_JOB_LOCK:
            _STORYBOARD_JOBS[job_id] = {
                "job_id": job_id,
                "status": "queued",
                "stage": "准备任务",
                "result": None,
                "error": "",
                "_abort_controller": abort_controller,
            }
        threading.Thread(
            target=_run_storyboard_job,
            args=(job_id, payload),
            daemon=True,
            name=f"minimax-h3-storyboard-{job_id[:8]}",
        ).start()
        return web.json_response({"ok": True, "job_id": job_id})
    except Exception as exc:
        return web.json_response({"ok": False, "error": str(exc)}, status=400)


@PromptServer.instance.routes.get("/minimax_h3/storyboard/jobs/{job_id}")
async def minimax_h3_storyboard_get_job(request: web.Request) -> web.Response:
    with _STORYBOARD_JOB_LOCK:
        stored = _STORYBOARD_JOBS.get(request.match_info["job_id"], {})
        job = {key: value for key, value in stored.items() if not key.startswith("_")}
    if not job:
        return web.json_response({"ok": False, "error": "任务不存在"}, status=404)
    return web.json_response({"ok": True, **job})


@PromptServer.instance.routes.delete("/minimax_h3/storyboard/jobs/{job_id}")
async def minimax_h3_storyboard_cancel_job(request: web.Request) -> web.Response:
    job_id = request.match_info["job_id"]
    with _STORYBOARD_JOB_LOCK:
        job = _STORYBOARD_JOBS.get(job_id)
        if not job:
            return web.json_response({"ok": False, "error": "任务不存在"}, status=404)
        if job["status"] in {"completed", "failed", "cancelled"}:
            return web.json_response({"ok": True, "status": job["status"], "transport_aborted": 0})
        job.update(status="cancelling", stage="正在终止模型输出")
        abort_controller = job["_abort_controller"]
    closed = abort_controller.cancel()
    return web.json_response({"ok": True, "status": "cancelling", "transport_aborted": closed})


@PromptServer.instance.routes.get("/minimax_h3/prompt_writer/models")
async def minimax_h3_prompt_writer_models(request: web.Request) -> web.Response:
    del request
    settings = _read_prompt_api_config()
    return web.json_response({
        "models": [{"id": item, "label": item} for item in settings.get("available_models", [])],
        "default_model": settings.get("model", ""),
        "source": "custom-api",
    })


@PromptServer.instance.routes.get("/minimax_h3/prompt_writer/settings")
async def minimax_h3_prompt_writer_settings_get(request: web.Request) -> web.Response:
    del request
    return web.json_response({"ok": True, "settings": _read_prompt_api_config()})


@PromptServer.instance.routes.post("/minimax_h3/prompt_writer/settings")
async def minimax_h3_prompt_writer_settings_post(request: web.Request) -> web.Response:
    try:
        payload = await request.json()
        settings = _write_prompt_api_config(payload)
        return web.json_response({"ok": True, "settings": settings})
    except Exception as exc:
        return web.json_response({"ok": False, "error": str(exc)}, status=400)


@PromptServer.instance.routes.post("/minimax_h3/prompt_writer/models/fetch")
async def minimax_h3_prompt_writer_models_fetch(request: web.Request) -> web.Response:
    try:
        payload = await request.json()
        api_format = str(payload.get("api_format") or "openai")
        api_url = str(payload.get("api_url") or "")
        api_key = str(payload.get("api_key") or "")
        models = await asyncio.to_thread(_fetch_prompt_models, api_format, api_url, api_key)
        return web.json_response({"ok": True, "models": models})
    except Exception as exc:
        return web.json_response({"ok": False, "error": str(exc)}, status=400)


NODE_CLASS_MAPPINGS = {"gosick_233_MiniMaxH3PromptStudio": MiniMaxH3PromptStudio}
NODE_DISPLAY_NAME_MAPPINGS = {
    "gosick_233_MiniMaxH3PromptStudio": "gosick_233 · MiniMax H3 Prompt Studio"
}
