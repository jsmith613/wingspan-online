import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

/**
 * Northern Cardinal - White power: When played, each other player gains 1 seed from the supply.
 * Habitats: Forest, Grassland. Nest: Bowl. Eggs: 4. Wingspan: 30cm. Points: 3.
 * Food: Seed, Fruit.
 */
export class NorthernCardinal extends BirdCard {
  readonly name = BirdCardName.NORTHERN_CARDINAL;
  readonly commonName = 'Northern Cardinal';
  readonly scientificName = 'Cardinalis cardinalis';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.SEED, FoodType.FRUIT];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 4;
  readonly wingspan = 30;
  readonly points = 3;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'When played: each other player gains 1 seed from the supply.';

  onPlay(player: Player, game: Game): void {
    for (const p of game.players) {
      if (p !== player) {
        p.addFood(FoodType.SEED);
      }
    }
  }
}
