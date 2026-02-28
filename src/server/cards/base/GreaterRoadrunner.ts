import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class GreaterRoadrunner extends BirdCard {
  readonly name = BirdCardName.GREATER_ROADRUNNER;
  readonly commonName = 'Greater Roadrunner';
  readonly scientificName = 'Geococcyx californianus';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.RODENT, FoodType.WILD];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 2;
  readonly wingspan = 56;
  readonly points = 7;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Look at a card from the deck. If less than 50cm, tuck it behind this bird. If not, discard it.';

  onActivate(player: Player, game: Game): void {
    const card = game.drawFromDeck();
    if (!card) return;
    const birdCard = game.createBirdCardInstance(card);
    if (birdCard && birdCard.wingspan < 50) {
      const self = player.board.getAllBirds().find(b => b.name === this.name);
      if (self) self.tuckedCards++;
    } else {
      game.discardBirdCard(card);
    }
  }
}
