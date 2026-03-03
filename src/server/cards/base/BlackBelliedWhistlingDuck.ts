import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { PayFoodToTuckFromDeck } from '../../deferredActions/PayFoodToTuckFromDeck';

export class BlackBelliedWhistlingDuck extends BirdCard {
  readonly name = BirdCardName.BLACK_BELLIED_WHISTLING_DUCK;
  readonly commonName = 'Black-Bellied Whistling-Duck';
  readonly scientificName = 'Dendrocygna autumnalis';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.SEED, FoodType.SEED];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 5;
  readonly wingspan = 76;
  readonly points = 2;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Discard 1 seed to tuck 2 card from the deck behind this bird.';

  onActivate(player: Player, game: Game): void {
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    game.deferredActions.push(new PayFoodToTuckFromDeck(player, self, FoodType.SEED, 2, this.powerText));
  }
}
