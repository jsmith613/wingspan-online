import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { LayEggs } from '../../deferredActions/LayEggs';

export class SaysPhoebe extends BirdCard {
  readonly name = BirdCardName.SAYS_PHOEBE;
  readonly commonName = 'Say\'s Phoebe';
  readonly scientificName = 'Sayornis saya';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.INVERTEBRATE, FoodType.INVERTEBRATE];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 3;
  readonly wingspan = 33;
  readonly points = 5;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Lay 1 egg on each of your birds with a bowl nest.';

  onPlay(player: Player, _game: Game): void {
    for (const bird of player.board.getAllBirds()) {
      const birdCard = _game.createBirdCardInstance(bird.name as any);
      if (birdCard && birdCard.nestType === NestType.BOWL && bird.eggs < birdCard.eggCapacity) {
        bird.eggs++;
      }
    }
  }
}
