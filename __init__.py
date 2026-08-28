from importlib import import_module

from .nodes import MiniMaxH3AutoUnload, MiniMaxH3Easy, MiniMaxH3EasyLoader, MiniMaxH3EasyOutput, MiniMaxH3EasySecondPassConditioning, MiniMaxH3SecondPassSwitch
from .prompt_writer import (
    NODE_CLASS_MAPPINGS as PROMPT_WRITER_CLASS_MAPPINGS,
    NODE_DISPLAY_NAME_MAPPINGS as PROMPT_WRITER_DISPLAY_NAME_MAPPINGS,
)

NODE_CLASS_MAPPINGS = {
    "gosick_233_MiniMaxH3EasyLoader": MiniMaxH3EasyLoader,
    "gosick_233_MiniMaxH3Easy": MiniMaxH3Easy,
    "gosick_233_MiniMaxH3EasyOutput": MiniMaxH3EasyOutput,
    "gosick_233_MiniMaxH3AutoUnload": MiniMaxH3AutoUnload,
    "gosick_233_MiniMaxH3EasySecondPassConditioning": MiniMaxH3EasySecondPassConditioning,
    "gosick_233_MiniMaxH3SecondPassSwitch": MiniMaxH3SecondPassSwitch,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "gosick_233_MiniMaxH3EasyLoader": "gosick_233 · MiniMax H3 Easy Loader",
    "gosick_233_MiniMaxH3Easy": "gosick_233 · MiniMax H3 Easy",
    "gosick_233_MiniMaxH3EasyOutput": "gosick_233 · MiniMax H3 Easy Output",
    "gosick_233_MiniMaxH3AutoUnload": "gosick_233 · MiniMax H3 Auto Unload",
    "gosick_233_MiniMaxH3EasySecondPassConditioning": "gosick_233 · MiniMax H3 Easy Second Pass Conditioning",
    "gosick_233_MiniMaxH3SecondPassSwitch": "gosick_233 · 二采开关（关闭时跳过二采）",
}

_prompt_overlap = set(NODE_CLASS_MAPPINGS).intersection(PROMPT_WRITER_CLASS_MAPPINGS)
if _prompt_overlap:
    raise RuntimeError(f"gosick_233 duplicate prompt-writer registration: {sorted(_prompt_overlap)}")
NODE_CLASS_MAPPINGS.update(PROMPT_WRITER_CLASS_MAPPINGS)
NODE_DISPLAY_NAME_MAPPINGS.update(PROMPT_WRITER_DISPLAY_NAME_MAPPINGS)

for _module_name in (
    "minimax_i2v_tail",
    "h3_prompt_relay",
    "H3DistanceAttentionPatcher",
    "h3_dynamic_cfg_scheduler",
    "h3_sigma_refiner",
    "h3_tiled_sampler",
):
    _module = import_module(f".py.{_module_name}", __name__)
    _overlap = set(NODE_CLASS_MAPPINGS).intersection(_module.NODE_CLASS_MAPPINGS)
    if _overlap:
        raise RuntimeError(f"gosick_233 duplicate node registration: {sorted(_overlap)}")
    NODE_CLASS_MAPPINGS.update(_module.NODE_CLASS_MAPPINGS)
    NODE_DISPLAY_NAME_MAPPINGS.update(_module.NODE_DISPLAY_NAME_MAPPINGS)

del _module_name, _module, _overlap, _prompt_overlap
del PROMPT_WRITER_CLASS_MAPPINGS, PROMPT_WRITER_DISPLAY_NAME_MAPPINGS

WEB_DIRECTORY = "./web"

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
