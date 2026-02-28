import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class SandhillCrane extends BirdCard {
  readonly name = BirdCardName.SANDHILL_CRANE;
  readonly commonName = 'Sandhill Crane';
  readonly scientificName = 'Antigone canadensis';
  readonly habitats = [HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [FoodType.SEED, FoodType.SEED, FoodType.WILD];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 1;
  readonly wingspan = 196;
  readonly points = 5;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Discard 1 seed to tuck 2 card from the deck behind this bird.';

  onActivate(player: Player, game: Game): void {
    if (!player.removeFood(FoodType.SEED)) return;
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    for (let i = 0; i < 2; i++) {
      const card = game.drawFromDeck();
      if (card) {
        self.tuckedCards++;
        game.discardBirdCard(card);
      }
    }
  }
}
