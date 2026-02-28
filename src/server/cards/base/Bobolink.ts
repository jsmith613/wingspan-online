import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { LayEggs } from '../../deferredActions/LayEggs';

export class Bobolink extends BirdCard {
  readonly name = BirdCardName.BOBOLINK;
  readonly commonName = 'Bobolink';
  readonly scientificName = 'Dolichonyx oryzivorus';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED, FoodType.SEED];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 3;
  readonly wingspan = 30;
  readonly points = 4;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Lay 1 egg on each of your birds with a ground nest.';

  onPlay(player: Player, _game: Game): void {
    for (const bird of player.board.getAllBirds()) {
      const birdCard = _game.createBirdCardInstance(bird.name as any);
      if (birdCard && birdCard.nestType === NestType.GROUND && bird.eggs < birdCard.eggCapacity) {
        bird.eggs++;
      }
    }
  }
}
