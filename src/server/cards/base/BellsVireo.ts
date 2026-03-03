import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { DrawBonusCardsKeepOne } from '../../deferredActions/DrawBonusCardsKeepOne';

export class BellsVireo extends BirdCard {
  readonly name = BirdCardName.BELLS_VIREO;
  readonly commonName = 'Bell\'s Vireo';
  readonly scientificName = 'Vireo bellii';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.INVERTEBRATE];
  readonly nestType = NestType.WILD;
  readonly eggCapacity = 2;
  readonly wingspan = 18;
  readonly points = 4;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Draw 2 new bonus cards and keep 1.';

  onPlay(player: Player, game: Game): void {
    game.deferredActions.push(new DrawBonusCardsKeepOne(player));
  }
}

