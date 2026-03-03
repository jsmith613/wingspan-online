import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { TuckCard } from '../../deferredActions/TuckCard';

export class YellowHeadedBlackbird extends BirdCard {
  readonly name = BirdCardName.YELLOW_HEADED_BLACKBIRD;
  readonly commonName = 'Yellow-Headed Blackbird';
  readonly scientificName = 'Xanthocephalus xanthocephalus';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 3;
  readonly wingspan = 38;
  readonly points = 4;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Tuck 1 card from your hand behind this bird. If you do, you may also lay 1 egg on this bird.';

  onActivate(player: Player, game: Game): void {
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    game.deferredActions.push(new TuckCard(player, {
      targetBird: self,
      message: 'Optional: tuck 1 card from your hand behind this bird, or skip.',
      onTucked: () => {
      if (self.eggs < this.eggCapacity) {
        self.eggs++;
      }
      },
    }));
  }
}
