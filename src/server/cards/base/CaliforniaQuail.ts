import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class CaliforniaQuail extends BirdCard {
  readonly name = BirdCardName.CALIFORNIA_QUAIL;
  readonly commonName = 'California Quail';
  readonly scientificName = 'Callipepla californica';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED, FoodType.SEED];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 6;
  readonly wingspan = 36;
  readonly points = 3;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Lay 1 egg on this bird.';

  onActivate(player: Player, _game: Game): void {
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (self && self.eggs < this.eggCapacity) {
      self.eggs++;
    }
  }
}
