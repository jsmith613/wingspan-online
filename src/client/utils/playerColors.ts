import { PlayerId } from '@common/Types';
import { PlayerViewModel } from '@common/models/PlayerViewModel';

const PLAYER_COLORS = [
  '#BEE6EB',
  '#B79FE8',
  '#EBC3BE',
  '#E6EBBE',
  '#f5b273',
];

function colorForIndex(index: number): string {
  if (index < PLAYER_COLORS.length) {
    return PLAYER_COLORS[index];
  }

  // Generate additional unique pastel colors if player count exceeds presets.
  const offset = index - PLAYER_COLORS.length + 1;
  const hue = (offset * 137.508) % 360;
  return `hsl(${hue.toFixed(1)}deg 65% 82%)`;
}

export function colorForPlayer(players: ReadonlyArray<PlayerViewModel>, playerId: PlayerId): string {
  const idx = players.findIndex((p) => p.id === playerId);
  if (idx < 0) return PLAYER_COLORS[0];
  return colorForIndex(idx);
}

export function allPlayerColors(players: ReadonlyArray<PlayerViewModel>): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < players.length; i++) {
    result[players[i].id] = colorForIndex(i);
  }
  return result;
}
