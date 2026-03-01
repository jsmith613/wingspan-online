import { DeferredAction, ActionPriority } from './DeferredAction';
import type { Player } from '../Player';
import type { Game } from '../Game';
import { PlayerInputModel } from '../../common/input/PlayerInputModel';
import { InputType } from '../../common/input/InputType';
import { createBirdCard } from '../cards/createCard';
import { HabitatType } from '../../common/game/HabitatType';
import { FoodType } from '../../common/game/FoodType';

/**
 * Draw bird cards. Player may choose from face-up tray or draw from deck.
 * Uses SELECT_OPTION to present tray cards + "Draw from Deck" as choices.
 */
export class DrawCards extends DeferredAction {
  private readonly count: number;
  private drawn: number = 0;

  constructor(player: Player, count: number) {
    super(player, ActionPriority.DRAW);
    this.count = count;
  }

  execute(game: Game): PlayerInputModel | undefined {
    return this.askForCard(game);
  }

  handleInput(game: Game, response: unknown): PlayerInputModel | undefined {
    const input = response as any;
    const selected: string = input.selectedOption || input;

    if (selected === 'DRAW_FROM_DECK') {
      const drawn = game.drawFromDeck();
      if (drawn) {
        this.player.addCardToHand(drawn);
      }
    } else if (selected.startsWith('TRAY:')) {
      // Format is TRAY:CARD_NAME:Label — extract the card name
      const cardName = selected.split(':')[1];
      const card = game.takeFromTray(cardName as any);
      if (card) {
        this.player.addCardToHand(card);
      }
    }
    this.drawn++;

    if (this.drawn >= this.count) {
      return undefined;
    }
    return this.askForCard(game);
  }

  isCancellationLocked(): boolean {
    return this.drawn > 0;
  }

  private askForCard(game: Game): PlayerInputModel | undefined {
    if (this.drawn >= this.count) {
      return undefined;
    }

    const trayCards = game.getBirdTray();
    const remaining = this.count - this.drawn;

    // Build options: face-up tray cards + draw from deck
    const options: string[] = [];
    for (const card of trayCards) {
      const label = String(card).replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
      options.push(`TRAY:${card}:${label}`);
    }
    options.push('DRAW_FROM_DECK');

    const cardDetails = trayCards.map(name => {
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
      type: InputType.SELECT_OPTION,
      options,
      cardDetails,
      message: `Draw a card (${this.drawn + 1} of ${this.count}). Choose a face-up card or draw from the deck.`,
    };
  }
}
