import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { PayFoodToTuckFromDeck } from '../../deferredActions/PayFoodToTuckFromDeck';

export class CanadaGoose extends BirdCard {
  readonly name = BirdCardName.CANADA_GOOSE;
  readonly commonName = 'Canada Goose';
  readonly scientificName = 'Branta canadensis';
  readonly habitats = [HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [FoodType.SEED, FoodType.SEED];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 3;
  readonly wingspan = 132;
  readonly points = 3;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Discard 1 seed to tuck 2 card from the deck behind this bird.';

  onActivate(player: Player, game: Game): void {
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    game.deferredActions.push(new PayFoodToTuckFromDeck(player, self, FoodType.SEED, 2, this.powerText));
  }
}
