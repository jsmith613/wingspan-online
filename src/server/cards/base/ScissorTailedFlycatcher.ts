import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class ScissorTailedFlycatcher extends BirdCard {
  readonly name = BirdCardName.SCISSOR_TAILED_FLYCATCHER;
  readonly commonName = 'Scissor-Tailed Flycatcher';
  readonly scientificName = 'Tyrannus forficatus';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.INVERTEBRATE, FoodType.FRUIT];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 2;
  readonly wingspan = 38;
  readonly points = 8;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'All players gain 1 invertebrate from the supply.';

  onActivate(_player: Player, game: Game): void {
    for (const p of game.getPlayers()) {
      p.addFood(FoodType.INVERTEBRATE);
    }
  }
}
