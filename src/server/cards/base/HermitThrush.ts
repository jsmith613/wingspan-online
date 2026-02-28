import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { GainFood } from '../../deferredActions/GainFood';

export class HermitThrush extends BirdCard {
  readonly name = BirdCardName.HERMIT_THRUSH;
  readonly commonName = 'Hermit Thrush';
  readonly scientificName = 'Catharus guttatus';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FRUIT, FoodType.FRUIT];
  readonly nestType = NestType.WILD;
  readonly eggCapacity = 2;
  readonly wingspan = 30;
  readonly points = 7;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Player(s) with the fewest birds in their forest gain 1 die from birdfeeder.';

  onActivate(_player: Player, game: Game): void {
    const players = game.getPlayers();
    const minBirds = Math.min(...players.map(p => p.board.getBirdCount(HabitatType.FOREST)));
    for (const p of players) {
      if (p.board.getBirdCount(HabitatType.FOREST) === minBirds) {
        game.deferredActions.push(new GainFood(p, 1));
      }
    }
  }
}
