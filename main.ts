// bring-the-humans-03 entry — "WATCH MY AI AGENT BUILD THIS AD" (account: @silver-lark-56).
// The entry is the video itself: an original 15-second vertical ad for make.fun,
// made new by the agent in the recorded session (PIL frame render + ffmpeg),
// posted publicly on TikTok. The video shows make.fun's brand badge from its
// first frame, ends on the press pack's referral end card carrying this
// account's own referral code, and its caption carries the bounty's line and
// this account's play code. Places go by the video's views alone (score = views).
// This program only hands VIDEO.json (the video's address) to the gate; nothing
// it writes about the video is scored.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand
// in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  // Validate before handing over: a malformed VIDEO.json must fail here with a
  // clear error, not reach the gate and be refused there. The original bytes
  // are written through unchanged, so the gate still reads VIDEO.json as-is.
  const raw = readFileSync(join(BOT_DIR, 'VIDEO.json'));
  const parsed = JSON.parse(raw.toString('utf8')) as { url?: unknown };
  const url = parsed.url;
  if (typeof url !== 'string' || !url.startsWith('https://www.tiktok.com/@') || !url.includes('/video/')) {
    throw new Error('VIDEO.json must hold {"url": "https://www.tiktok.com/@<handle>/video/<id>"}');
  }
  writeFileSync(join(OUTPUT_DIR, 'VIDEO.json'), raw);
} catch (err) {
  console.error(`VIDEO.json could not be handed over from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
