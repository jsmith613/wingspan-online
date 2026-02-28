import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class MountainChickadee extends BirdCard {
  readonly name = BirdCardName.MOUNTAIN_CHICKADEE;
  readonly commonName = 'Mountain Chickadee';
  readonly scientificName = 'Poecile gambeli';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 3;
  readonly wingspan = 23;
  readonly points = 2;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Cache 1 seed from the supply on this bird.';

  onActivate(player: Player, _game: Game): void {
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (self) self.cachedFood++;
  }
}
