# Own Pace video toolkit (backup)

Restores the rendering pipeline used for Own Pace videos 58+ (v2 format).

- `engine/` — `rig2d.js` (2D pictogram rig), `v2.js` (hooks, pops, bursts, timers), `soundlib.py` (beat engine + SFX),
  `render_p.cjs` (headless Chromium frame renderer), `encode.sh` (H.264 master + watermark + loudnorm −14 LUFS), `queue.sh`.
- `scenes/` — scene pages `vNN.html` and their soundtracks `soundNN.py` (58–69).
- `asr/transcribe.py` — offline English transcription with word timings (sherpa-onnx + Parakeet TDT 0.6B v2 int8; model from
  https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8.tar.bz2).
- `helpers/` — preview contact sheets (`wmprev.py`), event export (`steps.cjs`), page eval (`evalpage2.cjs`).
- `fonts/` (Poppins, OFL), `brand/` (watermark).

Restore: copy `engine/*`, `scenes/*` and `fonts/` into one working folder (e.g. `rat-race/`), the watermark to
`/home/claude/ownpace-logo/ownpace-video-watermark.png`, and the helpers to the scratchpad.
