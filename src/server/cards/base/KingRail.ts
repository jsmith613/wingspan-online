import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { DrawBonusCardsKeepOne } from '../../deferredActions/DrawBonusCardsKeepOne';

export class KingRail extends BirdCard {
  readonly name = BirdCardName.KING_RAIL;
  readonly commonName = 'King Rail';
  readonly scientificName = 'Rallus elegans';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FISH, FoodType.WILD];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 6;
  readonly wingspan = 51;
  readonly points = 4;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Draw 2 new bonus cards and keep 1.';

  onPlay(player: Player, game: Game): void {
    game.deferredActions.push(new DrawBonusCardsKeepOne(player));
  }
}

