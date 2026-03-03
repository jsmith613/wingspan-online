import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { DrawBonusCardsKeepOne } from '../../deferredActions/DrawBonusCardsKeepOne';

export class CaliforniaCondor extends BirdCard {
  readonly name = BirdCardName.CALIFORNIA_CONDOR;
  readonly commonName = 'California Condor';
  readonly scientificName = 'Gymnogyps californianus';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 1;
  readonly wingspan = 277;
  readonly points = 1;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Draw 2 new bonus cards and keep 1.';

  onPlay(player: Player, game: Game): void {
    game.deferredActions.push(new DrawBonusCardsKeepOne(player));
  }
}

