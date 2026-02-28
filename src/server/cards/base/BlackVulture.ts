import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { GainFood } from '../../deferredActions/GainFood';
import { GameEvent } from '../../powers/PowerEventBus';

export class BlackVulture extends BirdCard {
  readonly name = BirdCardName.BLACK_VULTURE;
  readonly commonName = 'Black Vulture';
  readonly scientificName = 'Coragyps atratus';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 1;
  readonly wingspan = 150;
  readonly points = 2;
  readonly powerType = PowerType.PINK;
  readonly powerText = 'When another player\'s predator succeeds, gain 1 die from the birdfeeder.';

  getTriggeredEvents(): GameEvent[] {
    return [GameEvent.CARD_TUCKED]; // Predator success results in tuck
  }

  onTrigger(event: GameEvent, triggeringPlayer: Player, owner: Player, game: Game): boolean {
    if (triggeringPlayer === owner) return false;
    game.deferredActions.push(new GainFood(owner, 1));
    return true;
  }
}
