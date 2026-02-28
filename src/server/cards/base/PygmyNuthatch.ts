import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class PygmyNuthatch extends BirdCard {
  readonly name = BirdCardName.PYGMY_NUTHATCH;
  readonly commonName = 'Pygmy Nuthatch';
  readonly scientificName = 'Sitta pygmaea';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 4;
  readonly wingspan = 20;
  readonly points = 2;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Tuck 1 card from your hand behind this bird. If you do, gain 1 invertebrate or seed from the supply.';

  onActivate(player: Player, _game: Game): void {
    if (player.hand.length === 0) return;
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    const card = player.hand.shift();
    if (card) {
      self.tuckedCards++;
      player.addFood(FoodType.SEED);
    }
  }
}
