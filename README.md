# Own Pace video toolkit (backup)

Restores the rendering pipeline used for Own Pace videos 58+ (v2 format).

- `engine/` — `rig2d.js` (2D pictogram rig), `v2.js` (hooks, pops, bursts, timers), `soundlib.py` (beat engine + SFX),
  `render_p.cjs` (headless Chromium frame renderer), `encode.sh` (H.264 master + watermark + loudnorm −14 LUFS), `queue.sh`.
- `engine/` (70+, voiceover videos) — `vo.js` (word-synced captions, scene runner, props), `rf.cjs` (fast renderer: CPU canvas +
  toDataURL piped straight into ffmpeg with watermark + −14 LUFS; ~10× faster than render_p), `prev.sh NN t1,t2,…` (preview stills +
  contact sheet), `go.sh NN "Title" DUR` (full render), `qc.sh` (specs/loudness/frames), `voedit.py` (cut/splice the creator's audio),
  `tools/mkph.py` (ASR words + hand-written phrases → caption array), `tools/assemble.py` (head + captions + body → vNN.html).
- `scenes/` — scene pages `vNN.html` and their soundtracks `soundNN.py` (58–81; 70–81 are voiceover videos made from reels the
  user shared on Oct 31; their source audio lives outside the repo). `scenes/captions70/` has the phrase files and post captions.
- `asr/transcribe.py` — offline English transcription with word timings (sherpa-onnx + Parakeet TDT 0.6B v2 int8; model from
  https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8.tar.bz2).
- `helpers/` — preview contact sheets (`wmprev.py`), event export (`steps.cjs`), page eval (`evalpage2.cjs`).
- `fonts/` (Poppins, OFL), `brand/` (watermark).

Restore: copy `engine/*`, `scenes/*` and `fonts/` into one working folder (e.g. `rat-race/`), the watermark to
`/home/claude/ownpace-logo/ownpace-video-watermark.png`, and the helpers to the scratchpad.
