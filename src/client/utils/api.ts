import { GameId, PlayerId } from '@common/Types';
import { GameViewModel } from '@common/models/GameViewModel';
import { PlayerInputModel } from '@common/input/PlayerInputModel';
import { GameOptions } from '@common/models/GameOptions';

const BASE_URL = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }
  return response.json() as Promise<T>;
}

export interface CreateGameRequest {
  playerNames: string[];
  options?: GameOptions;
}

export interface CreateGameResponse {
  gameId: GameId;
  playerIds: PlayerId[];
}

export function createGame(playerNames: string[], options?: GameOptions): Promise<CreateGameResponse> {
  return request(`${BASE_URL}/game`, {
    method: 'POST',
    body: JSON.stringify({ playerNames, options } as CreateGameRequest),
  });
}

export function getGameState(gameId: GameId, deviceId?: string): Promise<GameViewModel> {
  const query = deviceId ? `?deviceId=${encodeURIComponent(deviceId)}` : '';
  return request(`${BASE_URL}/game/${gameId}${query}`);
}

export function claimSeat(gameId: GameId, playerId: PlayerId, deviceId: string): Promise<{ ok: boolean; playerId: PlayerId }> {
  return request(`${BASE_URL}/game/${gameId}/claim`, {
    method: 'POST',
    body: JSON.stringify({ playerId, deviceId }),
  });
}

export function getWaitingFor(playerId: PlayerId): Promise<PlayerInputModel | null> {
  return request(`${BASE_URL}/player/${playerId}/waitingfor`);
}

export function submitInput(playerId: PlayerId, input: unknown, gameId?: GameId, deviceId?: string): Promise<GameViewModel> {
  const params = new URLSearchParams();
  if (gameId) params.set('gameId', gameId);
  if (deviceId) params.set('deviceId', deviceId);
  const query = params.toString() ? `?${params.toString()}` : '';
  return request(`${BASE_URL}/player/${playerId}/input${query}`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
