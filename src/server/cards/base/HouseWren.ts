import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { PlayAdditionalBird } from '../../deferredActions/PlayAdditionalBird';

export class HouseWren extends BirdCard {
  readonly name = BirdCardName.HOUSE_WREN;
  readonly commonName = 'House Wren';
  readonly scientificName = 'Troglodytes aedon';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 5;
  readonly wingspan = 15;
  readonly points = 1;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Play an additional bird in this bird\'s habitat. Pay its normal cost.';

  onPlay(player: Player, game: Game, playedHabitat?: HabitatType): void {
    if (!playedHabitat) return;
    game.deferredActions.push(new PlayAdditionalBird(player, [playedHabitat]));
  }
}
