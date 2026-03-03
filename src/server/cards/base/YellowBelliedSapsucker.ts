import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { ConfirmSimpleBrownEffect } from '../../deferredActions/ConfirmSimpleBrownEffect';

export class YellowBelliedSapsucker extends BirdCard {
  readonly name = BirdCardName.YELLOW_BELLIED_SAPSUCKER;
  readonly commonName = 'Yellow-Bellied Sapsucker';
  readonly scientificName = 'Sphyrapicus varius';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FRUIT];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 3;
  readonly wingspan = 41;
  readonly points = 3;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Gain 1 invertebrate from the supply.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new ConfirmSimpleBrownEffect(player, this.powerText, () => {
      player.addFood(FoodType.INVERTEBRATE);
    }));
  }
}
