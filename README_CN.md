# gosick_233 MiniMax H3 改版节点

[English](README.md)

这是作者为自己的 MiniMax H3 工作流整理的命名空间隔离改版。

## 这个改版做了什么

- 所有改版节点统一使用 `gosick_233_` 注册前缀，避免与原版节点重复注册。
- 将改版 MiniMax H3 Easy、选用的 YCNodes 工具和 AI 提示词/多分镜后端合并为一个节点包。
- 增加明确的 T2VA、I2VA、FL2VA、L2VA、Ref2VA 五种模式。
- 两个主模型选择器都允许设置为“无”，可只用另一个模型覆盖支持的模式。
- 增加 AI 创意输入、多分镜编辑、识图模型、文本/识图 API 设置、思考开关和真正终止上游输出。
- 后续分镜改为独立可执行的完整提示词；场景不变时使用稳定的文字锚点，不再写“与上一段相同”。
- 增加二采条件重建、Sigma 细化、分块采样、二采总开关和二采条件保存。
- 内置命名空间隔离的 3D latent 放大节点，可选择 4 / 8 / 12 / 24 帧时序分块；以后更新原插件不会覆盖本节点。
- 关闭二采时只保存一采视频；开启二采时可同时保存一采和二采用于对比。

## 安装

克隆或复制到：

```text
ComfyUI/custom_nodes/gosick_233
```

安装或更新 Python 文件后重启 ComfyUI；前端更新后刷新浏览器。

本仓库只提供节点代码，不包含模型；工作流使用的其他依赖需要另外安装。

## API 隐私

文本和识图 API 设置保存在本地：

```text
ComfyUI/custom_nodes/gosick_233/prompt_optimizer.json
```

该文件会以明文保存 API Key，已被 `.gitignore` 排除，不会上传到仓库。更新节点时保留
本地文件，就不需要重新输入 API。

## 原项目与致谢

感谢以下项目与作者公开分享源码：

- [nkxx188/ComfyUI-MiniMaxH3-Easy](https://github.com/nkxx188/ComfyUI-MiniMaxH3-Easy)
- [yichengup/ComfyUI-YCNodes-MiniMax-H3](https://github.com/yichengup/ComfyUI-YCNodes-MiniMax-H3)
- [LBH-123-AI/Comfyui_Minimax_h3_latent_Upscaler](https://github.com/LBH-123-AI/Comfyui_Minimax_h3_latent_Upscaler)

3D latent 放大节点的具体改动和原仓库目录记录在 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
