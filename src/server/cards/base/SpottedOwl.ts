import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class SpottedOwl extends BirdCard {
  readonly name = BirdCardName.SPOTTED_OWL;
  readonly commonName = 'Spotted Owl';
  readonly scientificName = 'Strix occidentalis';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.RODENT, FoodType.RODENT];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 1;
  readonly wingspan = 102;
  readonly points = 5;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Draw 2 new bonus cards and keep 1.';

  onPlay(_player: Player, _game: Game): void {
    // TODO: Draw 2 bonus cards and keep 1 - requires bonus card draw system
  }
}
