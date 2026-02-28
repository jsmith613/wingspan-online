import { PlayerId } from '../Types';
import { ClientBirdCard } from '../cards/ClientBirdCard';
import { BirdCardName } from '../cards/BirdCardName';
import { BonusCardName } from '../cards/BonusCardName';
import { FoodType } from '../game/FoodType';
import { HabitatType } from '../game/HabitatType';

export interface PlayerBoardSlot {
  readonly bird: ClientBirdCard | null;
}

export interface PlayerBoardView {
  readonly [HabitatType.FOREST]: ReadonlyArray<PlayerBoardSlot>;
  readonly [HabitatType.GRASSLAND]: ReadonlyArray<PlayerBoardSlot>;
  readonly [HabitatType.WETLAND]: ReadonlyArray<PlayerBoardSlot>;
}

export interface PlayerViewModel {
  readonly id: PlayerId;
  readonly name: string;
  readonly actionCubes: number;
  readonly hand: ReadonlyArray<BirdCardName>;
  readonly handDetails: ReadonlyArray<ClientBirdCard>;
  readonly bonusCards: ReadonlyArray<BonusCardName>;
  readonly food: ReadonlyArray<FoodType>;
  readonly board: PlayerBoardView;
  readonly score: number;
  readonly roundGoalPoints: ReadonlyArray<number>;
}
