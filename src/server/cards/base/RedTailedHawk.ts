import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

/**
 * Red-tailed Hawk - White power: When played, draw 2 cards.
 * Habitats: Forest. Nest: Platform. Eggs: 2. Wingspan: 122cm. Points: 5.
 * Food: Rodent, Rodent.
 */
export class RedTailedHawk extends BirdCard {
  readonly name = BirdCardName.RED_TAILED_HAWK;
  readonly commonName = 'Red-tailed Hawk';
  readonly scientificName = 'Buteo jamaicensis';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.RODENT, FoodType.RODENT];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 2;
  readonly wingspan = 122;
  readonly points = 5;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'When played: draw 2 cards.';

  onPlay(player: Player, game: Game): void {
    for (let i = 0; i < 2; i++) {
      const card = game.drawFromDeck();
      if (card) player.addCardToHand(card);
    }
  }
}
