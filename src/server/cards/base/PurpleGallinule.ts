import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { AllPlayersDrawFromDeck } from '../../deferredActions/AllPlayersDrawFromDeck';

export class PurpleGallinule extends BirdCard {
  readonly name = BirdCardName.PURPLE_GALLINULE;
  readonly commonName = 'Purple Gallinule';
  readonly scientificName = 'Porphyrio martinicus';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.SEED, FoodType.FRUIT, FoodType.WILD];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 4;
  readonly wingspan = 56;
  readonly points = 7;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'All players draw 1 card from the deck.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new AllPlayersDrawFromDeck(player, 1, this.powerText));
  }
}
