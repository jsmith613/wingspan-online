import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { PlayAdditionalBird } from '../../deferredActions/PlayAdditionalBird';

export class MountainBluebird extends BirdCard {
  readonly name = BirdCardName.MOUNTAIN_BLUEBIRD;
  readonly commonName = 'Mountain Bluebird';
  readonly scientificName = 'Sialia currucoides';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FRUIT];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 5;
  readonly wingspan = 36;
  readonly points = 4;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Play an additional bird in your grassland. Pay its normal cost.';

  onPlay(player: Player, game: Game): void {
    game.deferredActions.push(new PlayAdditionalBird(player, [HabitatType.GRASSLAND]));
  }
}
