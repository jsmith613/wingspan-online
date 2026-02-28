import { GameId, PlayerId } from '@common/Types';
import { GameViewModel } from '@common/models/GameViewModel';
import { PlayerInputModel } from '@common/input/PlayerInputModel';

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
}

export interface CreateGameResponse {
  gameId: GameId;
  playerIds: PlayerId[];
}

export function createGame(playerNames: string[]): Promise<CreateGameResponse> {
  return request(`${BASE_URL}/game`, {
    method: 'POST',
    body: JSON.stringify({ playerNames } as CreateGameRequest),
  });
}

export function getGameState(gameId: GameId): Promise<GameViewModel> {
  return request(`${BASE_URL}/game/${gameId}`);
}

export function getWaitingFor(playerId: PlayerId): Promise<PlayerInputModel | null> {
  return request(`${BASE_URL}/player/${playerId}/waitingfor`);
}

export function submitInput(playerId: PlayerId, input: unknown): Promise<GameViewModel> {
  return request(`${BASE_URL}/player/${playerId}/input`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
