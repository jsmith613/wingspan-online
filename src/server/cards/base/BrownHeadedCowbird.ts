import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { GameEvent } from '../../powers/PowerEventBus';

export class BrownHeadedCowbird extends BirdCard {
  readonly name = BirdCardName.BROWN_HEADED_COWBIRD;
  readonly commonName = 'Brown-Headed Cowbird';
  readonly scientificName = 'Molothrus ater';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.SEED];
  readonly nestType = NestType.NONE;
  readonly eggCapacity = 0;
  readonly wingspan = 30;
  readonly points = 3;
  readonly powerType = PowerType.PINK;
  readonly powerText = 'When another player takes the “lay eggs” action, lay 1 egg on a bird with a bowl nest.';

  getTriggeredEvents(): GameEvent[] {
    return [GameEvent.EGG_LAID];
  }

  onTrigger(event: GameEvent, triggeringPlayer: Player, owner: Player, _game: Game): boolean {
    if (triggeringPlayer === owner) return false;
    // Lay 1 egg on a bird with the matching nest type
    const birds = owner.board.getAllBirds().filter(b => b.eggs < 5);
    if (birds.length > 0) {
      birds[0].eggs++;
      return true;
    }
    return false;
  }
}
