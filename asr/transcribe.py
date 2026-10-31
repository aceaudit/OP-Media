# usage: python3 transcribe.py <audio_or_video> [out.json]
# Offline English transcription with word timings (sherpa-onnx + NVIDIA Parakeet TDT 0.6B v2 int8).
import sys, json, subprocess, numpy as np, sherpa_onnx, os
M = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8')
src = sys.argv[1]; out = sys.argv[2] if len(sys.argv) > 2 else None
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-vn', '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout
x = np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768
rec = sherpa_onnx.OfflineRecognizer.from_transducer(encoder=f'{M}/encoder.int8.onnx', decoder=f'{M}/decoder.int8.onnx', joiner=f'{M}/joiner.int8.onnx', tokens=f'{M}/tokens.txt', model_type='nemo_transducer', num_threads=2)
words = []
CH = 16000 * 25            # 25 s chunks with 1 s overlap handled by offset
for start in range(0, len(x), CH):
    seg = x[start:start + CH]
    if len(seg) < 1600: break
    s = rec.create_stream(); s.accept_waveform(16000, seg); rec.decode_stream(s)
    r = s.result; toks, ts = r.tokens, r.timestamps
    cur, t0 = '', None
    for tok, t in zip(toks, ts):
        if tok.startswith('▁') or tok.startswith(' '):
            if cur: words.append([round(t0 + start / 16000, 2), cur])
            cur, t0 = tok.lstrip('▁ '), t
        else:
            if t0 is None: t0 = t
            cur += tok
    if cur: words.append([round(t0 + start / 16000, 2), cur])
res = {'text': ' '.join(w for _, w in words), 'words': words, 'duration': round(len(x) / 16000, 2)}
print(res['text'])
if out: json.dump(res, open(out, 'w'), indent=0)
