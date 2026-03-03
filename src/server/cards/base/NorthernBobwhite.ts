import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { ConfirmSimpleBrownEffect } from '../../deferredActions/ConfirmSimpleBrownEffect';

export class NorthernBobwhite extends BirdCard {
  readonly name = BirdCardName.NORTHERN_BOBWHITE;
  readonly commonName = 'Northern Bobwhite';
  readonly scientificName = 'Colinus virginianus';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.SEED, FoodType.SEED, FoodType.SEED];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 6;
  readonly wingspan = 33;
  readonly points = 5;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Lay 1 egg on this bird.';

  onActivate(player: Player, game: Game): void {
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    const canConfirm = self.eggs < this.eggCapacity;
    game.deferredActions.push(new ConfirmSimpleBrownEffect(
      player,
      this.powerText,
      () => {
        if (self.eggs < this.eggCapacity) {
          self.eggs++;
        }
      },
      canConfirm,
      'No space for more eggs on this bird',
    ));
  }
}
