import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class AmericanGoldfinch extends BirdCard {
  readonly name = BirdCardName.AMERICAN_GOLDFINCH;
  readonly commonName = 'American Goldfinch';
  readonly scientificName = 'Spinus tristis';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.SEED, FoodType.SEED];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 3;
  readonly wingspan = 23;
  readonly points = 3;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Gain 3 seed from the supply.';

  onPlay(player: Player, _game: Game): void {
    for (let i = 0; i < 3; i++) {
      player.addFood(FoodType.SEED);
    }
  }
}
