import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { TuckCard } from '../../deferredActions/TuckCard';

export class BrewersBlackbird extends BirdCard {
  readonly name = BirdCardName.BREWERS_BLACKBIRD;
  readonly commonName = 'Brewer\'s Blackbird';
  readonly scientificName = 'Euphagus cyanocephalus';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.SEED, FoodType.WILD];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 3;
  readonly wingspan = 41;
  readonly points = 3;
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
