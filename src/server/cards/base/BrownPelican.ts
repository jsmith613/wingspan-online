import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class BrownPelican extends BirdCard {
  readonly name = BirdCardName.BROWN_PELICAN;
  readonly commonName = 'Brown Pelican';
  readonly scientificName = 'Pelecanus occidentalis';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.FISH, FoodType.FISH];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 2;
  readonly wingspan = 201;
  readonly points = 4;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Gain 3 fish from the supply.';

  onPlay(player: Player, _game: Game): void {
    for (let i = 0; i < 3; i++) {
      player.addFood(FoodType.FISH);
    }
  }
}
