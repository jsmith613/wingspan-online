import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { PlayAdditionalBird } from '../../deferredActions/PlayAdditionalBird';

export class SavannahSparrow extends BirdCard {
  readonly name = BirdCardName.SAVANNAH_SPARROW;
  readonly commonName = 'Savannah Sparrow';
  readonly scientificName = 'Passerculus sandwichensis';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 3;
  readonly wingspan = 18;
  readonly points = 2;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Play an additional bird in your grassland. Pay its normal cost.';

  onPlay(player: Player, game: Game): void {
    game.deferredActions.push(new PlayAdditionalBird(player, [HabitatType.GRASSLAND]));
  }
}
