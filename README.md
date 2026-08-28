# gosick_233 MiniMax H3 Nodes

[中文说明](README_CN.md)

This is a namespaced community modification used by the author's MiniMax H3
workflows. It is not an official release of either upstream project.

## What this build changes

- Registers every modified node under the `gosick_233_` namespace to avoid
  collisions with the original packages.
- Combines the modified MiniMax H3 Easy nodes, selected YCNodes utilities, and
  the AI prompt/storyboard backend in one package.
- Adds explicit T2VA, I2VA, FL2VA, L2VA, and Ref2VA modes.
- Allows either transformer selector to be set to `None`, using the remaining
  model for all supported modes.
- Adds AI idea input, multi-segment storyboard editing, image understanding,
  text/vision API settings, reasoning control, and real upstream stream
  cancellation.
- Makes later storyboard segments self-contained instead of referring to an
  unavailable previous-video memory; unchanged scenes reuse stable text anchors.
- Adds second-pass conditioning, Sigma refinement, tiled sampling, an explicit
  second-pass switch, and conditional saving.
- When second pass is off, only the first-pass video is saved. When it is on,
  both first- and second-pass videos can be saved for comparison.

## Installation

Clone or copy this repository to:

```text
ComfyUI/custom_nodes/gosick_233
```

Restart ComfyUI after installing or updating Python files. Refresh the browser
after frontend updates.

This repository provides nodes and code only. Models and other workflow
dependencies must be installed separately.

## API privacy

Prompt and vision API settings are stored locally in:

```text
ComfyUI/custom_nodes/gosick_233/prompt_optimizer.json
```

The file contains API keys in plain text and is excluded by `.gitignore`. It is
not included in this repository. Keep the local file when updating the node to
avoid entering the settings again.

## Upstream projects and licenses

This modification is based on:

- [nkxx188/ComfyUI-MiniMaxH3-Easy](https://github.com/nkxx188/ComfyUI-MiniMaxH3-Easy)
- [yichengup/ComfyUI-YCNodes-MiniMax-H3](https://github.com/yichengup/ComfyUI-YCNodes-MiniMax-H3)

Thanks to both original authors for publishing their work. See [LICENSE](LICENSE)
and [LICENSE-YCNODES](LICENSE-YCNODES) for the retained MIT notices.
