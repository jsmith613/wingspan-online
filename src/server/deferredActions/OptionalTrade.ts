import { DeferredAction, ActionPriority } from './DeferredAction';
import { GainFood } from './GainFood';
import { LayEggs } from './LayEggs';
import type { Player } from '../Player';
import type { Game } from '../Game';
import { PlayerInputModel } from '../../common/input/PlayerInputModel';
import { InputType } from '../../common/input/InputType';
import { HabitatType } from '../../common/game/HabitatType';
import { FoodType } from '../../common/game/FoodType';
import { createBirdCard } from '../cards/createCard';
import { BirdCardName } from '../../common/cards/BirdCardName';

const SKIP = 'SKIP_TRADE';
const BACK = 'BACK_TRADE';

/**
 * Optional trade action available at odd bird counts in a habitat.
 * Skips the accept/decline prompt and goes straight to the resource selection
 * with a "Skip" button to decline.
 *
 * - Forest: discard 1 card → gain 1 food (player chooses type from general supply)
 * - Grassland: pay 1 food → lay 1 extra egg
 * - Wetland: discard 1 egg → draw 1 extra card
 */
export class OptionalTrade extends DeferredAction {
  private readonly habitat: HabitatType;
  private phase: 'pick-card' | 'pick-food' | 'pick-egg' | 'pick-wetland-card' = 'pick-card';
  private pendingEggBird: string | null = null;

  constructor(player: Player, habitat: HabitatType) {
    super(player, ActionPriority.TRADE);
    this.habitat = habitat;
  }

  isCancellationLocked(): boolean {
    return true;
  }

  execute(_game: Game): PlayerInputModel | undefined {
    if (!this.canTrade()) {
      return undefined;
    }
    return this.showTradeChoice();
  }

  handleInput(game: Game, response: unknown): PlayerInputModel | undefined {
    const input = response as any;
    const selected: string = input.selectedOption || input;

    if (selected === SKIP) {
      return undefined;
    }

    if (this.phase === 'pick-card') {
      // Forest trade: player chose which card to discard, then gain 1 food from birdfeeder
      const cardName = selected.startsWith('TRAY:') ? selected.split(':')[1] : selected;
      this.player.removeCardFromHand(cardName as BirdCardName);
      game.deferredActions.push(new GainFood(this.player, 1));
      return undefined;
    }

    if (this.phase === 'pick-food') {
      // Grassland trade: player chose which food to pay
      this.player.removeFood(selected as FoodType);
      game.deferredActions.push(new LayEggs(this.player, 1));
      return undefined;
    }

    if (this.phase === 'pick-egg') {
      // Wetland trade step 1: player chose which bird — don't remove egg yet
      this.pendingEggBird = selected;
      return this.showWetlandCardSelection(game);
    }

    if (this.phase === 'pick-wetland-card') {
      if (selected === BACK) {
        this.pendingEggBird = null;
        return this.showWetlandTrade();
      }
      // Wetland trade step 2: player chose a card — now remove the egg
      const bird = this.player.board.getAllBirds().find(b => b.name === this.pendingEggBird);
      if (bird && bird.eggs > 0) {
        bird.eggs--;
      }
      if (selected === 'DRAW_FROM_DECK') {
        const drawn = game.drawFromDeck();
        if (drawn) {
          this.player.addCardToHand(drawn);
        }
      } else if (selected.startsWith('TRAY:')) {
        const cardName = selected.split(':')[1];
        const card = game.takeFromTray(cardName as BirdCardName);
        if (card) {
          this.player.addCardToHand(card);
        }
      }
      return undefined;
    }

    return undefined;
  }

  private canTrade(): boolean {
    switch (this.habitat) {
      case HabitatType.FOREST:
        return this.player.hand.length > 0;
      case HabitatType.GRASSLAND:
        return this.player.food.length > 0;
      case HabitatType.WETLAND:
        return this.player.board.getTotalEggs() > 0;
    }
  }

  /** Go straight to the resource selection screen with a Skip option. */
  private showTradeChoice(): PlayerInputModel | undefined {
    switch (this.habitat) {
      case HabitatType.FOREST:
        return this.showForestTrade();
      case HabitatType.GRASSLAND:
        return this.showGrasslandTrade();
      case HabitatType.WETLAND:
        return this.showWetlandTrade();
    }
  }

  private showForestTrade(): PlayerInputModel {
    this.phase = 'pick-card';
    const cards = this.player.hand;

    const options = cards.map(c => {
      const label = String(c).replace(/_/g, ' ').replace(/\b\w/g, (ch: string) => ch.toUpperCase());
      return `TRAY:${c}:${label}`;
    });
    options.push(SKIP);

    const cardDetails = cards.map(name => {
      const card = createBirdCard(name);
      if (card) return card.toClientCard();
      return {
        name,
        commonName: String(name).replace(/_/g, ' ').replace(/\b\w/g, (ch: string) => ch.toUpperCase()),
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
      type: InputType.SELECT_OPTION,
      options,
      cardDetails,
      message: 'Optional: discard a card to gain 1 food, or skip.',
    };
  }

  private showGrasslandTrade(): PlayerInputModel {
    this.phase = 'pick-food';
    const uniqueFoods = [...new Set(this.player.food.map(f => String(f)))];
    return {
      type: InputType.SELECT_OPTION,
      options: [...uniqueFoods, SKIP],
      message: 'Optional: pay a food to lay 1 extra egg, or skip.',
    };
  }

  private showWetlandTrade(): PlayerInputModel {
    this.phase = 'pick-egg';
    const birdsWithEggs = this.player.board.getAllBirds()
      .filter(b => b.eggs > 0)
      .map(b => String(b.name));
    return {
      type: InputType.SELECT_OPTION,
      options: [...birdsWithEggs, SKIP],
      message: 'Optional: discard an egg to draw 1 extra card, or skip.',
    };
  }

  private showWetlandCardSelection(game: Game): PlayerInputModel {
    this.phase = 'pick-wetland-card';
    const trayCards = game.getBirdTray();

    const options: string[] = [];
    for (const card of trayCards) {
      const label = String(card).replace(/_/g, ' ').replace(/\b\w/g, (ch: string) => ch.toUpperCase());
      options.push(`TRAY:${card}:${label}`);
    }
    options.push('DRAW_FROM_DECK');
    options.push(BACK);

    const cardDetails = trayCards.map(name => {
      const card = createBirdCard(name);
      if (card) return card.toClientCard();
      return {
        name,
        commonName: String(name).replace(/_/g, ' ').replace(/\b\w/g, (ch: string) => ch.toUpperCase()),
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
      type: InputType.SELECT_OPTION,
      options,
      cardDetails,
      message: 'Choose a card to draw (trade 1 egg), or skip.',
    };
  }
}
