import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { PlayAdditionalBird } from '../../deferredActions/PlayAdditionalBird';

export class TuftedTitmouse extends BirdCard {
  readonly name = BirdCardName.TUFTED_TITMOUSE;
  readonly commonName = 'Tufted Titmouse';
  readonly scientificName = 'Baeolophus bicolor';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED, FoodType.FRUIT];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 3;
  readonly wingspan = 25;
  readonly points = 2;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Play an additional bird in your forest. Pay its normal cost.';

  onPlay(player: Player, game: Game): void {
    game.deferredActions.push(new PlayAdditionalBird(player, [HabitatType.FOREST]));
  }
}
