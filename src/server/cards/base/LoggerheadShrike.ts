import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { GameEvent } from '../../powers/PowerEventBus';

export class LoggerheadShrike extends BirdCard {
  readonly name = BirdCardName.LOGGERHEAD_SHRIKE;
  readonly commonName = 'Loggerhead Shrike';
  readonly scientificName = 'Lanius ludovicianus';
  readonly habitats = [HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.RODENT];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 4;
  readonly wingspan = 30;
  readonly points = 3;
  readonly powerType = PowerType.PINK;
  readonly powerText = 'When another player takes the “gain food” action, if they gain any number of rodent, cache 1 rodent from the supply on this bird.';

  getTriggeredEvents(): GameEvent[] {
    return [GameEvent.FOOD_GAINED];
  }

  onTrigger(event: GameEvent, triggeringPlayer: Player, owner: Player, _game: Game): boolean {
    if (triggeringPlayer === owner) return false;
    const self = owner.board.getAllBirds().find(b => b.name === this.name);
    if (self) {
      self.cachedFood++;
      return true;
    }
    return false;
  }
}
