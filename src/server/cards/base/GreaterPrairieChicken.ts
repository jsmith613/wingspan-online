import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { DrawBonusCardsKeepOne } from '../../deferredActions/DrawBonusCardsKeepOne';

export class GreaterPrairieChicken extends BirdCard {
  readonly name = BirdCardName.GREATER_PRAIRIE_CHICKEN;
  readonly commonName = 'Greater Prairie-Chicken';
  readonly scientificName = 'Tympanuchus cupido';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED, FoodType.SEED];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 4;
  readonly wingspan = 71;
  readonly points = 5;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Draw 2 new bonus cards and keep 1.';

  onPlay(player: Player, game: Game): void {
    game.deferredActions.push(new DrawBonusCardsKeepOne(player));
  }
}

