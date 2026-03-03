import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { DrawBonusCardsKeepOne } from '../../deferredActions/DrawBonusCardsKeepOne';

export class RoseateSpoonbill extends BirdCard {
  readonly name = BirdCardName.ROSEATE_SPOONBILL;
  readonly commonName = 'Roseate Spoonbill';
  readonly scientificName = 'Platalea ajaja';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED, FoodType.FISH];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 2;
  readonly wingspan = 127;
  readonly points = 6;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Draw 2 new bonus cards and keep 1.';

  onPlay(player: Player, game: Game): void {
    game.deferredActions.push(new DrawBonusCardsKeepOne(player));
  }
}

