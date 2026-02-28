import { DeferredAction, ActionPriority } from './DeferredAction';
import type { Player } from '../Player';
import type { Game } from '../Game';
import { PlayerInputModel } from '../../common/input/PlayerInputModel';
import { InputType } from '../../common/input/InputType';
import { BirdCardName } from '../../common/cards/BirdCardName';
import { HabitatType } from '../../common/game/HabitatType';
import { createBirdCard } from '../cards/createCard';
import { FoodType } from '../../common/game/FoodType';

/**
 * White power helper: play one additional bird in restricted habitat(s), paying normal costs.
 */
export class PlayAdditionalBird extends DeferredAction {
  private readonly allowedHabitats: ReadonlyArray<HabitatType>;
  private selectedBird: BirdCardName | null = null;

  constructor(player: Player, allowedHabitats: ReadonlyArray<HabitatType>) {
    super(player, ActionPriority.DEFAULT);
    this.allowedHabitats = [...new Set(allowedHabitats)];
  }

  execute(_game: Game): PlayerInputModel | undefined {
    return this.askForBird();
  }

  handleInput(game: Game, response: unknown): PlayerInputModel | undefined {
    const input = response as any;

    if (this.selectedBird === null) {
      const selectedBird = ((input.selectedBirds || [])[0] || input.selectedBird) as BirdCardName | undefined;
      if (!selectedBird) {
        return this.askForBird();
      }

      const card = createBirdCard(selectedBird);
      if (!card) {
        return this.askForBird();
      }

      this.selectedBird = selectedBird;
      const availableHabitats = this.getAllowedPlayableHabitats(card.habitats);
      if (availableHabitats.length === 0) {
        this.selectedBird = null;
        return this.askForBird();
      }

      if (availableHabitats.length === 1) {
        game.playBirdFromHand(this.player, selectedBird, availableHabitats[0], card);
        this.selectedBird = null;
        return undefined;
      }

      return {
        type: InputType.SELECT_HABITAT_SLOT,
        availableHabitats,
        lockBack: true,
      };
    }

    const selectedHabitat = (input.selectedHabitat || input.habitat) as HabitatType | undefined;
    const card = createBirdCard(this.selectedBird);
    if (!card) {
      this.selectedBird = null;
      return this.askForBird();
    }

    const availableHabitats = this.getAllowedPlayableHabitats(card.habitats);
    if (!selectedHabitat || !availableHabitats.includes(selectedHabitat)) {
      return {
        type: InputType.SELECT_HABITAT_SLOT,
        availableHabitats,
        lockBack: true,
      };
    }

    game.playBirdFromHand(this.player, this.selectedBird, selectedHabitat, card);
    this.selectedBird = null;
    return undefined;
  }

  /**
   * Additional-bird powers should not allow cancel/back into top-level action refund flow.
   */
  isCancellationLocked(): boolean {
    return true;
  }

  private askForBird(): PlayerInputModel | undefined {
    const availableBirds = this.player.hand.filter(name => this.canPlayInAllowedHabitats(name));
    if (availableBirds.length === 0) {
      return undefined;
    }

    const birdDetails = availableBirds.map(name => {
      const card = createBirdCard(name);
      if (card) return card.toClientCard();
      return {
        name,
        commonName: String(name).replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
        scientificName: '',
        habitats: Object.values(HabitatType),
        foodCost: [] as FoodType[],
        nestType: 'BOWL' as any,
        eggCapacity: 0,
        wingspan: 0,
        points: 0,
        powerType: 'NONE' as any,
        powerText: '',
        eggs: 0,
        cachedFood: 0,
        tuckedCards: 0,
      };
    });

    return {
      type: InputType.SELECT_BIRD,
      availableBirds,
      birdDetails,
      lockBack: true,
      min: 1,
      max: 1,
    };
  }

  private canPlayInAllowedHabitats(name: BirdCardName): boolean {
    const card = createBirdCard(name);
    if (!card) return false;

    const foodCost = { foods: [...card.foodCost], totalRequired: card.foodCost.length, wildCount: 0 };
    if (!this.player.canAffordFoodCost(foodCost)) return false;

    const playableHabitats = this.getAllowedPlayableHabitats(card.habitats);
    return playableHabitats.some(h => this.player.canAffordEggCost(this.player.getEggCostForHabitat(h)));
  }

  private getAllowedPlayableHabitats(cardHabitats: ReadonlyArray<HabitatType>): HabitatType[] {
    return cardHabitats.filter(h => this.allowedHabitats.includes(h) && this.player.board.hasSpace(h));
  }
}
