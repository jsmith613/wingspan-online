import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { LayEggs } from '../../deferredActions/LayEggs';
import { TuckCard } from '../../deferredActions/TuckCard';

export class WhiteThroatedSwift extends BirdCard {
  readonly name = BirdCardName.WHITE_THROATED_SWIFT;
  readonly commonName = 'White-Throated Swift';
  readonly scientificName = 'Aeronautes saxatalis';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 2;
  readonly wingspan = 38;
  readonly points = 2;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Tuck 1 card from your hand behind this bird. If you do, lay 1 egg on any bird.';

  onActivate(player: Player, game: Game): void {
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    game.deferredActions.push(new TuckCard(player, {
      targetBird: self,
      message: 'Optional: tuck 1 card from your hand behind this bird, or skip.',
      onTucked: () => {
        game.deferredActions.push(new LayEggs(player, 1));
      },
    }));
  }
}
