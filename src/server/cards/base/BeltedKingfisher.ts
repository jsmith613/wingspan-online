import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { GameEvent } from '../../powers/PowerEventBus';

export class BeltedKingfisher extends BirdCard {
  readonly name = BirdCardName.BELTED_KINGFISHER;
  readonly commonName = 'Belted Kingfisher';
  readonly scientificName = 'Megaceryle alcyon';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.FISH, FoodType.WILD];
  readonly nestType = NestType.WILD;
  readonly eggCapacity = 4;
  readonly wingspan = 53;
  readonly points = 4;
  readonly powerType = PowerType.PINK;
  readonly powerText = 'When another player plays a bird in their wetland, gain 1 fish from the supply.';

  getTriggeredEvents(): GameEvent[] {
    return [GameEvent.BIRD_PLAYED];
  }

  onTrigger(event: GameEvent, triggeringPlayer: Player, owner: Player, _game: Game): boolean {
    if (triggeringPlayer === owner) return false;
    owner.addFood(FoodType.FISH);
    return true;
  }
}
