import { GameId } from '../../common/Types';
import { SerializedGame } from '../SerializedGame';

export interface IDatabase {
  initialize(): void;
  saveGame(game: SerializedGame): void;
  loadGame(id: GameId): SerializedGame | undefined;
  deleteGame(id: GameId): void;
}
