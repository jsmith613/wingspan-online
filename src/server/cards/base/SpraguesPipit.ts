import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { DrawBonusCardsKeepOne } from '../../deferredActions/DrawBonusCardsKeepOne';

export class SpraguesPipit extends BirdCard {
  readonly name = BirdCardName.SPRAGUES_PIPIT;
  readonly commonName = 'Sprague\'s Pipit';
  readonly scientificName = 'Anthus spragueii';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 3;
  readonly wingspan = 25;
  readonly points = 3;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Draw 2 new bonus cards and keep 1.';

  onPlay(player: Player, game: Game): void {
    game.deferredActions.push(new DrawBonusCardsKeepOne(player));
  }
}

