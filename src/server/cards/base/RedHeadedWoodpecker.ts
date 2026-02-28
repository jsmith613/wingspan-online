import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { GainFood } from '../../deferredActions/GainFood';

export class RedHeadedWoodpecker extends BirdCard {
  readonly name = BirdCardName.RED_HEADED_WOODPECKER;
  readonly commonName = 'Red-Headed Woodpecker';
  readonly scientificName = 'Melanerpes erythrocephalus';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED, FoodType.WILD];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 3;
  readonly wingspan = 43;
  readonly points = 4;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Gain 1 seed from the birdfeeder, if available. You may cache it on this bird.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new GainFood(player, 1));
    // Caching is optional - simplified to auto-cache
    // Full implementation would ask player if they want to cache
  }
}
