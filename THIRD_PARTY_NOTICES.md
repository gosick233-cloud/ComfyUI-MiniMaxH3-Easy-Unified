# 原项目与改动致谢

## MiniMax H3 Latent Upscaler (3D)

- 原作者仓库：[LBH-123-AI/Comfyui_Minimax_h3_latent_Upscaler](https://github.com/LBH-123-AI/Comfyui_Minimax_h3_latent_Upscaler)
- 原仓库代码目录：`nodes/minimax_h3_latent_upscaler_3d.py`
- 本节点包集成目录：`py/minimax_h3_latent_upscaler_3d.py`
- 原节点注册名：`MinimaxH3LatentUpscaler3D`
- 本节点包注册名：`gosick_233_MinimaxH3LatentUpscaler3D`

本改版以官方最新版为底稿，保留零拷贝加载、显式连续张量、ComfyUI 显存清理、异步传输、子目录模型扫描和 `force_unload` 等官方优化，仅增加 4 / 8 / 12 / 24 / 32 时序分块选项与独立注册名。

感谢原作者 LBH-123-AI 在社区公开分享该节点。
