import 'dart:convert';
import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:music_application/music_application.dart';
import 'package:synthetiq_music_core/synthetiq_music_core.dart';

void main() {
 test('live module metadata satisfies unchanged app identity gate', () async {
  final root = Platform.environment['MUSIC_TEST_ROOT'];
  expect(root, isNotNull, reason: 'Set MUSIC_TEST_ROOT to the test repository.');
  final result = await Process.run('node', ['$root/test/live_metadata.cjs']);
  expect(result.exitCode, 0, reason: result.stderr.toString());
  final input = jsonDecode(result.stdout.toString()) as List;
  expect(input.length, 3);
  for (final row in input) {
    final track = MusicTrack.fromJson(Map<String, Object?>.from(row['track']), sourceId: 'synthetiq_ytmusic_direct');
    final source = MusicAudioSource.fromJson({...Map<String, Object?>.from(row['audio']), 'url': 'https://example.com/fixture'});
    final old = MusicAudioSource.fromJson({'url': 'https://example.com/fixture'});
    print(jsonEncode({'title':track.title,'requestedArtist':track.artist,'resolvedTitle':source.title,'resolvedArtist':source.artist,'fixedAccepted':isResolvedRecordingMatch(track,source)}));
    expect(isResolvedRecordingMatch(track,old), false);
    expect(isResolvedRecordingMatch(track,source), true);
  }
 }, timeout: const Timeout(Duration(minutes: 2)));
}
