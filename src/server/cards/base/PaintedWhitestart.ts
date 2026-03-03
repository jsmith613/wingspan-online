import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { ConfirmSimpleBrownEffect } from '../../deferredActions/ConfirmSimpleBrownEffect';

export class PaintedWhitestart extends BirdCard {
  readonly name = BirdCardName.PAINTED_WHITESTART;
  readonly commonName = 'Painted Whitestart';
  readonly scientificName = 'Myioborus pictus';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.INVERTEBRATE];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 3;
  readonly wingspan = 22;
  readonly points = 1;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Gain 1 invertebrate from the supply.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new ConfirmSimpleBrownEffect(player, this.powerText, () => {
      player.addFood(FoodType.INVERTEBRATE);
    }));
  }
}
