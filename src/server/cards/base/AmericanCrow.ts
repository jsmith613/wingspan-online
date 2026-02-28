import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class AmericanCrow extends BirdCard {
  readonly name = BirdCardName.AMERICAN_CROW;
  readonly commonName = 'American Crow';
  readonly scientificName = 'Corvus brachyrhynchos';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [FoodType.WILD];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 2;
  readonly wingspan = 99;
  readonly points = 4;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Discard 1 egg from any of your other birds to gain 1 wild from the supply.';

  onActivate(player: Player, _game: Game): void {
    // Find a bird with eggs to discard from
    const birds = player.board.getAllBirds().filter(b => b.eggs > 0 && b.name !== this.name);
    if (birds.length === 0) return;
    birds[0].eggs--;
    // Gain a wild food (player picks any type) - simplified to invertebrate
    player.addFood(FoodType.INVERTEBRATE);
  }
}
