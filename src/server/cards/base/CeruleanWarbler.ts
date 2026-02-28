import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class CeruleanWarbler extends BirdCard {
  readonly name = BirdCardName.CERULEAN_WARBLER;
  readonly commonName = 'Cerulean Warbler';
  readonly scientificName = 'Setophaga cerulea';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 2;
  readonly wingspan = 20;
  readonly points = 4;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Draw 2 new bonus cards and keep 1.';

  onPlay(_player: Player, _game: Game): void {
    // TODO: Draw 2 bonus cards and keep 1 - requires bonus card draw system
  }
}
