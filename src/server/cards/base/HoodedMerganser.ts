import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class HoodedMerganser extends BirdCard {
  readonly name = BirdCardName.HOODED_MERGANSER;
  readonly commonName = 'Hooded Merganser';
  readonly scientificName = 'Lophodytes cucullatus';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FISH];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 4;
  readonly wingspan = 61;
  readonly points = 5;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Repeat 1 predator power in this habitat.';

  // TODO: Complex power - requires additional UI interaction
  onActivate(_player: Player, _game: Game): void {
    // Repeat 1 [predator] power in this habitat.
  }
}
