import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { GameEvent } from '../../powers/PowerEventBus';

export class HornedLark extends BirdCard {
  readonly name = BirdCardName.HORNED_LARK;
  readonly commonName = 'Horned Lark';
  readonly scientificName = 'Eremophila alpestris';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 4;
  readonly wingspan = 30;
  readonly points = 5;
  readonly powerType = PowerType.PINK;
  readonly powerText = 'When another player plays a bird in their grassland, tuck 1 card from your hand behind this bird.';

  getTriggeredEvents(): GameEvent[] {
    return [GameEvent.BIRD_PLAYED];
  }

  onTrigger(event: GameEvent, triggeringPlayer: Player, owner: Player, _game: Game): boolean {
    if (triggeringPlayer === owner) return false;
    if (owner.hand.length === 0) return false;
    const self = owner.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return false;
    const card = owner.hand.shift();
    if (card) {
      self.tuckedCards++;
      return true;
    }
    return false;
  }
}
