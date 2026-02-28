import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class RedWingedBlackbird extends BirdCard {
  readonly name = BirdCardName.RED_WINGED_BLACKBIRD;
  readonly commonName = 'Red-Winged Blackbird';
  readonly scientificName = 'Agelaius phoeniceus';
  readonly habitats = [HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [FoodType.SEED];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 3;
  readonly wingspan = 33;
  readonly points = 2;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Tuck 1 card from your hand behind this bird. If you do, you may also lay 1 egg on this bird.';

  onActivate(player: Player, game: Game): void {
    if (player.hand.length === 0) return;
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    const card = player.hand.shift();
    if (card) {
      self.tuckedCards++;
      if (self.eggs < this.eggCapacity) {
        self.eggs++;
      }
    }
  }
}
