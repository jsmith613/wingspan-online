import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { TuckCard } from '../../deferredActions/TuckCard';

export class PurpleMartin extends BirdCard {
  readonly name = BirdCardName.PURPLE_MARTIN;
  readonly commonName = 'Purple Martin';
  readonly scientificName = 'Progne subis';
  readonly habitats = [HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 3;
  readonly wingspan = 46;
  readonly points = 2;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Tuck 1 card from your hand behind this bird. If you do, draw 1 card.';

  onActivate(player: Player, game: Game): void {
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    game.deferredActions.push(new TuckCard(player, {
      targetBird: self,
      message: 'Optional: tuck 1 card from your hand behind this bird, or skip.',
      onTucked: () => {
        const drawn = game.drawFromDeck();
        if (drawn) player.addCardToHand(drawn);
      },
    }));
  }
}
