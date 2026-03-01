import { GameId, PlayerId } from '../Types';
import { PlayerViewModel } from './PlayerViewModel';
import { Phase } from '../game/Phase';
import { BirdCardName } from '../cards/BirdCardName';
import { FoodType } from '../game/FoodType';
import { PlayerInputModel } from '../input/PlayerInputModel';
import { GameOptions } from './GameOptions';

export interface BirdfeederDie {
  readonly foods: ReadonlyArray<FoodType>;
}

export interface BirdfeederView {
  readonly dice: ReadonlyArray<BirdfeederDie>;
}

export interface BirdTrayView {
  readonly faceUpCards: ReadonlyArray<BirdCardName>;
}

export interface RoundGoalView {
  readonly goalId: string;
  readonly description: string;
  readonly scores: ReadonlyArray<{ playerId: PlayerId; points: number }>;
}

export interface GameViewModel {
  readonly id: GameId;
  readonly phase: Phase;
  readonly round: number;
  readonly currentPlayerId: PlayerId;
  readonly expectedInputPlayerId: PlayerId;
  readonly players: ReadonlyArray<PlayerViewModel>;
  readonly birdfeeder: BirdfeederView;
  readonly birdTray: BirdTrayView;
  readonly roundGoals: ReadonlyArray<RoundGoalView>;
  readonly waitingFor: PlayerInputModel | null;
  readonly canCancel: boolean;
  readonly options: GameOptions;
}
