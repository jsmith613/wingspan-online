import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { DrawThenDiscardOne } from '../../deferredActions/DrawThenDiscardOne';

export class RuddyDuck extends BirdCard {
  readonly name = BirdCardName.RUDDY_DUCK;
  readonly commonName = 'Ruddy Duck';
  readonly scientificName = 'Oxyura jamaicensis';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 5;
  readonly wingspan = 48;
  readonly points = 0;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Draw 2 card. If you do, discard 1 card from your hand at the end of your turn.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new DrawThenDiscardOne(player, 2, this.powerText));
  }
}
