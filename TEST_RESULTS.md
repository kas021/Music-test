# Test evidence — 2026-09-19

## 1.0.2 playback metadata repair

Reproduced: 1.0.1 omitted title/artist; MusicAudioSource used Unknown values
and the unchanged playback coordinator rejected the recording before playback.
Initial direct Dart boundary-runner attempts could not load Flutter dart:ui;
the check was rerun successfully using flutter test in the app environment.

Live metadata integration: 3/3 pass the unchanged app matcher (God's Plan,
GOHOBI Blouse, and Last Thing You Need from GTAVI). Old metadata-free responses
are rejected for all three. Node fixtures: 11 pass. This is NOT device playback.

Provider video ID must match before catalogue metadata may be used; duration
must agree within 3 seconds when present. Metadata-only cache: 120 entries,
30-minute TTL, in-memory only. No extra fetch or backend work added.
Saved tracks after restart/cache expiry can still be rejected when YouTube's
player author/title differs from its music catalogue; search again for this
test. No app matcher or runtime validation has been weakened.

Run the live boundary test from the Music app directory with MUSIC_TEST_ROOT
set to this repository, using flutter test --no-pub and the absolute path to
test/app_boundary_test.dart. Live checks are explicitly opt-in.

Previous 1.0.1 package retained for rollback. Disable the test source to stop use.

## Original 1.0.1 evidence

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
