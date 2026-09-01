# gosick_233 MiniMax H3 Modified Nodes

[中文](README_CN.md)

This is a namespace-isolated MiniMax H3 node package assembled for the author's workflows.

## What this package changes

- Registers modified nodes with the `gosick_233_` prefix to avoid collisions with upstream nodes.
- Combines the modified MiniMax H3 Easy nodes, selected YCNodes utilities, and the prompt/storyboard backend in one package.
- Provides explicit T2VA, I2VA, FL2VA, L2VA, and Ref2VA modes.
- Allows either primary model selector to be set to none when the other model supports the chosen mode.
- Adds AI creative input, storyboard editing, vision/text API settings, reasoning controls, and real upstream-output blocking.
- Produces complete standalone prompts for subsequent shots and uses stable textual anchors instead of “same as previous shot.”
- Adds second-pass conditioning reconstruction, sigma refinement, tiled sampling, a second-pass master switch, and conditional output saving.
- Includes a namespace-isolated 3D latent upscaler with 4 / 8 / 12 / 24-frame temporal chunks, protected from updates to the original plugin.
- Saves only the first pass when the second pass is disabled, or both outputs for comparison when it is enabled.

## Installation

Clone or copy the repository to:

```text
ComfyUI/custom_nodes/gosick_233
```

Restart ComfyUI after Python updates and refresh the browser after frontend updates.

This repository contains node code only. Models and other workflow dependencies must be installed separately.

## API privacy

Text and vision API settings are stored locally in:

```text
ComfyUI/custom_nodes/gosick_233/prompt_optimizer.json
```

The file stores API keys as plaintext and is excluded by `.gitignore`, so it is not uploaded. Preserve the local file when updating to keep your settings.

## Upstream projects and acknowledgements

Thanks to the authors of these community projects for sharing their work:

- [nkxx188/ComfyUI-MiniMaxH3-Easy](https://github.com/nkxx188/ComfyUI-MiniMaxH3-Easy)
- [yichengup/ComfyUI-YCNodes-MiniMax-H3](https://github.com/yichengup/ComfyUI-YCNodes-MiniMax-H3)
- [LBH-123-AI/Comfyui_Minimax_h3_latent_Upscaler](https://github.com/LBH-123-AI/Comfyui_Minimax_h3_latent_Upscaler)

The integrated 3D latent upscaler changes and source repository path are documented in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
