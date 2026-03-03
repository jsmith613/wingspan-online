import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { TuckCard } from '../../deferredActions/TuckCard';

export class VauxsSwift extends BirdCard {
  readonly name = BirdCardName.VAUXS_SWIFT;
  readonly commonName = 'Vaux\'s Swift';
  readonly scientificName = 'Chaetura vauxi';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.INVERTEBRATE];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 3;
  readonly wingspan = 31;
  readonly points = 2;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Tuck 1 card from your hand behind this bird. If you do, gain 1 invertebrate from the supply.';

  onActivate(player: Player, _game: Game): void {
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    _game.deferredActions.push(new TuckCard(player, {
      targetBird: self,
      message: 'Optional: tuck 1 card from your hand behind this bird, or skip.',
      onTucked: () => {
        player.addFood(FoodType.INVERTEBRATE);
      },
    }));
  }
}
