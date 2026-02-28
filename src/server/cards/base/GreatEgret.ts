import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { PlayAdditionalBird } from '../../deferredActions/PlayAdditionalBird';

export class GreatEgret extends BirdCard {
  readonly name = BirdCardName.GREAT_EGRET;
  readonly commonName = 'Great Egret';
  readonly scientificName = 'Ardea alba';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.FISH, FoodType.FISH, FoodType.RODENT];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 3;
  readonly wingspan = 130;
  readonly points = 7;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Play an additional bird in your wetland. Pay its normal cost.';

  onPlay(player: Player, game: Game): void {
    game.deferredActions.push(new PlayAdditionalBird(player, [HabitatType.WETLAND]));
  }
}
