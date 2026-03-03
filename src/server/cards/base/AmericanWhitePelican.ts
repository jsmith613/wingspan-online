import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { PayFoodToTuckFromDeck } from '../../deferredActions/PayFoodToTuckFromDeck';

export class AmericanWhitePelican extends BirdCard {
  readonly name = BirdCardName.AMERICAN_WHITE_PELICAN;
  readonly commonName = 'American White Pelican';
  readonly scientificName = 'Pelecanus erythrorhynchos';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.FISH, FoodType.FISH];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 1;
  readonly wingspan = 274;
  readonly points = 5;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Discard 1 fish to tuck 2 card from the deck behind this bird.';

  onActivate(player: Player, game: Game): void {
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    game.deferredActions.push(new PayFoodToTuckFromDeck(player, self, FoodType.FISH, 2, this.powerText));
  }
}
