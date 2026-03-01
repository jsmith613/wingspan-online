import { DeferredAction, ActionPriority } from './DeferredAction';
import type { Player } from '../Player';
import type { Game } from '../Game';
import { PlayerInputModel } from '../../common/input/PlayerInputModel';
import { InputType } from '../../common/input/InputType';
import { BirdCardName } from '../../common/cards/BirdCardName';
import { HabitatType } from '../../common/game/HabitatType';
import { createBirdCard } from '../cards/createCard';
import { FoodType } from '../../common/game/FoodType';
import { PayBirdCost, canAffordBirdFoodCost } from './PayBirdCost';

/**
 * White power helper: play one additional bird in restricted habitat(s), paying normal costs.
 */
export class PlayAdditionalBird extends DeferredAction {
  private readonly allowedHabitats: ReadonlyArray<HabitatType>;
  private selectedBird: BirdCardName | null = null;
  private selectedHabitat: HabitatType | null = null;
  private selectedCard: import('../cards/BirdCard').BirdCard | null = null;
  private paymentAction: PayBirdCost | null = null;

  constructor(player: Player, allowedHabitats: ReadonlyArray<HabitatType>) {
    super(player, ActionPriority.DEFAULT);
    this.allowedHabitats = [...new Set(allowedHabitats)];
  }

  execute(_game: Game): PlayerInputModel | undefined {
    return this.askForBird();
  }

  handleInput(game: Game, response: unknown): PlayerInputModel | undefined {
    const input = response as any;

    if (this.paymentAction) {
      const next = this.paymentAction.handleInput?.(game, response);
      if (next) return next;

      if (this.selectedBird && this.selectedHabitat && this.selectedCard) {
        game.playBirdFromHand(this.player, this.selectedBird, this.selectedHabitat, this.selectedCard);
      }
      this.resetSelection();
      return undefined;
    }

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
      this.selectedCard = card;
      const availableHabitats = this.getAllowedPlayableHabitats(card.habitats);
      if (availableHabitats.length === 0) {
        this.resetSelection();
        return this.askForBird();
      }

      if (availableHabitats.length === 1) {
        return this.beginBirdPayment(game, selectedBird, availableHabitats[0], card);
      }

      return {
        type: InputType.SELECT_HABITAT_SLOT,
        availableHabitats,
        lockBack: true,
      };
    }

    const selectedHabitat = (input.selectedHabitat || input.habitat) as HabitatType | undefined;
    const card = this.selectedCard ?? createBirdCard(this.selectedBird);
    if (!card) {
      this.resetSelection();
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

    return this.beginBirdPayment(game, this.selectedBird, selectedHabitat, card);
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

    if (!canAffordBirdFoodCost(this.player.food, card.foodCost)) return false;

    const playableHabitats = this.getAllowedPlayableHabitats(card.habitats);
    return playableHabitats.some(h => this.player.canAffordEggCost(this.player.getEggCostForHabitat(h)));
  }

  private beginBirdPayment(
    game: Game,
    birdName: BirdCardName,
    habitat: HabitatType,
    card: import('../cards/BirdCard').BirdCard,
  ): PlayerInputModel | undefined {
    this.selectedBird = birdName;
    this.selectedHabitat = habitat;
    this.selectedCard = card;

    if (card.foodCost.length === 0) {
      game.playBirdFromHand(this.player, birdName, habitat, card);
      this.resetSelection();
      return undefined;
    }

    this.paymentAction = new PayBirdCost(this.player, card.foodCost);
    const input = this.paymentAction.execute(game);
    if (input) return input;

    game.playBirdFromHand(this.player, birdName, habitat, card);
    this.resetSelection();
    return undefined;
  }

  private resetSelection(): void {
    this.selectedBird = null;
    this.selectedHabitat = null;
    this.selectedCard = null;
    this.paymentAction = null;
  }

  private getAllowedPlayableHabitats(cardHabitats: ReadonlyArray<HabitatType>): HabitatType[] {
    return cardHabitats.filter(h => this.allowedHabitats.includes(h) && this.player.board.hasSpace(h));
  }
}
