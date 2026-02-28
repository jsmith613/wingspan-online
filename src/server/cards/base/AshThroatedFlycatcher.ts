import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { LayEggs } from '../../deferredActions/LayEggs';

export class AshThroatedFlycatcher extends BirdCard {
  readonly name = BirdCardName.ASH_THROATED_FLYCATCHER;
  readonly commonName = 'Ash-Throated Flycatcher';
  readonly scientificName = 'Myiarchus cinerascens';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.INVERTEBRATE, FoodType.FRUIT];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 4;
  readonly wingspan = 30;
  readonly points = 4;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Lay 1 egg on each of your birds with a cavity nest.';

  onPlay(player: Player, _game: Game): void {
    for (const bird of player.board.getAllBirds()) {
      const birdCard = _game.createBirdCardInstance(bird.name as any);
      if (birdCard && birdCard.nestType === NestType.CAVITY && bird.eggs < birdCard.eggCapacity) {
        bird.eggs++;
      }
    }
  }
}
