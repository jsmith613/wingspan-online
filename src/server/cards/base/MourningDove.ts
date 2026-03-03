import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { ConfirmSimpleBrownEffect } from '../../deferredActions/ConfirmSimpleBrownEffect';

export class MourningDove extends BirdCard {
  readonly name = BirdCardName.MOURNING_DOVE;
  readonly commonName = 'Mourning Dove';
  readonly scientificName = 'Zenaida macroura';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [FoodType.SEED];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 5;
  readonly wingspan = 46;
  readonly points = 0;
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
