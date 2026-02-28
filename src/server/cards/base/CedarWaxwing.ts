import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class CedarWaxwing extends BirdCard {
  readonly name = BirdCardName.CEDAR_WAXWING;
  readonly commonName = 'Cedar Waxwing';
  readonly scientificName = 'Bombycilla cedrorum';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.FRUIT, FoodType.FRUIT];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 3;
  readonly wingspan = 25;
  readonly points = 3;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Tuck 1 card from your hand behind this bird. If you do, gain 1 fruit from the supply.';

  onActivate(player: Player, _game: Game): void {
    if (player.hand.length === 0) return;
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    const card = player.hand.shift();
    if (card) {
      self.tuckedCards++;
      player.addFood(FoodType.FRUIT);
    }
  }
}
