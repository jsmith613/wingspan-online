import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { DrawBonusCardsKeepOne } from '../../deferredActions/DrawBonusCardsKeepOne';

export class CassinsFinch extends BirdCard {
  readonly name = BirdCardName.CASSINS_FINCH;
  readonly commonName = 'Cassin\'s Finch';
  readonly scientificName = 'Haemorhous cassinii';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.SEED, FoodType.FRUIT];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 3;
  readonly wingspan = 30;
  readonly points = 4;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Draw 2 new bonus cards and keep 1.';

  onPlay(player: Player, game: Game): void {
    game.deferredActions.push(new DrawBonusCardsKeepOne(player));
  }
}

