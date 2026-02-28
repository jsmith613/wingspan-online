import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { PlayAdditionalBird } from '../../deferredActions/PlayAdditionalBird';

export class RubyCrownedKinglet extends BirdCard {
  readonly name = BirdCardName.RUBY_CROWNED_KINGLET;
  readonly commonName = 'Ruby-Crowned Kinglet';
  readonly scientificName = 'Regulus calendula';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED, FoodType.FRUIT];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 3;
  readonly wingspan = 20;
  readonly points = 2;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Play an additional bird in your forest. Pay its normal cost.';

  onPlay(player: Player, game: Game): void {
    game.deferredActions.push(new PlayAdditionalBird(player, [HabitatType.FOREST]));
  }
}
