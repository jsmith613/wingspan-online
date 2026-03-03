import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { TuckCard } from '../../deferredActions/TuckCard';

export class PineSiskin extends BirdCard {
  readonly name = BirdCardName.PINE_SISKIN;
  readonly commonName = 'Pine Siskin';
  readonly scientificName = 'Spinus pinus';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.SEED, FoodType.SEED];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 2;
  readonly wingspan = 23;
  readonly points = 3;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Tuck 1 card from your hand behind this bird. If you do, gain 1 seed from the supply.';

  onActivate(player: Player, _game: Game): void {
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    _game.deferredActions.push(new TuckCard(player, {
      targetBird: self,
      message: 'Optional: tuck 1 card from your hand behind this bird, or skip.',
      onTucked: () => {
        player.addFood(FoodType.SEED);
      },
    }));
  }
}
