import { app } from "../../scripts/app.js";

const NODE_CLASS = "gosick_233_MiniMaxH3Easy";
const NODE_CLASSES = new Set([NODE_CLASS]);
const LOADER_CLASS = "gosick_233_MiniMaxH3EasyLoader";
const OUTPUT_CLASS = "gosick_233_MiniMaxH3EasyOutput";
const LINKS_PROP = "minimax_h3_virtual_media_links";
const PROMPT_DOC_PROP = "minimax_h3_prompt_reference_doc";
const WRITER_IDEA_PROP = "minimax_h3_writer_idea";
const WRITER_GENERATED_MODE_PROP = "minimax_h3_writer_generated_mode";
const WRITER_OUTPUT_LANGUAGE_PROP = "minimax_h3_writer_output_language";
const WRITER_COLLAPSED_PROP = "minimax_h3_writer_collapsed";
const WRITER_REASONING_PROP = "minimax_h3_writer_reasoning_enabled";
const STORYBOARDS_PROP = "minimax_h3_v106_storyboards";
const ACTIVE_STORYBOARD_PROP = "minimax_h3_v106_active_storyboard";
const STORYBOARD_COUNT_PROP = "minimax_h3_v106_storyboard_count";
const V107_SELF_CONTAINED_SEGMENTS_PROP = "minimax_h3_v107_self_contained_segments";
const PROMPT_API_SETTINGS_ENDPOINT = "/minimax_h3/prompt_writer/settings";
const PROMPT_API_MODELS_ENDPOINT = "/minimax_h3/prompt_writer/models/fetch";
const RUNTIME_REF_PREFIX = "__MINIMAX_H3_REF_";
const UNRESOLVED_REF_PREFIX = "__MINIMAX_H3_UNRESOLVED_REF_";
const DIALOGUE_CLASS = "h3-dialogue-block";
const MODE_T2VA = "t2va";
const MODE_I2VA = "i2va";
const MODE_FL2VA = "fl2va";
const MODE_L2VA = "l2va";
const MODE_REFERENCE = "ref2va";
const KEYFRAME_FIRST = "first";
const RESOLUTION_CUSTOM = "custom";
const REF_IMAGE_1K = "1k";
const REF_IMAGE_2K = "2k";
const MAX_MEDIA = 15;
const MIN_SECONDS = 1;
const MAX_SECONDS = 30;
const PROMPT_HISTORY_LIMIT = 120;
const PROMPT_UNDO_VERSION = "2026-08-05-editor-undo-shield-v1";
const CARET_SENTINEL = "\u200B";
const AUDIO_ICON_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect x='0.5' y='10' width='3' height='4' rx='1.5' fill='%2300e2bb'/%3E%3Crect x='5.5' y='7' width='3' height='10' rx='1.5' fill='%2300e2bb'/%3E%3Crect x='10.5' y='4' width='3' height='16' rx='1.5' fill='%2300e2bb'/%3E%3Crect x='15.5' y='7' width='3' height='10' rx='1.5' fill='%2300e2bb'/%3E%3Crect x='20.5' y='10' width='3' height='4' rx='1.5' fill='%2300e2bb'/%3E%3C/svg%3E";
const PRIMARY_BROWSER_LANGUAGE = String(globalThis.navigator?.language || globalThis.navigator?.languages?.[0] || "");
const ZH_BROWSER = /^(zh)(?:[-_]|$)/i.test(PRIMARY_BROWSER_LANGUAGE);
const TEXT = {
    image: ZH_BROWSER ? "\u56fe\u7247" : "Image",
    video: ZH_BROWSER ? "\u89c6\u9891" : "Video",
    audio: ZH_BROWSER ? "\u97f3\u9891" : "Audio",
    loadImage: ZH_BROWSER ? "\u52a0\u8f7d\u56fe\u7247" : "Load image",
    loadVideo: ZH_BROWSER ? "\u52a0\u8f7d\u89c6\u9891" : "Load video",
    loadAudio: ZH_BROWSER ? "\u52a0\u8f7d\u97f3\u9891" : "Load audio",
    deleteLink: ZH_BROWSER ? "\u5220\u9664" : "Delete",
    promptPlaceholder: "Prompt...",
    referencePromptPlaceholder: ZH_BROWSER ? "Prompt... \u8f93\u5165 @ \u5f15\u7528\u5df2\u8fde\u63a5\u7d20\u6750" : "Prompt... Type @ to reference connected media",
    mentionTitle: ZH_BROWSER ? "\u5f15\u7528\u7d20\u6750" : "Reference media",
    mentionEmpty: ZH_BROWSER ? "\u5148\u5c06\u7d20\u6750\u8fde\u63a5\u5230\u4e3b\u8282\u70b9" : "Connect media to the main node first",
    mainTitle: "MiniMax H3 Easy",
    loaderTitle: ZH_BROWSER ? "MiniMax H3 Easy \u52a0\u8f7d\u5668" : "MiniMax H3 Easy Loader",
    outputTitle: ZH_BROWSER ? "MiniMax H3 Easy \u8f93\u51fa" : "MiniMax H3 Easy Output",
    category: "MiniMax H3 Easy",
    mode: ZH_BROWSER ? "\u6a21\u5f0f" : "Mode",
    prompt: ZH_BROWSER ? "\u63d0\u793a\u8bcd" : "Prompt",
    resolution: ZH_BROWSER ? "\u5206\u8fa8\u7387" : "Resolution",
    aspectRatio: ZH_BROWSER ? "\u5bbd\u9ad8\u6bd4" : "Aspect ratio",
    width: ZH_BROWSER ? "\u5bbd\u5ea6" : "Width",
    height: ZH_BROWSER ? "\u9ad8\u5ea6" : "Height",
    seconds: ZH_BROWSER ? "\u79d2\u6570" : "Seconds",
    advanced: ZH_BROWSER ? "\u9ad8\u7ea7\u9009\u9879" : "Advanced options",
    fps: ZH_BROWSER ? "\u5e27\u7387 (FPS)" : "Frame rate (FPS)",
    keyframeRole: ZH_BROWSER ? "\u9996\u5c3e\u5e27\u8bbe\u7f6e" : "First/last frame setup",
    refImageSize: ZH_BROWSER ? "\u53c2\u8003\u56fe\u5c3a\u5bf8" : "Reference size",
    referenceMentionMode: ZH_BROWSER ? "@\u5f15\u7528\u65b9\u5f0f" : "@ reference mode",
    mentionByFilename: ZH_BROWSER ? "\u6309\u6587\u4ef6\u540d" : "By filename",
    mentionByIndex: ZH_BROWSER ? "\u6309\u5e8f\u53f7" : "By index",
    bundle: ZH_BROWSER ? "H3 \u6a21\u578b\u7ec4\u5408" : "H3 model bundle",
    fl2vaModel: ZH_BROWSER ? "FL2VA \u6a21\u578b" : "FL2VA model",
    ref2vaModel: ZH_BROWSER ? "REF2VA \u6a21\u578b" : "REF2VA model",
    textEncoder: ZH_BROWSER ? "\u6587\u672c\u7f16\u7801\u5668" : "Text encoder",
    videoVae: ZH_BROWSER ? "\u89c6\u9891 VAE" : "Video VAE",
    audioVae: ZH_BROWSER ? "\u97f3\u9891 VAE" : "Audio VAE",
    outputModel: "Model",
    outputPreviewFrames: ZH_BROWSER ? "\u9884\u89c8\u5e27\u6570" : "Preview frames",
    outputConditioning: "Conditioning",
    outputLatent: "Latent",
    outputVideoVae: "Video VAE",
    outputAudioVae: "Audio VAE",
    outputFps: "FPS",
    outputContext: "H3 Context",
    inputMedia: "Media",
    ideaTitle: ZH_BROWSER ? "AI 创意输入（可选）" : "AI idea input (optional)",
    ideaHint: ZH_BROWSER ? "在这里写你的想法，再点击生成提示词。" : "Describe your idea here, then generate a prompt.",
    finalPromptTitle: ZH_BROWSER ? "最终提示词（实际送入 H3）" : "Final prompt (sent to H3)",
    finalPromptHint: ZH_BROWSER ? "可直接手写，也可由上方 AI 生成后自动填入。" : "Write directly, or generate it from the AI idea above.",
    writerApiSettings: ZH_BROWSER ? "提示词优化 API 设置" : "Prompt API settings",
    writerLanguageChanged: ZH_BROWSER ? "返回语言已切换，请重新生成提示词。" : "Output language changed. Generate the prompt again.",
    generatePrompt: ZH_BROWSER ? "生成提示词" : "Generate prompt",
    generatingPrompt: ZH_BROWSER ? "生成中…" : "Generating…",
    analyzingImages: ZH_BROWSER ? "识图并生成中…" : "Analyzing images and generating…",
    generatedPrompt: ZH_BROWSER ? "已生成并填入下方最终提示词。" : "Generated and filled into the final prompt below.",
    generatedWithVision: ZH_BROWSER ? "已识别图片并生成提示词。" : "Images analyzed and prompt generated.",
    stalePrompt: ZH_BROWSER ? "顶部模式已改变，绿色区域仍是上一模式的结果；请重新生成或手动修改。" : "The top mode changed; the green prompt is from the previous mode. Regenerate it or edit it manually.",
    writerIdeaRequired: ZH_BROWSER ? "请先在黄色区域输入视频想法。" : "Enter a video idea in the yellow area first.",
};
const OPTION_DEFS = {
    mode: {
        [MODE_T2VA]: ZH_BROWSER ? "T2VA（文生视频）" : "T2VA (Text-to-video)",
        [MODE_I2VA]: ZH_BROWSER ? "I2VA（首帧生视频）" : "I2VA (First-frame-to-video)",
        [MODE_FL2VA]: ZH_BROWSER ? "FL2VA（首尾帧生视频）" : "FL2VA (First/last-frame video)",
        [MODE_L2VA]: ZH_BROWSER ? "L2VA（尾帧生视频）" : "L2VA (Last-frame-to-video)",
        [MODE_REFERENCE]: ZH_BROWSER ? "Ref2VA（参考生视频）" : "Ref2VA (Reference-to-video)",
    },
    keyframe_role: {
        first: ZH_BROWSER ? "\u9996\u5e27\u4f18\u5148" : "First frame priority",
        last: ZH_BROWSER ? "\u5c3e\u5e27\u4f18\u5148" : "Last frame priority",
    },
    ref_image_size: {
        [REF_IMAGE_1K]: ZH_BROWSER ? "\u77ed\u8fb9\u6700\u59271K\u50cf\u7d20" : "Max 1K Short Edge",
        [REF_IMAGE_2K]: ZH_BROWSER ? "\u77ed\u8fb9\u6700\u59272K\u50cf\u7d20" : "Max 2K Short Edge",
    },
    reference_mention_mode: {
        filename: ZH_BROWSER ? "\u6309\u6587\u4ef6\u540d" : "By filename",
        index: ZH_BROWSER ? "\u6309\u5e8f\u53f7" : "By index",
    },
    resolution: {
        "360P": "360P",
        "416P": "416P",
        "480P": "480P",
        "540P": "540P",
        "640P": "640P",
        "720P": "720P",
        "768P": "768P",
        "832P": "832P",
        "928P": "928P",
        "1024P": "1024P",
        "1080P": "1080P",
        [RESOLUTION_CUSTOM]: "Custom",
    },
    aspect_ratio: {
        "1:1": "1:1",
        "2:3": "2:3",
        "3:2": "3:2",
        "3:4": "3:4",
        "4:3": "4:3",
        "9:16": "9:16",
        "16:9": "16:9",
        "21:9": "21:9",
    },
};
const OPTION_ALIASES = {
    mode: {
        [MODE_T2VA]: MODE_T2VA,
        T2VA: MODE_T2VA,
        "T2VA（文生视频）": MODE_T2VA,
        [MODE_I2VA]: MODE_I2VA,
        I2VA: MODE_I2VA,
        "I2VA（首帧生视频）": MODE_I2VA,
        "I2VA（图生视频）": MODE_I2VA,
        [MODE_FL2VA]: MODE_FL2VA,
        FL2VA: MODE_FL2VA,
        "FL2VA（首尾帧生视频）": MODE_FL2VA,
        [MODE_L2VA]: MODE_L2VA,
        L2VA: MODE_L2VA,
        "L2VA（尾帧生视频）": MODE_L2VA,
        [MODE_REFERENCE]: MODE_REFERENCE,
        Ref2VA: MODE_REFERENCE,
        "Ref2VA（参考生视频）": MODE_REFERENCE,
        image: MODE_T2VA,
        "\u56fe\u751f\u6216\u9996\u5c3e\u5e27": MODE_T2VA,
        "\u56fe\u751f\u6216\u9996\u5c3e\u5e27\u89c6\u9891": MODE_T2VA,
        "I2V or First/Last Frame": MODE_T2VA,
        reference: MODE_REFERENCE,
        "\u53c2\u8003\u751f\u89c6\u9891": MODE_REFERENCE,
        "Reference-to-video": MODE_REFERENCE,
    },
    keyframe_role: {
        first: "first",
        "\u9996\u5e27\u4f18\u5148": "first",
        "First frame priority": "first",
        last: "last",
        "\u5c3e\u5e27\u4f18\u5148": "last",
        "Last frame priority": "last",
    },
    ref_image_size: {
        [REF_IMAGE_1K]: REF_IMAGE_1K,
        "\u77ed\u8fb9\u6700\u59271K\u50cf\u7d20": REF_IMAGE_1K,
        "Max 1K Short Edge": REF_IMAGE_1K,
        [REF_IMAGE_2K]: REF_IMAGE_2K,
        "\u77ed\u8fb9\u6700\u59272K\u50cf\u7d20": REF_IMAGE_2K,
        "Max 2K Short Edge": REF_IMAGE_2K,
    },
    reference_mention_mode: {
        filename: "filename",
        "\u6309\u6587\u4ef6\u540d": "filename",
        "By filename": "filename",
        index: "index",
        "\u6309\u5e8f\u53f7": "index",
        "By index": "index",
    },
};
const COLOR_IMAGE = "#5aa9f0";
const COLOR_LINK_BORDER = "rgba(0,0,0,0.5)";
const COMFY_NATIVE_LINK_COLOR = "#9A9";
const LABELS = {
    image: TEXT.image,
    video: TEXT.video,
    audio: TEXT.audio,
};
const LOADERS = {
    image: { classType: "LoadImage", label: TEXT.loadImage },
    video: { classType: "LoadVideo", label: TEXT.loadVideo },
    audio: { classType: "LoadAudio", label: TEXT.loadAudio },
};

let installed = false;
let patchedCanvas = false;
let patchedPrompt = false;
let linkMenu = null;
let createMenu = null;
let quickCreateCaptureCanvas = null;
let quickCreateCaptureCleanup = null;
let activePromptNode = null;
let lastCapturedDropAt = 0;
let nativeDropGuardActive = false;
const videoThumbnailCache = new Map();
let mentionPreviewRefreshTimer = null;
let suppressNativeDropUntil = 0;
let nativeSearchSuppressStyle = null;
let releaseCreateMenuLinkHold = null;
let nativeThemeWatcherInstalled = false;
let lastVueNodesMode = null;
let composerFieldSequence = 0;

function isTarget(node) {
    return NODE_CLASSES.has(String(node?.comfyClass || node?.type || node?.constructor?.nodeData?.name || ""));
}

function isV106(node) {
    return isTarget(node);
}

function isLoader(node) {
    return String(node?.comfyClass || node?.type || node?.constructor?.nodeData?.name || "") === LOADER_CLASS;
}

function isOutput(node) {
    return String(node?.comfyClass || node?.type || node?.constructor?.nodeData?.name || "") === OUTPUT_CLASS;
}

function canonicalOption(name, value) {
    const raw = String(value ?? "");
    const alias = OPTION_ALIASES[name]?.[raw];
    if (alias !== undefined) return alias;
    const definition = OPTION_DEFS[name];
    if (definition) {
        for (const [key, label] of Object.entries(definition)) {
            if (raw === key || raw === label) return key;
        }
    }
    return raw;
}

function localizeComboWidget(widget) {
    const name = String(widget?.name || "");
    const definition = OPTION_DEFS[name];
    if (!widget || !definition) return;
    const current = canonicalOption(name, widget.value);
    widget.__h3OptionName = name;
    widget.options ||= {};
    widget.options.values = Object.values(definition);
    widget.value = definition[current] ?? widget.value;
}

function setLocalizedSlotLabel(slot, label) {
    if (!slot || !label) return;
    slot.label = label;
    slot.localized_name = label;
}

function localizeNodeInstance(node) {
    if (!node) return;
    if (isLoader(node)) {
        node.title = TEXT.loaderTitle;
        const labels = { fl2va_model: TEXT.fl2vaModel, ref2va_model: TEXT.ref2vaModel, text_encoder: TEXT.textEncoder, video_vae: TEXT.videoVae, audio_vae: TEXT.audioVae };
        for (const widget of node.widgets || []) if (labels[widget.name]) widget.label = labels[widget.name];
        for (const input of node.inputs || []) if (labels[input.name]) setLocalizedSlotLabel(input, labels[input.name]);
        return;
    }
    if (isOutput(node)) {
        node.title = TEXT.outputTitle;
        for (const input of node.inputs || []) {
            if (input.name === "h3_context") setLocalizedSlotLabel(input, TEXT.outputContext);
        }
        const outputLabels = { positive: TEXT.outputConditioning, latent: TEXT.outputLatent, video_vae: TEXT.outputVideoVae, audio_vae: TEXT.outputAudioVae, fps: TEXT.outputFps };
        for (const output of node.outputs || []) {
            const key = String(output.name || "").toLowerCase();
            if (outputLabels[key]) setLocalizedSlotLabel(output, outputLabels[key]);
        }
        return;
    }
    if (!isTarget(node)) return;
    node.title = TEXT.mainTitle;
    const labels = { mode: TEXT.mode, prompt: TEXT.prompt, resolution: TEXT.resolution, aspect_ratio: TEXT.aspectRatio, width: TEXT.width, height: TEXT.height, seconds: TEXT.seconds, advanced: TEXT.advanced, fps: TEXT.fps, keyframe_role: TEXT.keyframeRole, ref_image_size: TEXT.refImageSize, reference_mention_mode: TEXT.referenceMentionMode };
    for (const widget of node.widgets || []) {
        if (labels[widget.name]) widget.label = labels[widget.name];
        localizeComboWidget(widget);
    }
    for (const input of node.inputs || []) {
        if (input.name === "h3_bundle") setLocalizedSlotLabel(input, TEXT.bundle);
        if (input.name === "media") setLocalizedSlotLabel(input, TEXT.inputMedia);
    }
    const outputLabels = { model: TEXT.outputModel, h3_context: TEXT.outputContext, preview_frames: TEXT.outputPreviewFrames };
    for (const output of node.outputs || []) {
        const key = String(output.name || "").toLowerCase();
        if (outputLabels[key]) setLocalizedSlotLabel(output, outputLabels[key]);
    }
}

function localizeNodeDefinition(nodeData) {
    if (!nodeData || ![...NODE_CLASSES, LOADER_CLASS, OUTPUT_CLASS].includes(nodeData.name)) return;
    nodeData.display_name = nodeData.name === LOADER_CLASS
        ? TEXT.loaderTitle
        : nodeData.name === OUTPUT_CLASS
            ? TEXT.outputTitle
            : TEXT.mainTitle;
    nodeData.category = TEXT.category;
}

function getWidget(node, name) {
    return node?.widgets?.find((widget) => widget?.name === name) || null;
}

function getWidgetValue(node, name, fallback = "") {
    const widget = getWidget(node, name);
    return widget?.value ?? fallback;
}

function asBoolean(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        if (["", "0", "false", "off", "no"].includes(normalized)) return false;
        if (["1", "true", "on", "yes"].includes(normalized)) return true;
    }
    return value == null ? fallback : Boolean(value);
}

function currentMode(node) {
    return canonicalOption("mode", getWidgetValue(node, "mode", MODE_T2VA));
}

function isReferenceMode(node) {
    return currentMode(node) === MODE_REFERENCE;
}

function writerPromptMode(node) {
    return {
        [MODE_T2VA]: "T2VA",
        [MODE_I2VA]: "I2VA",
        [MODE_FL2VA]: "FL2VA",
        [MODE_L2VA]: "L2VA",
        [MODE_REFERENCE]: "Ref2VA",
    }[currentMode(node)] || "T2VA";
}

function isCustomResolution(node) {
    return canonicalOption("resolution", getWidgetValue(node, "resolution", "480P")) === RESOLUTION_CUSTOM;
}

function isAdvancedEnabled(node) {
    return asBoolean(getWidgetValue(node, "advanced", false));
}

function referenceMentionMode(node) {
    const value = canonicalOption("reference_mention_mode", getWidgetValue(node, "reference_mention_mode", "index"));
    return value === "index" ? "index" : "filename";
}

function ensureLinks(node) {
    node.properties ||= {};
    if (!Array.isArray(node.properties[LINKS_PROP])) {
        node.properties[LINKS_PROP] = [];
    }
    return node.properties[LINKS_PROP];
}

function isSameNode(left, right) {
    if (!left || !right) return false;
    if (left === right) return true;
    const leftId = Number(left.id);
    const rightId = Number(right.id);
    return Number.isFinite(leftId) && Number.isFinite(rightId) && leftId === rightId;
}

function resequence(node) {
    const counts = { image: 0, video: 0, audio: 0 };
    ensureLinks(node).forEach((link) => {
        const mediaType = String(link.media_type || "image").toLowerCase();
        const sequenceType = Object.hasOwn(counts, mediaType) ? mediaType : "image";
        counts[sequenceType] += 1;
        link.order = counts[sequenceType];
    });
}

function normalizeLinks(node, removeMissing = true) {
    const links = ensureLinks(node);
    const normalized = [];
    const seen = new Set();
    for (const link of links) {
        const sourceId = Number(link?.source_id);
        const sourceSlot = Number(link?.source_slot) || 0;
        const mediaType = String(link?.media_type || "image").toLowerCase();
        if (!Number.isFinite(sourceId) || !["image", "video", "audio"].includes(mediaType)) continue;
        if (Number.isFinite(Number(node?.id)) && sourceId === Number(node.id)) continue;
        const key = `${sourceId}:${sourceSlot}:${mediaType}`;
        if (seen.has(key)) continue;
        const canResolveSource = typeof app.graph?.getNodeById === "function";
        const source = canResolveSource ? app.graph.getNodeById(sourceId) : null;
        if (removeMissing && canResolveSource && !source) continue;
        seen.add(key);
        normalized.push({ ...link, source_id: sourceId, source_slot: sourceSlot, media_type: mediaType });
    }
    const changed = normalized.length !== links.length || normalized.some((link, index) => {
        const previous = links[index];
        return !previous
            || Number(previous.source_id) !== link.source_id
            || Number(previous.source_slot) !== link.source_slot
            || String(previous.media_type || "image").toLowerCase() !== link.media_type;
    });
    if (changed) node.properties[LINKS_PROP] = normalized;
    else if (links.some((link) => !Number.isFinite(Number(link?.order)))) node.properties[LINKS_PROP] = normalized;
    resequence(node);
    return ensureLinks(node);
}

function getSlotType(slot) {
    return String(slot?.type || slot?.datatype || slot?.label || "").toUpperCase();
}

function getMediaType(sourceType, sourceNode = null) {
    const type = String(sourceType || "").toUpperCase();
    if (type.includes("AUDIO")) return "audio";
    if (type.includes("VIDEO")) return "video";
    if (type.includes("IMAGE")) return "image";
    const name = String(sourceNode?.comfyClass || sourceNode?.type || "").toLowerCase();
    if (name.includes("audio")) return "audio";
    if (name.includes("video")) return "video";
    return "image";
}

function mediaLimits(node) {
    return {
        [MODE_T2VA]: { image: 0, video: 0, audio: 0, total: 0 },
        [MODE_I2VA]: { image: 1, video: 0, audio: 0, total: 1 },
        [MODE_FL2VA]: { image: 2, video: 0, audio: 0, total: 2 },
        [MODE_L2VA]: { image: 1, video: 0, audio: 0, total: 1 },
        [MODE_REFERENCE]: { image: 9, video: 3, audio: 3, total: MAX_MEDIA },
    }[currentMode(node)] || { image: 0, video: 0, audio: 0, total: 0 };
}

function canAccept(node, mediaType) {
    const limits = mediaLimits(node);
    if (!limits[mediaType]) return false;
    const links = ensureLinks(node);
    if (links.length >= limits.total) return false;
    const count = links.filter((link) => String(link.media_type || "image") === mediaType).length;
    return count < limits[mediaType];
}

function pruneLinksForMode(node) {
    const limits = mediaLimits(node);
    const counts = { image: 0, video: 0, audio: 0 };
    const kept = [];
    for (const link of ensureLinks(node)) {
        const type = String(link.media_type || "image");
        if (!limits[type] || counts[type] >= limits[type] || kept.length >= limits.total) continue;
        counts[type] += 1;
        kept.push(link);
    }
    node.properties[LINKS_PROP] = kept;
    resequence(node);
}

function getMediaInputIndex(node) {
    return node?.inputs?.findIndex((input) => String(input?.name || "") === "media") ?? -1;
}

function getConnectionPosition(node, isInput, slotIndex) {
    const normalize = (point) => Array.isArray(point) && Number.isFinite(point[0]) && Number.isFinite(point[1])
        ? [point[0], point[1]]
        : null;
    const modern = isInput
        ? normalize(node?.getInputPos?.(slotIndex))
        : normalize(node?.getOutputPos?.(slotIndex));
    if (modern) return modern;
    const out = [0, 0];
    try {
        if (typeof node?.getConnectionPos === "function") {
            const legacy = normalize(node.getConnectionPos(isInput, slotIndex, out)) || normalize(out);
            if (legacy) return legacy;
        }
    } catch {
        // Fall through to stable LiteGraph geometry.
    }
    const slot = 40 + Math.max(0, slotIndex) * 20;
    return isInput
        ? [Number(node?.pos?.[0] || 0), Number(node?.pos?.[1] || 0) + slot]
        : [Number(node?.pos?.[0] || 0) + Number(node?.size?.[0] || 160), Number(node?.pos?.[1] || 0) + slot];
}

function getMediaDot(node) {
    const index = getMediaInputIndex(node);
    if (index < 0) return null;
    const point = getConnectionPosition(node, true, index);
    return { x: point[0], y: point[1] };
}

function graphPosition(canvas, event) {
    try {
        canvas.adjustMouseEvent?.(event);
    } catch {
        // Older LiteGraph builds do not expose adjustMouseEvent.
    }
    if (Array.isArray(canvas?.graph_mouse)) return [canvas.graph_mouse[0], canvas.graph_mouse[1]];
    if (Number.isFinite(event?.canvasX) && Number.isFinite(event?.canvasY)) return [event.canvasX, event.canvasY];
    const rect = canvas?.canvas?.getBoundingClientRect?.();
    const scale = canvas?.ds?.scale || 1;
    const offset = canvas?.ds?.offset || [0, 0];
    if (rect && Number.isFinite(event?.clientX) && Number.isFinite(event?.clientY)) {
        return [(event.clientX - rect.left) / scale - offset[0], (event.clientY - rect.top) / scale - offset[1]];
    }
    return [0, 0];
}

function pointerGraphPosition(canvas, event) {
    if (Number.isFinite(event?.canvasX) && Number.isFinite(event?.canvasY)) return [event.canvasX, event.canvasY];
    const rect = canvas?.canvas?.getBoundingClientRect?.();
    if (rect && Number.isFinite(event?.clientX) && Number.isFinite(event?.clientY)) {
        const scale = canvas?.ds?.scale || 1;
        const offset = canvas?.ds?.offset || [0, 0];
        return [(event.clientX - rect.left) / scale - offset[0], (event.clientY - rect.top) / scale - offset[1]];
    }
    return graphPosition(canvas, event);
}

function clientPosition(canvas, point) {
    const rect = canvas?.canvas?.getBoundingClientRect?.();
    if (!rect) return null;
    const scale = canvas?.ds?.scale || 1;
    const offset = canvas?.ds?.offset || [0, 0];
    return { x: rect.left + (point[0] + offset[0]) * scale, y: rect.top + (point[1] + offset[1]) * scale };
}

function connectingOutput(canvas) {
    const node = canvas?.connecting_node || canvas?.connectingNode;
    if (!node) return null;
    const raw = canvas.connecting_output ?? canvas.connecting_slot ?? canvas.connecting_output_slot;
    if (raw == null && canvas.connecting_input) return null;
    const index = typeof raw === "number" ? raw : Number(raw?.slot_index ?? raw?.slot ?? 0);
    const output = node.outputs?.[Number.isFinite(index) ? index : 0] || raw || {};
    return {
        sourceNode: node,
        sourceSlot: Number.isFinite(index) ? index : 0,
        sourceType: getSlotType(output),
    };
}

function connectingInput(canvas) {
    const node = canvas?.connecting_node || canvas?.connectingNode;
    const input = canvas?.connecting_input || canvas?.connectingInput;
    if (!node || !input || !isTarget(node)) return null;
    const index = typeof input === "number" ? input : node.inputs?.indexOf(input);
    const slot = node.inputs?.[Number.isFinite(index) ? index : -1];
    if (String(slot?.name || input?.name || "") !== "media") return null;
    return { targetNode: node };
}

function clearConnecting(canvas) {
    canvas.connecting_node = null;
    canvas.connecting_output = null;
    canvas.connecting_slot = null;
    canvas.connecting_pos = null;
    canvas.connecting_input = null;
}

function addVirtualLink(targetNode, sourceNode, sourceSlot, sourceType, mediaType = null) {
    if (!targetNode || !sourceNode || isSameNode(targetNode, sourceNode)) return false;
    const sourceId = Number(sourceNode.id);
    if (!Number.isFinite(sourceId)) return false;
    mediaType ||= getMediaType(sourceType, sourceNode);
    if (!canAccept(targetNode, mediaType)) return false;
    const links = ensureLinks(targetNode);
    const exists = links.some((link) => Number(link.source_id) === sourceId && Number(link.source_slot) === Number(sourceSlot));
    if (exists) return false;
    links.push({
        source_id: sourceId,
        source_slot: Number(sourceSlot) || 0,
        source_type: sourceType || "*",
        media_type: mediaType,
        order: links.length + 1,
    });
    resequence(targetNode);
    targetNode.setDirtyCanvas?.(true, true);
    app.graph?.setDirtyCanvas?.(true, true);
    app.graph?.change?.();
    requestMentionPreviewRefresh();
    return true;
}

function removeVirtualLink(node, index) {
    const links = ensureLinks(node);
    if (index < 0 || index >= links.length) return false;
    links.splice(index, 1);
    resequence(node);
    node.setDirtyCanvas?.(true, true);
    app.graph?.setDirtyCanvas?.(true, true);
    app.graph?.change?.();
    requestMentionPreviewRefresh();
    return true;
}

function getNativeGraphLink(graph, linkId) {
    if (!graph || linkId == null) return null;
    for (const links of [graph.links, graph._links]) {
        if (!links) continue;
        if (typeof links.get === "function") {
            const link = links.get(linkId) ?? links.get(String(linkId));
            if (link) return link;
        }
        const link = links[linkId] ?? links[String(linkId)];
        if (link) return link;
    }
    return null;
}

function convertNativeMediaConnection(targetNode, inputIndex, linkInfo = null) {
    if (!isTarget(targetNode) || targetNode.__h3VirtualWireClearing) return false;
    const input = targetNode.inputs?.[inputIndex];
    if (!input || String(input.name || "") !== "media") return false;

    const graph = targetNode.graph || app.graph;
    const linkId = input.link ?? linkInfo?.id ?? linkInfo?.link_id ?? linkInfo?.linkId;
    const nativeLink = getNativeGraphLink(graph, linkId) || linkInfo;
    if (!nativeLink) return false;

    const directSourceCandidate = nativeLink.origin_node || nativeLink.originNode
        || nativeLink.fromNode || nativeLink.sourceNode;
    const directSource = directSourceCandidate && typeof directSourceCandidate === "object"
        ? directSourceCandidate
        : null;
    const sourceId = nativeLink.origin_id ?? nativeLink.originId
        ?? nativeLink.from_id ?? nativeLink.fromId
        ?? (directSourceCandidate && typeof directSourceCandidate !== "object" ? directSourceCandidate : directSource?.id);
    const sourceNode = directSource || graph?.getNodeById?.(Number(sourceId));
    if (!sourceNode || isSameNode(targetNode, sourceNode)) return false;

    const rawSourceSlot = nativeLink.origin_slot ?? nativeLink.originSlot
        ?? nativeLink.from_slot ?? nativeLink.fromSlot ?? nativeLink.from?.slot ?? 0;
    const parsedSourceSlot = Number(rawSourceSlot);
    const sourceSlot = Number.isFinite(parsedSourceSlot) ? parsedSourceSlot : 0;
    const output = sourceNode.outputs?.[sourceSlot] || {};
    const sourceType = getSlotType(output)
        || String(nativeLink.type || nativeLink.origin_type || nativeLink.originType || "*").toUpperCase();

    const added = addVirtualLink(targetNode, sourceNode, sourceSlot, sourceType);
    targetNode.__h3VirtualWireClearing = true;
    try {
        if (targetNode.inputs?.[inputIndex]?.link != null && typeof targetNode.disconnectInput === "function") {
            targetNode.disconnectInput(inputIndex);
        } else if (linkId != null && typeof graph?.removeLink === "function") {
            graph.removeLink(linkId);
        }
        if (targetNode.inputs?.[inputIndex]) targetNode.inputs[inputIndex].link = null;
    } finally {
        targetNode.__h3VirtualWireClearing = false;
    }

    targetNode.setDirtyCanvas?.(true, true);
    graph?.setDirtyCanvas?.(true, true);
    requestMentionPreviewRefresh();
    return added;
}

function scheduleNativeMediaConnectionConversion(targetNode, inputIndex, linkInfo = null) {
    setTimeout(() => convertNativeMediaConnection(targetNode, inputIndex, linkInfo), 0);
    if (!linkInfo) setTimeout(() => convertNativeMediaConnection(targetNode, inputIndex), 50);
}

function cubicPoint(start, end, t) {
    const cp1 = [start[0] + 80, start[1]];
    const cp2 = [end[0] - 80, end[1]];
    const mt = 1 - t;
    return [
        mt * mt * mt * start[0] + 3 * mt * mt * t * cp1[0] + 3 * mt * t * t * cp2[0] + t * t * t * end[0],
        mt * mt * mt * start[1] + 3 * mt * mt * t * cp1[1] + 3 * mt * t * t * cp2[1] + t * t * t * end[1],
    ];
}

function linkGeometry(targetNode, link) {
    const sourceNode = targetNode.graph?.getNodeById?.(Number(link.source_id));
    const dot = getMediaDot(targetNode);
    if (!sourceNode || !dot) return null;
    const source = getConnectionPosition(sourceNode, false, Number(link.source_slot) || 0);
    const target = [dot.x, dot.y];
    return { sourceNode, source, target, mid: cubicPoint(source, target, 0.5) };
}

function getComfyLinkTypeColor(type) {
    const colors = globalThis.LGraphCanvas?.link_type_colors || {};
    const raw = String(type || "");
    const candidates = [raw, raw.toUpperCase(), raw.toLowerCase()].filter(Boolean);
    for (const candidate of candidates) {
        if (colors[candidate]) return colors[candidate];
    }
    return "";
}

function getComfyDefaultLinkColor(canvas) {
    return canvas?.default_link_color || globalThis.LiteGraph?.LINK_COLOR || COMFY_NATIVE_LINK_COLOR;
}

function linkColor(canvas, targetNode, sourceNode, link) {
    if (linkHighlighted(canvas, targetNode, sourceNode)) return "#FFF";
    const typedColor = getComfyLinkTypeColor(link?.source_type);
    if (typedColor) return typedColor;
    return String(link?.media_type || "image") === "image" ? COLOR_IMAGE : getComfyDefaultLinkColor(canvas);
}

function linkHighlighted(canvas, targetNode, sourceNode) {
    return Boolean(
        targetNode?.selected || sourceNode?.selected ||
        canvas?.selectedItems?.has?.(targetNode) || canvas?.selectedItems?.has?.(sourceNode) ||
        canvas?.selected_nodes?.[targetNode?.id] || canvas?.selected_nodes?.[sourceNode?.id]
    );
}

function hitTestLinks(graph, x, y) {
    let best = null;
    for (const targetNode of graph?._nodes || []) {
        if (!isTarget(targetNode)) continue;
        const links = ensureLinks(targetNode);
        links.forEach((link, index) => {
            const geometry = linkGeometry(targetNode, link);
            if (!geometry) return;
            const distance = Math.hypot(x - geometry.mid[0], y - geometry.mid[1]);
            if (distance <= 18 && (!best || distance < best.distance)) best = { targetNode, index, point: geometry.mid, distance };
        });
    }
    return best;
}

function closeContextMenuCompat(menu) {
    menu?.close?.();
    menu?.remove?.();
    globalThis.LiteGraph?.ContextMenu?.closeAllContextMenus?.(globalThis.window);
    if (typeof document !== "undefined") {
        document.querySelectorAll(".litecontextmenu").forEach((element) => element.remove());
    }
}

function closeLinkMenu() {
    linkMenu?.close?.();
    linkMenu?.remove?.();
    linkMenu = null;
}

function openLinkMenu(canvas, hit, event) {
    closeLinkMenu();
    const anchor = clientPosition(canvas, hit.point) || { x: event?.clientX || 0, y: event?.clientY || 0 };
    const menuEvent = typeof PointerEvent === "function"
        ? new PointerEvent("pointerdown", { clientX: anchor.x + 8, clientY: anchor.y + 8, bubbles: true, cancelable: true })
        : new MouseEvent("mousedown", { clientX: anchor.x + 8, clientY: anchor.y + 8, bubbles: true, cancelable: true });
    let menuInstance = null;
    const remove = () => {
        removeVirtualLink(hit.targetNode, hit.index);
        closeContextMenuCompat(menuInstance);
        if (linkMenu === menuInstance) linkMenu = null;
    };
    if (globalThis.LiteGraph?.ContextMenu) {
        menuInstance = new globalThis.LiteGraph.ContextMenu([
            { content: TEXT.deleteLink, callback: remove },
        ], { event: menuEvent });
        linkMenu = menuInstance;
    }
}

function openCreateMenu(canvas, targetNode, event, allowedTypes) {
    if (!targetNode) return;
    closeContextMenuCompat(createMenu);
    createMenu = null;
    nativeDropGuardActive = false;
    releaseCreateMenuLinkHold?.();
    releaseCreateMenuLinkHold = null;
    const [x, y] = Number.isFinite(event?.canvasX) && Number.isFinite(event?.canvasY)
        ? [event.canvasX, event.canvasY]
        : graphPosition(canvas, event);
    const anchor = clientPosition(canvas, [x, y]) || { x: event?.clientX || 0, y: event?.clientY || 0 };
    const menuEvent = typeof PointerEvent === "function"
        ? new PointerEvent("pointerdown", { clientX: anchor.x, clientY: anchor.y, bubbles: true, cancelable: true })
        : new MouseEvent("mousedown", { clientX: anchor.x, clientY: anchor.y, bubbles: true, cancelable: true });
    let menuInstance = null;
    const finish = () => {
        closeContextMenuCompat(menuInstance);
        if (createMenu === menuInstance) createMenu = null;
        releaseCreateMenuLinkHold?.();
        releaseCreateMenuLinkHold = null;
        nativeDropGuardActive = false;
        setNativeSearchVisualSuppression(false);
        clearTemporaryRenderLink(canvas);
    };
    const items = allowedTypes.filter((type) => canAccept(targetNode, type)).map((type) => ({
        content: LOADERS[type].label,
        callback: () => {
            createResourceNode(canvas, targetNode, type, [x, y]);
            finish();
        },
    }));
    if (!globalThis.LiteGraph?.ContextMenu || !items.length) {
        nativeDropGuardActive = false;
        setNativeSearchVisualSuppression(false);
        clearTemporaryRenderLink(canvas);
        return;
    }
    releaseCreateMenuLinkHold = holdDroppedLinkForMenu(canvas, { canvasX: x, canvasY: y });
    setNativeSearchVisualSuppression(true);
    menuInstance = new globalThis.LiteGraph.ContextMenu(items, { event: menuEvent });
    createMenu = menuInstance;
    menuInstance.controller?.signal?.addEventListener?.("abort", () => {
        if (createMenu === menuInstance) createMenu = null;
        releaseCreateMenuLinkHold?.();
        releaseCreateMenuLinkHold = null;
        nativeDropGuardActive = false;
        setNativeSearchVisualSuppression(false);
        clearTemporaryRenderLink(canvas);
    }, { once: true });
}

function alignNodeOutputToDrop(node, slot, position) {
    if (!node || slot < 0 || !Number.isFinite(position?.[0]) || !Number.isFinite(position?.[1])) return false;
    const current = node.pos || [0, 0];
    const connection = getConnectionPosition(node, false, slot);
    if (!Number.isFinite(connection?.[0]) || !Number.isFinite(connection?.[1])) return false;
    node.pos = [current[0] + position[0] - connection[0], current[1] + position[1] - connection[1]];
    node.setDirtyCanvas?.(true, true);
    return true;
}

function createResourceNode(canvas, targetNode, mediaType, position) {
    const spec = LOADERS[mediaType];
    const graph = canvas?.graph || app.graph;
    const LiteGraph = globalThis.LiteGraph;
    if (!spec || !graph || !LiteGraph?.createNode) return false;
    const node = LiteGraph.createNode(spec.classType);
    if (!node) return false;
    node.pos = [position[0], position[1]];
    graph.add(node);
    const slot = node.outputs?.findIndex((output) => getMediaType(getSlotType(output), node) === mediaType) ?? 0;
    alignNodeOutputToDrop(node, slot, position);
    if (isVueNodesMode() && typeof requestAnimationFrame === "function") {
        const placedPosition = [Number(node.pos?.[0]) || 0, Number(node.pos?.[1]) || 0];
        requestAnimationFrame(() => {
            const stillAtPlacedPosition = Math.abs((Number(node.pos?.[0]) || 0) - placedPosition[0]) < 0.5
                && Math.abs((Number(node.pos?.[1]) || 0) - placedPosition[1]) < 0.5;
            if (stillAtPlacedPosition) alignNodeOutputToDrop(node, slot, position);
        });
    }
    const output = node.outputs?.[slot] || {};
    addVirtualLink(targetNode, node, slot, getSlotType(output) || mediaType.toUpperCase(), mediaType);
    graph.setDirtyCanvas?.(true, true);
    return true;
}

function getSlotIndex(slots, rawSlot) {
    if (typeof rawSlot === "number") return slots?.[rawSlot] ? rawSlot : -1;
    for (const key of ["slot_index", "slot", "index"]) {
        const value = rawSlot?.[key];
        if (typeof value === "number" && slots?.[value]) return value;
    }
    if (Array.isArray(slots) && rawSlot) {
        const direct = slots.indexOf(rawSlot);
        if (direct >= 0) return direct;
        const name = typeof rawSlot === "string" ? rawSlot : rawSlot?.name;
        if (name) return slots.findIndex((slot) => slot?.name === name);
    }
    return -1;
}

function getPendingConnectorLink(canvas) {
    const link = canvas?.linkConnector?.renderLinks?.at?.(0);
    if (!link) return null;
    const endpointNode = link.node || link.fromNode || link.originNode || link.sourceNode || link.toNode || link.targetNode
        || link.inputNode || link.outputNode;
    const endpointSlot = link.fromSlot ?? link.slot ?? link.output ?? link.input ?? link.toSlot ?? {};
    const toType = String(link.toType || link.targetType || link.targetSlotType || "").toLowerCase();
    let direction = toType.includes("output") ? "from_input" : "from_output";
    const inputIndex = getSlotIndex(endpointNode?.inputs, endpointSlot);
    const outputIndex = getSlotIndex(endpointNode?.outputs, endpointSlot);
    if (inputIndex >= 0 && outputIndex < 0) direction = "from_input";
    if (outputIndex >= 0 && inputIndex < 0) direction = "from_output";
    if (direction === "from_input") {
        const input = endpointNode?.inputs?.[inputIndex] || endpointSlot;
        if (!isTarget(endpointNode) || String(input?.name || "") !== "media") return null;
        return { direction, targetNode: endpointNode, targetSlot: inputIndex };
    }
    const output = endpointNode?.outputs?.[outputIndex] || endpointSlot || {};
    return {
        direction,
        sourceNode: endpointNode,
        sourceSlot: Math.max(0, outputIndex),
        sourceType: getSlotType(output),
    };
}

function nodeAtGraphPoint(canvas, x, y, ignoredNode = null) {
    const nodes = canvas?.graph?._nodes || app.graph?._nodes || [];
    for (let index = nodes.length - 1; index >= 0; index -= 1) {
        const node = nodes[index];
        if (!node || node === ignoredNode) continue;
        const pos = node.pos || [0, 0];
        const size = node.size || node.computeSize?.() || [0, 0];
        if (x >= pos[0] && y >= pos[1] && x <= pos[0] + Number(size[0] || 0) && y <= pos[1] + Number(size[1] || 0)) return node;
    }
    return null;
}

function findNativeSearchContainer() {
    const active = document.activeElement;
    const activeRoot = active?.closest?.("[role='search'], .node-search-box-dialog-mask, .invisible-dialog-root, .p-dialog, [data-pc-name='dialog']");
    return document.querySelector(".node-search-box-dialog-mask .comfy-vue-node-search-container")
        || document.querySelector(".invisible-dialog-root .comfy-vue-node-search-container")
        || document.querySelector(".comfy-vue-node-search-container")
        || activeRoot
        || document.querySelector("[role='search']");
}

function findNativeSearchInput(container) {
    const active = document.activeElement;
    if (active?.tagName === "INPUT" && (!container || container.contains(active))) return active;
    return container?.querySelector?.('input[id^="comfy-vue-node-search-box-input-"]')
        || container?.querySelector?.(".comfy-vue-node-search-box input")
        || container?.querySelector?.("input")
        || document.querySelector('input[id^="comfy-vue-node-search-box-input-"]');
}

function setNativeSearchVisualSuppression(enabled) {
    const className = "minimax-h3-easy-hide-native-search";
    if (enabled) {
        if (!nativeSearchSuppressStyle) {
            nativeSearchSuppressStyle = document.createElement("style");
            nativeSearchSuppressStyle.textContent = `
body.${className} .node-search-box-dialog-mask,
body.${className} .p-dialog-mask:has(.comfy-vue-node-search-container),
body.${className} .invisible-dialog-root:has(.comfy-vue-node-search-container),
body.${className} .comfy-vue-node-search-container {
    opacity: 0 !important;
    pointer-events: none !important;
}`;
            document.head?.appendChild(nativeSearchSuppressStyle);
        }
        document.body?.classList?.add(className);
    } else {
        document.body?.classList?.remove(className);
    }
}

function closeNativeNodeSearchSoon() {
    const close = () => {
        const container = findNativeSearchContainer();
        const input = findNativeSearchInput(container);
        if (!container && !input) return;
        const init = { key: "Escape", code: "Escape", keyCode: 27, which: 27, bubbles: true, cancelable: true };
        input?.dispatchEvent?.(new KeyboardEvent("keydown", init));
        container?.dispatchEvent?.(new KeyboardEvent("keydown", init));
        document.dispatchEvent(new KeyboardEvent("keydown", init));
    };
    for (const delay of [0, 16, 50, 120]) setTimeout(close, delay);
}

function holdDroppedLinkForMenu(canvas, detail) {
    const events = canvas?.linkConnector?.events;
    if (!events) return null;
    const preventReset = (event) => event.preventDefault?.();
    canvas.linkConnector.state ||= {};
    if (Number.isFinite(detail?.canvasX) && Number.isFinite(detail?.canvasY)) {
        canvas.linkConnector.state.snapLinksPos = [detail.canvasX, detail.canvasY];
    }
    events.addEventListener("reset", preventReset, { once: true });
    return () => events.removeEventListener("reset", preventReset);
}

function clearTemporaryRenderLink(canvas) {
    const connector = canvas?.linkConnector;
    connector?.reset?.();
    if (Array.isArray(connector?.renderLinks)) connector.renderLinks.length = 0;
    canvas?.setDirty?.(true, true);
    (canvas?.graph || app.graph)?.setDirtyCanvas?.(true, true);
}

function shouldSuppressNativeDrop(type) {
    return type === "dropped-on-canvas"
        && (nativeDropGuardActive || Boolean(createMenu))
        && performance.now() < suppressNativeDropUntil;
}

function suppressNativeDrop(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    event?.stopImmediatePropagation?.();
    if (!createMenu) nativeDropGuardActive = false;
    closeNativeNodeSearchSoon();
}

function scheduleInputCreateMenu(canvas, event, pending, allowed) {
    const [canvasX, canvasY] = pointerGraphPosition(canvas, event);
    const detail = {
        clientX: event?.clientX,
        clientY: event?.clientY,
        canvasX,
        canvasY,
        originalEvent: event,
    };
    nativeDropGuardActive = true;
    suppressNativeDropUntil = performance.now() + 1000;
    setNativeSearchVisualSuppression(true);
    closeNativeNodeSearchSoon();
    openCreateMenu(canvas, pending.targetNode, detail, allowed);
    suppressNativeDropUntil = performance.now() + 800;
    closeNativeNodeSearchSoon();
    return true;
}

function installQuickCreateCapture(canvas) {
    if (!canvas?.canvas || !canvas?.linkConnector?.events) return false;
    if (canvas === quickCreateCaptureCanvas && canvas.__h3EasyQuickCreateCaptureInstalled) return true;

    // Nodes 2.0 can replace app.canvas while the page is starting. A module-global
    // "installed" flag leaves the handlers attached to the discarded canvas and
    // makes the live canvas rely on the less reliable mouse-up fallback. Remove the
    // old global listeners and install against the current canvas instance instead.
    quickCreateCaptureCleanup?.();
    quickCreateCaptureCleanup = null;
    quickCreateCaptureCanvas = canvas;
    canvas.__h3EasyQuickCreateCaptureInstalled = true;
    const handler = (event) => {
        // A ContextMenu item click also bubbles through the global pointer-up
        // listeners while the temporary connector is still being held. Without
        // this guard, the first menu click is mistaken for another canvas drop:
        // the temporary line is reset and the menu is reopened before its item
        // callback can create the resource node.
        if (createMenu || event?.target?.closest?.(".litecontextmenu")) return;
        if (event?.button > 0 || performance.now() - lastCapturedDropAt < 80) return;
        const pending = getPendingConnectorLink(canvas);
        if (!pending) return;
        const [x, y] = pointerGraphPosition(canvas, event);
        if (pending.direction === "from_output") {
            const target = (canvas.graph?._nodes || []).find((node) => {
                if (!isTarget(node)) return false;
                const dot = getMediaDot(node);
                return dot && Math.hypot(x - dot.x, y - dot.y) <= 18;
            });
            if (!target) return;
            if (isSameNode(target, pending.sourceNode)) return;
            const added = addVirtualLink(target, pending.sourceNode, pending.sourceSlot, pending.sourceType);
            if (!added) return;
            lastCapturedDropAt = performance.now();
            event.preventDefault?.();
            event.stopPropagation?.();
            event.stopImmediatePropagation?.();
            canvas.linkConnector.reset?.();
            closeNativeNodeSearchSoon();
            return;
        }
        if (nodeAtGraphPoint(canvas, x, y, pending.targetNode)) return;
        lastCapturedDropAt = performance.now();
        event.preventDefault?.();
        event.stopPropagation?.();
        event.stopImmediatePropagation?.();
        const allowed = isReferenceMode(pending.targetNode) ? ["image", "video", "audio"] : ["image"];
        scheduleInputCreateMenu(canvas, event, pending, allowed);
    };
    const pointerTargets = [window, document, canvas.canvas];
    for (const target of pointerTargets) {
        target.addEventListener?.("pointerup", handler, true);
        target.addEventListener?.("mouseup", handler, true);
    }

    const events = canvas.linkConnector.events;
    const originalDispatch = typeof events.dispatch === "function" ? events.dispatch : null;
    const originalDispatchEvent = events.dispatchEvent;
    let wrappedDispatch = null;
    let wrappedDispatchEvent = null;
    if (originalDispatch) {
        wrappedDispatch = function dispatchWithMediaDropGuard(type, detail) {
            if (type === "before-drop-links") {
                const pending = getPendingConnectorLink(canvas);
                if (pending?.direction === "from_input") {
                    nativeDropGuardActive = true;
                    suppressNativeDropUntil = performance.now() + 1000;
                    setNativeSearchVisualSuppression(true);
                    closeNativeNodeSearchSoon();
                }
            }
            if (shouldSuppressNativeDrop(type)) {
                closeNativeNodeSearchSoon();
                return false;
            }
            return originalDispatch.call(events, type, detail);
        };
        events.dispatch = wrappedDispatch;
    }
    wrappedDispatchEvent = function dispatchEventWithMediaDropGuard(event) {
        if (event?.type === "before-drop-links") {
            const pending = getPendingConnectorLink(canvas);
            if (pending?.direction === "from_input") {
                nativeDropGuardActive = true;
                suppressNativeDropUntil = performance.now() + 1000;
                setNativeSearchVisualSuppression(true);
                closeNativeNodeSearchSoon();
            }
        }
        if (shouldSuppressNativeDrop(event?.type)) {
            suppressNativeDrop(event);
            return false;
        }
        return originalDispatchEvent.call(events, event);
    };
    events.dispatchEvent = wrappedDispatchEvent;
    const droppedOnCanvasHandler = (event) => {
        if (shouldSuppressNativeDrop(event?.type)) suppressNativeDrop(event);
    };
    events.addEventListener("dropped-on-canvas", droppedOnCanvasHandler, { capture: true });

    quickCreateCaptureCleanup = () => {
        for (const target of pointerTargets) {
            target.removeEventListener?.("pointerup", handler, true);
            target.removeEventListener?.("mouseup", handler, true);
        }
        events.removeEventListener?.("dropped-on-canvas", droppedOnCanvasHandler, { capture: true });
        if (wrappedDispatch && events.dispatch === wrappedDispatch) events.dispatch = originalDispatch;
        if (events.dispatchEvent === wrappedDispatchEvent) events.dispatchEvent = originalDispatchEvent;
        canvas.__h3EasyQuickCreateCaptureInstalled = false;
        if (quickCreateCaptureCanvas === canvas) quickCreateCaptureCanvas = null;
    };
    return true;
}

function drawLinks(canvas, ctx) {
    const graph = canvas?.graph || app.graph;
    if (!graph?._nodes || canvas.links_render_mode === globalThis.LiteGraph?.HIDDEN_LINK) return;
    for (const targetNode of graph._nodes) {
        if (!isTarget(targetNode)) continue;
        const links = ensureLinks(targetNode);
        for (const link of links) {
            const geometry = linkGeometry(targetNode, link);
            if (!geometry) continue;
            const highlighted = linkHighlighted(canvas, targetNode, geometry.sourceNode);
            const color = linkColor(canvas, targetNode, geometry.sourceNode, link);
            const width = canvas.connections_width || 3;
            ctx.save();
            ctx.lineJoin = "round";
            ctx.shadowBlur = 0;
            ctx.shadowColor = "transparent";
            ctx.beginPath();
            ctx.moveTo(geometry.source[0], geometry.source[1]);
            ctx.bezierCurveTo(geometry.source[0] + 80, geometry.source[1], geometry.target[0] - 80, geometry.target[1], geometry.target[0], geometry.target[1]);
            ctx.lineWidth = width + 4;
            ctx.strokeStyle = canvas.render_connections_border !== false && !canvas.low_quality ? COLOR_LINK_BORDER : "transparent";
            if (ctx.strokeStyle !== "transparent") ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(geometry.source[0], geometry.source[1]);
            ctx.bezierCurveTo(geometry.source[0] + 80, geometry.source[1], geometry.target[0] - 80, geometry.target[1], geometry.target[0], geometry.target[1]);
            ctx.lineWidth = width;
            ctx.strokeStyle = color;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(geometry.mid[0], geometry.mid[1], 5, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.fillStyle = highlighted ? "#222" : "#fff";
            ctx.font = "bold 7px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(String(link.order || 1), geometry.mid[0], geometry.mid[1] + 0.3);
            ctx.restore();
        }
    }
}

function patchCanvas() {
    const canvas = app.canvas;
    if (!canvas || canvas.__h3EasyCanvasPatched || typeof canvas.drawConnections !== "function") return;
    canvas.__h3EasyCanvasPatched = true;
    patchedCanvas = true;
    const originalDraw = canvas.drawConnections;
    canvas.drawConnections = function drawConnectionsWithH3Links(ctx) {
        const result = originalDraw?.apply(this, arguments);
        const connectionContext = ctx || this.bgctx || this.ctx;
        const onConnectionLayer = connectionContext?.canvas === this?.bgcanvas || connectionContext === this?.bgctx || !this?.bgcanvas;
        if (connectionContext && onConnectionLayer) drawLinks(this, connectionContext);
        return result;
    };

    const originalDown = canvas.processMouseDown;
    canvas.processMouseDown = function processMouseDownWithH3Links(event) {
        if (!getInputConnection(this)) {
            const [x, y] = graphPosition(this, event);
            const hit = hitTestLinks(this.graph || app.graph, x, y);
            if (hit) {
                openLinkMenu(this, hit, event);
                event?.preventDefault?.();
                event?.stopImmediatePropagation?.();
                return true;
            }
        }
        const result = originalDown?.apply(this, arguments);
        return result;
    };

    const originalUp = canvas.processMouseUp;
    canvas.processMouseUp = function processMouseUpWithH3Links(event) {
        const output = connectingOutput(this);
        const input = connectingInput(this);
        const [x, y] = pointerGraphPosition(this, event);
        const target = (this.graph || app.graph)?._nodes?.find((node) => isTarget(node) && (() => {
            const dot = getMediaDot(node);
            return dot && Math.hypot(x - dot.x, y - dot.y) <= 18;
        })());

        if (output && target && !isSameNode(target, output.sourceNode)) {
            const added = addVirtualLink(target, output.sourceNode, output.sourceSlot, output.sourceType);
            if (!added) return originalUp?.apply(this, arguments);
            clearConnecting(this);
            this.graph?.setDirtyCanvas?.(true, true);
            event?.preventDefault?.();
            event?.stopImmediatePropagation?.();
            return true;
        }

        if (input && !target) {
            openCreateMenu(this, input.targetNode, event, isReferenceMode(input.targetNode) ? ["image", "video", "audio"] : ["image"]);
            clearConnecting(this);
            event?.preventDefault?.();
            event?.stopImmediatePropagation?.();
            return true;
        }
        return originalUp?.apply(this, arguments);
    };

    const linkPointerHandler = (event) => {
        if (getPendingConnectorLink(canvas) || connectingOutput(canvas) || connectingInput(canvas)) return;
        const [x, y] = graphPosition(canvas, event);
        const hit = hitTestLinks(canvas.graph || app.graph, x, y);
        if (!hit) return;
        openLinkMenu(canvas, hit, event);
        event.preventDefault?.();
        event.stopPropagation?.();
        event.stopImmediatePropagation?.();
    };
    canvas.canvas?.addEventListener?.("pointerdown", linkPointerHandler, true);
    installQuickCreateCapture(canvas);
}

function getInputConnection(canvas) {
    const node = canvas?.connecting_node || canvas?.connectingNode;
    const input = canvas?.connecting_input || canvas?.connectingInput;
    if (!node || !isTarget(node) || !input) return null;
    const slot = typeof input === "number" ? node.inputs?.[input] : input;
    if (String(slot?.name || "") !== "media") return null;
    return { targetNode: node };
}

function buildRuntimePrompt(node, runtimeLinks) {
    const promptWidget = getWidget(node, "prompt");
    const fallback = String(promptWidget?.value || "");
    const doc = node?.properties?.[PROMPT_DOC_PROP];
    if (!Array.isArray(doc?.parts)) return fallback;
    return doc.parts.map((part) => {
        if (part?.type === "dialogue") return `<d>${String(part.text || "")}</d>`;
        if (part?.type !== "mention") return String(part?.text || "");
        const mediaType = String(part.mediaType || "image").toLowerCase();
        const partSourceId = part.sourceId != null && Number.isFinite(Number(part.sourceId)) ? Number(part.sourceId) : null;
        const partOrdinal = Number(part.ordinal);
        let index = -1;
        if ((referenceMentionMode(node) === "index" || partSourceId == null) && Number.isFinite(partOrdinal) && partOrdinal > 0) {
            let ordinal = 0;
            for (let runtimeIndex = 0; runtimeIndex < runtimeLinks.length; runtimeIndex += 1) {
                const link = runtimeLinks[runtimeIndex];
                if (String(link.media_type || "image").toLowerCase() !== mediaType) continue;
                ordinal += 1;
                if (ordinal === partOrdinal) {
                    index = runtimeIndex;
                    break;
                }
            }
        }
        if (index < 0 && partSourceId != null) {
            index = runtimeLinks.findIndex((link) =>
                Number(link.source_id) === partSourceId
                && Number(link.source_slot) === Number(part.sourceSlot || 0)
                && String(link.media_type || "image").toLowerCase() === mediaType
            );
        }
        if (index >= 0) return `${RUNTIME_REF_PREFIX}${index + 1}__`;
        if (!isReferenceMode(node)) return String(part.token || "");
        return `${UNRESOLVED_REF_PREFIX}${mediaType}__`;
    }).join("");
}

async function optimizePromptForRun(node, prompt) {
    if (isV106(node)) return prompt;
    const settings = await loadPromptApiSettings();
    if (!settings.optimize_on_run || !String(prompt || "").trim()) return prompt;
    const imageReferences = buildWriterImageReferences(node);
    setWriterStatus(node, imageReferences.length ? TEXT.analyzingImages : TEXT.generatingPrompt, "loading");
    const response = await fetch("/minimax_h3/prompt_writer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            prompt_mode: writerPromptMode(node),
            user_prompt: String(prompt || ""),
            duration_seconds: Number(getWidgetValue(node, "seconds", 5)),
            reference_context: buildWriterReferenceContext(node),
            image_references: imageReferences,
            output_language: node.properties?.[WRITER_OUTPUT_LANGUAGE_PROP] === "en" ? "en" : "zh",
        }),
    });
    const data = await response.json();
    if (!response.ok || data.error || !String(data.prompt || "").trim()) throw new Error(data.error || `HTTP ${response.status}`);
    setWriterStatus(node, ZH_BROWSER ? "运行前提示词优化完成" : "Prompt optimized before run", "success");
    return String(data.prompt);
}

function patchGraphToPrompt() {
    if (patchedPrompt || typeof app.graphToPrompt !== "function") return;
    patchedPrompt = true;
    const original = app.graphToPrompt;
    app.graphToPrompt = async function graphToPromptWithOrderedMedia() {
        const promptData = await original.apply(this, arguments);
        const output = promptData?.output || {};
        for (const node of app.graph?._nodes || []) {
            if (!isTarget(node)) continue;
            const promptNode = output[String(node.id)];
            if (!promptNode) continue;
            promptNode.inputs ||= {};
            delete promptNode.inputs.media;
            for (let index = 1; index <= MAX_MEDIA; index += 1) {
                delete promptNode.inputs[`media_${index}`];
                delete promptNode.inputs[`media_type_${index}`];
            }
            if (node.__h3Editor) syncPromptFromEditor(node, false);
            const runtimeLinks = normalizeLinks(node).filter((link) => Boolean(output[String(link.source_id)]));
            runtimeLinks.forEach((link, index) => {
                const source = output[String(link.source_id)];
                const slot = Number(link.source_slot) || 0;
                promptNode.inputs[`media_${index + 1}`] = [String(link.source_id), slot];
                promptNode.inputs[`media_type_${index + 1}`] = String(link.media_type || "image");
            });
            const runtimePrompt = buildRuntimePrompt(node, runtimeLinks);
            try {
                promptNode.inputs.prompt = await optimizePromptForRun(node, runtimePrompt);
            } catch (error) {
                setWriterStatus(node, `${ZH_BROWSER ? "自动优化失败" : "Automatic optimization failed"}：${error.message}`, "error");
                throw error;
            }
            promptNode.inputs.mode = currentMode(node);
            promptNode.inputs.resolution = canonicalOption("resolution", getWidgetValue(node, "resolution", "480P"));
            promptNode.inputs.aspect_ratio = canonicalOption("aspect_ratio", getWidgetValue(node, "aspect_ratio", "16:9"));
            promptNode.inputs.width = Number(getWidgetValue(node, "width", 1344));
            promptNode.inputs.height = Number(getWidgetValue(node, "height", 768));
            promptNode.inputs.seconds = Math.min(MAX_SECONDS, Math.max(MIN_SECONDS, Number(getWidgetValue(node, "seconds", 5)) || 5));
            promptNode.inputs.advanced = asBoolean(getWidgetValue(node, "advanced", false));
            promptNode.inputs.fps = Number(getWidgetValue(node, "fps", 24));
            promptNode.inputs.keyframe_role = canonicalOption("keyframe_role", getWidgetValue(node, "keyframe_role", KEYFRAME_FIRST));
            promptNode.inputs.ref_image_size = canonicalOption("ref_image_size", getWidgetValue(node, "ref_image_size", REF_IMAGE_1K));
            promptNode.inputs.reference_mention_mode = canonicalOption("reference_mention_mode", getWidgetValue(node, "reference_mention_mode", "index"));
        }
        return promptData;
    };
}

function editorText(editor) {
    let result = "";
    const visit = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            result += String(node.textContent || "").replaceAll("\u200B", "");
            return;
        }
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        if (node.classList?.contains("h3-mention-chip")) {
            result += node.dataset.token || "";
            return;
        }
        if (node.tagName === "BR") {
            result += "\n";
            return;
        }
        const block = ["DIV", "P"].includes(node.tagName);
        if (block && result && !result.endsWith("\n")) result += "\n";
        for (const child of node.childNodes || []) visit(child);
    };
    for (const child of editor.childNodes || []) visit(child);
    return result;
}

function sourceLabel(node) {
    return String(node?.title || node?.comfyClass || node?.type || "Media");
}

function widgetFilename(value) {
    const candidate = typeof value === "object" ? (value?.filename || value?.name || "") : value;
    const text = String(candidate || "").trim();
    if (!text || /^data:|^blob:|^https?:/i.test(text)) return "";
    return text.split(/[\\/]/).pop() || text;
}

function sourceFilename(node, mediaType) {
    if (!node) return "";
    const preferred = {
        image: ["image", "filename", "file"],
        video: ["video", "file", "filename", "video_file", "videofile"],
        audio: ["audio", "file", "filename", "audio_file", "audiofile"],
    }[mediaType] || ["file", "filename"];
    const preferredSet = new Set(preferred);
    const widgets = Array.isArray(node.widgets) ? node.widgets : [];
    const ordered = [
        ...widgets.filter((widget) => preferredSet.has(String(widget?.name || "").toLowerCase())),
        ...widgets,
    ];
    for (const widget of ordered) {
        const name = String(widget?.name || "").toLowerCase();
        const filename = widgetFilename(widget?.value);
        if (!filename) continue;
        if (preferredSet.has(name) || /\.(png|jpe?g|webp|gif|bmp|mp4|webm|mov|mkv|avi|m4v|mp3|wav|flac|ogg|m4a)$/i.test(filename)) return filename;
    }
    return widgetFilename(node?.properties?.filename || node?.properties?.file || "");
}

function truncateMentionLabel(value, maxLength = 22) {
    const text = String(value || "");
    if (text.length <= maxLength) return text;
    return `${text.slice(0, Math.max(4, maxLength - 1))}\u2026`;
}

function connectedMentionOptions(node) {
    const links = normalizeLinks(node);
    const mediaOrder = { image: 0, video: 1, audio: 2 };
    const orderedLinks = links
        .map((link, index) => ({ link, index }))
        .sort((left, right) => {
            const leftType = String(left.link.media_type || "image").toLowerCase();
            const rightType = String(right.link.media_type || "image").toLowerCase();
            return (mediaOrder[leftType] ?? 0) - (mediaOrder[rightType] ?? 0) || left.index - right.index;
        })
        .map((entry) => entry.link);
    const counts = { image: 0, video: 0, audio: 0 };
    const mode = referenceMentionMode(node);
    return orderedLinks.map((link) => {
        const type = String(link.media_type || "image");
        counts[type] = (counts[type] || 0) + 1;
        const ordinal = counts[type];
        const tag = type === "image" ? `<Picture ${ordinal}>` : type === "video" ? `<Video ${ordinal}>` : `<Audio ${ordinal}>`;
        const source = app.graph?.getNodeById?.(Number(link.source_id));
        watchMediaSourceNode(source);
        const filename = sourceFilename(source, type);
        const fullLabel = filename || sourceLabel(source);
        const label = mode === "index" ? `${LABELS[type] || type}${ordinal}` : truncateMentionLabel(fullLabel);
        return {
            type,
            tag,
            token: `@${mode === "index" ? label : fullLabel}`,
            label,
            fullLabel,
            ordinal,
            referenceMode: mode,
            source: sourceLabel(source),
            sourceId: Number(link.source_id),
            sourceSlot: Number(link.source_slot) || 0,
            previewUrl: sourcePreviewUrl(source, type),
        };
    });
}

function mentionOptions(node) {
    return isReferenceMode(node) ? connectedMentionOptions(node) : [];
}

function writerMentionOptions(node) {
    return connectedMentionOptions(node);
}

function findMentionOption(options, reference, mode) {
    const type = String(reference?.mediaType || reference?.type || "image").toLowerCase();
    const ordinal = Number(reference?.ordinal);
    const rawSourceId = reference?.sourceId;
    const sourceId = rawSourceId == null || rawSourceId === "" ? Number.NaN : Number(rawSourceId);
    const sourceSlot = Number(reference?.sourceSlot) || 0;
    const findByOrdinal = () => Number.isFinite(ordinal) && ordinal > 0
        ? options.find((item) => item.type === type && Number(item.ordinal) === ordinal)
        : null;
    if (mode === "index") return findByOrdinal();
    if (Number.isFinite(sourceId)) {
        return options.find((item) => Number(item.sourceId) === sourceId
            && Number(item.sourceSlot) === sourceSlot
            && item.type === type) || null;
    }
    // Official tags pasted before their media exists only carry a type and an
    // ordinal. In filename mode, use that ordinal once to claim the future
    // source; after resolution updateMentionChip stores sourceId/sourceSlot and
    // the reference becomes source-bound like any other filename-mode chip.
    return findByOrdinal();
}

function isLikelyVideoUrl(url) {
    const value = String(url || "").toLowerCase();
    return /\.(mp4|webm|mov|mkv|avi|m4v)(?:[?#].*)?$/.test(value)
        || /[?&]filename=[^&]*\.(mp4|webm|mov|mkv|avi|m4v)(?:[&#]|$)/.test(value);
}

function mediaViewUrlFromWidgets(node, preferredNames) {
    const widgets = Array.isArray(node?.widgets) ? node.widgets : [];
    const preferred = new Set(preferredNames);
    const candidates = [
        ...widgets.filter((widget) => preferred.has(String(widget?.name || "").toLowerCase())),
        ...widgets,
    ];
    for (const widget of candidates) {
        const value = widget?.value;
        if (!value) continue;
        const filename = typeof value === "object" ? value?.filename : value;
        if (!filename) continue;
        const name = String(widget?.name || "").toLowerCase();
        if (!preferred.has(name) && !/\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(String(filename))) continue;
        const params = new URLSearchParams({
            filename: String(filename),
            type: typeof value === "object" ? String(value.type || "input") : "input",
        });
        if (typeof value === "object" && value.subfolder) params.set("subfolder", String(value.subfolder));
        return `/view?${params.toString()}`;
    }
    return "";
}

function getNodeVideoSrc(node) {
    for (const widget of node?.widgets || []) {
        const element = widget?.element;
        const video = element?.matches?.("video") ? element : element?.querySelector?.("video");
        if (video?.currentSrc || video?.src) return video.currentSrc || video.src;
    }
    return mediaViewUrlFromWidgets(node, ["video", "file", "filename", "video_file", "videofile"]);
}

function refreshMentionPreviews() {
    for (const node of app.graph?._nodes || []) {
        if (!isTarget(node)) continue;
        normalizeLinks(node);
        if (node.__h3WriterIdeaMentionMenu) syncWriterIdeaMentionMenu(node);
        const writerOptions = writerMentionOptions(node);
        const writerMode = referenceMentionMode(node);
        for (const chip of node.__h3WriterIdeaInput?.querySelectorAll?.(".h3-mention-chip") || []) {
            const option = findMentionOption(writerOptions, {
                mediaType: chip.dataset.mediaType || "image",
                ordinal: Number(chip.dataset.ordinal) || null,
                sourceId: chip.dataset.sourceId ? Number(chip.dataset.sourceId) : null,
                sourceSlot: Number(chip.dataset.sourceSlot) || 0,
            }, writerMode);
            updateMentionChip(chip, option || {
                type: chip.dataset.mediaType || "image",
                token: chip.dataset.token || "",
                label: chip.dataset.label || chip.dataset.fullLabel || "",
                fullLabel: chip.dataset.fullLabel || chip.dataset.label || "",
                referenceMode: writerMode,
                ordinal: Number(chip.dataset.ordinal) || null,
                sourceId: chip.dataset.sourceId ? Number(chip.dataset.sourceId) : null,
                sourceSlot: Number(chip.dataset.sourceSlot) || 0,
                previewUrl: "",
                unresolved: true,
            });
        }
        if (!isReferenceMode(node)) {
            closeMentionMenu(node);
            continue;
        }
        const options = mentionOptions(node);
        const currentMode = referenceMentionMode(node);
        for (const chip of node.__h3Editor?.querySelectorAll?.(".h3-mention-chip") || []) {
            const sourceId = chip.dataset.sourceId ? Number(chip.dataset.sourceId) : null;
            const ordinal = Number(chip.dataset.ordinal) || null;
            const option = findMentionOption(options, {
                mediaType: chip.dataset.mediaType || "image",
                ordinal,
                sourceId,
                sourceSlot: Number(chip.dataset.sourceSlot) || 0,
            }, currentMode);
            updateMentionChip(chip, option || {
                type: chip.dataset.mediaType || "image",
                token: chip.dataset.token || "",
                label: chip.dataset.label || chip.dataset.fullLabel || "",
                fullLabel: chip.dataset.fullLabel || chip.dataset.label || "",
                referenceMode: currentMode,
                ordinal,
                sourceId,
                sourceSlot: Number(chip.dataset.sourceSlot) || 0,
                previewUrl: "",
                unresolved: true,
                pending: sourceId == null && ordinal != null,
            });
        }
        if (node.__h3Editor) syncPromptFromEditor(node, false);
        const menu = node.__h3MentionMenu;
        if (menu) {
            const query = String(menu.mention?.query || "").toLowerCase();
            menu.options = options.filter((option) => !query || `${option.label} ${option.fullLabel || ""} ${option.source}`.toLowerCase().includes(query));
            menu.activeIndex = Math.min(menu.activeIndex, Math.max(0, menu.options.length - 1));
            renderMentionMenu(node);
        }
        node.setDirtyCanvas?.(true, true);
    }
    app.graph?.setDirtyCanvas?.(true, true);
}

function updateMentionChip(chip, option) {
    if (!chip || !option) return;
    const nextToken = option.token || option.tag || chip.dataset.token || "";
    const nextLabel = option.label || chip.dataset.label || nextToken;
    const nextFullLabel = option.fullLabel || nextLabel;
    const nextPreviewUrl = option.previewUrl || "";
    chip.classList.toggle("is-pending", Boolean(option.pending));
    chip.classList.toggle("is-unresolved", Boolean(option.unresolved) && !option.pending);
    chip.dataset.token = nextToken;
    chip.dataset.label = nextLabel;
    chip.dataset.fullLabel = nextFullLabel;
    chip.dataset.mediaType = option.type || chip.dataset.mediaType || "image";
    chip.dataset.referenceMode = option.referenceMode || chip.dataset.referenceMode || "index";
    chip.dataset.ordinal = Number(option.ordinal) || chip.dataset.ordinal || "";
    chip.dataset.pendingReference = option.pending ? "true" : "";
    if (option.sourceId != null) chip.dataset.sourceId = String(option.sourceId);
    if (option.sourceSlot != null) chip.dataset.sourceSlot = String(Number(option.sourceSlot) || 0);
    chip.dataset.previewUrl = nextPreviewUrl;
    chip.title = option.pending
        ? (ZH_BROWSER ? "\u7b49\u5f85\u8fde\u63a5\u5bf9\u5e94\u5e8f\u53f7\u7684\u5a92\u4f53\u7d20\u6750" : "Waiting for media with the matching index")
        : option.unresolved
            ? (ZH_BROWSER ? "\u5df2\u65ad\u5f00\uff1a\u8bf7\u91cd\u65b0\u8fde\u63a5\u6216\u5220\u9664\u8be5\u5f15\u7528" : "Disconnected: reconnect or remove this reference")
        : nextFullLabel;
    const label = chip.querySelector?.(".h3-mention-chip-label");
    if (label) label.textContent = `@${nextLabel}`;
    const thumb = chip.querySelector?.(".h3-mention-chip-thumb");
    if (thumb && (thumb.dataset?.previewUrl !== nextPreviewUrl || thumb.dataset?.mediaType !== (option.type || "image"))) {
        const replacement = makeMentionThumb(option);
        replacement.dataset.previewUrl = nextPreviewUrl;
        thumb.replaceWith(replacement);
    } else if (!thumb) {
        const replacement = makeMentionThumb(option);
        replacement.dataset.previewUrl = nextPreviewUrl;
        chip.prepend(replacement);
    }
}

function requestMentionPreviewRefresh() {
    if (mentionPreviewRefreshTimer) return;
    mentionPreviewRefreshTimer = setTimeout(() => {
        mentionPreviewRefreshTimer = null;
        refreshMentionPreviews();
    }, 0);
}

function watchMediaSourceNode(node) {
    if (!node) return;
    node.__h3MediaSourceWatchInstalled = true;
    for (const widget of node.widgets || []) {
        if (!widget || widget.__h3MediaSourceWatchInstalled) continue;
        widget.__h3MediaSourceWatchInstalled = true;
        const originalCallback = widget.callback;
        widget.callback = function onMediaSourceWidgetChange(value) {
            const result = originalCallback?.apply(this, arguments);
            requestMentionPreviewRefresh();
            return result;
        };
        const element = widget.inputEl || widget.element;
        element?.addEventListener?.("change", requestMentionPreviewRefresh, true);
        element?.addEventListener?.("input", requestMentionPreviewRefresh, true);
    }
}

function installMediaSourceNode(nodeType, nodeData) {
    const name = String(nodeData?.name || "").toLowerCase();
    if (!name.includes("loadimage") && !name.includes("loadvideo") && !name.includes("loadaudio")) return;
    if (nodeType.prototype.__h3MediaSourceInstalled) return;
    nodeType.prototype.__h3MediaSourceInstalled = true;
    const originalCreated = nodeType.prototype.onNodeCreated;
    nodeType.prototype.onNodeCreated = function onNodeCreatedH3MediaSource() {
        const result = originalCreated?.apply(this, arguments);
        watchMediaSourceNode(this);
        return result;
    };
    const originalConfigure = nodeType.prototype.onConfigure;
    nodeType.prototype.onConfigure = function onConfigureH3MediaSource(info) {
        const result = originalConfigure?.apply(this, arguments);
        watchMediaSourceNode(this);
        requestMentionPreviewRefresh();
        return result;
    };
}

function getVideoFrameThumbnail(videoUrl) {
    if (!videoUrl) return "";
    const cached = videoThumbnailCache.get(videoUrl);
    if (cached?.dataUrl) return cached.dataUrl;
    if (cached?.loading) return "";
    if (cached?.failed) {
        if (Date.now() - Number(cached.failedAt || 0) < 1800) return "";
        videoThumbnailCache.delete(videoUrl);
    }
    if (!isLikelyVideoUrl(videoUrl) && !/^blob:|^data:video\//i.test(videoUrl)) return "";

    const entry = { loading: true, dataUrl: "" };
    videoThumbnailCache.set(videoUrl, entry);
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    let finished = false;
    let sampleTimes = [];
    let sampleIndex = 0;
    let bestFrame = null;

    const cleanup = () => {
        video.removeAttribute("src");
        video.load?.();
    };
    const succeed = (dataUrl) => {
        if (finished || !dataUrl) return;
        finished = true;
        entry.loading = false;
        entry.dataUrl = dataUrl;
        cleanup();
        requestMentionPreviewRefresh();
    };
    const fail = () => {
        if (finished) return;
        finished = true;
        entry.loading = false;
        entry.failed = true;
        entry.failedAt = Date.now();
        cleanup();
    };
    const measureFrame = (context, width, height) => {
        try {
            const data = context.getImageData(0, 0, width, height).data;
            let total = 0;
            let bright = 0;
            let count = 0;
            const stride = 4 * Math.max(1, Math.floor((width * height) / 1600));
            for (let index = 0; index < data.length; index += stride) {
                const luminance = (data[index] * 0.2126) + (data[index + 1] * 0.7152) + (data[index + 2] * 0.0722);
                total += luminance;
                if (luminance > 24) bright += 1;
                count += 1;
            }
            const average = count ? total / count : 0;
            const brightRatio = count ? bright / count : 0;
            return { score: average + brightRatio * 90, usable: average > 18 || brightRatio > 0.035 };
        } catch {
            return { score: 255, usable: true };
        }
    };
    const capture = () => {
        if (finished || !video.videoWidth || !video.videoHeight) return;
        try {
            const canvas = document.createElement("canvas");
            const scale = Math.min(1, 96 / Math.max(video.videoWidth, video.videoHeight));
            canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
            canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
            const context = canvas.getContext("2d");
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const quality = measureFrame(context, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
            if (!bestFrame || quality.score > bestFrame.score) bestFrame = { dataUrl, score: quality.score };
            if (quality.usable) succeed(dataUrl);
            else seekNextSample();
        } catch {
            fail();
        }
    };
    const captureDecodedFrame = () => {
        if (finished) return;
        if (typeof video.requestVideoFrameCallback === "function") video.requestVideoFrameCallback(capture);
        else setTimeout(capture, 80);
    };
    const seekNextSample = () => {
        if (finished) return;
        if (sampleIndex >= sampleTimes.length) {
            if (bestFrame?.dataUrl && bestFrame.score > 18) succeed(bestFrame.dataUrl);
            else fail();
            return;
        }
        const nextTime = sampleTimes[sampleIndex++];
        try {
            if (Math.abs(Number(video.currentTime || 0) - nextTime) < 0.015) captureDecodedFrame();
            else video.currentTime = nextTime;
        } catch {
            captureDecodedFrame();
        }
    };

    setTimeout(fail, 4500);
    video.addEventListener("loadedmetadata", () => {
        const duration = Number(video.duration);
        if (!Number.isFinite(duration) || duration <= 0) sampleTimes = [0];
        else {
            const end = Math.max(0, duration - 0.06);
            sampleTimes = Array.from(new Set([
                duration * 0.12,
                0.5,
                duration * 0.3,
                duration * 0.55,
                duration * 0.8,
            ].map((time) => Number(Math.min(end, Math.max(0, time)).toFixed(3)))));
        }
        seekNextSample();
    }, { once: true });
    video.addEventListener("seeked", captureDecodedFrame);
    video.addEventListener("error", fail, { once: true });
    video.src = videoUrl;
    video.load?.();
    return "";
}

function sourcePreviewUrl(node, mediaType) {
    if (!node) return "";
    if (mediaType === "audio") return "";
    if (mediaType === "image") {
        const currentImageUrl = mediaViewUrlFromWidgets(node, ["image", "file", "filename"]);
        if (currentImageUrl) return currentImageUrl;
    }
    const image = (node.imgs || []).find((item) => item?.src && !isLikelyVideoUrl(item.src));
    if (image?.src) return image.src;
    for (const widget of node.widgets || []) {
        const element = widget?.element;
        const img = element?.matches?.("img") ? element : element?.querySelector?.("img");
        if (img?.src) return img.src;
        const video = element?.matches?.("video") ? element : element?.querySelector?.("video");
        if (mediaType === "video" && video?.poster) return video.poster;
    }
    if (mediaType === "video") return getVideoFrameThumbnail(getNodeVideoSrc(node));
    const value = getWidget(node, "image")?.value;
    const filename = typeof value === "object" ? value?.filename : value;
    if (!filename) return "";
    const params = new URLSearchParams({ filename: String(filename), type: typeof value === "object" ? String(value.type || "input") : "input" });
    if (typeof value === "object" && value.subfolder) params.set("subfolder", String(value.subfolder));
    return `/view?${params.toString()}`;
}

function makeAudioIcon(className) {
    const image = document.createElement("img");
    image.className = className;
    image.alt = "";
    image.draggable = false;
    image.setAttribute("aria-hidden", "true");
    image.src = AUDIO_ICON_SVG;
    image.style.background = "transparent";
    return image;
}

function makeMentionThumb(option, menu = false) {
    const className = menu ? "h3-mention-menu-thumb" : "h3-mention-chip-thumb";
    if (option.type === "audio") {
        const audio = makeAudioIcon(className);
        audio.dataset.previewUrl = "";
        audio.dataset.mediaType = "audio";
        return audio;
    }
    if (option.previewUrl) {
        const image = document.createElement("img");
        image.className = className;
        image.alt = "";
        image.draggable = false;
        image.src = option.previewUrl;
        image.dataset.previewUrl = option.previewUrl;
        image.dataset.mediaType = option.type || "image";
        image.addEventListener("error", () => image.replaceWith(makeMentionThumb({ ...option, previewUrl: "" }, menu)), { once: true });
        return image;
    }
    const icon = document.createElement("span");
    icon.className = `${className} is-${option.type || "image"}`;
    icon.setAttribute("aria-hidden", "true");
    icon.dataset.previewUrl = "";
    icon.dataset.mediaType = option.type || "image";
    return icon;
}

function makeMentionChip(option) {
    const chip = document.createElement("span");
    chip.className = `h3-mention-chip${option.pending ? " is-pending" : option.unresolved ? " is-unresolved" : ""}`;
    chip.contentEditable = "false";
    chip.dataset.token = option.token || option.tag || "";
    chip.dataset.label = option.label || "";
    chip.dataset.fullLabel = option.fullLabel || option.label || "";
    chip.dataset.mediaType = option.type || "image";
    chip.dataset.referenceMode = option.referenceMode || "index";
    chip.dataset.ordinal = Number(option.ordinal) || "";
    chip.dataset.sourceId = option.sourceId != null ? String(option.sourceId) : "";
    chip.dataset.sourceSlot = String(option.sourceSlot || 0);
    chip.dataset.previewUrl = option.previewUrl || "";
    chip.dataset.pendingReference = option.pending ? "true" : "";
    chip.title = option.pending
        ? (ZH_BROWSER ? "\u7b49\u5f85\u8fde\u63a5\u5bf9\u5e94\u5e8f\u53f7\u7684\u5a92\u4f53\u7d20\u6750" : "Waiting for media with the matching index")
        : option.unresolved
            ? (ZH_BROWSER ? "\u5df2\u65ad\u5f00\uff1a\u8bf7\u91cd\u65b0\u8fde\u63a5\u6216\u5220\u9664\u8be5\u5f15\u7528" : "Disconnected: reconnect or remove this reference")
        : (option.fullLabel || option.label || "");
    const label = document.createElement("span");
    label.className = "h3-mention-chip-label";
    label.textContent = `@${option.label || ""}`;
    chip.append(makeMentionThumb(option), label);
    chip.addEventListener("pointerdown", (event) => {
        if (event.target?.closest?.(".h3-mention-chip-label")) return;
        event.preventDefault();
        event.stopPropagation();
        const selection = window.getSelection?.();
        if (!selection) return;
        const range = document.createRange();
        const before = event.clientX < chip.getBoundingClientRect().left + chip.getBoundingClientRect().width / 2;
        before ? range.setStartBefore(chip) : range.setStartAfter(chip);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    });
    return chip;
}

function isDialogueBlock(node) {
    return node?.nodeType === Node.ELEMENT_NODE && node.classList?.contains(DIALOGUE_CLASS);
}

function dialogueBlockText(block) {
    return editorText(block);
}

function makeDialogueBlock(value = "") {
    const block = document.createElement("span");
    block.className = DIALOGUE_CLASS;
    block.spellcheck = false;
    block.dataset.dialogue = "true";
    appendTextWithBreaks(block, value);
    if (!String(value || "")) block.append(makeCaretSentinel());
    return block;
}

function ensureDialogueInnerCaret(block) {
    if (!block || dialogueBlockText(block)) return;
    if (![...(block.childNodes || [])].some((node) => isCaretSentinelText(node))) {
        block.append(makeCaretSentinel());
    }
}

function appendDialogueBlock(container, value = "") {
    container.append(makeCaretSentinel(), makeDialogueBlock(value), makeCaretSentinel());
}

function appendPromptTextWithDialogueBlocks(container, value) {
    appendTextWithBreaks(container, String(value || ""));
}

function serializeEditorDoc(editor) {
    const parts = [];
    const pushText = (text) => {
        const value = String(text || "").replaceAll("\u200B", "");
        if (!value) return;
        if (parts.at(-1)?.type === "text") parts[parts.length - 1].text += value;
        else parts.push({ type: "text", text: value });
    };
    const visit = (item) => {
        if (item.nodeType === Node.TEXT_NODE) {
            pushText(item.textContent);
            return;
        }
        if (item.nodeType !== Node.ELEMENT_NODE) return;
        if (isDialogueBlock(item)) {
            const text = dialogueBlockText(item);
            parts.push({ type: "dialogue", text });
            return;
        }
        if (item.classList?.contains("h3-mention-chip")) {
            parts.push({
                type: "mention",
                token: item.dataset.token || "",
                label: item.dataset.label || "",
                fullLabel: item.dataset.fullLabel || item.dataset.label || "",
                mediaType: item.dataset.mediaType || "image",
                referenceMode: item.dataset.referenceMode || "index",
                ordinal: Number(item.dataset.ordinal) || null,
                sourceId: item.dataset.sourceId ? Number(item.dataset.sourceId) : null,
                sourceSlot: Number(item.dataset.sourceSlot) || 0,
                previewUrl: item.dataset.previewUrl || "",
            });
            return;
        }
        if (item.tagName === "BR") {
            pushText("\n");
            return;
        }
        const block = ["DIV", "P"].includes(item.tagName);
        if (block && parts.length && !(parts.at(-1)?.type === "text" && parts.at(-1).text.endsWith("\n"))) pushText("\n");
        for (const child of item.childNodes || []) visit(child);
    };
    for (const child of editor.childNodes || []) visit(child);
    return {
        version: 1,
        text: parts.map((part) => {
            if (part.type === "mention") return part.token;
            if (part.type === "dialogue") return `<d>${part.text || ""}</d>`;
            return part.text;
        }).join(""),
        parts,
    };
}

function appendTextWithBreaks(container, value) {
    String(value || "").split("\n").forEach((part, index) => {
        if (index) container.append(document.createElement("br"));
        if (part) container.append(document.createTextNode(part));
    });
}

function appendWriterIdeaWithMentionChips(node, container, value) {
    const options = writerMentionOptions(node).slice().sort((left, right) => String(right.token || "").length - String(left.token || "").length);
    const byToken = new Map(options.filter((option) => option.token).map((option) => [String(option.token), option]));
    if (!byToken.size) {
        appendTextWithBreaks(container, value);
        return;
    }
    const pattern = new RegExp([...byToken.keys()].map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "g");
    let offset = 0;
    for (const match of String(value || "").matchAll(pattern)) {
        appendTextWithBreaks(container, String(value || "").slice(offset, match.index));
        container.append(makeCaretSentinel(), makeMentionChip(byToken.get(match[0])), makeCaretSentinel());
        offset = Number(match.index) + match[0].length;
    }
    appendTextWithBreaks(container, String(value || "").slice(offset));
}

function renderEditorFromNode(node, force = false) {
    const editor = node?.__h3Editor;
    const widget = getWidget(node, "prompt");
    if (!editor || !widget || (document.activeElement === editor && !force)) return;
    const doc = node.properties?.[PROMPT_DOC_PROP];
    editor.textContent = "";
    if (!Array.isArray(doc?.parts)) {
        appendPromptTextWithDialogueBlocks(editor, String(widget.value || ""));
        return;
    }
    const live = mentionOptions(node);
    for (const part of doc.parts) {
        if (part?.type === "dialogue") {
            appendTextWithBreaks(editor, `<d>${String(part.text || "")}</d>`);
            continue;
        }
        if (part?.type !== "mention") {
            appendTextWithBreaks(editor, part?.text || "");
            continue;
        }
        const currentMode = referenceMentionMode(node);
        const partSourceId = part.sourceId != null && Number.isFinite(Number(part.sourceId)) ? Number(part.sourceId) : null;
        const partOrdinal = Number(part.ordinal) || null;
        const option = findMentionOption(live, {
            mediaType: part.mediaType || "image",
            ordinal: partOrdinal,
            sourceId: partSourceId,
            sourceSlot: Number(part.sourceSlot) || 0,
        }, currentMode);
        editor.append(makeMentionChip({
            type: part.mediaType || option?.type || "image",
            token: option?.token || part.token || option?.tag || "",
            tag: option?.tag || part.token || "",
            label: option?.label || part.label || part.token || "",
            fullLabel: option?.fullLabel || part.fullLabel || part.label || part.token || "",
            referenceMode: currentMode,
            ordinal: option?.ordinal ?? part.ordinal,
            sourceId: option?.sourceId ?? part.sourceId,
            sourceSlot: option?.sourceSlot ?? part.sourceSlot ?? 0,
            previewUrl: option?.previewUrl || "",
            unresolved: !option,
            pending: !option && partSourceId == null && partOrdinal != null,
        }));
    }
}

function syncPromptFromEditor(node, markDirty = true) {
    const editor = node?.__h3Editor;
    const widget = getWidget(node, "prompt");
    if (!editor || !widget || node.__h3EditorSyncing) return;
    node.__h3EditorSyncing = true;
    try {
        const doc = serializeEditorDoc(editor);
        widget.value = doc.text;
        if (widget._state) widget._state.value = doc.text;
        node.properties ||= {};
        node.properties[PROMPT_DOC_PROP] = doc;
        if (markDirty) {
            node.setDirtyCanvas?.(true, true);
            app.graph?.setDirtyCanvas?.(true, true);
            app.graph?.change?.();
        }
    } finally {
        node.__h3EditorSyncing = false;
    }
}

function clonePromptDoc(doc) {
    const source = doc && typeof doc === "object" ? doc : {};
    return {
        version: 1,
        text: String(source.text || ""),
        parts: Array.isArray(source.parts) ? source.parts.map((part) => ({ ...part })) : [],
    };
}

function promptDocKey(doc) {
    return JSON.stringify(clonePromptDoc(doc));
}

function editorPromptNode(editor) {
    return editor?.__h3PromptNode || null;
}

function editorFromEvent(event) {
    const target = event?.target;
    if (target?.closest) {
        const editor = target.closest(".h3-prompt-editor");
        if (editor) return editor;
    }
    const active = typeof document !== "undefined" ? document.activeElement : null;
    return active?.closest?.(".h3-prompt-editor") || activePromptNode?.__h3Editor || null;
}

function isPromptUndoRedoEvent(event) {
    if (!(event?.ctrlKey || event?.metaKey)) return false;
    const key = String(event.key || "").toLowerCase();
    const code = String(event.code || "");
    return key === "z" || key === "y" || code === "KeyZ" || code === "KeyY";
}

function ensurePromptHistory(node) {
    const editor = node?.__h3Editor;
    if (!editor) return null;
    if (node.__h3PromptHistory) return node.__h3PromptHistory;
    const doc = clonePromptDoc(serializeEditorDoc(editor));
    node.__h3PromptHistory = {
        undo: [{ doc }],
        redo: [],
        lastKey: promptDocKey(doc),
        applying: false,
    };
    return node.__h3PromptHistory;
}

function resetPromptHistory(node) {
    node.__h3PromptHistory = null;
    ensurePromptHistory(node);
}

function pushPromptHistory(node) {
    const history = ensurePromptHistory(node);
    const editor = node?.__h3Editor;
    if (!history || !editor || history.applying) return;
    const doc = clonePromptDoc(serializeEditorDoc(editor));
    const key = promptDocKey(doc);
    if (key === history.lastKey) return;
    history.undo.push({ doc });
    if (history.undo.length > PROMPT_HISTORY_LIMIT) history.undo.shift();
    history.redo = [];
    history.lastKey = key;
}

function setEditorCaretAtEnd(editor) {
    if (!editor) return;
    const selection = window.getSelection?.();
    if (!selection) return;
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
}

function applyPromptHistoryEntry(node, entry) {
    const history = node?.__h3PromptHistory;
    const editor = node?.__h3Editor;
    const widget = getWidget(node, "prompt");
    if (!history || !editor || !entry?.doc || !widget) return false;
    history.applying = true;
    try {
        const doc = clonePromptDoc(entry.doc);
        node.properties ||= {};
        node.properties[PROMPT_DOC_PROP] = doc;
        widget.value = doc.text;
        if (widget._state) widget._state.value = doc.text;
        renderEditorFromNode(node, true);
        syncPromptFromEditor(node, false);
        history.lastKey = promptDocKey(doc);
    } finally {
        history.applying = false;
    }
    closeMentionMenu(node);
    editor.focus();
    setEditorCaretAtEnd(editor);
    return true;
}

function handlePromptHistoryKeydown(node, event) {
    if (!isPromptUndoRedoEvent(event)) return false;
    event.preventDefault?.();
    event.stopPropagation?.();
    event.stopImmediatePropagation?.();
    const history = ensurePromptHistory(node);
    if (!history) return true;
    const key = String(event.key || "").toLowerCase();
    const isRedo = key === "y" || String(event.code || "") === "KeyY" || (key === "z" && event.shiftKey);
    if (isRedo) {
        const entry = history.redo.pop();
        if (!entry) return true;
        history.undo.push(entry);
        applyPromptHistoryEntry(node, entry);
        return true;
    }
    if (history.undo.length <= 1) return true;
    const current = history.undo.pop();
    if (current) history.redo.push(current);
    applyPromptHistoryEntry(node, history.undo[history.undo.length - 1]);
    return true;
}

function handlePromptUndoRedoCapture(event) {
    if (!isPromptUndoRedoEvent(event)) return;
    const node = editorPromptNode(editorFromEvent(event));
    if (node && !node.__h3PromptComposing) {
        pushPromptHistory(node);
        handlePromptHistoryKeydown(node, event);
    }
}

function handlePromptHistoryBeforeInputCapture(event) {
    if (event?.inputType !== "historyUndo" && event?.inputType !== "historyRedo") return;
    const node = editorPromptNode(editorFromEvent(event));
    if (!node || node.__h3PromptComposing) return;
    const isRedo = event.inputType === "historyRedo";
    pushPromptHistory(node);
    handlePromptHistoryKeydown(node, {
        ctrlKey: true,
        metaKey: false,
        shiftKey: isRedo,
        key: isRedo ? "y" : "z",
        code: isRedo ? "KeyY" : "KeyZ",
        preventDefault: () => event.preventDefault?.(),
        stopPropagation: () => event.stopPropagation?.(),
        stopImmediatePropagation: () => event.stopImmediatePropagation?.(),
    });
}

function ensurePromptUndoRedoShield() {
    if (globalThis.__H3_PROMPT_UNDO_SHIELD_INSTALLED || typeof window === "undefined") return;
    globalThis.__H3_PROMPT_UNDO_SHIELD_INSTALLED = true;
    globalThis.__H3_PROMPT_UNDO_VERSION = PROMPT_UNDO_VERSION;
    window.addEventListener("keydown", handlePromptUndoRedoCapture, true);
    window.addEventListener("pointerdown", (event) => {
        const editor = event?.target?.closest?.(".h3-prompt-editor");
        activePromptNode = editorPromptNode(editor);
    }, true);
    document.addEventListener("focusin", (event) => {
        const editor = event?.target?.closest?.(".h3-prompt-editor");
        activePromptNode = editorPromptNode(editor);
    }, true);
    document.addEventListener("beforeinput", handlePromptHistoryBeforeInputCapture, true);
}

function patchLiteGraphPromptProcessKey() {
    if (globalThis.__H3_PROMPT_PROCESS_KEY_PATCHED || !globalThis.LGraphCanvas?.prototype) return;
    const proto = globalThis.LGraphCanvas.prototype;
    const originalProcessKey = proto.processKey;
    if (typeof originalProcessKey !== "function") return;
    globalThis.__H3_PROMPT_PROCESS_KEY_PATCHED = true;
    proto.processKey = function processKeyH3PromptEditorShield(event) {
        const node = editorPromptNode(editorFromEvent(event));
        if (node && isPromptUndoRedoEvent(event)) {
            pushPromptHistory(node);
            handlePromptHistoryKeydown(node, event);
            return;
        }
        return originalProcessKey.apply(this, arguments);
    };
}

function preparePromptEditorForUndo(editor) {
    if (!editor) return;
    editor.setAttribute("data-h3-undo-version", PROMPT_UNDO_VERSION);
    try {
        Object.defineProperty(editor, "type", {
            value: "textarea",
            configurable: true,
        });
    } catch {
        editor.type = "textarea";
    }
}

function getMentionRange(editor) {
    const selection = window.getSelection?.();
    if (!selection || !selection.rangeCount || !selection.isCollapsed) return null;
    const caret = selection.getRangeAt(0);
    if (!editor.contains(caret.startContainer)) return null;
    if (caret.startContainer.parentElement?.closest?.(`.${DIALOGUE_CLASS}`)) return null;
    // Mention chips are contentEditable=false elements whose visible text also
    // contains an "@". Reading cloneContents().textContent therefore made a
    // normal character typed after an existing chip look like an active @ query.
    // Build a small editable-text stream instead, treating chips and line breaks
    // as hard boundaries.
    const units = [];
    const visit = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            if (!node.parentElement?.closest?.(".h3-mention-chip")) units.push({ kind: "text", node });
            return;
        }
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        if (isDialogueBlock(node)) {
            units.push({ kind: "dialogue", node });
            return;
        }
        if (node.classList?.contains("h3-mention-chip")) {
            units.push({ kind: "chip", node });
            return;
        }
        if (node.tagName === "BR") {
            units.push({ kind: "break", node });
            return;
        }
        for (const child of node.childNodes || []) visit(child);
    };
    visit(editor);

    if (caret.startContainer.nodeType !== Node.TEXT_NODE) return null;
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
    const menu = node?.__h3MentionMenu;
    menu?.element?.remove?.();
    if (node) node.__h3MentionMenu = null;
}

function dialogueBlockAtSelection(editor) {
    const selection = window.getSelection?.();
    if (!selection || !selection.rangeCount) return null;
    const container = selection.getRangeAt(0).startContainer;
    const element = container.nodeType === Node.ELEMENT_NODE ? container : container.parentElement;
    const block = element?.closest?.(`.${DIALOGUE_CLASS}`);
    return block && editor.contains(block) ? block : null;
}

function dialogueBoundary(block, side) {
    if (!block?.parentNode) return null;
    const sibling = side === "before" ? block.previousSibling : block.nextSibling;
    if (isCaretSentinelText(sibling)) return sibling;
    const marker = makeCaretSentinel();
    block.parentNode.insertBefore(marker, side === "before" ? block : block.nextSibling);
    return marker;
}

function setCaretAtEndOfNode(node) {
    if (!node) return;
    const selection = window.getSelection?.();
    if (!selection) return;
    const range = document.createRange();
    let target = node;
    while (target?.lastChild) target = target.lastChild;
    if (target?.nodeType === Node.TEXT_NODE) {
        range.setStart(target, target.textContent.length);
    } else if (target?.parentNode && target !== node) {
        range.setStartAfter(target);
    } else {
        range.setStart(node, node.childNodes.length);
    }
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
}

function exitDialogueBlock(node, editor, block) {
    const marker = dialogueBoundary(block, "after");
    if (!marker) return false;
    const text = String(marker.textContent || "");
    const index = text.indexOf(CARET_SENTINEL);
    editor.focus({ preventScroll: true });
    setCaretAtNode(marker, index >= 0 ? index + CARET_SENTINEL.length : text.length);
    closeMentionMenu(node);
    return true;
}

function insertDialogueBlockAtSelection(node, editor) {
    const selection = window.getSelection?.();
    if (!selection || !selection.rangeCount || !editor) return false;
    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) return false;
    if (dialogueBlockAtSelection(editor)) return false;
    range.deleteContents();
    const before = makeCaretSentinel();
    const block = makeDialogueBlock("");
    const after = makeCaretSentinel();
    const fragment = document.createDocumentFragment();
    fragment.append(before, block, after);
    range.insertNode(fragment);
    editor.focus({ preventScroll: true });
    setCaretAtEndOfNode(block);
    closeMentionMenu(node);
    return true;
}

function findDialogueAcrossWhitespace(start, root, direction) {
    let current = start;
    const skipped = [];
    while (current) {
        if (isDialogueBlock(current)) return { block: current, skipped };
        if (isIgnorableTextNode(current)) {
            skipped.push(current);
            current = adjacentLeaf(current, root, direction);
            continue;
        }
        return null;
    }
    return null;
}

function deleteLastDialogueContent(block) {
    const leaves = [];
    const visit = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            leaves.push(node);
            return;
        }
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "BR") {
            leaves.push(node);
            return;
        }
        for (const child of node.childNodes || []) visit(child);
    };
    for (const child of block.childNodes || []) visit(child);
    for (let index = leaves.length - 1; index >= 0; index -= 1) {
        const leaf = leaves[index];
        if (leaf.nodeType === Node.TEXT_NODE) {
            if (deleteLastVisibleChar(leaf)) {
                setCaretAtEndOfNode(block);
                return true;
            }
            if (!leaf.textContent) leaf.remove();
            continue;
        }
        if (leaf.nodeType === Node.ELEMENT_NODE && leaf.tagName === "BR") {
            const next = leaf.nextSibling;
            leaf.remove();
            if (isOnlyCaretSentinelText(next)) next.remove();
            setCaretAtEndOfNode(block);
            return true;
        }
    }
    ensureDialogueInnerCaret(block);
    setCaretAtEndOfNode(block);
    return false;
}

function removeDialogueBlock(block) {
    if (!block?.parentNode) return false;
    const parent = block.parentNode;
    const before = block.previousSibling;
    const after = block.nextSibling;
    let marker = isCaretSentinelText(before) ? before : null;
    if (!marker) {
        marker = makeCaretSentinel();
        parent.insertBefore(marker, block);
    }
    block.remove();
    if (after !== marker && isOnlyCaretSentinelText(after)) after.remove();
    setCaretAtNode(marker, marker.textContent.length);
    return true;
}

function backspaceDialogueBoundary(editor, node) {
    const selection = window.getSelection?.();
    if (!selection || !selection.rangeCount || !selection.isCollapsed) return false;
    const activeBlock = dialogueBlockAtSelection(editor);
    if (activeBlock) {
        if (!dialogueBlockText(activeBlock)) {
            const removed = removeDialogueBlock(activeBlock);
            if (removed) closeMentionMenu(node);
            return removed;
        }
        return false;
    }
    const range = selection.getRangeAt(0);
    if (!editor.contains(range.startContainer)) return false;
    const scan = getDeletionScanStart(range, editor, "backward");
    if (!scan) return false;
    const found = findDialogueAcrossWhitespace(scan.start, editor, "backward");
    if (!found?.block) return false;
    for (const skipped of found.skipped) skipped.remove?.();
    const block = found.block;
    if (dialogueBlockText(block)) {
        if (!deleteLastDialogueContent(block)) return false;
        closeMentionMenu(node);
        return true;
    }
    const removed = removeDialogueBlock(block);
    if (removed) closeMentionMenu(node);
    return removed;
}

function positionMentionMenu(element, editor) {
    const selection = window.getSelection?.();
    const caret = selection?.rangeCount ? selection.getRangeAt(0).getBoundingClientRect() : null;
    const editorRect = editor.getBoundingClientRect();
    const rect = caret && (caret.width || caret.height) ? caret : editorRect;
    const width = Math.min(280, Math.max(198, element.offsetWidth || 198));
    const height = Math.min(360, element.offsetHeight || 120);
    let left = rect.left;
    let top = rect.bottom + 6;
    if (left + width > window.innerWidth - 8) left = window.innerWidth - width - 8;
    if (top + height > window.innerHeight - 8) top = Math.max(8, rect.top - height - 6);
    element.style.left = `${Math.max(8, Math.round(left))}px`;
    element.style.top = `${Math.max(8, Math.round(top))}px`;
}

function chooseMention(node, option) {
    const state = node?.__h3MentionMenu;
    const range = state?.mention?.range;
    const editor = node?.__h3Editor;
    if (!range || !editor) return;
    range.deleteContents();
    const before = document.createTextNode("\u200B");
    const chip = makeMentionChip(option);
    const after = document.createTextNode("\u200B");
    const fragment = document.createDocumentFragment();
    fragment.append(before, chip, after);
    range.insertNode(fragment);
    const selection = window.getSelection?.();
    if (selection) {
        const caret = document.createRange();
        caret.setStart(after, after.textContent.length);
        caret.collapse(true);
        selection.removeAllRanges();
        selection.addRange(caret);
    }
    closeMentionMenu(node);
    syncPromptFromEditor(node);
    pushPromptHistory(node);
    editor.focus();
}

function renderMentionMenu(node) {
    const state = node?.__h3MentionMenu;
    if (!state) return;
    const { element, options, activeIndex } = state;
    element.textContent = "";
    const title = document.createElement("div");
    title.className = "h3-mention-menu-title";
    title.textContent = TEXT.mentionTitle;
    element.append(title);
    if (!options.length) {
        const empty = document.createElement("div");
        empty.className = "h3-mention-menu-empty";
        empty.textContent = TEXT.mentionEmpty;
        element.append(empty);
        return;
    }
    options.forEach((option, index) => {
        const item = document.createElement("div");
        item.className = `h3-mention-menu-item${index === activeIndex ? " is-active" : ""}`;
        const main = document.createElement("div");
        main.className = "h3-mention-menu-main";
        main.textContent = option.label;
        main.title = option.fullLabel || option.label || "";
        const detail = document.createElement("div");
        detail.className = "h3-mention-menu-detail";
        detail.textContent = option.source;
        const text = document.createElement("div");
        text.append(main, detail);
        item.append(makeMentionThumb(option, true), text);
        item.addEventListener("pointermove", () => {
            if (!node.__h3MentionMenu || node.__h3MentionMenu.activeIndex === index) return;
            node.__h3MentionMenu.activeIndex = index;
            renderMentionMenu(node);
        });
        item.addEventListener("pointerdown", (event) => {
            event.preventDefault();
            event.stopPropagation();
            chooseMention(node, option);
        });
        element.append(item);
    });
}

function openMentionMenu(node, editor) {
    if (!isReferenceMode(node)) {
        closeMentionMenu(node);
        return false;
    }
    const mention = getMentionRange(editor);
    if (!mention) {
        closeMentionMenu(node);
        return false;
    }
    const query = mention.query.toLowerCase();
    const options = mentionOptions(node).filter((option) => !query || `${option.label} ${option.fullLabel || ""} ${option.source}`.toLowerCase().includes(query));
    const existing = node.__h3MentionMenu;
    if (existing) {
        existing.mention = mention;
        existing.options = options;
        existing.activeIndex = Math.min(existing.activeIndex, Math.max(0, options.length - 1));
        renderMentionMenu(node);
        positionMentionMenu(existing.element, editor);
        return true;
    }
    const element = document.createElement("div");
    element.className = "h3-mention-menu";
    applyNativeEditorTheme(element);
    document.body.append(element);
    node.__h3MentionMenu = { element, mention, options, activeIndex: 0 };
    renderMentionMenu(node);
    positionMentionMenu(element, editor);
    return true;
}

function syncMentionMenuToCaret(node, editor) {
    if (!isReferenceMode(node) || !getMentionRange(editor)) {
        closeMentionMenu(node);
        return false;
    }
    return openMentionMenu(node, editor);
}

function setWidgetOption(widget, key, value) {
    if (!widget) return;
    widget.options ||= {};
    if (value === undefined) delete widget.options[key];
    else widget.options[key] = value;
    if (widget._state?.options) {
        if (value === undefined) delete widget._state.options[key];
        else widget._state.options[key] = value;
    }
}

function isVueNodesMode() {
    return Boolean(globalThis.LiteGraph?.vueNodesMode);
}

function applyNativeEditorTheme(element) {
    if (!element?.style) return;
    const LiteGraph = globalThis.LiteGraph || {};
    const modern = isVueNodesMode();
    const widgetBg = LiteGraph.WIDGET_BGCOLOR || "#222";
    const widgetText = LiteGraph.WIDGET_TEXT_COLOR || "#ddd";
    const outline = LiteGraph.WIDGET_OUTLINE_COLOR || "rgba(255, 255, 255, 0.18)";
    const menuBg = LiteGraph.NODE_DEFAULT_BGCOLOR || "#1f1f1f";
    element.classList?.toggle("h3-native-vue-nodes", modern);
    element.classList?.toggle("h3-native-legacy-nodes", !modern);
    if (modern) {
        element.style.setProperty("--h3-native-widget-bg", "var(--component-node-widget-background, var(--secondary-background, #222))");
        element.style.setProperty("--h3-native-widget-text", "var(--component-node-foreground, var(--base-foreground, #ddd))");
        element.style.setProperty("--h3-native-widget-outline", "var(--component-node-widget-background-highlighted, var(--border-default, rgba(255, 255, 255, 0.18)))");
        element.style.setProperty("--h3-native-widget-focus", "var(--component-node-widget-background-highlighted, var(--border-default, rgba(255, 255, 255, 0.28)))");
        element.style.setProperty("--h3-native-widget-muted", "var(--component-node-foreground-secondary, var(--muted-foreground, rgba(255, 255, 255, 0.42)))");
        element.style.setProperty("--h3-native-menu-bg", "var(--component-node-widget-background, var(--comfy-menu-bg, #1f1f1f))");
        element.style.setProperty("--h3-native-widget-radius", "var(--radius-lg, 8px)");
        element.style.setProperty("--h3-native-widget-padding", "8px 12px");
        element.style.setProperty("--h3-native-widget-line-height", "var(--text-xs--line-height, 1.3333333)");
        element.style.setProperty("--h3-native-widget-text-size", "var(--text-xs, var(--comfy-textarea-font-size, 12px))");
        return;
    }
    element.style.setProperty("--h3-native-widget-bg", `var(--comfy-input-bg, ${widgetBg})`);
    element.style.setProperty("--h3-native-widget-text", `var(--input-text, ${widgetText})`);
    element.style.setProperty("--h3-native-widget-outline", `var(--border-color, ${outline})`);
    element.style.setProperty("--h3-native-widget-focus", `var(--border-color, ${outline})`);
    element.style.setProperty("--h3-native-widget-muted", "rgba(255, 255, 255, 0.42)");
    element.style.setProperty("--h3-native-menu-bg", `var(--comfy-menu-bg, ${menuBg})`);
    element.style.setProperty("--h3-native-widget-radius", "0px");
    element.style.setProperty("--h3-native-widget-padding", "2px");
    element.style.setProperty("--h3-native-widget-line-height", "normal");
    element.style.setProperty("--h3-native-widget-text-size", "var(--comfy-textarea-font-size, 12px)");
}

function syncEditorThemes(force = false) {
    const modern = isVueNodesMode();
    if (!force && lastVueNodesMode === modern) return;
    lastVueNodesMode = modern;
    for (const node of app.graph?._nodes || []) {
        if (!isTarget(node)) continue;
        applyNativeEditorTheme(node.__h3EditorWrap);
        applyNativeEditorTheme(node.__h3WriterPanel);
        applyNativeEditorTheme(node.__h3WriterIdeaMentionMenu?.element);
        applyNativeEditorTheme(node.__h3MentionMenu?.element);
    }
    app.graph?.setDirtyCanvas?.(true, true);
}

function installNativeThemeWatcher() {
    if (nativeThemeWatcherInstalled) return;
    nativeThemeWatcherInstalled = true;
    lastVueNodesMode = null;
    setInterval(() => syncEditorThemes(), 1000);
    for (const delay of [0, 60, 180]) setTimeout(() => syncEditorThemes(true), delay);
}

function patchEditorKeyHandling() {
    const proto = globalThis.LGraphCanvas?.prototype;
    if (!proto || proto.__h3PromptKeyHandlingPatched || typeof proto.processKey !== "function") return;
    proto.__h3PromptKeyHandlingPatched = true;
    const original = proto.processKey;
    proto.processKey = function processKeyWithH3PromptEditor(event) {
        const editor = event?.target?.closest?.(".h3-prompt-editor")
            || document.activeElement?.closest?.(".h3-prompt-editor")
            || activePromptNode?.__h3Editor;
        if (editor) {
            const node = editorPromptNode(editor);
            if (node && isPromptUndoRedoEvent(event)) handlePromptHistoryKeydown(node, event);
            return;
        }
        return original.apply(this, arguments);
    };
}

function hideOriginalPromptWidget(widget) {
    if (!widget) return;
    if (!widget.__h3PromptHidden) {
        widget.__h3PromptHidden = true;
        widget.__h3OriginalType = widget.type;
        widget.__h3OriginalComputeSize = widget.computeSize;
        widget.__h3OriginalHidden = widget.hidden;
        widget.__h3OriginalOptionsHidden = widget.options?.hidden;
        widget.__h3OriginalOptionsCanvasOnly = widget.options?.canvasOnly;
    }
    widget.hidden = true;
    setWidgetOption(widget, "hidden", true);
    setWidgetOption(widget, "canvasOnly", true);
    widget.type = "hidden";
    widget.computeSize = () => [0, -4];
}

function restoreOriginalPromptWidget(widget) {
    if (!widget?.__h3PromptHidden) return;
    widget.type = widget.__h3OriginalType || "customtext";
    widget.computeSize = widget.__h3OriginalComputeSize || (() => [220, 120]);
    widget.hidden = widget.__h3OriginalHidden ?? false;
    setWidgetOption(widget, "hidden", widget.__h3OriginalOptionsHidden);
    setWidgetOption(widget, "canvasOnly", widget.__h3OriginalOptionsCanvasOnly);
    widget.__h3PromptHidden = false;
}

function hideDomEditorWidget(widget) {
    if (!widget) return;
    if (!widget.__h3EditorHidden) {
        widget.__h3EditorHidden = true;
        widget.__h3EditorType = widget.type;
        widget.__h3EditorComputeSize = widget.computeSize;
    }
    widget.hidden = true;
    setWidgetOption(widget, "hidden", true);
    widget.type = "hidden";
    widget.computeSize = () => [0, -4];
}

function showDomEditorWidget(widget) {
    if (!widget?.__h3EditorHidden) return;
    widget.type = widget.__h3EditorType || "h3_prompt_mentions";
    widget.computeSize = widget.__h3EditorComputeSize || (() => [220, 96]);
    widget.hidden = false;
    setWidgetOption(widget, "hidden", false);
    widget.__h3EditorHidden = false;
}

function refreshVueNodeWidgets(node) {
    if (!Array.isArray(node?.widgets)) return;
    const widgets = [...node.widgets];
    try {
        if (isVueNodesMode()) node.widgets = [];
        node.widgets = widgets;
    } catch { /* Some frontends expose widgets as a read-only field. */ }
}

function getConditionalWidgetHeight(node, widget) {
    if (!widget) return Number(globalThis.LiteGraph?.NODE_WIDGET_HEIGHT) || 20;
    const storedHeight = Number(widget.__h3ConditionalRowHeight);
    if (Number.isFinite(storedHeight) && storedHeight > 0) return storedHeight;
    const measure = widget.__h3ConditionalOrigComputeSize || widget.computeSize;
    try {
        const measured = measure?.call(widget, Math.max(80, Number(node?.size?.[0]) || 220));
        const height = Number(measured?.[1]);
        if (Number.isFinite(height) && height > 0) {
            widget.__h3ConditionalRowHeight = height;
            return height;
        }
    } catch { /* Use the standard row height when a widget cannot be measured. */ }
    const height = Number(widget.computedHeight) > 0
        ? Number(widget.computedHeight)
        : Number(globalThis.LiteGraph?.NODE_WIDGET_HEIGHT) || 20;
    widget.__h3ConditionalRowHeight = height;
    return height;
}

function adjustNodeHeight(node, delta) {
    if (!node?.size || !Number.isFinite(delta) || !delta) return;
    const width = Number(node.size[0]) || 0;
    const beforeHeight = Number(node.size[1]) || 0;
    const nextHeight = Math.max(0, beforeHeight + delta);
    const nextSize = [width, nextHeight];
    node.setSize?.(nextSize);
    if (node.size) {
        node.size[0] = width;
        node.size[1] = nextHeight;
    } else {
        node.size = nextSize;
    }
    node._widgetSlotsDirty = true;
    node.setDirtyCanvas?.(true, true);
    node.graph?.setDirtyCanvas?.(true, true);
    app.graph?.setDirtyCanvas?.(true, true);
}

function hideConditionalWidget(widget) {
    if (!widget) return false;
    let compactSize = false;
    try {
        const measured = widget.computeSize?.();
        compactSize = Number(measured?.[0]) === 0 && Number(measured?.[1]) === -4;
    } catch { /* The widget may not expose a measurable size yet. */ }
    const wasVisible = widget.hidden !== true
        || widget.options?.hidden !== true
        || widget.type !== "hidden"
        || !compactSize;
    const originalType = widget.type;
    const originalComputeSize = widget.computeSize;
    const originalHidden = widget.hidden;
    if (widget.type !== "hidden" && widget.type !== "converted-widget") widget.__h3ConditionalOrigType = widget.type;
    if (!Object.prototype.hasOwnProperty.call(widget, "__h3ConditionalOrigComputeSize")) {
        widget.__h3ConditionalOrigComputeSize = originalComputeSize;
        widget.__h3ConditionalHadComputeSize = Object.prototype.hasOwnProperty.call(widget, "computeSize");
        widget.__h3ConditionalOrigHidden = originalHidden;
        widget.__h3ConditionalOrigOptionsHidden = widget.options?.hidden;
        widget.__h3ConditionalOrigOptionsCanvasOnly = widget.options?.canvasOnly;
        widget.__h3ConditionalOrigComputedHeight = widget.computedHeight;
        widget.__h3ConditionalHadComputedHeight = Object.prototype.hasOwnProperty.call(widget, "computedHeight");
    }
    widget.hidden = true;
    if (widget.inputEl) widget.inputEl.style.display = "none";
    if (widget.element) widget.element.style.display = "none";
    widget.type = "hidden";
    widget.computeSize = () => [0, -4];
    widget.computedHeight = 0;
    setWidgetOption(widget, "hidden", true);
    setWidgetOption(widget, "canvasOnly", true);
    if (widget._state) {
        widget._state.hidden = true;
        widget._state.type = "hidden";
        widget._state.computedHeight = 0;
    }
    return wasVisible;
}

function showConditionalWidget(widget) {
    if (!widget) return false;
    const wasHidden = widget.type === "hidden"
        || widget.hidden === true
        || widget.options?.hidden === true
        || widget._state?.type === "hidden"
        || widget._state?.hidden === true
        || widget._state?.options?.hidden === true;
    if (!wasHidden) return false;
    widget.hidden = widget.__h3ConditionalOrigHidden ?? false;
    if (widget.inputEl) widget.inputEl.style.display = "";
    if (widget.element) widget.element.style.display = "";
    if (widget.type === "hidden") widget.type = widget.__h3ConditionalOrigType || "combo";
    if (widget.__h3ConditionalHadComputeSize) widget.computeSize = widget.__h3ConditionalOrigComputeSize;
    else delete widget.computeSize;
    if (widget.__h3ConditionalHadComputedHeight) widget.computedHeight = widget.__h3ConditionalOrigComputedHeight;
    else delete widget.computedHeight;
    setWidgetOption(widget, "hidden", false);
    setWidgetOption(widget, "canvasOnly", false);
    if (widget._state) {
        widget._state.hidden = widget.hidden;
        widget._state.type = widget.type;
        if (widget.__h3ConditionalHadComputedHeight) widget._state.computedHeight = widget.computedHeight;
        else delete widget._state.computedHeight;
        widget._state.options ||= {};
        if (widget.options?.hidden === undefined) delete widget._state.options.hidden;
        else widget._state.options.hidden = widget.options.hidden;
        if (widget.options?.canvasOnly === undefined) delete widget._state.options.canvasOnly;
        else widget._state.options.canvasOnly = widget.options.canvasOnly;
    }
    localizeComboWidget(widget);
    return wasHidden;
}

function setConditionalWidgetVisible(node, widget, visible) {
    const rowHeight = getConditionalWidgetHeight(node, widget);
    const changed = visible ? showConditionalWidget(widget) : hideConditionalWidget(widget);
    if (!changed) return false;
    adjustNodeHeight(node, visible ? rowHeight : -rowHeight);
    refreshVueNodeWidgets(node);
    node._widgetSlotsDirty = true;
    return true;
}

function syncModeWidgets(node) {
    const advanced = isAdvancedEnabled(node);
    const changed = [
        setConditionalWidgetVisible(node, getWidget(node, "fps"), advanced),
        setConditionalWidgetVisible(node, getWidget(node, "keyframe_role"), false),
        setConditionalWidgetVisible(node, getWidget(node, "ref_image_size"), advanced),
        setConditionalWidgetVisible(node, getWidget(node, "reference_mention_mode"), advanced && isReferenceMode(node)),
        setConditionalWidgetVisible(node, getWidget(node, "aspect_ratio"), !isCustomResolution(node)),
        setConditionalWidgetVisible(node, getWidget(node, "width"), isCustomResolution(node)),
        setConditionalWidgetVisible(node, getWidget(node, "height"), isCustomResolution(node)),
    ].some(Boolean);
    if (changed) {
        refreshVueNodeWidgets(node);
        node._widgetSlotsDirty = true;
        node.setDirtyCanvas?.(true, true);
        app.graph?.setDirtyCanvas?.(true, true);
    }
    return changed;
}

function repairNodeLayout(node) {
    if (!node) return;
    const run = () => {
        refreshVueNodeWidgets(node);
        node._widgetSlotsDirty = true;
        node.setDirtyCanvas?.(true, true);
        app.graph?.setDirtyCanvas?.(true, true);
    };
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(run);
    else setTimeout(run, 0);
}

function syncEditorMode(node) {
    syncModeWidgets(node);
    const widget = getWidget(node, "prompt");
    const editor = node.__h3Editor;
    const wrap = node.__h3EditorWrap;
    const domWidget = node.__h3DomWidget;
    if (!widget || !editor || !wrap || !domWidget) return;
    const reference = isReferenceMode(node);
    hideOriginalPromptWidget(widget);
    setWidgetOption(domWidget, "canvasOnly", false);
    showDomEditorWidget(domWidget);
    editor.style.display = "block";
    wrap.style.display = "flex";
    editor.dataset.placeholder = reference ? TEXT.referencePromptPlaceholder : TEXT.promptPlaceholder;
    applyNativeEditorTheme(wrap);
    if (!reference) closeMentionMenu(node);
}

function handleMentionMenuKeydown(node, event) {
    const state = node?.__h3MentionMenu;
    if (!state) return false;
    if (event.key === "Escape") {
        closeMentionMenu(node);
        return true;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        if (state.options.length) {
            const delta = event.key === "ArrowDown" ? 1 : -1;
            state.activeIndex = (state.activeIndex + delta + state.options.length) % state.options.length;
            renderMentionMenu(node);
            state.element.querySelector(".is-active")?.scrollIntoView?.({ block: "nearest" });
        }
        return true;
    }
    if (event.key === "Enter" || event.key === "Tab") {
        const option = state.options[state.activeIndex];
        if (option) chooseMention(node, option);
        return Boolean(option);
    }
    return false;
}

function stripCaretSentinels(value) {
    return String(value ?? "").replaceAll(CARET_SENTINEL, "");
}

function makeCaretSentinel() {
    return document.createTextNode(CARET_SENTINEL);
}

function isCaretSentinelText(node) {
    return node?.nodeType === Node.TEXT_NODE && String(node.textContent || "").includes(CARET_SENTINEL);
}

function isOnlyCaretSentinelText(node) {
    return node?.nodeType === Node.TEXT_NODE && stripCaretSentinels(node.textContent) === "";
}

function isIgnorableTextNode(node) {
    return node?.nodeType === Node.TEXT_NODE && stripCaretSentinels(node.textContent).trim() === "";
}

function isMentionChip(node) {
    return node?.nodeType === Node.ELEMENT_NODE && node.classList?.contains("h3-mention-chip");
}

function deepestLeaf(node, direction) {
    let current = node;
    if (isMentionChip(current) || isDialogueBlock(current)) return current;
    while (current?.childNodes?.length) {
        if (isMentionChip(current) || isDialogueBlock(current) || current.contentEditable === "false") return current;
        current = direction === "backward"
            ? current.childNodes[current.childNodes.length - 1]
            : current.childNodes[0];
    }
    return current;
}

function adjacentLeaf(node, root, direction) {
    if (!node || node === root) return null;
    let current = node;
    while (current && current !== root) {
        const sibling = direction === "backward" ? current.previousSibling : current.nextSibling;
        if (sibling) return deepestLeaf(sibling, direction);
        current = current.parentNode;
    }
    return null;
}

function getAdjacentLeafFromCaret(range, root, direction) {
    const container = range.startContainer;
    const offset = range.startOffset;
    if (container.nodeType === Node.TEXT_NODE) {
        if (direction === "backward" && offset > 0) return null;
        if (direction === "forward" && offset < container.textContent.length) return null;
        return adjacentLeaf(container, root, direction);
    }
    if (container.nodeType === Node.ELEMENT_NODE) {
        if (direction === "backward") {
            if (offset > 0) return deepestLeaf(container.childNodes[offset - 1], "backward");
            return adjacentLeaf(container, root, "backward");
        }
        if (offset < container.childNodes.length) return deepestLeaf(container.childNodes[offset], "forward");
        return adjacentLeaf(container, root, "forward");
    }
    return null;
}

function findChipAcrossWhitespace(start, root, direction) {
    let current = start;
    const skipped = [];
    while (current) {
        if (isMentionChip(current)) return { chip: current, skipped };
        if (isIgnorableTextNode(current)) {
            skipped.push(current);
            current = adjacentLeaf(current, root, direction);
            continue;
        }
        if (current.nodeType === Node.ELEMENT_NODE && current.tagName === "BR") return null;
        return null;
    }
    return null;
}

function findLineBreakAcrossWhitespace(start, root, direction) {
    let current = start;
    const skipped = [];
    while (current) {
        if (current.nodeType === Node.ELEMENT_NODE && current.tagName === "BR") {
            return { breakNode: current, skipped };
        }
        if (isIgnorableTextNode(current)) {
            skipped.push(current);
            current = adjacentLeaf(current, root, direction);
            continue;
        }
        return null;
    }
    return null;
}

function setCaretAtNode(node, offset = 0) {
    const selection = window.getSelection?.();
    if (!selection || !node) return;
    const range = document.createRange();
    range.setStart(node, offset);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
}

function getDeletionScanStart(range, editor, direction) {
    let spacer = null;
    let start = null;
    const container = range.startContainer;
    const offset = range.startOffset;
    if (container.nodeType === Node.TEXT_NODE) {
        const text = container.textContent || "";
        if (direction === "backward") {
            const before = text.slice(0, offset);
            if (before && stripCaretSentinels(before).trim() !== "") return null;
            spacer = before ? container : null;
            start = before ? adjacentLeaf(container, editor, "backward") : getAdjacentLeafFromCaret(range, editor, "backward");
        } else {
            const after = text.slice(offset);
            if (after && stripCaretSentinels(after).trim() !== "") return null;
            spacer = after ? container : null;
            start = after ? adjacentLeaf(container, editor, "forward") : getAdjacentLeafFromCaret(range, editor, "forward");
        }
    } else {
        start = getAdjacentLeafFromCaret(range, editor, direction);
    }
    return { start, spacer, container, offset };
}

function removeSpacerText(spacer, offset, direction) {
    if (spacer?.nodeType !== Node.TEXT_NODE) return;
    if (direction === "backward") spacer.deleteData(0, offset);
    else spacer.deleteData(offset, spacer.textContent.length - offset);
    if (!spacer.textContent) spacer.remove();
}

function deleteLastVisibleChar(textNode) {
    const text = String(textNode?.textContent || "");
    let cursor = 0;
    let last = null;
    for (const char of Array.from(text)) {
        const length = char.length;
        if (char !== CARET_SENTINEL) last = { index: cursor, length };
        cursor += length;
    }
    if (!last) return false;
    textNode.deleteData(last.index, last.length);
    if (!textNode.textContent) textNode.remove();
    return true;
}

function deletePreviousVisibleCharBeforeOffset(textNode, offset) {
    if (textNode?.nodeType !== Node.TEXT_NODE) return false;
    const text = String(textNode.textContent || "");
    const limit = Math.max(0, Math.min(Number(offset) || 0, text.length));
    let cursor = 0;
    let target = null;
    for (const char of Array.from(text)) {
        const length = char.length;
        const next = cursor + length;
        if (next > limit) break;
        if (char !== CARET_SENTINEL) target = { index: cursor, length };
        cursor = next;
    }
    if (!target) return false;
    textNode.deleteData(target.index, target.length);
    setCaretAtNode(textNode, target.index);
    return true;
}

function getOrInsertCaretSentinel(chip, side) {
    if (!chip?.parentNode) return null;
    const sibling = side === "before" ? chip.previousSibling : chip.nextSibling;
    if (isCaretSentinelText(sibling)) return sibling;
    const marker = makeCaretSentinel();
    chip.parentNode.insertBefore(marker, side === "before" ? chip : chip.nextSibling);
    return marker;
}

function removeMentionChip(chip, direction = "backward") {
    if (!chip?.parentNode) return null;
    const marker = makeCaretSentinel();
    chip.parentNode.insertBefore(marker, direction === "backward" ? chip : chip.nextSibling);
    chip.remove();
    return marker;
}

function findPreviousContentFromSentinel(marker, editor) {
    let current = adjacentLeaf(marker, editor, "backward");
    const skipped = [];
    while (current) {
        if (isOnlyCaretSentinelText(current)) {
            skipped.push(current);
            current = adjacentLeaf(current, editor, "backward");
            continue;
        }
        return { node: current, skipped };
    }
    return { node: null, skipped };
}

function removeEmptyCaretMarker(marker) {
    if (isOnlyCaretSentinelText(marker)) marker.remove?.();
}

function placeCaretAfterPreviousContent(marker, editor) {
    const previous = findPreviousContentFromSentinel(marker, editor);
    if (previous.node?.nodeType === Node.TEXT_NODE) {
        setCaretAtNode(previous.node, previous.node.textContent.length);
        removeEmptyCaretMarker(marker);
        return true;
    }
    if (isMentionChip(previous.node)) {
        const afterMarker = getOrInsertCaretSentinel(previous.node, "after");
        setCaretAtNode(afterMarker, afterMarker.textContent.length);
        if (afterMarker !== marker) removeEmptyCaretMarker(marker);
        return true;
    }
    setCaretAtNode(marker, marker.textContent.length);
    return false;
}

function isSentinelBeforeChip(marker, editor) {
    const next = adjacentLeaf(marker, editor, "forward");
    return Boolean(findChipAcrossWhitespace(next, editor, "forward")?.chip);
}

function backspaceBeforeChip(editor, node) {
    const selection = window.getSelection?.();
    if (!selection || !selection.rangeCount || !selection.isCollapsed) return false;
    const range = selection.getRangeAt(0);
    const marker = range.startContainer;
    if (!editor.contains(marker) || !isCaretSentinelText(marker) || !isSentinelBeforeChip(marker, editor)) return false;
    if (deletePreviousVisibleCharBeforeOffset(marker, range.startOffset)) return true;
    const previous = findPreviousContentFromSentinel(marker, editor);
    if (!previous.node) {
        if (isSentinelBeforeChip(marker, editor)) setCaretAtNode(marker, marker.textContent.length);
        else if (marker.textContent === CARET_SENTINEL) marker.remove();
        closeMentionMenu(node);
        return true;
    }
    if (previous.node.nodeType === Node.TEXT_NODE) deleteLastVisibleChar(previous.node);
    else if (isMentionChip(previous.node)) previous.node.remove();
    else if (previous.node.nodeType === Node.ELEMENT_NODE && previous.node.tagName === "BR") previous.node.remove();
    else return false;
    for (const item of previous.skipped) item.remove?.();
    setCaretAtNode(marker, marker.textContent.length);
    closeMentionMenu(node);
    return true;
}

function backspaceAtLooseSentinel(editor, node) {
    const selection = window.getSelection?.();
    if (!selection || !selection.rangeCount || !selection.isCollapsed) return false;
    const range = selection.getRangeAt(0);
    const marker = range.startContainer;
    if (!editor.contains(marker) || !isCaretSentinelText(marker) || isSentinelBeforeChip(marker, editor)) return false;
    if (deletePreviousVisibleCharBeforeOffset(marker, range.startOffset)) return true;
    const previous = findPreviousContentFromSentinel(marker, editor);
    if (!previous.node || (previous.node.nodeType === Node.ELEMENT_NODE && previous.node.tagName === "BR")) return false;
    if (previous.node.nodeType === Node.TEXT_NODE) deleteLastVisibleChar(previous.node);
    else if (isMentionChip(previous.node)) previous.node.remove();
    else return false;
    for (const item of previous.skipped) item.remove?.();
    setCaretAtNode(marker, marker.textContent.length);
    closeMentionMenu(node);
    return true;
}

function deleteLineBreakNearCaret(editor, node, direction) {
    const selection = window.getSelection?.();
    if (!selection || !selection.rangeCount || !selection.isCollapsed) return false;
    const range = selection.getRangeAt(0);
    if (!editor.contains(range.startContainer)) return false;
    const scan = getDeletionScanStart(range, editor, direction);
    if (!scan) return false;
    const found = findLineBreakAcrossWhitespace(scan.start, editor, direction);
    if (!found?.breakNode) return false;
    const marker = makeCaretSentinel();
    found.breakNode.parentNode?.insertBefore(marker, found.breakNode);
    found.breakNode.remove();
    for (const item of found.skipped) item.remove?.();
    removeSpacerText(scan.spacer, scan.offset, direction);
    placeCaretAfterPreviousContent(marker, editor);
    closeMentionMenu(node);
    return true;
}

function blockNativeSentinelDeletion(editor) {
    const selection = window.getSelection?.();
    if (!selection || !selection.rangeCount || !selection.isCollapsed) return false;
    const range = selection.getRangeAt(0);
    const marker = range.startContainer;
    if (!editor.contains(marker) || !isCaretSentinelText(marker)) return false;
    if (stripCaretSentinels(marker.textContent || "") !== "") return false;
    const previous = adjacentLeaf(marker, editor, "backward");
    const next = adjacentLeaf(marker, editor, "forward");
    return Boolean(
        findChipAcrossWhitespace(previous, editor, "backward")?.chip
        || findChipAcrossWhitespace(next, editor, "forward")?.chip
    );
}

function deleteChipNearCaret(editor, node, direction) {
    const selection = window.getSelection?.();
    if (!selection || !selection.rangeCount || !selection.isCollapsed) return false;
    const range = selection.getRangeAt(0);
    const editorNode = range.startContainer;
    if (!editor.contains(editorNode)) return false;
    const directChip = editorNode.nodeType === Node.ELEMENT_NODE
        ? editorNode.closest?.(".h3-mention-chip")
        : editorNode.parentElement?.closest?.(".h3-mention-chip");
    if (directChip && editor.contains(directChip)) {
        const marker = removeMentionChip(directChip, direction);
        setCaretAtNode(marker, marker.textContent.length);
        closeMentionMenu(node);
        return true;
    }
    const scan = getDeletionScanStart(range, editor, direction);
    if (!scan) return false;
    const found = findChipAcrossWhitespace(scan.start, editor, direction);
    if (!found?.chip) return false;
    const marker = removeMentionChip(found.chip, direction);
    for (const item of found.skipped) item.remove?.();
    removeSpacerText(scan.spacer, scan.offset, direction);
    setCaretAtNode(marker, marker.textContent.length);
    closeMentionMenu(node);
    return true;
}

function insertEditorLineBreak(editor) {
    const selection = window.getSelection?.();
    if (!selection || !selection.rangeCount) return false;
    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) return false;
    range.deleteContents();
    const br = document.createElement("br");
    const marker = document.createTextNode("\u200B");
    const fragment = document.createDocumentFragment();
    fragment.append(br, marker);
    range.insertNode(fragment);
    const caret = document.createRange();
    caret.setStart(marker, marker.textContent.length);
    caret.collapse(true);
    selection.removeAllRanges();
    selection.addRange(caret);
    return true;
}

function insertPlainText(editor, text) {
    if (document.execCommand?.("insertText", false, text)) return;
    const selection = window.getSelection?.();
    if (!selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const node = document.createTextNode(text);
    range.insertNode(node);
    range.setStartAfter(node);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
}

function pastedMentionCandidates(node) {
    if (!isReferenceMode(node)) return [];
    const labels = {
        image: ["图片", "Image", "image", "Picture", "picture"],
        video: ["视频", "Video", "video"],
        audio: ["音频", "Audio", "audio"],
    };
    const candidates = [];
    const seen = new Set();
    for (const option of mentionOptions(node)) {
        const aliases = new Set();
        if (option.fullLabel) aliases.add(`@${option.fullLabel}`);
        if (option.token) aliases.add(option.token);
        for (const prefix of labels[option.type] || []) {
            aliases.add(`@${prefix}${option.ordinal}`);
            aliases.add(`@${prefix} ${option.ordinal}`);
        }
        for (const raw of aliases) {
            const value = String(raw || "");
            const key = value.toLocaleLowerCase();
            if (!value || seen.has(key)) continue;
            seen.add(key);
            candidates.push({ raw: value, option });
        }
    }
    return candidates.sort((left, right) => right.raw.length - left.raw.length);
}

function pastedOfficialMediaTagMatch(node, value, cursor) {
    if (!isReferenceMode(node)) return null;
    const match = String(value || "").slice(cursor).match(/^<\s*(picture|video|audio)\s*(\d+)\s*>/i);
    if (!match) return null;
    const type = match[1].toLowerCase() === "picture" ? "image" : match[1].toLowerCase();
    const ordinal = Number(match[2]);
    if (!Number.isFinite(ordinal) || ordinal <= 0) return null;
    const live = mentionOptions(node);
    const resolved = live.find((option) => option.type === type && Number(option.ordinal) === ordinal);
    const tag = type === "image" ? `<Picture ${ordinal}>` : type === "video" ? `<Video ${ordinal}>` : `<Audio ${ordinal}>`;
    const fallbackLabel = `${LABELS[type] || type}${ordinal}`;
    return {
        raw: match[0],
        option: resolved || {
            type,
            tag,
            token: `@${fallbackLabel}`,
            label: fallbackLabel,
            fullLabel: fallbackLabel,
            ordinal,
            referenceMode: referenceMentionMode(node),
            sourceId: null,
            sourceSlot: 0,
            previewUrl: "",
            unresolved: true,
            pending: true,
        },
    };
}

function appendPastedText(fragment, text) {
    let last = null;
    String(text || "").split("\n").forEach((part, index) => {
        if (index) {
            last = document.createElement("br");
            fragment.append(last);
        }
        if (part) {
            last = document.createTextNode(part);
            fragment.append(last);
        }
    });
    return last;
}

function insertTextWithMentionChips(node, editor, text) {
    const selection = window.getSelection?.();
    if (!selection || !selection.rangeCount || !editor.contains(selection.anchorNode)) return false;
    const range = selection.getRangeAt(0);
    const value = String(text || "");
    if (!value) return false;
    const candidates = pastedMentionCandidates(node);
    range.deleteContents();
    const fragment = document.createDocumentFragment();
    let plainStart = 0;
    let cursor = 0;
    while (cursor < value.length) {
        const match = pastedOfficialMediaTagMatch(node, value, cursor)
            || candidates.find((candidate) => value.slice(cursor, cursor + candidate.raw.length).toLocaleLowerCase() === candidate.raw.toLocaleLowerCase());
        if (!match) {
            cursor += 1;
            continue;
        }
        if (plainStart < cursor) appendPastedText(fragment, value.slice(plainStart, cursor));
        fragment.append(document.createTextNode(CARET_SENTINEL));
        fragment.append(makeMentionChip(match.option));
        fragment.append(document.createTextNode(CARET_SENTINEL));
        cursor += match.raw.length;
        plainStart = cursor;
    }
    if (plainStart < value.length) appendPastedText(fragment, value.slice(plainStart));
    const caretMarker = document.createTextNode(CARET_SENTINEL);
    fragment.append(caretMarker);
    range.insertNode(fragment);
    const caret = document.createRange();
    caret.setStart(caretMarker, caretMarker.textContent.length);
    caret.collapse(true);
    selection.removeAllRanges();
    selection.addRange(caret);
    return true;
}

function buildWriterReferenceContext(node) {
    const options = writerMentionOptions(node);
    if (!options.length) return "";
    const details = { image: "connected image", video: "connected video", audio: "connected audio" };
    const lines = ["CONNECTED REFERENCES (labels are fixed; use them exactly):"];
    for (const option of options) {
        lines.push(`${option.tag}: ${details[option.type]}${option.fullLabel ? ` (${option.fullLabel})` : ""}.`);
    }
    return lines.join("\n");
}

function buildWriterImageReferences(node) {
    return writerMentionOptions(node)
        .filter((option) => option.type === "image")
        .map((option) => {
            let filename = "";
            let subfolder = "";
            let storageType = "input";
            try {
                const url = new URL(String(option.previewUrl || ""), globalThis.location?.href || "http://127.0.0.1/");
                if (url.pathname.replace(/\/+$/, "").endsWith("/view")) {
                    filename = String(url.searchParams.get("filename") || "").trim();
                    subfolder = String(url.searchParams.get("subfolder") || "").trim();
                    storageType = String(url.searchParams.get("type") || "input").trim().toLowerCase();
                }
            } catch { /* Fall back to the source widget's filename below. */ }
            if (!filename && /\.(png|jpe?g|webp|gif|bmp)$/i.test(String(option.fullLabel || ""))) {
                filename = String(option.fullLabel).trim();
            }
            return {
                tag: option.tag,
                filename,
                subfolder,
                type: ["input", "output", "temp"].includes(storageType) ? storageType : "input",
            };
        });
}

function syncWriterIdeaFromEditor(node, markDirty = true) {
    const editor = node?.__h3WriterIdeaInput;
    if (!editor) return;
    node.properties ||= {};
    node.properties[WRITER_IDEA_PROP] = editorText(editor);
    if (markDirty) {
        node.setDirtyCanvas?.(true, true);
        app.graph?.setDirtyCanvas?.(true, true);
        app.graph?.change?.();
    }
}

function getWriterIdeaMentionRange(editor) {
    const selection = window.getSelection?.();
    if (!selection || !selection.rangeCount || !selection.isCollapsed) return null;
    const caret = selection.getRangeAt(0);
    if (!editor.contains(caret.startContainer) || caret.startContainer.nodeType !== Node.TEXT_NODE) return null;
    const units = [];
    const visit = (item) => {
        if (item.nodeType === Node.TEXT_NODE) {
            units.push({ kind: "text", node: item });
            return;
        }
        if (item.nodeType !== Node.ELEMENT_NODE) return;
        if (item.tagName === "BR") {
            units.push({ kind: "break", node: item });
            return;
        }
        for (const child of item.childNodes || []) visit(child);
    };
    visit(editor);
    const currentIndex = units.findIndex((unit) => unit.kind === "text" && unit.node === caret.startContainer);
    if (currentIndex < 0) return null;
    const selected = [];
    for (let index = currentIndex; index >= 0; index -= 1) {
        const unit = units[index];
        if (unit.kind !== "text") break;
        const end = index === currentIndex ? caret.startOffset : String(unit.node.textContent || "").length;
        selected.unshift({ unit, text: String(unit.node.textContent || "").slice(0, end) });
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

function closeWriterIdeaMentionMenu(node) {
    node?.__h3WriterIdeaMentionMenu?.element?.remove?.();
    if (node) node.__h3WriterIdeaMentionMenu = null;
}

function positionWriterIdeaMentionMenu(element, editor) {
    const selection = window.getSelection?.();
    const caret = selection?.rangeCount ? selection.getRangeAt(0).getBoundingClientRect() : null;
    const editorRect = editor.getBoundingClientRect();
    const rect = caret && (caret.width || caret.height) ? caret : editorRect;
    const width = element.offsetWidth || 280;
    const height = Math.min(320, element.offsetHeight || 140);
    let left = rect.left;
    let top = rect.bottom + 6;
    if (left + width > window.innerWidth - 8) left = window.innerWidth - width - 8;
    if (top + height > window.innerHeight - 8) top = Math.max(8, rect.top - height - 6);
    element.style.left = `${Math.max(8, Math.round(left))}px`;
    element.style.top = `${Math.max(8, Math.round(top))}px`;
}

function chooseWriterIdeaMention(node, option) {
    const state = node?.__h3WriterIdeaMentionMenu;
    const editor = node?.__h3WriterIdeaInput;
    const range = state?.mention?.range;
    if (!range || !editor) return;
    range.deleteContents();
    const fragment = document.createDocumentFragment();
    fragment.append(makeCaretSentinel(), makeMentionChip(option));
    const inserted = document.createTextNode("\u200B ");
    fragment.append(inserted);
    range.insertNode(fragment);
    const caret = document.createRange();
    caret.setStart(inserted, inserted.textContent.length);
    caret.collapse(true);
    const selection = window.getSelection?.();
    selection?.removeAllRanges();
    selection?.addRange(caret);
    closeWriterIdeaMentionMenu(node);
    syncWriterIdeaFromEditor(node);
    editor.focus();
}

function renderWriterIdeaMentionMenu(node) {
    const state = node?.__h3WriterIdeaMentionMenu;
    if (!state) return;
    state.element.textContent = "";
    const title = document.createElement("div");
    title.className = "h3-writer-idea-mention-title";
    title.textContent = ZH_BROWSER ? "引用已连接素材" : "Reference connected media";
    state.element.append(title);
    if (!state.options.length) {
        const empty = document.createElement("div");
        empty.className = "h3-writer-idea-mention-empty";
        empty.textContent = TEXT.mentionEmpty;
        state.element.append(empty);
        return;
    }
    state.options.forEach((option, index) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = `h3-writer-idea-mention-item${index === state.activeIndex ? " is-active" : ""}`;
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", index === state.activeIndex ? "true" : "false");
        const thumb = makeMentionThumb(option, true);
        const text = document.createElement("span");
        text.className = "h3-writer-idea-mention-text";
        const main = document.createElement("strong");
        main.textContent = option.token;
        const detail = document.createElement("small");
        detail.textContent = `${option.tag} · ${option.fullLabel}`;
        text.append(main, detail);
        item.append(thumb, text);
        item.addEventListener("pointermove", () => {
            if (node.__h3WriterIdeaMentionMenu?.activeIndex === index) return;
            node.__h3WriterIdeaMentionMenu.activeIndex = index;
            renderWriterIdeaMentionMenu(node);
        });
        item.addEventListener("pointerdown", (event) => {
            event.preventDefault();
            event.stopPropagation();
            chooseWriterIdeaMention(node, option);
        });
        state.element.append(item);
    });
}

function syncWriterIdeaMentionMenu(node) {
    const editor = node?.__h3WriterIdeaInput;
    const mention = editor ? getWriterIdeaMentionRange(editor) : null;
    if (!mention) {
        closeWriterIdeaMentionMenu(node);
        return false;
    }
    const query = mention.query.toLocaleLowerCase();
    const options = writerMentionOptions(node).filter((option) =>
        !query || `${option.token} ${option.tag} ${option.fullLabel}`.toLocaleLowerCase().includes(query)
    );
    let state = node.__h3WriterIdeaMentionMenu;
    if (!state) {
        const element = document.createElement("div");
        element.className = "h3-writer-idea-mention-menu";
        element.setAttribute("role", "listbox");
        applyNativeEditorTheme(element);
        document.body.append(element);
        state = node.__h3WriterIdeaMentionMenu = { element, mention, options, activeIndex: 0 };
    } else {
        state.mention = mention;
        state.options = options;
        state.activeIndex = Math.min(state.activeIndex, Math.max(0, options.length - 1));
    }
    renderWriterIdeaMentionMenu(node);
    positionWriterIdeaMentionMenu(state.element, editor);
    return true;
}

function handleWriterIdeaMentionKeydown(node, event) {
    const state = node?.__h3WriterIdeaMentionMenu;
    if (!state) return false;
    if (event.key === "Escape") {
        closeWriterIdeaMentionMenu(node);
        return true;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        if (state.options.length) {
            const delta = event.key === "ArrowDown" ? 1 : -1;
            state.activeIndex = (state.activeIndex + delta + state.options.length) % state.options.length;
            renderWriterIdeaMentionMenu(node);
        }
        return true;
    }
    if (event.key === "Enter" || event.key === "Tab") {
        const option = state.options[state.activeIndex];
        if (option) chooseWriterIdeaMention(node, option);
        return Boolean(option);
    }
    return false;
}

function setWriterStatus(node, message, kind = "info") {
    const status = node?.__h3WriterStatus;
    if (!status) return;
    status.textContent = String(message || "");
    status.dataset.kind = kind;
    status.setAttribute("role", kind === "error" ? "alert" : "status");
    status.setAttribute("aria-live", kind === "error" ? "assertive" : "polite");
}

function clearGeneratedPromptModeTracking(node) {
    node.properties ||= {};
    delete node.properties[WRITER_GENERATED_MODE_PROP];
    node.__h3EditorWrap?.classList?.remove("is-mode-stale");
    if (node.__h3WriterStatus?.dataset.kind === "warning") setWriterStatus(node, "");
}

function updateGeneratedPromptModeState(node, announce = false) {
    const generatedMode = canonicalOption("mode", node?.properties?.[WRITER_GENERATED_MODE_PROP] || "");
    const stale = Boolean(generatedMode && generatedMode !== currentMode(node));
    node?.__h3EditorWrap?.classList?.toggle("is-mode-stale", stale);
    if (stale && (announce || !node.__h3WriterStatus?.textContent || node.__h3WriterStatus?.dataset.kind === "warning")) {
        setWriterStatus(node, TEXT.stalePrompt, "warning");
    } else if (!stale && node.__h3WriterStatus?.dataset.kind === "warning") {
        setWriterStatus(node, "");
    }
    return stale;
}

function setFinalPrompt(node, value) {
    const promptWidget = getWidget(node, "prompt");
    if (!promptWidget) return;
    const text = String(value || "");
    promptWidget.value = text;
    if (promptWidget._state) promptWidget._state.value = text;
    node.properties ||= {};
    node.properties[WRITER_GENERATED_MODE_PROP] = currentMode(node);
    delete node.properties[PROMPT_DOC_PROP];
    renderEditorFromNode(node, true);
    syncPromptFromEditor(node, false);
    resetPromptHistory(node);
    node.setDirtyCanvas?.(true, true);
    app.graph?.setDirtyCanvas?.(true, true);
    app.graph?.change?.();
    updateGeneratedPromptModeState(node);
}

function placeComposerWidgetsAtEnd(node) {
    if (!Array.isArray(node?.widgets)) return;
    const composerWidgets = [node.__h3WriterDomWidget, node.__h3DomWidget].filter(Boolean);
    if (!composerWidgets.length) return;
    for (const item of composerWidgets) {
        const index = node.widgets.indexOf(item);
        if (index >= 0) node.widgets.splice(index, 1);
    }
    node.widgets.push(...composerWidgets);
    refreshVueNodeWidgets(node);
}

let promptApiSettingsCache = null;

async function loadPromptApiSettings(force = false) {
    if (promptApiSettingsCache && !force) return { ...promptApiSettingsCache };
    const response = await fetch(PROMPT_API_SETTINGS_ENDPOINT, { headers: { Accept: "application/json" } });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || `HTTP ${response.status}`);
    promptApiSettingsCache = { ...(data.settings || {}) };
    return { ...promptApiSettingsCache };
}

function promptApiField(labelText, control) {
    const row = document.createElement("label");
    row.className = "h3-api-settings-row";
    const label = document.createElement("span");
    label.textContent = labelText;
    row.append(label, control);
    return row;
}

function promptApiSwitch(labelText, checked) {
    const row = document.createElement("label");
    row.className = "h3-api-settings-switch-row";
    const label = document.createElement("span");
    label.textContent = labelText;
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = Boolean(checked);
    row.append(label, input);
    return { row, input };
}

function fillPromptModelSelect(select, models, selected) {
    const values = Array.from(new Set((models || []).map((item) => String(item || "").trim()).filter(Boolean)));
    const current = String(selected || "").trim();
    if (current && !values.includes(current)) values.unshift(current);
    select.textContent = "";
    if (!values.length) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = ZH_BROWSER ? "请先拉取模型" : "Fetch models first";
        select.append(option);
        select.disabled = true;
        return;
    }
    for (const value of values) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.append(option);
    }
    select.disabled = false;
    select.value = values.includes(current) ? current : values[0];
}

async function openPromptApiSettings(node) {
    let settings;
    try {
        settings = await loadPromptApiSettings(true);
    } catch (error) {
        window.alert(`${TEXT.writerApiSettings}：${error.message}`);
        return;
    }
    document.querySelector(".h3-api-settings-overlay")?.remove?.();
    const overlay = document.createElement("div");
    overlay.className = "h3-api-settings-overlay";
    const dialog = document.createElement("section");
    dialog.className = "h3-api-settings-dialog h3-api-settings-dialog-wide";
    const header = document.createElement("header");
    const title = document.createElement("strong");
    title.textContent = TEXT.writerApiSettings;
    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "×";
    close.className = "h3-api-settings-close";
    header.append(title, close);

    const status = document.createElement("div");
    status.className = "h3-api-settings-status";
    const providerGrid = document.createElement("div");
    providerGrid.className = "h3-api-provider-grid";
    const formatOptions = [["openai", "OpenAI 兼容"], ["responses", "OpenAI Responses"], ["gemini", "Gemini 原生"], ["ollama", "Ollama"]];

    const makeProvider = (prefix, headingText, noteText) => {
        const field = (name) => prefix ? `${prefix}_${name}` : name;
        const section = document.createElement("section");
        section.className = "h3-api-provider-card";
        const heading = document.createElement("strong");
        heading.className = "h3-api-provider-title";
        heading.textContent = headingText;
        const note = document.createElement("div");
        note.className = "h3-api-provider-note";
        note.textContent = noteText;
        const format = document.createElement("select");
        for (const [value, label] of formatOptions) {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = label;
            format.append(option);
        }
        format.value = String(settings[field("api_format")] || "openai");
        const url = document.createElement("input");
        url.type = "text";
        url.value = String(settings[field("api_url")] || "");
        url.placeholder = "https://example.com/v1";
        const key = document.createElement("input");
        key.type = "password";
        key.autocomplete = "off";
        key.value = String(settings[field("api_key")] || "");
        key.placeholder = "API Key";
        const modelLine = document.createElement("div");
        modelLine.className = "h3-api-settings-model-line";
        const fetchModels = document.createElement("button");
        fetchModels.type = "button";
        fetchModels.textContent = ZH_BROWSER ? "拉取模型" : "Fetch models";
        const model = document.createElement("select");
        fillPromptModelSelect(model, settings[field("available_models")], settings[field("model")]);
        modelLine.append(fetchModels, model);
        section.append(
            heading,
            note,
            promptApiField(ZH_BROWSER ? "API 格式" : "API format", format),
            promptApiField(ZH_BROWSER ? "API 地址" : "API URL", url),
            promptApiField("API Key", key),
            promptApiField(ZH_BROWSER ? "模型" : "Model", modelLine),
        );
        const provider = { prefix, field, section, format, url, key, model, fetchModels };
        fetchModels.addEventListener("click", async () => {
            fetchModels.disabled = true;
            fetchModels.textContent = ZH_BROWSER ? "拉取中…" : "Loading…";
            status.textContent = "";
            try {
                const response = await fetch(PROMPT_API_MODELS_ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ api_format: format.value, api_url: url.value.trim(), api_key: key.value }),
                });
                const data = await response.json();
                if (!response.ok || !data.ok || !Array.isArray(data.models)) throw new Error(data.error || `HTTP ${response.status}`);
                fillPromptModelSelect(model, data.models, model.value || settings[field("model")]);
                status.textContent = `${headingText}已拉取 ${data.models.length} 个模型`;
                status.dataset.kind = "success";
            } catch (error) {
                status.textContent = `${headingText}拉取失败：${error.message}`;
                status.dataset.kind = "error";
            } finally {
                fetchModels.disabled = false;
                fetchModels.textContent = ZH_BROWSER ? "拉取模型" : "Fetch models";
            }
        });
        return provider;
    };

    const textProvider = makeProvider("", "文本生成模型", "负责理解创意、执行南风规则并生成完整多段提示词。");
    const visionProvider = makeProvider("vision", "图片识别模型", "只负责逐张识别参考图片，再把客观分析结果交给文本模型。");
    providerGrid.append(textProvider.section, visionProvider.section);

    const readMedia = promptApiSwitch(ZH_BROWSER ? "文本模型直接读取媒体（独立识图不受此开关影响）" : "Text model reads media directly", settings.read_media);
    const autoOptimize = promptApiSwitch(ZH_BROWSER ? "运行工作流时自动优化" : "Optimize automatically on run", settings.optimize_on_run);
    const unloadOllama = promptApiSwitch(ZH_BROWSER ? "优化后卸载 Ollama 模型" : "Unload Ollama after optimization", settings.unload_ollama_after_optimize !== false);
    const actions = document.createElement("footer");
    const save = document.createElement("button");
    save.type = "button";
    save.textContent = ZH_BROWSER ? "保存" : "Save";
    save.className = "h3-api-settings-save";
    actions.append(save);
    dialog.append(header, providerGrid, status, readMedia.row, autoOptimize.row, unloadOllama.row, actions);
    overlay.append(dialog);
    document.body.append(overlay);
    const closeDialog = () => overlay.remove();
    close.addEventListener("click", closeDialog);
    overlay.addEventListener("pointerdown", (event) => { if (event.target === overlay) closeDialog(); });
    dialog.addEventListener("pointerdown", (event) => event.stopPropagation());

    save.addEventListener("click", async () => {
        if (!textProvider.url.value.trim() || !textProvider.model.value) {
            status.textContent = "请完整配置文本生成模型";
            status.dataset.kind = "error";
            return;
        }
        const visionStarted = Boolean(visionProvider.url.value.trim() || visionProvider.key.value || visionProvider.model.value);
        if (visionStarted && (!visionProvider.url.value.trim() || !visionProvider.model.value)) {
            status.textContent = "图片识别模型配置不完整；请填写地址并拉取、选择模型";
            status.dataset.kind = "error";
            return;
        }
        save.disabled = true;
        try {
            const providerPayload = (provider) => ({
                [provider.field("api_format")]: provider.format.value,
                [provider.field("api_url")]: provider.url.value.trim(),
                [provider.field("api_key")]: provider.key.value,
                [provider.field("model")]: provider.model.value,
                [provider.field("available_models")]: Array.from(provider.model.options).map((option) => option.value).filter(Boolean),
            });
            const response = await fetch(PROMPT_API_SETTINGS_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...providerPayload(textProvider),
                    ...providerPayload(visionProvider),
                    read_media: readMedia.input.checked,
                    optimize_on_run: autoOptimize.input.checked,
                    unload_ollama_after_optimize: unloadOllama.input.checked,
                }),
            });
            const data = await response.json();
            if (!response.ok || !data.ok) throw new Error(data.error || `HTTP ${response.status}`);
            promptApiSettingsCache = { ...(data.settings || {}) };
            setWriterStatus(node, "文本与识图 API 设置已保存", "success");
            closeDialog();
        } catch (error) {
            status.textContent = `保存失败：${error.message}`;
            status.dataset.kind = "error";
        } finally {
            save.disabled = false;
        }
    });
}

function v106StoryboardState(node) {
    node.properties ||= {};
    let shots = node.properties[STORYBOARDS_PROP];
    if (!Array.isArray(shots) || !shots.length) {
        shots = [String(getWidgetValue(node, "prompt", ""))];
    }
    shots = shots.slice(0, 12).map((value) => String(value || ""));
    const requestedCount = Math.max(1, Math.min(12, Number(node.properties[STORYBOARD_COUNT_PROP]) || shots.length));
    while (shots.length < requestedCount) shots.push("");
    if (shots.length > requestedCount) shots.length = requestedCount;
    const active = Math.max(0, Math.min(shots.length - 1, Number(node.properties[ACTIVE_STORYBOARD_PROP]) || 0));
    node.properties[STORYBOARDS_PROP] = shots;
    node.properties[STORYBOARD_COUNT_PROP] = shots.length;
    node.properties[ACTIVE_STORYBOARD_PROP] = active;
    return { shots, active };
}

function captureV106Storyboard(node) {
    if (!isV106(node)) return;
    syncPromptFromEditor(node, false);
    const state = v106StoryboardState(node);
    state.shots[state.active] = String(getWidgetValue(node, "prompt", ""));
    node.properties[STORYBOARDS_PROP] = state.shots;
}

function applyV106Storyboard(node, index, capture = true) {
    if (!isV106(node)) return;
    if (capture) captureV106Storyboard(node);
    const state = v106StoryboardState(node);
    const active = Math.max(0, Math.min(state.shots.length - 1, Number(index) || 0));
    node.properties[ACTIVE_STORYBOARD_PROP] = active;
    setFinalPrompt(node, state.shots[active]);
    node.__h3V106RenderStoryboards?.();
}

function resizeV106Storyboards(node, count) {
    captureV106Storyboard(node);
    const state = v106StoryboardState(node);
    const target = Math.max(1, Math.min(12, Number(count) || 1));
    while (state.shots.length < target) state.shots.push("");
    if (state.shots.length > target) state.shots.length = target;
    node.properties[STORYBOARDS_PROP] = state.shots;
    node.properties[STORYBOARD_COUNT_PROP] = target;
    node.properties[ACTIVE_STORYBOARD_PROP] = Math.min(state.active, target - 1);
    applyV106Storyboard(node, node.properties[ACTIVE_STORYBOARD_PROP], false);
}

function v106StoryboardImages(node) {
    return buildWriterImageReferences(node);
}

function v106StoryboardMode(node) {
    return currentMode(node);
}

async function pollV106StoryboardJob(jobId, node) {
    for (;;) {
        const response = await fetch(`/minimax_h3/storyboard/jobs/${encodeURIComponent(jobId)}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.error || `HTTP ${response.status}`);
        setWriterStatus(node, data.stage || "正在等待完整分镜…", "loading");
        if (data.status === "completed") return data.result;
        if (data.status === "cancelled") {
            const error = new Error("分镜生成已终止");
            error.cancelled = true;
            throw error;
        }
        if (data.status === "failed") throw new Error(data.error || "分镜任务失败");
        await new Promise((resolve) => setTimeout(resolve, 1500));
    }
}

async function generateV106Storyboards(node, idea) {
    const state = v106StoryboardState(node);
    const images = v106StoryboardImages(node);
    const response = await fetch("/minimax_h3/storyboard/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            idea,
            segment_count: state.shots.length,
            mode: v106StoryboardMode(node),
            image_references: images,
            reference_context: buildWriterReferenceContext(node),
            duration_seconds: Number(getWidgetValue(node, "seconds", 5)),
            enable_reasoning: Boolean(node.properties?.[WRITER_REASONING_PROP]),
            output_language: node.properties?.[WRITER_OUTPUT_LANGUAGE_PROP] === "en" ? "en" : "zh",
            self_contained_segments: Boolean(node.properties?.[V107_SELF_CONTAINED_SEGMENTS_PROP]),
        }),
    });
    const created = await response.json();
    if (!response.ok || !created.ok || !created.job_id) throw new Error(created.error || `HTTP ${response.status}`);
    node.__h3ActiveStoryboardJobId = created.job_id;
    if (node.__h3WriterStopButton) node.__h3WriterStopButton.disabled = false;
    const data = await pollV106StoryboardJob(created.job_id, node);
    const globalPrompt = String(data?.global || "").trim();
    const segments = Array.isArray(data?.segments) ? data.segments.map((segment) => {
        const text = String(segment || "").trim();
        return [globalPrompt ? `全局提示词：\n${globalPrompt}` : "", text].filter(Boolean).join("\n\n");
    }) : [];
    if (segments.length !== state.shots.length) throw new Error(`返回了 ${segments.length} 段，但当前要求 ${state.shots.length} 段`);
    node.properties[STORYBOARDS_PROP] = segments;
    node.properties[STORYBOARD_COUNT_PROP] = segments.length;
    node.properties[ACTIVE_STORYBOARD_PROP] = 0;
    applyV106Storyboard(node, 0, false);
    return segments.length;
}

async function cancelV106StoryboardJob(node) {
    const jobId = node?.__h3ActiveStoryboardJobId;
    if (!jobId) return;
    if (node.__h3WriterStopButton) node.__h3WriterStopButton.disabled = true;
    setWriterStatus(node, "正在断开模型的生成连接…", "loading");
    const response = await fetch(`/minimax_h3/storyboard/jobs/${encodeURIComponent(jobId)}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || `HTTP ${response.status}`);
    setWriterStatus(node, "已断开模型的生成连接，等待任务结束", "success");
}

function ensureV106StoryboardBar(node, wrap) {
    if (!isV106(node) || node.__h3V106StoryboardBar) return;
    const bar = document.createElement("div");
    bar.className = "h3-v106-storyboard-bar";
    const tabs = document.createElement("div");
    tabs.className = "h3-v106-storyboard-tabs";
    const actions = document.createElement("div");
    actions.className = "h3-v106-storyboard-actions";
    const button = (label, className = "") => {
        const value = document.createElement("button");
        value.type = "button";
        value.className = `h3-v106-storyboard-button ${className}`.trim();
        value.textContent = label;
        return value;
    };
    const add = button("＋ 添加分镜");
    const copy = button("复制分镜");
    const remove = button("删除分镜", "danger");
    const queueCurrent = button("▶ 生成当前分镜", "generate");
    const queueFollowing = button("▶ 生成当前及后续分镜", "generate wide");
    const queue = async (fromCurrentOnly) => {
        captureV106Storyboard(node);
        const state = v106StoryboardState(node);
        const original = state.active;
        const indexes = fromCurrentOnly ? [original] : state.shots.map((_, index) => index).filter((index) => index >= original);
        const jobs = indexes.filter((index) => state.shots[index].trim());
        if (!jobs.length) { window.alert("要生成的分镜提示词为空"); return; }
        queueCurrent.disabled = true;
        queueFollowing.disabled = true;
        let submitted = 0;
        try {
            for (const index of jobs) {
                applyV106Storyboard(node, index, false);
                await app.queuePrompt(0, 1);
                submitted += 1;
            }
            setWriterStatus(node, `已按顺序提交 ${submitted} 个分镜`, "success");
        } catch (error) {
            window.alert(`分镜提交失败（已提交 ${submitted}/${jobs.length}）：${error?.message || error}`);
        } finally {
            applyV106Storyboard(node, original, false);
            queueCurrent.disabled = false;
            queueFollowing.disabled = false;
        }
    };
    add.onclick = () => {
        captureV106Storyboard(node);
        const state = v106StoryboardState(node);
        if (state.shots.length >= 12) { window.alert("最多支持12段分镜"); return; }
        state.shots.push("");
        node.properties[STORYBOARDS_PROP] = state.shots;
        node.properties[STORYBOARD_COUNT_PROP] = state.shots.length;
        applyV106Storyboard(node, state.shots.length - 1, false);
    };
    copy.onclick = () => {
        captureV106Storyboard(node);
        const state = v106StoryboardState(node);
        if (state.shots.length >= 12) { window.alert("最多支持12段分镜"); return; }
        state.shots.push(String(state.shots[state.active] || ""));
        node.properties[STORYBOARDS_PROP] = state.shots;
        node.properties[STORYBOARD_COUNT_PROP] = state.shots.length;
        applyV106Storyboard(node, state.shots.length - 1, false);
    };
    remove.onclick = () => {
        captureV106Storyboard(node);
        const state = v106StoryboardState(node);
        if (state.shots.length <= 1) return;
        state.shots.splice(state.active, 1);
        node.properties[STORYBOARDS_PROP] = state.shots;
        node.properties[STORYBOARD_COUNT_PROP] = state.shots.length;
        applyV106Storyboard(node, Math.min(state.active, state.shots.length - 1), false);
    };
    queueCurrent.onclick = () => queue(true);
    queueFollowing.onclick = () => queue(false);
    actions.append(add, copy, remove, queueCurrent, queueFollowing);
    bar.append(tabs, actions);
    wrap.append(bar);
    node.__h3V106StoryboardBar = bar;
    node.__h3V106RenderStoryboards = () => {
        const state = v106StoryboardState(node);
        tabs.replaceChildren();
        state.shots.forEach((_, index) => {
            const tab = button(`分镜 ${index + 1}`, index === state.active ? "active" : "");
            tab.onclick = () => applyV106Storyboard(node, index);
            tabs.append(tab);
        });
        remove.disabled = state.shots.length <= 1;
        if (node.__h3V106CountSelect) node.__h3V106CountSelect.value = String(state.shots.length);
    };
    node.__h3V106RenderStoryboards();
}

function ensureWriterComposer(node) {
    if (node.__h3WriterPanel || typeof document === "undefined" || typeof node.addDOMWidget !== "function") return;
    node.properties ||= {};
    delete node.properties.minimax_h3_writer_model;
    if (node.properties[WRITER_IDEA_PROP] == null) node.properties[WRITER_IDEA_PROP] = "";
    if (!["zh", "en"].includes(node.properties[WRITER_OUTPUT_LANGUAGE_PROP])) node.properties[WRITER_OUTPUT_LANGUAGE_PROP] = "zh";
    node.__h3ComposerFieldKey ||= ++composerFieldSequence;

    const panel = document.createElement("section");
    panel.className = "h3-writer-composer";
    applyNativeEditorTheme(panel);
    panel.addEventListener("pointerdown", (event) => event.stopPropagation());

    const heading = document.createElement("label");
    heading.className = "h3-composer-section-label h3-composer-idea-label";
    heading.textContent = TEXT.ideaTitle;
    heading.htmlFor = `h3-writer-idea-${node.__h3ComposerFieldKey}`;

    const headingRow = document.createElement("div");
    headingRow.className = "h3-writer-heading-row";
    const collapseToggle = document.createElement("button");
    collapseToggle.type = "button";
    collapseToggle.className = "h3-writer-collapse-toggle";
    const writerCollapsed = () => Boolean(node.properties?.[WRITER_COLLAPSED_PROP]);
    const writerPanelHeight = () => writerCollapsed() ? 48 : 220;
    const refreshWriterCollapsed = () => {
        const collapsed = writerCollapsed();
        panel.classList.toggle("is-collapsed", collapsed);
        collapseToggle.textContent = collapsed ? "展开" : "折叠";
        collapseToggle.title = collapsed ? "展开 AI 创意输入" : "折叠 AI 创意输入";
        collapseToggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
    };
    headingRow.append(heading, collapseToggle);

    const idea = document.createElement("div");
    idea.className = "h3-writer-idea-input";
    idea.id = `h3-writer-idea-${node.__h3ComposerFieldKey}`;
    idea.contentEditable = "true";
    idea.tabIndex = 0;
    idea.setAttribute("role", "textbox");
    idea.setAttribute("aria-multiline", "true");
    idea.setAttribute("aria-label", TEXT.ideaTitle);
    idea.dataset.placeholder = `${TEXT.ideaHint} ${ZH_BROWSER ? "输入 @ 可引用已连接的图片、视频或音频。" : "Type @ to reference connected images, videos, or audio."}`;
    idea.spellcheck = false;
    appendWriterIdeaWithMentionChips(node, idea, String(node.properties[WRITER_IDEA_PROP] || ""));
    idea.addEventListener("beforeinput", (event) => {
        if (event.inputType === "insertText" && event.data === "@") setTimeout(() => syncWriterIdeaMentionMenu(node), 0);
    });
    idea.addEventListener("input", () => {
        syncWriterIdeaFromEditor(node);
        syncWriterIdeaMentionMenu(node);
    });
    idea.addEventListener("keyup", (event) => {
        if (!["ArrowUp", "ArrowDown", "Enter", "Escape", "Tab"].includes(event.key)) syncWriterIdeaMentionMenu(node);
        event.stopPropagation();
    });
    idea.addEventListener("keydown", (event) => {
        if (handleWriterIdeaMentionKeydown(node, event)) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        if (event.key === "Escape") closeWriterIdeaMentionMenu(node);
        event.stopPropagation();
    });
    idea.addEventListener("paste", (event) => {
        event.preventDefault();
        event.stopPropagation();
        insertPlainText(idea, event.clipboardData?.getData("text/plain") || "");
        syncWriterIdeaFromEditor(node);
        syncWriterIdeaMentionMenu(node);
    });
    idea.addEventListener("blur", () => {
        syncWriterIdeaFromEditor(node, false);
        setTimeout(() => {
            if (!node.__h3WriterIdeaMentionMenu?.element?.matches?.(":hover")) closeWriterIdeaMentionMenu(node);
        }, 160);
    });
    idea.addEventListener("wheel", (event) => event.stopPropagation(), { passive: true });

    const actions = document.createElement("div");
    actions.className = "h3-writer-actions";
    if (isV106(node)) {
        const countControl = document.createElement("label");
        countControl.className = "h3-v106-count-control";
        const countLabel = document.createElement("span");
        countLabel.textContent = "分镜段数";
        const countSelect = document.createElement("select");
        for (let count = 1; count <= 12; count += 1) {
            const option = document.createElement("option");
            option.value = String(count);
            option.textContent = `${count}段`;
            countSelect.append(option);
        }
        countSelect.value = String(v106StoryboardState(node).shots.length);
        countSelect.onchange = () => resizeV106Storyboards(node, Number(countSelect.value));
        countControl.append(countLabel, countSelect);
        actions.append(countControl);
        node.__h3V106CountSelect = countSelect;
    }
    const apiSettings = document.createElement("button");
    apiSettings.type = "button";
    apiSettings.className = "h3-writer-secondary-button";
    apiSettings.textContent = TEXT.writerApiSettings;
    apiSettings.addEventListener("click", () => openPromptApiSettings(node));
    const languageToggle = document.createElement("button");
    languageToggle.type = "button";
    languageToggle.className = "h3-writer-language-toggle h3-writer-secondary-button";
    const refreshLanguageToggle = () => {
        const language = node.properties?.[WRITER_OUTPUT_LANGUAGE_PROP] === "en" ? "en" : "zh";
        languageToggle.textContent = language === "zh" ? "中文" : "English";
        languageToggle.dataset.language = language;
        languageToggle.setAttribute("aria-label", language === "zh"
            ? (ZH_BROWSER ? "提示词返回语言：中文；点击切换为英文" : "Prompt output language: Chinese; click for English")
            : (ZH_BROWSER ? "提示词返回语言：英文；点击切换为中文" : "Prompt output language: English; click for Chinese"));
        languageToggle.title = languageToggle.getAttribute("aria-label");
    };
    refreshLanguageToggle();
    languageToggle.addEventListener("click", () => {
        node.properties ||= {};
        node.properties[WRITER_OUTPUT_LANGUAGE_PROP] = node.properties[WRITER_OUTPUT_LANGUAGE_PROP] === "en" ? "zh" : "en";
        refreshLanguageToggle();
        setWriterStatus(node, TEXT.writerLanguageChanged, "warning");
        node.setDirtyCanvas?.(true, true);
        app.graph?.setDirtyCanvas?.(true, true);
    });
    const reasoningToggle = document.createElement("button");
    reasoningToggle.type = "button";
    reasoningToggle.className = "h3-writer-reasoning-toggle h3-writer-secondary-button";
    const refreshReasoningToggle = () => {
        const enabled = Boolean(node.properties?.[WRITER_REASONING_PROP]);
        reasoningToggle.textContent = enabled ? "思考：开" : "思考：关";
        reasoningToggle.dataset.enabled = enabled ? "true" : "false";
        reasoningToggle.title = enabled
            ? "已允许模型使用思考模式；点击关闭"
            : "已关闭模型思考模式；点击开启";
        reasoningToggle.setAttribute("aria-pressed", enabled ? "true" : "false");
    };
    refreshReasoningToggle();
    reasoningToggle.addEventListener("click", () => {
        node.properties ||= {};
        node.properties[WRITER_REASONING_PROP] = !Boolean(node.properties[WRITER_REASONING_PROP]);
        refreshReasoningToggle();
        setWriterStatus(node, node.properties[WRITER_REASONING_PROP] ? "思考模式已开启" : "思考模式已关闭", "success");
        node.setDirtyCanvas?.(true, true);
        app.graph?.setDirtyCanvas?.(true, true);
        app.graph?.change?.();
    });
    const generate = document.createElement("button");
    generate.type = "button";
    generate.className = "h3-writer-generate-button";
    generate.textContent = isV106(node) ? "生成分镜" : TEXT.generatePrompt;
    generate.addEventListener("click", async () => {
        const userPrompt = editorText(idea).trim();
        if (!userPrompt) {
            setWriterStatus(node, TEXT.writerIdeaRequired, "error");
            idea.focus();
            return;
        }
        const promptMode = writerPromptMode(node);
        const imageReferences = buildWriterImageReferences(node);
        generate.disabled = true;
        generate.textContent = imageReferences.length ? TEXT.analyzingImages : TEXT.generatingPrompt;
        setWriterStatus(node, imageReferences.length ? TEXT.analyzingImages : TEXT.generatingPrompt, "loading");
        try {
            if (isV106(node)) {
                const count = await generateV106Storyboards(node, userPrompt);
                setWriterStatus(node, `已按南风完整规则生成并填入 ${count} 段分镜`, "success");
                return;
            }
            const response = await fetch("/minimax_h3/prompt_writer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt_mode: promptMode,
                    user_prompt: userPrompt,
                    duration_seconds: Number(getWidget(node, "seconds")?.value || 5),
                    reference_context: buildWriterReferenceContext(node),
                    image_references: imageReferences,
                    output_language: node.properties?.[WRITER_OUTPUT_LANGUAGE_PROP] === "en" ? "en" : "zh",
                }),
            });
            const data = await response.json();
            if (!response.ok || data.error || !String(data.prompt || "").trim()) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }
            setFinalPrompt(node, data.prompt);
            setWriterStatus(node, Number(data.vision_count || 0) > 0 ? TEXT.generatedWithVision : TEXT.generatedPrompt, "success");
        } catch (error) {
            if (error?.cancelled) setWriterStatus(node, "分镜生成已终止", "success");
            else setWriterStatus(node, `${ZH_BROWSER ? "生成失败" : "Generation failed"}：${error.message}`, "error");
        } finally {
            node.__h3ActiveStoryboardJobId = null;
            if (node.__h3WriterStopButton) node.__h3WriterStopButton.disabled = true;
            generate.disabled = false;
            generate.textContent = isV106(node) ? "生成分镜" : TEXT.generatePrompt;
        }
    });
    const stop = document.createElement("button");
    stop.type = "button";
    stop.className = "h3-writer-stop-button";
    stop.textContent = "终止生成";
    stop.disabled = true;
    stop.title = "关闭正在进行的模型 HTTP 流，停止继续输出";
    stop.addEventListener("click", async () => {
        try {
            await cancelV106StoryboardJob(node);
        } catch (error) {
            setWriterStatus(node, `终止失败：${error.message}`, "error");
            if (node.__h3ActiveStoryboardJobId) stop.disabled = false;
        }
    });
    actions.append(apiSettings, languageToggle, reasoningToggle, generate, stop);

    const status = document.createElement("div");
    status.className = "h3-writer-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    panel.append(headingRow, idea, actions, status);

    node.__h3WriterPanel = panel;
    node.__h3WriterIdeaInput = idea;
    node.__h3WriterApiSettingsButton = apiSettings;
    node.__h3WriterLanguageToggle = languageToggle;
    node.__h3WriterReasoningToggle = reasoningToggle;
    node.__h3WriterGenerateButton = generate;
    node.__h3WriterStopButton = stop;
    node.__h3WriterStatus = status;
    const domWidget = node.addDOMWidget("h3_writer_composer", "h3_writer_composer", panel, {
        getValue: () => String(node.properties?.[WRITER_IDEA_PROP] || ""),
        setValue: (value) => {
            node.properties ||= {};
            node.properties[WRITER_IDEA_PROP] = String(value || "");
            idea.textContent = "";
            appendWriterIdeaWithMentionChips(node, idea, node.properties[WRITER_IDEA_PROP]);
        },
        margin: 10,
        serialize: false,
        getMinHeight: writerPanelHeight,
        getMaxHeight: writerPanelHeight,
        getHeight: writerPanelHeight,
        afterResize: () => applyNativeEditorTheme(panel),
        onDraw: () => applyNativeEditorTheme(panel),
    });
    if (!domWidget) {
        panel.remove();
        node.__h3WriterPanel = null;
        return;
    }
    domWidget.serialize = false;
    setWidgetOption(domWidget, "serialize", false);
    setWidgetOption(domWidget, "canvasOnly", false);
    domWidget.computeSize = () => [Math.max(220, Number(node.size?.[0]) || 0), writerPanelHeight()];
    domWidget.computedHeight = writerPanelHeight();
    node.__h3WriterDomWidget = domWidget;
    collapseToggle.addEventListener("click", () => {
        syncWriterIdeaFromEditor(node, false);
        const wasCollapsed = writerCollapsed();
        node.properties[WRITER_COLLAPSED_PROP] = !wasCollapsed;
        refreshWriterCollapsed();
        domWidget.computedHeight = writerPanelHeight();
        if (domWidget._state) domWidget._state.computedHeight = domWidget.computedHeight;
        adjustNodeHeight(node, wasCollapsed ? 172 : -172);
        repairNodeLayout(node);
        node.setDirtyCanvas?.(true, true);
        app.graph?.setDirtyCanvas?.(true, true);
        app.graph?.change?.();
    });
    refreshWriterCollapsed();
    placeComposerWidgetsAtEnd(node);
    const writerMinHeight = isV106(node) ? (writerCollapsed() ? 858 : 1030) : 730;
    node.size = [Math.max(520, Number(node.size?.[0]) || 0), Math.max(writerMinHeight, Number(node.size?.[1]) || 0)];
    updateGeneratedPromptModeState(node);
    repairNodeLayout(node);
}

function syncWriterComposerState(node) {
    if (!node?.__h3WriterPanel) return;
    const idea = String(node.properties?.[WRITER_IDEA_PROP] || "");
    if (document.activeElement !== node.__h3WriterIdeaInput && editorText(node.__h3WriterIdeaInput) !== idea) {
        node.__h3WriterIdeaInput.textContent = "";
        appendWriterIdeaWithMentionChips(node, node.__h3WriterIdeaInput, idea);
    }
}

function ensurePromptEditor(node) {
    if (node.__h3Editor) {
        preparePromptEditorForUndo(node.__h3Editor);
        ensureWriterComposer(node);
        placeComposerWidgetsAtEnd(node);
        return;
    }
    if (typeof document === "undefined" || typeof node.addDOMWidget !== "function") return;
    ensurePromptUndoRedoShield();
    patchLiteGraphPromptProcessKey();
    const widget = getWidget(node, "prompt");
    if (!widget) return;
    hideOriginalPromptWidget(widget);
    const wrap = document.createElement("div");
    wrap.className = "h3-prompt-editor-wrap";
    wrap.style.minHeight = "0px";
    applyNativeEditorTheme(wrap);
    node.__h3ComposerFieldKey ||= ++composerFieldSequence;
    const finalHeading = document.createElement("label");
    finalHeading.className = "h3-composer-section-label h3-composer-final-label";
    finalHeading.textContent = TEXT.finalPromptTitle;
    finalHeading.htmlFor = `h3-final-prompt-${node.__h3ComposerFieldKey}`;
    const finalHint = document.createElement("div");
    finalHint.className = "h3-composer-section-hint";
    finalHint.textContent = TEXT.finalPromptHint;
    const editor = document.createElement("div");
    editor.className = "comfy-multiline-input h3-prompt-editor";
    editor.id = `h3-final-prompt-${node.__h3ComposerFieldKey}`;
    editor.contentEditable = "true";
    preparePromptEditorForUndo(editor);
    editor.__h3PromptNode = node;
    editor.tabIndex = 0;
    editor.setAttribute("role", "textbox");
    editor.setAttribute("aria-label", TEXT.finalPromptTitle);
    editor.dataset.placeholder = isReferenceMode(node) ? TEXT.referencePromptPlaceholder : TEXT.promptPlaceholder;
    editor.spellcheck = false;
    editor.addEventListener("beforeinput", (event) => {
        if (isReferenceMode(node) && event.data === "@") setTimeout(() => syncMentionMenuToCaret(node, editor), 0);
    });
    editor.addEventListener("input", (event) => {
        clearGeneratedPromptModeTracking(node);
        syncPromptFromEditor(node);
        if (event?.isComposing || event?.inputType === "insertCompositionText" || node.__h3PromptComposing) {
            syncMentionMenuToCaret(node, editor);
            return;
        }
        pushPromptHistory(node);
        syncMentionMenuToCaret(node, editor);
    });
    editor.addEventListener("compositionstart", () => {
        node.__h3PromptComposing = true;
    });
    editor.addEventListener("compositionend", () => {
        node.__h3PromptComposing = false;
        syncPromptFromEditor(node);
        pushPromptHistory(node);
    });
    editor.addEventListener("focus", () => {
        activePromptNode = node;
        applyNativeEditorTheme(wrap);
        // Focusing the editor must not open the picker by itself. It should only
        // appear when the caret is actually inside a freshly typed @ query.
        syncMentionMenuToCaret(node, editor);
    });
    editor.addEventListener("pointerdown", () => {
        activePromptNode = node;
    }, true);
    editor.addEventListener("keyup", (event) => {
        if (!isReferenceMode(node) || ["ArrowUp", "ArrowDown", "Enter", "Escape", "Tab"].includes(event.key)) return;
        syncMentionMenuToCaret(node, editor);
        event.stopPropagation();
    });
    editor.addEventListener("keydown", (event) => {
        if (isPromptUndoRedoEvent(event)) {
            handlePromptHistoryKeydown(node, event);
        }
    }, true);
    editor.addEventListener("keydown", (event) => {
        if (handleMentionMenuKeydown(node, event)) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        if (event.key === "Backspace" && (
            deleteLineBreakNearCaret(editor, node, "backward")
            || deleteChipNearCaret(editor, node, "backward")
            || backspaceBeforeChip(editor, node)
            || backspaceAtLooseSentinel(editor, node)
            || blockNativeSentinelDeletion(editor)
        )) {
            event.preventDefault();
            syncPromptFromEditor(node);
            pushPromptHistory(node);
        } else if (event.key === "Delete" && deleteChipNearCaret(editor, node, "forward")) {
            event.preventDefault();
            syncPromptFromEditor(node);
            pushPromptHistory(node);
        } else if (event.key === "Enter" && insertEditorLineBreak(editor)) {
            event.preventDefault();
            closeMentionMenu(node);
            syncPromptFromEditor(node);
            pushPromptHistory(node);
        } else if (event.key === "Escape") {
            closeMentionMenu(node);
        }
        event.stopPropagation();
    });
    editor.addEventListener("paste", (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
        insertTextWithMentionChips(node, editor, event.clipboardData?.getData("text/plain") || "");
        syncPromptFromEditor(node);
        pushPromptHistory(node);
        syncMentionMenuToCaret(node, editor);
    });
    editor.addEventListener("blur", () => {
        syncPromptFromEditor(node);
        setTimeout(() => {
            if (!node.__h3MentionMenu?.element?.matches?.(":hover")) closeMentionMenu(node);
        }, 160);
    });
    wrap.addEventListener("pointerdown", (event) => {
        event.stopPropagation();
        if (!event.target?.closest?.(".h3-mention-chip")) closeMentionMenu(node);
    });
    const wheelHandler = (event) => {
        const editorFocused = document.activeElement === editor;
        const horizontal = Math.abs(event.deltaX || 0) > Math.abs(event.deltaY || 0);
        const maxScrollTop = Math.max(0, editor.scrollHeight - editor.clientHeight);
        const lineHeight = parseFloat(getComputedStyle(editor).lineHeight) || 16;
        const deltaY = event.deltaMode === 1
            ? event.deltaY * lineHeight
            : event.deltaMode === 2
                ? event.deltaY * editor.clientHeight
                : event.deltaY;
        if (!editorFocused) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation?.();
            app.canvas?.processMouseWheel?.(event);
            return;
        }
        if (!event.ctrlKey && !horizontal && maxScrollTop > 0 && deltaY) {
            const next = Math.max(0, Math.min(maxScrollTop, editor.scrollTop + deltaY));
            if (next !== editor.scrollTop) {
                editor.scrollTop = next;
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation?.();
                return;
            }
        }
        if (!event.ctrlKey && !horizontal && maxScrollTop > 0) {
            event.stopPropagation();
            event.stopImmediatePropagation?.();
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
        app.canvas?.processMouseWheel?.(event);
    };
    editor.addEventListener("wheel", wheelHandler, { passive: false, capture: true });
    wrap.addEventListener("wheel", wheelHandler, { passive: false });
    wrap.append(finalHeading, finalHint, editor);
    ensureV106StoryboardBar(node, wrap);
    node.__h3Editor = editor;
    node.__h3EditorWrap = wrap;
    renderEditorFromNode(node);
    resetPromptHistory(node);
    const domWidget = node.addDOMWidget("h3_prompt_mentions", "h3_prompt_mentions", wrap, {
        getValue: () => String(getWidget(node, "prompt")?.value || ""),
        setValue: (value) => {
            const promptWidget = getWidget(node, "prompt");
            if (promptWidget) promptWidget.value = String(value || "");
            renderEditorFromNode(node);
        },
        margin: 10,
        serialize: false,
        getMinHeight: () => isV106(node) ? 390 : 260,
        afterResize: () => {
            applyNativeEditorTheme(wrap);
            node._widgetSlotsDirty = true;
            node.setDirtyCanvas?.(true, true);
        },
        onDraw: () => applyNativeEditorTheme(wrap),
    });
    if (!domWidget) {
        restoreOriginalPromptWidget(widget);
        wrap.remove();
        node.__h3Editor = null;
        node.__h3EditorWrap = null;
        return;
    }
    node.__h3DomWidget = domWidget;
    domWidget.serialize = false;
    setWidgetOption(domWidget, "serialize", false);
    setWidgetOption(domWidget, "canvasOnly", false);
    domWidget.__h3EditorType = domWidget.type;
    domWidget.__h3EditorComputeSize = domWidget.computeSize;
    ensureWriterComposer(node);
    placeComposerWidgetsAtEnd(node);
    syncEditorMode(node);
    repairNodeLayout(node);
}

function installPromptEditorSoon(node) {
    if (!node || node.__h3PromptInstallPending || node.__h3Editor) return;
    node.__h3PromptInstallPending = true;
    const run = () => {
        node.__h3PromptInstallPending = false;
        ensurePromptEditor(node);
        if (!node.__h3Editor && !node.__h3PromptInstallRetry) {
            node.__h3PromptInstallRetry = setTimeout(() => {
                node.__h3PromptInstallRetry = null;
                ensurePromptEditor(node);
            }, 120);
        }
    };
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(run);
    else setTimeout(run, 0);
}

function updatePromptEditor(node) {
    if (!node.__h3Editor) {
        installPromptEditorSoon(node);
        return;
    }
    const editor = node.__h3Editor;
    if (!editor) return;
    preparePromptEditorForUndo(editor);
    syncEditorMode(node);
}

function pruneTransportInputs(nodeData) {
    const optional = nodeData?.input?.optional;
    if (!optional) return;
    for (const name of Object.keys(optional)) {
        if (/^media_\d+$/.test(name) || /^media_type_\d+$/.test(name)) delete optional[name];
    }
}

function setConfiguredWidgetValue(node, name, value) {
    const widget = getWidget(node, name);
    if (!widget || value === undefined) return;
    widget.value = value;
    if (widget._state) widget._state.value = value;
}

function repairConfiguredWidgetValues(node, info) {
    const raw = Array.isArray(info?.widgets_values) ? [...info.widgets_values] : [];
    if (!raw.length) return;

    const defaults = {
        mode: MODE_T2VA,
        prompt: "",
        resolution: "480P",
        aspect_ratio: "16:9",
        width: 1344,
        height: 768,
        seconds: 5,
        advanced: false,
        fps: 24,
        keyframe_role: KEYFRAME_FIRST,
        ref_image_size: REF_IMAGE_1K,
                reference_mention_mode: "index",
    };
    const names = Object.keys(defaults);
    const values = raw;
    const resolutionAt = canonicalOption("resolution", values[2]);
    const nextResolution = canonicalOption("resolution", values[3]);
    const hasResolution = Object.prototype.hasOwnProperty.call(OPTION_DEFS.resolution, resolutionAt);
    const hasShiftedResolution = Object.prototype.hasOwnProperty.call(OPTION_DEFS.resolution, nextResolution);
    if (!hasResolution && hasShiftedResolution) values.splice(2, 1);

    const normalized = {
        mode: Object.prototype.hasOwnProperty.call(OPTION_DEFS.mode, canonicalOption("mode", values[0]))
            ? canonicalOption("mode", values[0]) : defaults.mode,
        prompt: typeof values[1] === "string" ? values[1] : defaults.prompt,
        resolution: Object.prototype.hasOwnProperty.call(OPTION_DEFS.resolution, canonicalOption("resolution", values[2]))
            ? canonicalOption("resolution", values[2]) : defaults.resolution,
        aspect_ratio: Object.prototype.hasOwnProperty.call(OPTION_DEFS.aspect_ratio, canonicalOption("aspect_ratio", values[3]))
            ? canonicalOption("aspect_ratio", values[3]) : defaults.aspect_ratio,
        width: Number.isFinite(Number(values[4])) ? Number(values[4]) : defaults.width,
        height: Number.isFinite(Number(values[5])) ? Number(values[5]) : defaults.height,
        seconds: Number.isFinite(Number(values[6]))
            ? Math.min(MAX_SECONDS, Math.max(MIN_SECONDS, Number(values[6])))
            : defaults.seconds,
        advanced: asBoolean(values[7], defaults.advanced),
        fps: Number.isFinite(Number(values[8])) ? Number(values[8]) : defaults.fps,
        keyframe_role: Object.prototype.hasOwnProperty.call(OPTION_DEFS.keyframe_role, canonicalOption("keyframe_role", values[9]))
            ? canonicalOption("keyframe_role", values[9]) : defaults.keyframe_role,
        ref_image_size: Object.prototype.hasOwnProperty.call(OPTION_DEFS.ref_image_size, canonicalOption("ref_image_size", values[10]))
            ? canonicalOption("ref_image_size", values[10]) : defaults.ref_image_size,
        reference_mention_mode: Object.prototype.hasOwnProperty.call(OPTION_DEFS.reference_mention_mode, canonicalOption("reference_mention_mode", values[11]))
            ? canonicalOption("reference_mention_mode", values[11]) : defaults.reference_mention_mode,
    };
    for (const name of names) setConfiguredWidgetValue(node, name, normalized[name]);
    info.widgets_values = names.map((name) => normalized[name]);
}

function installNode(nodeType, nodeData) {
    if (!NODE_CLASSES.has(nodeData?.name)) return;
    if (nodeType.prototype.__h3EasyNodeInstalled) return;
    nodeType.prototype.__h3EasyNodeInstalled = true;
    pruneTransportInputs(nodeData);
    const originalCreated = nodeType.prototype.onNodeCreated;
    nodeType.prototype.onNodeCreated = function onNodeCreatedH3Easy() {
        const result = originalCreated?.apply(this, arguments);
        this.properties ||= {};
        ensureLinks(this);
        normalizeLinks(this);
        localizeNodeInstance(this);
        syncModeWidgets(this);
        patchCanvas();
        installQuickCreateCapture(app.canvas);
        installPromptEditorSoon(this);
        const modeWidget = getWidget(this, "mode");
        if (modeWidget) {
            const originalCallback = modeWidget.callback;
            modeWidget.callback = (value) => {
                originalCallback?.call(modeWidget, value);
                pruneLinksForMode(this);
                syncModeWidgets(this);
                syncEditorMode(this);
                renderEditorFromNode(this);
                updateGeneratedPromptModeState(this, true);
                requestMentionPreviewRefresh();
                repairNodeLayout(this);
                this.setDirtyCanvas?.(true, true);
            };
        }
        const resolutionWidget = getWidget(this, "resolution");
        if (resolutionWidget && !resolutionWidget.__h3ConditionalCallbackBound) {
            resolutionWidget.__h3ConditionalCallbackBound = true;
            const originalCallback = resolutionWidget.callback;
            resolutionWidget.callback = (value) => {
                originalCallback?.call(resolutionWidget, value);
                syncModeWidgets(this);
                repairNodeLayout(this);
                this.setDirtyCanvas?.(true, true);
            };
        }
        const advancedWidget = getWidget(this, "advanced");
        if (advancedWidget && !advancedWidget.__h3ConditionalCallbackBound) {
            advancedWidget.__h3ConditionalCallbackBound = true;
            const originalCallback = advancedWidget.callback;
            advancedWidget.callback = (value) => {
                originalCallback?.call(advancedWidget, value);
                syncModeWidgets(this);
                repairNodeLayout(this);
                this.setDirtyCanvas?.(true, true);
            };
        }
        const referenceMentionWidget = getWidget(this, "reference_mention_mode");
        if (referenceMentionWidget && !referenceMentionWidget.__h3ConditionalCallbackBound) {
            referenceMentionWidget.__h3ConditionalCallbackBound = true;
            const originalCallback = referenceMentionWidget.callback;
            referenceMentionWidget.callback = (value) => {
                originalCallback?.call(referenceMentionWidget, value);
                syncModeWidgets(this);
                renderEditorFromNode(this);
                requestMentionPreviewRefresh();
                repairNodeLayout(this);
                this.setDirtyCanvas?.(true, true);
            };
        }
        return result;
    };

    const originalConfigure = nodeType.prototype.onConfigure;
    nodeType.prototype.onConfigure = function onConfigureH3Easy(info) {
        const result = originalConfigure?.apply(this, arguments);
        if (info?.properties?.[PROMPT_DOC_PROP]) {
            this.properties ||= {};
            this.properties[PROMPT_DOC_PROP] = info.properties[PROMPT_DOC_PROP];
        }
        repairConfiguredWidgetValues(this, info);
        normalizeLinks(this);
        localizeNodeInstance(this);
        syncModeWidgets(this);
        renderEditorFromNode(this);
        resetPromptHistory(this);
        syncEditorMode(this);
        requestMentionPreviewRefresh();
        installPromptEditorSoon(this);
        syncWriterComposerState(this);
        repairNodeLayout(this);
        const mediaInputIndex = getMediaInputIndex(this);
        if (mediaInputIndex >= 0 && this.inputs?.[mediaInputIndex]?.link != null) {
            scheduleNativeMediaConnectionConversion(this, mediaInputIndex);
        }
        return result;
    };

    const originalConnectionsChange = nodeType.prototype.onConnectionsChange;
    nodeType.prototype.onConnectionsChange = function onConnectionsChangeH3Easy(type, index, connected, linkInfo) {
        const result = originalConnectionsChange?.apply(this, arguments);
        const inputIndex = Number(index);
        const input = this.inputs?.[Number.isFinite(inputIndex) ? inputIndex : -1];
        if (connected && !this.__h3VirtualWireClearing && String(input?.name || "") === "media") {
            scheduleNativeMediaConnectionConversion(this, inputIndex, linkInfo);
        }
        return result;
    };

    const originalSerialize = nodeType.prototype.onSerialize;
    nodeType.prototype.onSerialize = function onSerializeH3Easy(info) {
        if (this.__h3Editor) syncPromptFromEditor(this, false);
        const result = originalSerialize?.apply(this, arguments);
        if (info && this.properties?.[PROMPT_DOC_PROP]) {
            info.properties ||= {};
            info.properties[PROMPT_DOC_PROP] = this.properties[PROMPT_DOC_PROP];
        }
        return result;
    };

    const originalDraw = nodeType.prototype.onDrawForeground;
    nodeType.prototype.onDrawForeground = function onDrawForegroundH3Easy(ctx) {
        const result = originalDraw?.apply(this, arguments);
        normalizeLinks(this);
        syncModeWidgets(this);
        updatePromptEditor(this);
        return result;
    };

    const originalRemoved = nodeType.prototype.onRemoved;
    nodeType.prototype.onRemoved = function onRemovedH3Easy() {
        closeMentionMenu(this);
        closeWriterIdeaMentionMenu(this);
        if (this.__h3PromptInstallRetry) clearTimeout(this.__h3PromptInstallRetry);
        this.__h3PromptInstallRetry = null;
        this.__h3PromptInstallPending = false;
        this.__h3EditorWrap?.remove?.();
        this.__h3WriterPanel?.remove?.();
        this.__h3Editor = null;
        this.__h3EditorWrap = null;
        this.__h3DomWidget = null;
        this.__h3WriterPanel = null;
        this.__h3WriterDomWidget = null;
        this.__h3WriterIdeaInput = null;
        this.__h3WriterApiSettingsButton = null;
        this.__h3WriterStatus = null;
        return originalRemoved?.apply(this, arguments);
    };
}

function installLoaderNode(nodeType, nodeData) {
    if (nodeData?.name !== LOADER_CLASS) return;
    if (nodeType.prototype.__h3EasyLoaderInstalled) return;
    nodeType.prototype.__h3EasyLoaderInstalled = true;
    const originalCreated = nodeType.prototype.onNodeCreated;
    nodeType.prototype.onNodeCreated = function onNodeCreatedH3Loader() {
        const result = originalCreated?.apply(this, arguments);
        localizeNodeInstance(this);
        return result;
    };
    const originalConfigure = nodeType.prototype.onConfigure;
    nodeType.prototype.onConfigure = function onConfigureH3Loader(info) {
        const result = originalConfigure?.apply(this, arguments);
        localizeNodeInstance(this);
        return result;
    };
}

function installOutputNode(nodeType, nodeData) {
    if (nodeData?.name !== OUTPUT_CLASS) return;
    if (nodeType.prototype.__h3EasyOutputInstalled) return;
    nodeType.prototype.__h3EasyOutputInstalled = true;
    const originalCreated = nodeType.prototype.onNodeCreated;
    nodeType.prototype.onNodeCreated = function onNodeCreatedH3Output() {
        const result = originalCreated?.apply(this, arguments);
        localizeNodeInstance(this);
        return result;
    };
    const originalConfigure = nodeType.prototype.onConfigure;
    nodeType.prototype.onConfigure = function onConfigureH3Output(info) {
        const result = originalConfigure?.apply(this, arguments);
        localizeNodeInstance(this);
        return result;
    };
}

function install() {
    if (installed) return;
    installed = true;
    patchCanvas();
    patchGraphToPrompt();
    patchEditorKeyHandling();
    installNativeThemeWatcher();
    for (const delay of [0, 100, 500, 1200]) setTimeout(() => patchCanvas(), delay);
    setTimeout(() => installQuickCreateCapture(app.canvas), 0);
    setTimeout(() => installQuickCreateCapture(app.canvas), 250);
    document.addEventListener("pointerdown", (event) => {
        for (const node of app.graph?._nodes || []) {
            const state = node?.__h3MentionMenu;
            if (!state) continue;
            if (state.element?.contains?.(event.target) || node.__h3EditorWrap?.contains?.(event.target)) continue;
            closeMentionMenu(node);
        }
    }, true);
    const refreshForMediaWidget = (event) => {
        const target = event?.target;
        if (!target || target.closest?.(".h3-prompt-editor")) return;
        if (!target.matches?.("input, select, textarea, video, audio")) return;
        requestMentionPreviewRefresh();
    };
    document.addEventListener("change", refreshForMediaWidget, true);
    document.addEventListener("input", refreshForMediaWidget, true);
    const style = document.createElement("style");
    style.textContent = `
      .h3-writer-composer {
        display: flex; flex-direction: column; gap: 8px; width: 100%; height: 220px; min-width: 0; min-height: 220px; max-height: 220px;
        box-sizing: border-box; padding: 10px; overflow: hidden; border: 1px solid rgba(246,190,66,.72); border-radius: 8px;
        background: linear-gradient(180deg, rgba(246,190,66,.12), rgba(246,190,66,.045)); color: var(--h3-native-widget-text, #ddd);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .h3-composer-section-label { font-size: 13px; font-weight: 700; line-height: 1.3; letter-spacing: .01em; }
      .h3-composer-idea-label { color: #ffd06a; }
      .h3-writer-heading-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 27px; }
      .h3-writer-collapse-toggle { min-width: 54px; min-height: 26px; padding: 3px 10px; border: 1px solid rgba(246,190,66,.5); border-radius: 14px; background: rgba(246,190,66,.1); color: #ffd77e; cursor: pointer; font-size: 11px; font-weight: 700; }
      .h3-writer-collapse-toggle:hover { border-color: rgba(246,190,66,.9); background: rgba(246,190,66,.2); }
      .h3-writer-composer.is-collapsed { height: 48px; min-height: 48px; max-height: 48px; padding-top: 9px; padding-bottom: 9px; }
      .h3-writer-composer.is-collapsed > .h3-writer-idea-input,
      .h3-writer-composer.is-collapsed > .h3-writer-actions,
      .h3-writer-composer.is-collapsed > .h3-writer-status { display: none; }
      .h3-composer-final-label { color: #a8ed59; }
      .h3-composer-section-hint { margin-top: -3px; color: var(--h3-native-widget-muted, rgba(255,255,255,.52)); font-size: 11px; line-height: 1.35; }
      .h3-writer-controls { display: grid; grid-template-columns: minmax(0,1fr) minmax(145px,.72fr); gap: 8px; }
      .h3-writer-control { display: flex; flex-direction: column; gap: 3px; min-width: 0; color: var(--h3-native-widget-muted, rgba(255,255,255,.62)); font-size: 10px; }
      .h3-writer-control input, .h3-writer-model-display {
        width: 100%; min-width: 0; height: 28px; box-sizing: border-box; padding: 3px 7px; border: 1px solid var(--h3-native-widget-outline, rgba(255,255,255,.18));
        border-radius: 6px; outline: none; background: var(--h3-native-widget-bg, #222); color: var(--h3-native-widget-text, #ddd); font-size: 11px;
      }
      .h3-writer-control input:focus { border-color: rgba(246,190,66,.92); box-shadow: 0 0 0 1px rgba(246,190,66,.32); }
      .h3-writer-control input::placeholder { color: var(--h3-native-widget-muted, rgba(255,255,255,.38)); }
      .h3-writer-model-display { display: flex; align-items: center; font-weight: 650; cursor: default; user-select: none; }
      .h3-writer-idea-input {
        flex: 0 0 78.75px; width: 100%; height: 78.75px; min-width: 0; min-height: 78.75px; max-height: 78.75px; box-sizing: border-box; padding: 8px 9px; resize: none; overflow: auto;
        border: 1px solid rgba(246,190,66,.42); border-radius: 6px; outline: none; background: var(--h3-native-widget-bg, #222);
        color: var(--h3-native-widget-text, #ddd); caret-color: var(--h3-native-widget-text, #ddd); font-family: Consolas, "Courier New", monospace;
        font-size: var(--h3-native-widget-text-size, 12px); line-height: 1.4; white-space: pre-wrap; overflow-wrap: anywhere; cursor: text;
      }
      .h3-writer-idea-input:focus { border-color: rgba(246,190,66,.95); box-shadow: 0 0 0 1px rgba(246,190,66,.25); }
      .h3-writer-idea-input:empty::before { content: attr(data-placeholder); color: var(--h3-native-widget-muted, rgba(255,255,255,.38)); pointer-events: none; }
      .h3-writer-idea-mention-menu {
        position: fixed; z-index: 10090; width: 280px; max-height: 320px; overflow: auto; padding: 5px;
        border: 1px solid var(--h3-native-widget-outline, rgba(255,255,255,.18)); border-radius: 8px;
        background: var(--h3-native-menu-bg, rgba(28,28,28,.98)); box-shadow: 0 16px 38px rgba(0,0,0,.42);
        color: var(--h3-native-widget-text, rgba(255,255,255,.94)); font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .h3-writer-idea-mention-title, .h3-writer-idea-mention-empty { padding: 7px 8px; color: var(--h3-native-widget-muted, rgba(255,255,255,.62)); font-size: 11px; }
      .h3-writer-idea-mention-item {
        display: grid; grid-template-columns: 38px minmax(0,1fr); gap: 8px; align-items: center; width: 100%; min-height: 44px; padding: 5px 7px;
        border: 0; border-radius: 6px; background: transparent; color: inherit; text-align: left; cursor: pointer;
      }
      .h3-writer-idea-mention-item:hover, .h3-writer-idea-mention-item.is-active, .h3-writer-idea-mention-item:focus-visible { background: rgba(246,190,66,.16); outline: none; }
      .h3-writer-idea-mention-text { display: flex; flex-direction: column; min-width: 0; }
      .h3-writer-idea-mention-text strong, .h3-writer-idea-mention-text small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .h3-writer-idea-mention-text strong { font-size: 12px; }
      .h3-writer-idea-mention-text small { margin-top: 2px; color: var(--h3-native-widget-muted, rgba(255,255,255,.55)); font-size: 10px; }
      .h3-writer-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 7px; }
      .h3-writer-actions button { min-height: 30px; padding: 5px 10px; border: 1px solid var(--h3-native-widget-outline, rgba(255,255,255,.18)); border-radius: 6px; cursor: pointer; font-weight: 650; font-size: 11px; }
      .h3-writer-actions button:focus-visible { outline: 2px solid rgba(255,208,106,.95); outline-offset: 2px; }
      .h3-writer-actions button:disabled { cursor: wait; opacity: .58; }
      .h3-writer-secondary-button { background: var(--h3-native-widget-bg, #222); color: var(--h3-native-widget-text, #ddd); }
    .h3-writer-secondary-button:hover:not(:disabled) { border-color: rgba(255,255,255,.38); background: rgba(255,255,255,.08); }
    .h3-writer-language-toggle { min-width: 66px; }
    .h3-writer-language-toggle[data-language="zh"] { border-color: rgba(92,183,255,.7); color: #bfe3ff; }
    .h3-writer-language-toggle[data-language="en"] { border-color: rgba(167,223,89,.7); color: #ccef9b; }
    .h3-writer-reasoning-toggle { min-width: 72px; }
    .h3-writer-reasoning-toggle[data-enabled="true"] { border-color: rgba(190,129,255,.78); background: rgba(137,76,198,.22); color: #e4c6ff; }
    .h3-writer-reasoning-toggle[data-enabled="false"] { color: var(--h3-native-widget-muted, rgba(255,255,255,.58)); }
      .h3-writer-generate-button { border-color: rgba(246,190,66,.72) !important; background: #d99a18; color: #15110a; }
      .h3-writer-generate-button:hover:not(:disabled) { background: #efb332; }
      .h3-writer-stop-button { border-color: rgba(255,92,92,.78) !important; background: rgba(136,36,42,.78); color: #ffe1e1; }
      .h3-writer-stop-button:hover:not(:disabled) { background: rgba(181,48,56,.9); }
      .h3-v106-count-control { display: flex; align-items: center; gap: 6px; margin-right: auto; color: #9bdfff; font-size: 11px; font-weight: 700; }
      .h3-v106-count-control select { min-width: 76px; height: 30px; padding: 3px 8px; border: 1px solid rgba(92,183,255,.72); border-radius: 6px; background: #172a38; color: #dff4ff; cursor: pointer; }
      .h3-v106-storyboard-bar { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; padding-top: 9px; border-top: 1px solid rgba(92,183,255,.48); }
      .h3-v106-storyboard-tabs { display: grid; grid-template-columns: repeat(6,minmax(0,1fr)); gap: 6px; }
      .h3-v106-storyboard-actions { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 7px; }
      .h3-v106-storyboard-button { min-height: 30px; padding: 5px 7px; border: 1px solid rgba(92,183,255,.32); border-radius: 16px; background: #17252b; color: #dbe9ec; cursor: pointer; font-size: 11px; font-weight: 700; }
      .h3-v106-storyboard-button:hover:not(:disabled) { border-color: #55c7dc; background: #1c3840; }
      .h3-v106-storyboard-button.active { border-color: #62e6f4; background: linear-gradient(180deg,#1fa8b6,#167481); color: #fff; box-shadow: 0 0 10px rgba(65,220,234,.24); }
      .h3-v106-storyboard-button.danger { border-color: rgba(229,102,112,.48); background: #3a2025; color: #ffd7da; }
      .h3-v106-storyboard-button.generate { border-color: rgba(246,190,66,.6); background: #28331f; color: #ffe7a7; }
      .h3-v106-storyboard-button.wide { grid-column: span 2; }
      .h3-v106-storyboard-button:disabled { cursor: not-allowed; opacity: .45; }
      .h3-writer-status { min-height: 15px; color: var(--h3-native-widget-muted, rgba(255,255,255,.56)); font-size: 10.5px; line-height: 1.35; }
      .h3-writer-status[data-kind="success"] { color: #a8ed59; }
      .h3-writer-status[data-kind="error"] { color: #ff9292; }
      .h3-writer-status[data-kind="loading"] { color: #ffd06a; }
      .h3-writer-status[data-kind="warning"] { color: #ffd06a; font-weight: 650; }
      .h3-api-settings-overlay {
        position: fixed; inset: 0; z-index: 12000; display: grid; place-items: center; padding: 18px;
        background: rgba(0,0,0,.58); backdrop-filter: blur(2px);
      }
      .h3-api-settings-dialog {
        width: min(440px, calc(100vw - 36px)); max-height: calc(100vh - 36px); overflow: auto;
        box-sizing: border-box; padding: 18px; border: 1px solid rgba(255,255,255,.18); border-radius: 12px;
        background: #202124; color: #eee; box-shadow: 0 24px 70px rgba(0,0,0,.62); font-family: system-ui, sans-serif;
      }
      .h3-api-settings-dialog-wide { width: min(880px, calc(100vw - 36px)); }
      .h3-api-provider-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 14px; }
      .h3-api-provider-card { min-width: 0; padding: 13px; border: 1px solid #444b55; border-radius: 10px; background: #181a1f; }
      .h3-api-provider-title { display: block; color: #f0f2f5; font-size: 14px; }
      .h3-api-provider-note { min-height: 32px; margin-top: 5px; color: #8f98a6; font-size: 10.5px; line-height: 1.4; }
      .h3-api-settings-dialog header { display: flex; align-items: center; justify-content: space-between; margin: -4px 0 14px; font-size: 17px; }
      .h3-api-settings-close { border: 0; background: transparent; color: #aaa; font-size: 24px; cursor: pointer; }
      .h3-api-settings-row { display: flex; flex-direction: column; gap: 6px; margin: 11px 0; color: #b8b8b8; font-size: 12px; }
      .h3-api-settings-row > input, .h3-api-settings-row > select, .h3-api-settings-model-line select {
        width: 100%; height: 36px; box-sizing: border-box; padding: 5px 9px; border: 1px solid #50545c; border-radius: 7px;
        outline: none; background: #292b30; color: #f1f1f1;
      }
      .h3-api-settings-model-line { display: grid; grid-template-columns: auto minmax(0,1fr); gap: 8px; }
      .h3-api-settings-model-line button, .h3-api-settings-save {
        min-height: 36px; padding: 6px 12px; border: 1px solid #657186; border-radius: 7px; background: #343944; color: #fff; cursor: pointer;
      }
      .h3-api-settings-switch-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: 12px 0; color: #d0d0d0; font-size: 13px; }
      @media (max-width: 760px) { .h3-api-provider-grid { grid-template-columns: 1fr; } }
      .h3-api-settings-switch-row input { width: 18px; height: 18px; accent-color: #7ca8ff; }
      .h3-api-settings-status { min-height: 17px; margin: 5px 0 9px; color: #aaa; font-size: 12px; }
      .h3-api-settings-status[data-kind="success"] { color: #9ee37d; }
      .h3-api-settings-status[data-kind="error"] { color: #ff9494; }
      .h3-api-settings-dialog footer { display: flex; justify-content: flex-end; margin-top: 16px; }
      .h3-api-settings-save { min-width: 86px; border-color: #6f9df4; background: #426dbf; font-weight: 700; }
      .h3-prompt-editor-wrap {
        position: relative; display: flex; flex-direction: column; gap: 6px; width: 100%; height: 100%; min-width: 0; min-height: 0; max-height: 100%;
        box-sizing: border-box; padding: 10px; border: 1px solid rgba(155,220,68,.7); border-radius: 8px; overflow: hidden;
        contain: size layout paint; background: linear-gradient(180deg, rgba(155,220,68,.1), rgba(155,220,68,.035));
      }
      .h3-prompt-editor-wrap.is-mode-stale { border-color: #ffd06a; box-shadow: inset 0 0 0 1px rgba(255,208,106,.24); }
      .h3-prompt-editor {
        --h3-prompt-text-size: var(--h3-native-widget-text-size, var(--comfy-textarea-font-size, 12px));
        display: block; flex: 1 1 auto; width: 100%; height: auto; min-width: 0; min-height: 135px; max-height: 100%; box-sizing: border-box;
        padding: var(--h3-native-widget-padding, 2px); overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain;
        white-space: pre-wrap; overflow-wrap: anywhere; border: 1px solid rgba(155,220,68,.34); border-radius: 6px; outline: none;
        resize: none; background-color: var(--h3-native-widget-bg, var(--comfy-input-bg, #222));
        color: var(--h3-native-widget-text, var(--input-text, #ddd)); caret-color: var(--h3-native-widget-text, var(--input-text, #ddd));
        font-family: Consolas, "Courier New", monospace; font-size: var(--h3-prompt-text-size); font-weight: 400;
        font-style: normal; line-height: var(--h3-native-widget-line-height, normal); letter-spacing: 0;
      }
      .h3-prompt-editor :not(.h3-mention-chip):not(.h3-mention-chip *) {
        font-family: Consolas, "Courier New", monospace !important; font-size: var(--h3-prompt-text-size) !important;
        font-weight: 400 !important; font-style: normal !important; line-height: var(--h3-native-widget-line-height, normal) !important; letter-spacing: 0 !important;
      }
      .h3-prompt-editor-wrap.h3-native-vue-nodes .h3-prompt-editor:focus {
        border-color: rgba(155,220,68,.9); box-shadow: 0 0 0 1px rgba(155,220,68,.28);
      }
      .h3-prompt-editor:empty::before { content: attr(data-placeholder); color: var(--h3-native-widget-muted, rgba(255,255,255,.38)); pointer-events: none; }
      .h3-mention-chip {
        display: inline; max-width: 150px; margin: 0 1px; padding: 0; vertical-align: baseline; border: 0; border-radius: 0;
        background: transparent; color: rgba(0,226,187,.98); font-family: inherit; font-size: var(--h3-prompt-text-size, 12px);
        font-weight: 400; line-height: inherit; letter-spacing: 0; user-select: text; cursor: text;
      }
      .h3-mention-chip.is-unresolved { color: #ff9b9b; text-decoration: underline wavy rgba(255,110,110,.86); text-decoration-thickness: 1px; }
      .h3-mention-chip-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: baseline; }
      .h3-mention-chip-thumb { display: inline-block; width: 16px; height: 16px; margin-right: 2px; object-fit: cover; border-radius: 3px; vertical-align: -2px; background: rgba(255,255,255,.12); user-select: none; }
      .h3-mention-chip-thumb.is-image, .h3-mention-menu-thumb.is-image { background: #5aa9f0; }
      .h3-mention-chip-thumb.is-video, .h3-mention-menu-thumb.is-video { position: relative; background: linear-gradient(135deg, #1557b8, #49b6ff); }
      .h3-mention-chip-thumb.is-video::after {
        content: ""; position: absolute; left: 6px; top: 4px; border-left: 6px solid rgba(255,255,255,.9); border-top: 4px solid transparent; border-bottom: 4px solid transparent;
      }
      .h3-mention-menu-thumb.is-video::after {
        content: ""; position: absolute; left: 13px; top: 10px; border-left: 10px solid rgba(255,255,255,.9); border-top: 7px solid transparent; border-bottom: 7px solid transparent;
      }
      .h3-mention-menu {
        position: fixed; z-index: 10080; width: 198px; min-width: 198px; max-width: 198px; max-height: 360px; overflow: auto; padding: 5px;
        border: 1px solid var(--h3-native-widget-outline, rgba(255,255,255,.16)); border-radius: 8px;
        background: var(--h3-native-menu-bg, rgba(28,28,28,.98)); box-shadow: 0 16px 38px rgba(0,0,0,.42);
        color: var(--h3-native-widget-text, rgba(255,255,255,.94)); font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .h3-mention-menu-title { padding: 6px 8px 7px; color: var(--h3-native-widget-muted, rgba(255,255,255,.62)); font-size: 12px; }
      .h3-mention-menu-empty { padding: 9px 10px; color: var(--h3-native-widget-muted, rgba(255,255,255,.62)); font-size: 12px; }
      .h3-mention-menu-item { display: grid; grid-template-columns: 38px minmax(0,1fr); gap: 8px; align-items: center; min-height: 42px; padding: 4px 7px; border-radius: 6px; cursor: pointer; }
      .h3-mention-menu-item.is-active, .h3-mention-menu-item:hover { background: rgba(160,255,178,.15); }
      .h3-mention-menu-thumb { display: block; width: 36px; height: 36px; object-fit: cover; border-radius: 5px; background: rgba(255,255,255,.1); }
      .h3-mention-menu-main { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; font-weight: 700; }
      .h3-mention-menu-detail { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 2px; color: var(--h3-native-widget-muted, rgba(255,255,255,.55)); font-size: 11px; }
    `;
    document.head.append(style);
}

app.registerExtension({
    name: "gosick_233.MiniMaxH3Easy",
    setup() {
        install();
    },
    beforeRegisterNodeDef(nodeType, nodeData) {
        localizeNodeDefinition(nodeData);
        installMediaSourceNode(nodeType, nodeData);
        installLoaderNode(nodeType, nodeData);
        installOutputNode(nodeType, nodeData);
        installNode(nodeType, nodeData);
    },
});
