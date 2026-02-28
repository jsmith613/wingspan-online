import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class GoldenEagle extends BirdCard {
  readonly name = BirdCardName.GOLDEN_EAGLE;
  readonly commonName = 'Golden Eagle';
  readonly scientificName = 'Aquila chrysaetos';
  readonly habitats = [HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [FoodType.RODENT, FoodType.RODENT, FoodType.RODENT];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 1;
  readonly wingspan = 201;
  readonly points = 8;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Look at a card from the deck. If less than 100cm, tuck it behind this bird. If not, discard it.';

  onActivate(player: Player, game: Game): void {
    const card = game.drawFromDeck();
    if (!card) return;
    const birdCard = game.createBirdCardInstance(card);
    if (birdCard && birdCard.wingspan < 100) {
      const self = player.board.getAllBirds().find(b => b.name === this.name);
      if (self) self.tuckedCards++;
    } else {
      game.discardBirdCard(card);
    }
  }
}
