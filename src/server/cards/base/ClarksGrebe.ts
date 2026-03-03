import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { DrawThenDiscardOne } from '../../deferredActions/DrawThenDiscardOne';

export class ClarksGrebe extends BirdCard {
  readonly name = BirdCardName.CLARKS_GREBE;
  readonly commonName = 'Clark\'s Grebe';
  readonly scientificName = 'Aechmophorus clarkii';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.FISH];
  readonly nestType = NestType.WILD;
  readonly eggCapacity = 2;
  readonly wingspan = 61;
  readonly points = 5;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Draw 1 card. If you do, discard 1 card from your hand at the end of your turn.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new DrawThenDiscardOne(player, 1, this.powerText));
  }
}
