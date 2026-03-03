import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { DrawThenDiscardOne } from '../../deferredActions/DrawThenDiscardOne';

export class RedBreastedMerganser extends BirdCard {
  readonly name = BirdCardName.RED_BREASTED_MERGANSER;
  readonly commonName = 'Red-Breasted Merganser';
  readonly scientificName = 'Mergus serrator';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FISH];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 4;
  readonly wingspan = 78;
  readonly points = 3;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Draw 2 card. If you do, discard 1 card from your hand at the end of your turn.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new DrawThenDiscardOne(player, 2, this.powerText));
  }
}
