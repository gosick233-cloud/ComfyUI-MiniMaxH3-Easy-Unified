import { app } from "/scripts/app.js";

const NODE_CLASS = "MiniMaxH3PromptStudio";
const H3_NODE_CLASS = "gosick_233_MiniMaxH3Easy";
const T8_CONDITIONING_CLASS = "MiniMaxH3AudioConditioningT8";
const T8_AGGREGATOR_CLASS = "MiniMaxH3MediaAggregatorT8";
const LINKS_PROP = "minimax_h3_virtual_media_links";
const EDITOR_CLASS = "h3-writer-prompt-editor";
const MENU_CLASS = "h3-writer-mention-menu";
const DEFAULT_REFERENCE_CONTEXT = "<Picture 1>: first connected image\n<Video 1>: first connected video\n<Audio 1>: synchronized audio from <Video 1>\n<Audio 2>: first standalone audio";
const OFFICIAL_DEEPSEEK_MODEL = "deepseek-v4-flash";
const DEFAULT_PROMPT_MODEL = OFFICIAL_DEEPSEEK_MODEL;

function widget(node, name) {
  return node.widgets?.find((item) => item.name === name);
}

function zenModelWidget(node) {
  return node?.__h3WriterZenModelWidget || null;
}

async function loadZenModels(node, forceRefresh = false) {
  const target = zenModelWidget(node);
  if (!target || node.__h3WriterModelsLoading) return;
  node.__h3WriterModelsLoading = true;
  try {
    const query = forceRefresh ? "?refresh=1" : "";
    const response = await fetch(`/minimax_h3/prompt_writer/models${query}`, { headers: { Accept: "application/json" } });
    const data = await response.json();
    if (!response.ok || data.error || !Array.isArray(data.models) || !data.models.length) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }
    const values = data.models.map((item) => String(item?.id || "").trim()).filter(Boolean);
    if (!values.length) throw new Error("没有可用的提示词模型");
    target.options ||= {};
    target.options.values = values;
    const current = String(target.value || "");
    target.value = values.includes(current) ? current : (values.includes(data.default_model) ? data.default_model : values[0]);
    target.__h3WriterModelSource = String(data.source || "deepseek-official");
    target.options.tooltip = "提示词转换固定使用 DeepSeek 官方 API；连接图片时会先调用豆包识图。";
    target.callback?.(target.value);
    node.setDirtyCanvas?.(true, true);
  } catch (error) {
    target.options ||= {};
    target.options.values ||= [String(target.value || DEFAULT_PROMPT_MODEL)];
    target.options.tooltip = "提示词模型状态加载失败，将继续使用 DeepSeek 官方 API。";
    console.warn("MiniMax H3 Prompt Studio: failed to load prompt model status", error);
  } finally {
    node.__h3WriterModelsLoading = false;
    node.setDirtyCanvas?.(true, true);
  }
}

function addZenModelSelector(node) {
  if (node.__h3WriterZenModelWidget || typeof node.addWidget !== "function") return;
  const initialModel = String(node.properties?.h3_writer_zen_model || DEFAULT_PROMPT_MODEL);
  const target = node.addWidget(
    "combo",
    "提示词转换模型/API",
    initialModel,
    () => {
      node.properties ||= {};
      node.properties.h3_writer_zen_model = String(node.__h3WriterZenModelWidget?.value || DEFAULT_PROMPT_MODEL);
      node.setDirtyCanvas?.(true, true);
      app.graph?.setDirtyCanvas?.(true, true);
    },
    { values: [initialModel] },
  );
  if (!target) return;
  target.serialize = false;
  setWidgetOption(target, "serialize", false);
  node.__h3WriterZenModelWidget = target;
  const refresh = node.addWidget("button", "刷新模型列表", null, () => loadZenModels(node, true));
  if (refresh) {
    refresh.serialize = false;
    setWidgetOption(refresh, "serialize", false);
    node.__h3WriterZenModelRefreshButton = refresh;
  }
  loadZenModels(node);
}

function setWidgetOption(target, key, value) {
  if (!target) return;
  target.options ||= {};
  if (value === undefined) delete target.options[key];
  else target.options[key] = value;
  if (target._state?.options) {
    if (value === undefined) delete target._state.options[key];
    else target._state.options[key] = value;
  }
}

function hideWidget(target) {
  if (!target) return;
  if (!target.__h3WriterHidden) {
    target.__h3WriterHidden = true;
    target.__h3WriterOriginalType = target.type;
    target.__h3WriterOriginalComputeSize = target.computeSize;
    target.__h3WriterOriginalHidden = target.hidden;
    target.__h3WriterOriginalOptionsHidden = target.options?.hidden;
    target.__h3WriterOriginalOptionsCanvasOnly = target.options?.canvasOnly;
  }
  target.hidden = true;
  setWidgetOption(target, "hidden", true);
  setWidgetOption(target, "canvasOnly", true);
  target.type = "hidden";
  target.computeSize = () => [0, -4];
}

function restoreWidget(target) {
  if (!target?.__h3WriterHidden) return;
  target.type = target.__h3WriterOriginalType || "customtext";
  target.computeSize = target.__h3WriterOriginalComputeSize || (() => [220, 120]);
  target.hidden = target.__h3WriterOriginalHidden ?? false;
  setWidgetOption(target, "hidden", target.__h3WriterOriginalOptionsHidden);
  setWidgetOption(target, "canvasOnly", target.__h3WriterOriginalOptionsCanvasOnly);
  target.__h3WriterHidden = false;
}

function compactPromptStudioLayout(node) {
  const widgets = node?.widgets;
  if (!Array.isArray(widgets)) return;

  // reference_context is still serialized and used internally to build the
  // connected-media context, but its large manual textarea is unnecessary.
  hideWidget(widget(node, "reference_context"));

  // Keep the compact controls together at the top: mode, then duration.
  const modeWidget = widget(node, "prompt_mode");
  const durationWidget = widget(node, "duration_seconds");
  const modeIndex = widgets.indexOf(modeWidget);
  const durationIndex = widgets.indexOf(durationWidget);
  if (modeIndex >= 0 && durationIndex >= 0 && durationIndex !== modeIndex + 1) {
    widgets.splice(durationIndex, 1);
    const nextModeIndex = widgets.indexOf(modeWidget);
    widgets.splice(nextModeIndex + 1, 0, durationWidget);
  }
}

function isH3EasyNode(node) {
  return String(node?.comfyClass || node?.type || node?.constructor?.nodeData?.name || "") === H3_NODE_CLASS;
}

function graphNodes(node) {
  return (node?.graph || app.graph)?._nodes || [];
}

function h3EasyNodeFor(node) {
  return graphNodes(node).find((candidate) => isH3EasyNode(candidate)) || null;
}

function nodeClassName(node) {
  return String(node?.comfyClass || node?.type || node?.constructor?.nodeData?.name || "");
}

function t8ConditioningNodeFor(node) {
  return graphNodes(node).find((candidate) => nodeClassName(candidate) === T8_CONDITIONING_CLASS) || null;
}

function graphLinkFor(node, linkId) {
  const graph = node?.graph || app.graph;
  if (!graph || linkId == null) return null;
  for (const links of [graph.links, graph._links]) {
    if (!links) continue;
    if (typeof links.get === "function") {
      const found = links.get(linkId) ?? links.get(String(linkId));
      if (found) return found;
    }
    const found = links[linkId] ?? links[String(linkId)];
    if (found) return found;
  }
  return null;
}

function patchLinkedPromptSerialization() {
  const current = app.graphToPrompt;
  if (typeof current !== "function" || current.__h3WriterLinkedPromptPatch) return Boolean(current);
  const original = current;
  const wrapped = async function graphToPromptPreservingLinkedH3Prompt() {
    const promptData = await original.apply(this, arguments);
    const output = promptData?.output || {};
    for (const node of app.graph?._nodes || []) {
      if (!isH3EasyNode(node)) continue;
      const promptInput = node.inputs?.find((input) => String(input?.name || "") === "prompt");
      if (promptInput?.link == null) continue;
      const promptNode = output[String(node.id)];
      if (!promptNode?.inputs) continue;
      const link = graphLinkFor(node, promptInput.link);
      const sourceNode = link?.origin_node || link?.originNode || link?.sourceNode;
      const sourceId = link?.origin_id ?? link?.originId ?? link?.source_id ?? link?.sourceId
        ?? (typeof sourceNode === "object" ? sourceNode?.id : sourceNode);
      const sourceSlot = link?.origin_slot ?? link?.originSlot ?? link?.source_slot ?? link?.sourceSlot ?? 0;
      if (Number.isFinite(Number(sourceId))) {
        promptNode.inputs.prompt = [String(sourceId), Number(sourceSlot) || 0];
      }
    }
    return promptData;
  };
  wrapped.__h3WriterLinkedPromptPatch = true;
  app.graphToPrompt = wrapped;
  return true;
}

function scheduleLinkedPromptPatch() {
  for (const delay of [0, 100, 300, 800, 1500, 3000]) {
    setTimeout(() => patchLinkedPromptSerialization(), delay);
  }
}

function mediaType(link) {
  const value = String(link?.media_type || link?.source_type || "image").toLowerCase();
  if (value.includes("audio")) return "audio";
  if (value.includes("video")) return "video";
  return "image";
}

function sourceNodeFor(node, sourceId) {
  const graph = node?.graph || app.graph;
  return graph?.getNodeById?.(Number(sourceId))
    || graphNodes(node).find((candidate) => Number(candidate?.id) === Number(sourceId))
    || null;
}

function filenameFromValue(value) {
  const raw = typeof value === "object" ? (value?.filename || value?.name || "") : value;
  const text = String(raw || "").trim();
  if (!text || /^(data|blob|https?):/i.test(text)) return "";
  return text.split(/[\\/]/).pop() || text;
}

function sourceFilename(source, type) {
  if (!source) return "";
  const preferred = {
    image: ["image", "filename", "file"],
    video: ["video", "file", "filename", "video_file", "videofile"],
    audio: ["audio", "file", "filename", "audio_file", "audiofile"],
  }[type] || ["file", "filename"];
  const preferredSet = new Set(preferred);
  const widgets = Array.isArray(source.widgets) ? source.widgets : [];
  const ordered = [
    ...widgets.filter((item) => preferredSet.has(String(item?.name || "").toLowerCase())),
    ...widgets,
  ];
  for (const item of ordered) {
    const filename = filenameFromValue(item?.value);
    if (!filename) continue;
    const name = String(item?.name || "").toLowerCase();
    if (preferredSet.has(name) || /\.(png|jpe?g|webp|gif|bmp|mp4|webm|mov|mkv|avi|m4v|mp3|wav|flac|ogg|m4a)$/i.test(filename)) {
      return filename;
    }
  }
  return filenameFromValue(source?.properties?.filename || source?.properties?.file);
}

function sourceLabel(source) {
  return String(source?.title || source?.comfyClass || source?.type || "connected media");
}

function sourceWidgetValue(source, names) {
  const wanted = new Set(names.map((name) => String(name).toLowerCase()));
  const widgets = Array.isArray(source?.widgets) ? source.widgets : [];
  const ordered = [
    ...widgets.filter((item) => wanted.has(String(item?.name || "").toLowerCase())),
    ...widgets,
  ];
  for (const item of ordered) {
    const value = item?.value;
    const raw = typeof value === "object" ? (value?.filename || value?.name || "") : value;
    const filename = String(raw || "").trim();
    if (filename && !/^(data|blob|https?):/i.test(filename)) return value;
  }
  return null;
}

function sourcePreviewUrl(source, type) {
  if (!source || type === "audio") return "";
  const existingImage = (source.imgs || []).find((item) => item?.src);
  if (existingImage?.src) return existingImage.src;
  for (const item of source.widgets || []) {
    const element = item?.element;
    const image = element?.matches?.("img") ? element : element?.querySelector?.("img");
    if (image?.src) return image.src;
    const video = element?.matches?.("video") ? element : element?.querySelector?.("video");
    if (type === "video" && (video?.poster || video?.currentSrc || video?.src)) {
      return video.poster || video.currentSrc || video.src;
    }
  }
  const names = type === "video" ? ["video", "file", "filename"] : ["image", "file", "filename"];
  const value = sourceWidgetValue(source, names);
  const raw = typeof value === "object" ? value : { filename: value, type: "input" };
  const filename = String(raw?.filename || raw?.name || "").trim();
  if (!filename) return "";
  const params = new URLSearchParams({
    filename,
    type: String(raw?.type || "input"),
  });
  if (raw?.subfolder) params.set("subfolder", String(raw.subfolder));
  return `/view?${params.toString()}`;
}

function linkSourceId(link) {
  const sourceNode = link?.origin_node || link?.originNode || link?.sourceNode;
  const sourceId = link?.origin_id ?? link?.originId ?? link?.source_id ?? link?.sourceId
    ?? (typeof sourceNode === "object" ? sourceNode?.id : sourceNode);
  return Number.isFinite(Number(sourceId)) ? Number(sourceId) : null;
}

function inferT8MediaType(sourceNode, link) {
  const linkedType = String(link?.type || link?.data_type || link?.dataType || "").toLowerCase();
  if (linkedType.includes("audio")) return "audio";
  if (linkedType.includes("video")) return "video";
  if (linkedType.includes("image")) return "image";
  const className = nodeClassName(sourceNode).toLowerCase();
  if (className.includes("audio")) return "audio";
  if (className.includes("video")) return "video";
  return "image";
}

function t8AggregatorReferenceLinks(node, conditioning) {
  const bundleInput = (conditioning?.inputs || []).find((input) => String(input?.name || "") === "media_bundle");
  if (bundleInput?.link == null) return [];
  const bundleLink = graphLinkFor(conditioning, bundleInput.link);
  const aggregator = sourceNodeFor(node, linkSourceId(bundleLink));
  if (!aggregator || nodeClassName(aggregator) !== T8_AGGREGATOR_CLASS) return [];

  return (aggregator.inputs || []).map((input, inputIndex) => {
    const name = String(input?.name || "");
    if (!/^media\.media_\d+$/.test(name) || input?.link == null) return null;
    const link = graphLinkFor(aggregator, input.link);
    const sourceId = linkSourceId(link);
    if (sourceId == null) return null;
    const sourceNode = sourceNodeFor(node, sourceId);
    const sourceSlot = link?.origin_slot ?? link?.originSlot ?? link?.source_slot ?? link?.sourceSlot ?? 0;
    return {
      source_id: sourceId,
      source_slot: Number(sourceSlot) || 0,
      media_type: inferT8MediaType(sourceNode, link),
      order: inputIndex,
      t8_input: name,
    };
  }).filter(Boolean);
}

function t8ReferenceLinks(node) {
  const conditioning = t8ConditioningNodeFor(node);
  if (!conditioning) return [];

  const aggregated = t8AggregatorReferenceLinks(node, conditioning);
  if (aggregated.length) return aggregated;

  return (conditioning.inputs || []).map((input, inputIndex) => {
    const name = String(input?.name || "");
    let mediaType = "";
    if (name === "first_frame" || name === "last_frame" || /^ref_images\.ref_image_\d+$/.test(name)) {
      mediaType = "image";
    } else if (/^ref_videos\.ref_video_\d+$/.test(name)) {
      mediaType = "video";
    } else if (name === "drive_audio" || /^ref_video_audios\.ref_video_audio_\d+$/.test(name)
      || /^ref_audios\.ref_audio_\d+$/.test(name)) {
      mediaType = "audio";
    }
    if (!mediaType || input?.link == null) return null;

    const link = graphLinkFor(conditioning, input.link);
    const sourceId = linkSourceId(link);
    if (sourceId == null) return null;

    const sourceSlot = link?.origin_slot ?? link?.originSlot ?? link?.source_slot ?? link?.sourceSlot ?? 0;
    return {
      source_id: sourceId,
      source_slot: Number(sourceSlot) || 0,
      media_type: mediaType,
      order: inputIndex,
      t8_input: name,
    };
  }).filter(Boolean);
}

function referenceOptions(node) {
  const h3 = h3EasyNodeFor(node);
  const virtualLinks = Array.isArray(h3?.properties?.[LINKS_PROP]) ? h3.properties[LINKS_PROP] : [];
  const t8Links = t8ReferenceLinks(node);
  const links = t8Links.length ? t8Links : virtualLinks;
  const typeOrder = { image: 0, video: 1, audio: 2 };
  const ordered = links
    .map((link, index) => ({ link, index }))
    .sort((left, right) => {
      const leftType = mediaType(left.link);
      const rightType = mediaType(right.link);
      return (typeOrder[leftType] ?? 0) - (typeOrder[rightType] ?? 0)
        || Number(left.link?.order || left.index + 1) - Number(right.link?.order || right.index + 1)
        || left.index - right.index;
    });
  const counts = { image: 0, video: 0, audio: 0 };
  return ordered.map(({ link }) => {
    const type = mediaType(link);
    counts[type] += 1;
    const ordinal = counts[type];
    const kind = type === "image" ? "Picture" : type === "video" ? "Video" : "Audio";
    const source = sourceNodeFor(node, link?.source_id);
    const filename = sourceFilename(source, type);
    const label = `${kind} ${ordinal}`;
    return {
      type,
      ordinal,
      label,
      tag: `<${label}>`,
      token: `@${label}`,
      sourceId: Number(link?.source_id),
      sourceSlot: Number(link?.source_slot) || 0,
      source: filename || sourceLabel(source),
      detail: type === "image" ? "connected image" : type === "video" ? "connected video" : "connected audio",
      previewUrl: sourcePreviewUrl(source, type),
    };
  });
}

function buildReferenceContext(node, manualValue) {
  const options = referenceOptions(node);
  const manual = String(manualValue || "").trim();
  if (!options.length) return manual;
  const connected = [
    "CONNECTED REFERENCES (labels are fixed; use them exactly):",
    ...options.map((option) => `${option.tag}: ${option.detail}${option.source ? ` (${option.source})` : ""}.`),
  ].join("\n");
  if (!manual || manual === DEFAULT_REFERENCE_CONTEXT || /^No external references are used\.?$/i.test(manual)) return connected;
  return `${connected}\n\nUSER-PROVIDED REFERENCE NOTES:\n${manual}`;
}

function installStyles() {
  if (typeof document === "undefined" || document.getElementById("h3-writer-styles")) return;
  const style = document.createElement("style");
  style.id = "h3-writer-styles";
  style.textContent = `
    .h3-writer-prompt-wrap { position: relative; width: 100%; height: 100%; min-height: 0; box-sizing: border-box; overflow: hidden; }
    .h3-writer-prompt-editor {
      display: block; width: 100%; height: 100%; min-height: 0; box-sizing: border-box; padding: 7px 9px;
      overflow-y: auto; overflow-x: hidden; white-space: pre-wrap; overflow-wrap: anywhere;
      border: 0; border-radius: 5px; outline: none; resize: none;
      background: var(--comfy-input-bg, #222); color: var(--input-text, #ddd); caret-color: var(--input-text, #ddd);
      font-family: Consolas, "Courier New", monospace; font-size: var(--comfy-textarea-font-size, 12px); line-height: 1.35;
    }
    .h3-writer-prompt-editor:focus { box-shadow: 0 0 0 1px var(--border-color, rgba(255,255,255,.2)); }
    .h3-writer-prompt-editor:empty::before { content: attr(data-placeholder); color: rgba(255,255,255,.4); pointer-events: none; }
    .h3-writer-mention-menu {
      position: fixed; z-index: 10080; width: 250px; max-height: 330px; overflow: auto; padding: 5px;
      border: 1px solid rgba(255,255,255,.18); border-radius: 8px; background: rgba(28,28,28,.98);
      box-shadow: 0 16px 38px rgba(0,0,0,.42); color: rgba(255,255,255,.94);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .h3-writer-mention-title { padding: 6px 8px 7px; color: rgba(255,255,255,.62); font-size: 12px; }
    .h3-writer-mention-empty { padding: 9px 10px; color: rgba(255,255,255,.62); font-size: 12px; }
    .h3-writer-mention-item { display: grid; grid-template-columns: 34px minmax(0,1fr); gap: 8px; align-items: center; min-height: 42px; padding: 5px 7px; border-radius: 6px; cursor: pointer; }
    .h3-writer-mention-item:hover, .h3-writer-mention-item.is-active { background: rgba(160,255,178,.15); }
    .h3-writer-mention-thumb { display: block; width: 32px; height: 32px; border-radius: 5px; object-fit: cover; background: linear-gradient(135deg, #355b7d, #1d2c3d); box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); }
    .h3-writer-mention-thumb.is-video { background: linear-gradient(135deg, #315f83, #24384f); }
    .h3-writer-mention-thumb.is-audio { display: grid; place-items: center; color: #86f4d8; font-size: 19px; background: linear-gradient(135deg, #1f6c65, #173f48); }
    .h3-writer-mention-main { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; font-weight: 700; }
    .h3-writer-mention-detail { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 2px; color: rgba(255,255,255,.55); font-size: 11px; }
  `;
  document.head.append(style);
}

function editorText(editor) {
  let result = "";
  const visit = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      result += String(node.textContent || "");
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.tagName === "BR") {
      result += "\n";
      return;
    }
    const block = ["DIV", "P"].includes(node.tagName);
    if (block && result && !result.endsWith("\n")) result += "\n";
    for (const child of node.childNodes || []) visit(child);
  };
  for (const child of editor?.childNodes || []) visit(child);
  return result;
}

function syncEditorToWidget(node, markDirty = true) {
  const editor = node?.__h3WriterEditor;
  const target = widget(node, "user_prompt");
  if (!editor || !target || node.__h3WriterSyncing) return;
  node.__h3WriterSyncing = true;
  try {
    const value = editorText(editor);
    target.value = value;
    if (target._state) target._state.value = value;
    if (markDirty) {
      node.setDirtyCanvas?.(true, true);
      app.graph?.setDirtyCanvas?.(true, true);
      app.graph?.change?.();
    }
  } finally {
    node.__h3WriterSyncing = false;
  }
}

function renderEditorFromWidget(node, force = false) {
  const editor = node?.__h3WriterEditor;
  const target = widget(node, "user_prompt");
  if (!editor || !target || (!force && document.activeElement === editor)) return;
  editor.textContent = String(target.value || "");
}

function getMentionRange(editor) {
  const selection = window.getSelection?.();
  if (!selection || !selection.rangeCount || !selection.isCollapsed) return null;
  const caret = selection.getRangeAt(0);
  if (!editor.contains(caret.startContainer) || caret.startContainer.nodeType !== Node.TEXT_NODE) return null;

  const units = [];
  const visit = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      units.push({ kind: "text", node });
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.tagName === "BR") {
      units.push({ kind: "break", node });
      return;
    }
    for (const child of node.childNodes || []) visit(child);
  };
  visit(editor);
  const currentIndex = units.findIndex((unit) => unit.kind === "text" && unit.node === caret.startContainer);
  if (currentIndex < 0) return null;

  const selected = [];
  for (let index = currentIndex; index >= 0; index -= 1) {
    const unit = units[index];
    if (unit.kind !== "text") break;
    const end = index === currentIndex ? caret.startOffset : (unit.node.textContent || "").length;
    selected.unshift({ unit, text: (unit.node.textContent || "").slice(0, end) });
  }
  const before = selected.map((entry) => entry.text).join("");
  const match = before.match(/@[^@\n]*$/);
  if (!match) return null;

  const targetStart = before.length - match[0].length;
  let offset = 0;
  const range = document.createRange();
  for (const entry of selected) {
    const next = offset + entry.text.length;
    if (targetStart <= next) {
      range.setStart(entry.unit.node, Math.max(0, targetStart - offset));
      break;
    }
    offset = next;
  }
  range.setEnd(caret.startContainer, caret.startOffset);
  return { range, query: match[0].slice(1) };
}

function closeMentionMenu(node) {
  node?.__h3WriterMentionMenu?.element?.remove?.();
  if (node) node.__h3WriterMentionMenu = null;
}

function positionMentionMenu(element, editor) {
  const selection = window.getSelection?.();
  const caret = selection?.rangeCount ? selection.getRangeAt(0).getBoundingClientRect() : null;
  const editorRect = editor.getBoundingClientRect();
  const rect = caret && (caret.width || caret.height) ? caret : editorRect;
  const width = element.offsetWidth || 250;
  const height = Math.min(330, element.offsetHeight || 120);
  let left = rect.left;
  let top = rect.bottom + 6;
  if (left + width > window.innerWidth - 8) left = window.innerWidth - width - 8;
  if (top + height > window.innerHeight - 8) top = Math.max(8, rect.top - height - 6);
  element.style.left = `${Math.max(8, Math.round(left))}px`;
  element.style.top = `${Math.max(8, Math.round(top))}px`;
}

function renderMentionMenu(node) {
  const state = node?.__h3WriterMentionMenu;
  if (!state) return;
  state.element.textContent = "";
  const title = document.createElement("div");
  title.className = "h3-writer-mention-title";
  title.textContent = "引用素材（选择后插入 @）";
  state.element.append(title);
  if (!state.options.length) {
    const empty = document.createElement("div");
    empty.className = "h3-writer-mention-empty";
    empty.textContent = "没有检测到已连接素材；请先把上传节点接到 T8 Conditioning 或 MiniMax H3 Easy。也可以手动输入 @Picture 1。";
    state.element.append(empty);
    return;
  }
  state.options.forEach((option, index) => {
    const item = document.createElement("div");
    item.className = `h3-writer-mention-item${index === state.activeIndex ? " is-active" : ""}`;
    const thumb = document.createElement(option.type === "video" && option.previewUrl ? "video" : "span");
    thumb.className = `h3-writer-mention-thumb is-${option.type}`;
    thumb.setAttribute("aria-hidden", "true");
    if (option.type === "audio") {
      thumb.textContent = "♫";
    } else if (option.previewUrl && option.type === "video") {
      thumb.src = option.previewUrl;
      thumb.muted = true;
      thumb.autoplay = true;
      thumb.loop = true;
      thumb.playsInline = true;
      thumb.addEventListener("error", () => {
        thumb.removeAttribute("src");
        thumb.textContent = "▶";
      }, { once: true });
    } else if (option.previewUrl) {
      const image = document.createElement("img");
      image.className = thumb.className;
      image.alt = "";
      image.draggable = false;
      image.src = option.previewUrl;
      image.addEventListener("error", () => image.replaceWith(Object.assign(document.createElement("span"), {
        className: `h3-writer-mention-thumb is-${option.type}`,
      })), { once: true });
      item.append(image);
    }
    const main = document.createElement("div");
    main.className = "h3-writer-mention-main";
    main.textContent = option.token;
    const detail = document.createElement("div");
    detail.className = "h3-writer-mention-detail";
    detail.textContent = `${option.tag} · ${option.source}`;
    const text = document.createElement("div");
    text.append(main, detail);
    if (!item.firstChild) item.append(thumb);
    item.append(text);
    item.addEventListener("pointermove", () => {
      if (node.__h3WriterMentionMenu?.activeIndex === index) return;
      node.__h3WriterMentionMenu.activeIndex = index;
      renderMentionMenu(node);
    });
    item.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      chooseMention(node, option);
    });
    state.element.append(item);
  });
}

function openMentionMenu(node, editor) {
  const mention = getMentionRange(editor);
  if (!mention) {
    closeMentionMenu(node);
    return false;
  }
  const query = mention.query.toLowerCase();
  const options = referenceOptions(node).filter((option) =>
    !query || `${option.label} ${option.source} ${option.detail}`.toLowerCase().includes(query)
  );
  const existing = node.__h3WriterMentionMenu;
  if (existing) {
    existing.mention = mention;
    existing.options = options;
    existing.activeIndex = Math.min(existing.activeIndex, Math.max(0, options.length - 1));
    renderMentionMenu(node);
    positionMentionMenu(existing.element, editor);
    return true;
  }
  const element = document.createElement("div");
  element.className = MENU_CLASS;
  document.body.append(element);
  node.__h3WriterMentionMenu = { element, mention, options, activeIndex: 0 };
  renderMentionMenu(node);
  positionMentionMenu(element, editor);
  return true;
}

function syncMentionMenuToCaret(node, editor) {
  if (!getMentionRange(editor)) {
    closeMentionMenu(node);
    return false;
  }
  return openMentionMenu(node, editor);
}

function chooseMention(node, option) {
  const state = node?.__h3WriterMentionMenu;
  const editor = node?.__h3WriterEditor;
  const range = state?.mention?.range;
  if (!range || !editor) return;
  range.deleteContents();
  const inserted = document.createTextNode(`${option.token} `);
  range.insertNode(inserted);
  const caret = document.createRange();
  caret.setStart(inserted, inserted.textContent.length);
  caret.collapse(true);
  const selection = window.getSelection?.();
  selection?.removeAllRanges();
  selection?.addRange(caret);
  closeMentionMenu(node);
  syncEditorToWidget(node);
  editor.focus();
}

function handleMentionMenuKeydown(node, event) {
  const state = node?.__h3WriterMentionMenu;
  if (!state) return false;
  if (event.key === "Escape") {
    closeMentionMenu(node);
    return true;
  }
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    if (!state.options.length) return true;
    const direction = event.key === "ArrowDown" ? 1 : -1;
    state.activeIndex = (state.activeIndex + direction + state.options.length) % state.options.length;
    renderMentionMenu(node);
    positionMentionMenu(state.element, node.__h3WriterEditor);
    return true;
  }
  if ((event.key === "Enter" || event.key === "Tab") && state.options[state.activeIndex]) {
    chooseMention(node, state.options[state.activeIndex]);
    return true;
  }
  return false;
}

function installUserPromptEditor(node) {
  if (node.__h3WriterEditor || typeof document === "undefined" || typeof node.addDOMWidget !== "function") return;
  const target = widget(node, "user_prompt");
  if (!target) return;
  hideWidget(target);

  const wrap = document.createElement("div");
  wrap.className = "h3-writer-prompt-wrap";
  const editor = document.createElement("div");
  editor.className = EDITOR_CLASS;
  editor.contentEditable = "true";
  editor.spellcheck = false;
  editor.tabIndex = 0;
  editor.setAttribute("role", "textbox");
  editor.setAttribute("aria-label", "user prompt");
  editor.dataset.placeholder = "输入视频想法；输入 @ 选择已连接的图片、视频或音频";
  editor.textContent = String(target.value || "");
  editor.addEventListener("beforeinput", (event) => {
    if (event.inputType === "insertText" && event.data === "@") {
      setTimeout(() => syncMentionMenuToCaret(node, editor), 0);
    }
  });
  editor.addEventListener("input", () => {
    syncEditorToWidget(node);
    setTimeout(() => syncMentionMenuToCaret(node, editor), 0);
  });
  editor.addEventListener("keyup", (event) => {
    if (!["ArrowUp", "ArrowDown", "Enter", "Escape", "Tab"].includes(event.key)) {
      syncMentionMenuToCaret(node, editor);
    }
    event.stopPropagation();
  });
  editor.addEventListener("keydown", (event) => {
    if (handleMentionMenuKeydown(node, event)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (event.key === "Escape") closeMentionMenu(node);
    event.stopPropagation();
  });
  editor.addEventListener("focus", () => syncMentionMenuToCaret(node, editor));
  editor.addEventListener("blur", () => {
    syncEditorToWidget(node, false);
    setTimeout(() => {
      if (!node.__h3WriterMentionMenu?.element?.matches?.(":hover")) closeMentionMenu(node);
    }, 160);
  });
  wrap.addEventListener("pointerdown", (event) => event.stopPropagation());
  wrap.append(editor);
  const domWidget = node.addDOMWidget("h3_writer_user_prompt", "h3_writer_user_prompt", wrap, {
    getValue: () => String(widget(node, "user_prompt")?.value || ""),
    setValue: (value) => {
      const current = widget(node, "user_prompt");
      if (current) current.value = String(value || "");
      renderEditorFromWidget(node, true);
    },
    margin: 8,
    serialize: false,
    getMinHeight: () => 92,
    afterResize: () => {
      node._widgetSlotsDirty = true;
      node.setDirtyCanvas?.(true, true);
    },
  });
  if (!domWidget) {
    restoreWidget(target);
    wrap.remove();
    return;
  }
  domWidget.serialize = false;
  setWidgetOption(domWidget, "serialize", false);
  domWidget.computeSize = () => [0, 100];
  const domIndex = node.widgets?.indexOf(domWidget) ?? -1;
  const targetIndex = node.widgets?.indexOf(target) ?? -1;
  if (domIndex >= 0 && targetIndex >= 0 && domIndex !== targetIndex + 1) {
    node.widgets.splice(domIndex, 1);
    const nextTargetIndex = node.widgets.indexOf(target);
    node.widgets.splice(nextTargetIndex + 1, 0, domWidget);
  }
  node.__h3WriterEditor = editor;
  node.__h3WriterEditorWrap = wrap;
  node.__h3WriterDomWidget = domWidget;
  compactPromptStudioLayout(node);
  node.setDirtyCanvas?.(true, true);
}

function installUserPromptEditorSoon(node) {
  if (node.__h3WriterEditor || node.__h3WriterInstallPending) return;
  node.__h3WriterInstallPending = true;
  const run = () => {
    node.__h3WriterInstallPending = false;
    installUserPromptEditor(node);
    if (!node.__h3WriterEditor && !node.__h3WriterInstallRetry) {
      node.__h3WriterInstallRetry = setTimeout(() => {
        node.__h3WriterInstallRetry = null;
        installUserPromptEditor(node);
      }, 150);
    }
  };
  if (typeof requestAnimationFrame === "function") requestAnimationFrame(run);
  else setTimeout(run, 0);
}

function addConvertButton(node) {
  if (node.__h3WriterButton) return;
  const button = node.addWidget("button", "转换为官方 H3 模板", null, async () => {
    syncEditorToWidget(node, false);
    const mode = widget(node, "prompt_mode")?.value || "Ref2VA";
    const userPrompt = widget(node, "user_prompt")?.value || "";
    const duration = Number(widget(node, "duration_seconds")?.value || 5);
    const manualReferences = widget(node, "reference_context")?.value || "";
    const references = buildReferenceContext(node, manualReferences);
    if (!userPrompt.trim()) {
      window.alert("请先在 user_prompt 中输入视频想法。");
      return;
    }
    button.name = "转换中...";
    try {
      const response = await fetch("/minimax_h3/prompt_writer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt_mode: mode,
          user_prompt: userPrompt,
          duration_seconds: duration,
          reference_context: references,
          model: zenModelWidget(node)?.value || "",
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || `HTTP ${response.status}`);
      const edited = widget(node, "edited_template");
      if (edited) {
        edited.value = data.prompt;
        edited.callback?.(edited.value);
      }
      node.setDirtyCanvas(true, true);
      app.graph?.setDirtyCanvas?.(true, true);
    } catch (error) {
      window.alert(`H3 提示词转换失败：${error.message}`);
    } finally {
      button.name = "转换为官方 H3 模板";
      node.setDirtyCanvas(true, true);
    }
  });
  button.serialize = false;
  node.__h3WriterButton = button;
}

app.registerExtension({
  name: "ComfyUI.MiniMaxH3PromptWriter",
  async setup() {
    installStyles();
    scheduleLinkedPromptPatch();
  },
  async beforeRegisterNodeDef(nodeType, nodeData) {
    if (nodeData.name !== NODE_CLASS || nodeType.prototype.__h3WriterInstalled) return;
    nodeType.prototype.__h3WriterInstalled = true;
    const originalCreated = nodeType.prototype.onNodeCreated;
    nodeType.prototype.onNodeCreated = function () {
      originalCreated?.apply(this, arguments);
      installStyles();
      scheduleLinkedPromptPatch();
      compactPromptStudioLayout(this);
      installUserPromptEditorSoon(this);
      addZenModelSelector(this);
      addConvertButton(this);
      this.size = [620, 690];
    };
    const originalConfigure = nodeType.prototype.onConfigure;
    nodeType.prototype.onConfigure = function () {
      const result = originalConfigure?.apply(this, arguments);
      compactPromptStudioLayout(this);
      if (Array.isArray(this.size) && this.size.length >= 2) {
        this.size[1] = Math.min(Number(this.size[1]) || 690, 690);
      }
      installUserPromptEditorSoon(this);
      setTimeout(() => {
        compactPromptStudioLayout(this);
        addZenModelSelector(this);
        loadZenModels(this);
        renderEditorFromWidget(this, true);
      }, 0);
      return result;
    };
    const originalRemoved = nodeType.prototype.onRemoved;
    nodeType.prototype.onRemoved = function () {
      closeMentionMenu(this);
      if (this.__h3WriterInstallRetry) clearTimeout(this.__h3WriterInstallRetry);
      this.__h3WriterEditorWrap?.remove?.();
      this.__h3WriterEditor = null;
      this.__h3WriterEditorWrap = null;
      this.__h3WriterDomWidget = null;
      return originalRemoved?.apply(this, arguments);
    };
  },
});
