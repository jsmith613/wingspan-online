import { GameId, PlayerId } from '../common/Types';
import { Phase } from '../common/game/Phase';
import { FoodType } from '../common/game/FoodType';
import { BirdCardName } from '../common/cards/BirdCardName';
import { BonusCardName } from '../common/cards/BonusCardName';
import { SerializedPlayerBoard } from './habitats/PlayerBoard';
import { SerializedBirdfeeder } from './birdfeeder/Birdfeeder';

export interface SerializedPlayer {
  id: PlayerId;
  name: string;
  actionCubes: number;
  food: FoodType[];
  hand: BirdCardName[];
  bonusCards: BonusCardName[];
  board: SerializedPlayerBoard;
  roundGoalPoints: number[];
}

export interface SerializedGame {
  id: GameId;
  seed: number;
  phase: Phase;
  round: number;
  currentPlayerIndex: number;
  players: SerializedPlayer[];
  birdfeeder: SerializedBirdfeeder;
  deck: BirdCardName[];
  discardPile: BirdCardName[];
  birdTray: BirdCardName[];
  bonusDeck: BonusCardName[];
}
