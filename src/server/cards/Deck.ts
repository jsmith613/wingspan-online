import { BirdCardName } from '../../common/cards/BirdCardName';
import { BonusCardName } from '../../common/cards/BonusCardName';
import { shuffle } from '../../common/prng';

/**
 * Generic deck management: shuffle, draw, discard.
 * Uses seeded PRNG for deterministic shuffling.
 */
export class Deck<T extends string> {
  private cards: T[];
  private discardPile: T[];
  private rng: () => number;

  constructor(cards: T[], rng: () => number) {
    this.cards = shuffle([...cards], rng);
    this.discardPile = [];
    this.rng = rng;
  }

  /** Draw a card from the top of the deck. Returns null if empty. */
  draw(): T | null {
    if (this.cards.length === 0) {
      if (this.discardPile.length === 0) return null;
      this.cards = shuffle([...this.discardPile], this.rng);
      this.discardPile = [];
    }
    return this.cards.pop() ?? null;
  }

  /** Draw multiple cards. */
  drawMany(count: number): T[] {
    const drawn: T[] = [];
    for (let i = 0; i < count; i++) {
      const card = this.draw();
      if (!card) break;
      drawn.push(card);
    }
    return drawn;
  }

  /** Add a card to the discard pile. */
  discard(card: T): void {
    this.discardPile.push(card);
  }

  /** Discard multiple cards. */
  discardMany(cards: T[]): void {
    this.discardPile.push(...cards);
  }

  /** Number of cards remaining in the draw pile. */
  get remaining(): number {
    return this.cards.length;
  }

  /** Number of cards in the discard pile. */
  get discardCount(): number {
    return this.discardPile.length;
  }

  /** Peek at the top card without drawing. */
  peek(): T | null {
    return this.cards.length > 0 ? this.cards[this.cards.length - 1] : null;
  }

  /** Get all cards in the draw pile (for serialization). */
  getCards(): T[] {
    return [...this.cards];
  }

  /** Get all cards in the discard pile (for serialization). */
  getDiscardPile(): T[] {
    return [...this.discardPile];
  }

  /** Create from serialized state. */
  static fromState<T extends string>(
    cards: T[],
    discardPile: T[],
    rng: () => number
  ): Deck<T> {
    const deck = new Deck<T>([], rng);
    deck.cards = [...cards];
    deck.discardPile = [...discardPile];
    return deck;
  }
}
