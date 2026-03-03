import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { DrawThenDiscardOne } from '../../deferredActions/DrawThenDiscardOne';

export class BlackTern extends BirdCard {
  readonly name = BirdCardName.BLACK_TERN;
  readonly commonName = 'Black Tern';
  readonly scientificName = 'Chlidonias niger';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FISH];
  readonly nestType = NestType.WILD;
  readonly eggCapacity = 2;
  readonly wingspan = 61;
  readonly points = 4;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Draw 1 card. If you do, discard 1 card from your hand at the end of your turn.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new DrawThenDiscardOne(player, 1, this.powerText));
  }
}
