# Test evidence — 2026-09-19

- node --check modules/ytmusic/index.js: passed.
- node --test test/module.test.cjs: 9 passed, 0 failed.
- Live unauthenticated search for Drake: 20 results.
- First returned track: audio URL resolution succeeded without an API key.
- No audio bytes were fetched or listened to in this check.
- Physical app install, playback, completion, seeking and background audio:
  not yet verified. Owner testing is the purpose of this public prototype.
- No new background work, backend calls or multi-runtime coordination added.
  Existing app runtime caps apply. Metadata paging returns empty after page 0.
- Explicit provider playback restrictions fail without a different-client retry.
- Existing source prototype provenance and limits are documented in README.

Package SHA-256:
934946c9aa73e88fe4e45bc6ed1e93bb3b22c555879d6c77efe3ca575492b7bb
