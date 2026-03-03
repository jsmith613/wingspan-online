import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { ConfirmSimpleBrownEffect } from '../../deferredActions/ConfirmSimpleBrownEffect';

export class WhiteBreastedNuthatch extends BirdCard {
  readonly name = BirdCardName.WHITE_BREASTED_NUTHATCH;
  readonly commonName = 'White-Breasted Nuthatch';
  readonly scientificName = 'Sitta carolinensis';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 3;
  readonly wingspan = 28;
  readonly points = 2;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Cache 1 seed from the supply on this bird.';

  onActivate(player: Player, game: Game): void {
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    game.deferredActions.push(new ConfirmSimpleBrownEffect(
      player,
      this.powerText,
      () => {
        self.cachedFood++;
      },
    ));
  }
}
