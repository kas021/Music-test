# Music test — YouTube-only prototype

In Synthetiq Music, open Settings → Sources → add a GitHub source:

https://github.com/kas021/Music-test

This is an experimental user-installed module, not an app update or an
official YouTube integration. Only search and playback resolution are offered:
first search page (up to 24 songs), no album browsing, pagination, Home feed,
Smart Radio or downloads. Availability can vary; upstream changes can break it.

No Qobuz code, account tokens, API keys, cookies or private credentials are
included. Requests are sent directly to YouTube. Explicit playback restrictions
fail closed; this package does not grant access to restricted content.

## Provenance

Adapted from the owner's DeepSeek-produced Synthetiq YT Music Direct module,
whose accompanying notes describe reimplementation informed by a community
8SPINE YTMusic-direct reference (nvmindl v5.1). No decoded reference files,
decoder or credential-injection scripts are included. No claim of an upstream
license grant or affiliation is made; wider redistribution licensing has not
been established.

Changes from the supplied prototype: removed API-key dependency and content
confirmation flags, stopped client fallback on explicit playback restrictions,
and required the resolved player video ID to match the requested recording.

## Testing and limitations

Run: node --test test/module.test.cjs

Fixture tests do not prove physical iPhone/Windows playback. This test release
is intended for the owner to check installation, search and correct-song
playback. Do not report tokens, cookies or signed media links in issues.

Disable/remove this test source in Settings to roll back. Existing sources and
the released app are unchanged.
