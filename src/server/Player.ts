import { PlayerId } from '../common/Types';
import { FoodType } from '../common/game/FoodType';
import { HabitatType } from '../common/game/HabitatType';
import { BirdCardName } from '../common/cards/BirdCardName';
import { BonusCardName } from '../common/cards/BonusCardName';
import { FoodCost } from '../common/Units';
import { EGG_COST_BY_COLUMN } from '../common/constants';
import { PlayerBoard, PlacedBird } from './habitats/PlayerBoard';
import { PlayerViewModel } from '../common/models/PlayerViewModel';
import { SerializedPlayer } from './SerializedGame';
import { ClientBirdCard } from '../common/cards/ClientBirdCard';
import { createBirdCard, createBonusCard } from './cards/createCard';

export class Player {
  public readonly id: PlayerId;
  public readonly name: string;
  public actionCubes: number;
  public food: FoodType[];
  public hand: BirdCardName[];
  public bonusCards: BonusCardName[];
  public board: PlayerBoard;
  public roundGoalPoints: number[];

  constructor(id: PlayerId, name: string, actionCubes: number) {
    this.id = id;
    this.name = name;
    this.actionCubes = actionCubes;
    this.food = [];
    this.hand = [];
    this.bonusCards = [];
    this.board = new PlayerBoard();
    this.roundGoalPoints = [];
  }

  /** Add food to the player's supply. */
  addFood(food: FoodType): void {
    this.food.push(food);
  }

  /** Remove food from the player's supply. Returns true if successful. */
  removeFood(food: FoodType): boolean {
    const idx = this.food.indexOf(food);
    if (idx === -1) return false;
    this.food.splice(idx, 1);
    return true;
  }

  /** Count of a specific food type in the player's supply. */
  getFoodCount(food: FoodType): number {
    return this.food.filter(f => f === food).length;
  }

  /** Add a bird card to the player's hand. */
  addCardToHand(card: BirdCardName): void {
    this.hand.push(card);
  }

  /** Remove a bird card from hand. Returns true if successful. */
  removeCardFromHand(card: BirdCardName): boolean {
    const idx = this.hand.indexOf(card);
    if (idx === -1) return false;
    this.hand.splice(idx, 1);
    return true;
  }

  /** Check if the player can afford a food cost. */
  canAffordFoodCost(cost: FoodCost): boolean {
    // Make a copy of available food to track what's "spent"
    const available = [...this.food];

    // First, try to pay specific foods
    for (const needed of cost.foods) {
      if (needed === FoodType.WILD) continue;
      const idx = available.indexOf(needed);
      if (idx === -1) return false;
      available.splice(idx, 1);
    }

    // Then check wild costs can be paid with remaining food
    return available.length >= cost.wildCount;
  }

  /** Get the egg cost for placing a bird in a habitat (based on column). */
  getEggCostForHabitat(habitat: HabitatType): number {
    const nextSlot = this.board.getNextEmptySlot(habitat);
    if (nextSlot === -1) return Infinity;
    return EGG_COST_BY_COLUMN[nextSlot];
  }

  /** Check if the player has enough eggs on the board to pay an egg cost. */
  canAffordEggCost(eggCount: number): boolean {
    return this.board.getTotalEggs() >= eggCount;
  }

  /** Check if the player can play a bird in any habitat it supports. */
  canPlayBird(
    habitats: ReadonlyArray<HabitatType>,
    foodCost: FoodCost
  ): boolean {
    if (!this.canAffordFoodCost(foodCost)) return false;

    for (const habitat of habitats) {
      if (!this.board.hasSpace(habitat)) continue;
      const eggCost = this.getEggCostForHabitat(habitat);
      if (this.canAffordEggCost(eggCost)) return true;
    }
    return false;
  }

  /** Use an action cube. Returns false if no cubes remain. */
  useActionCube(): boolean {
    if (this.actionCubes <= 0) return false;
    this.actionCubes--;
    return true;
  }

  /** Calculate the player's total score. */
  calculateScore(): number {
    let score = 0;

    // Points from bird cards (their face value)
    for (const bird of this.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      score += card ? card.points : 0;
    }

    // Eggs on birds
    score += this.board.getTotalEggs();

    // Cached food
    score += this.board.getTotalCachedFood();

    // Tucked cards
    score += this.board.getTotalTuckedCards();

    // Round goal points
    score += this.roundGoalPoints.reduce((sum, p) => sum + p, 0);

    // Bonus card points
    for (const bonusName of this.bonusCards) {
      const bonusCard = createBonusCard(bonusName);
      if (bonusCard) {
        score += bonusCard.score(this);
      }
    }

    return score;
  }

  /** Build a ClientBirdCard from a name, optionally merging placed-bird state. */
  private buildClientCard(name: BirdCardName, placed?: PlacedBird | null): ClientBirdCard {
    const card = createBirdCard(name);
    if (card) {
      const client = card.toClientCard();
      if (placed) {
        client.eggs = placed.eggs;
        client.cachedFood = placed.cachedFood;
        client.tuckedCards = placed.tuckedCards;
      }
      return client;
    }
    return {
      name,
      commonName: String(name).replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      scientificName: '',
      habitats: [],
      foodCost: [],
      nestType: 'BOWL' as any,
      eggCapacity: 0,
      wingspan: 0,
      points: 0,
      powerType: 'NONE' as any,
      powerText: '',
      eggs: placed?.eggs ?? 0,
      cachedFood: placed?.cachedFood ?? 0,
      tuckedCards: placed?.tuckedCards ?? 0,
    };
  }

  /** Build board slot view for a habitat. */
  private buildHabitatView(habitat: HabitatType) {
    return this.board.getHabitat(habitat).map(slot => ({
      bird: slot ? this.buildClientCard(slot.name as BirdCardName, slot) : null,
    }));
  }

  /** Get the view model for this player (sent to client). */
  toViewModel(viewerPlayerId?: PlayerId): PlayerViewModel {
    const isViewer = viewerPlayerId === this.id;
    return {
      id: this.id,
      name: this.name,
      actionCubes: this.actionCubes,
      handCount: this.hand.length,
      bonusCardCount: this.bonusCards.length,
      hand: isViewer ? [...this.hand] : [],
      handDetails: isViewer ? this.hand.map(name => this.buildClientCard(name)) : [],
      bonusCards: isViewer ? [...this.bonusCards] : [],
      bonusCardDetails: isViewer ? this.bonusCards.map(name => {
        const card = createBonusCard(name);
        if (card) return card.toClientCard(this);
        return {
          name,
          displayName: String(name).replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
          description: '',
          condition: '',
          vpText: '',
          score: 0,
        };
      }) : [],
      food: [...this.food],
      board: {
        [HabitatType.FOREST]: this.buildHabitatView(HabitatType.FOREST),
        [HabitatType.GRASSLAND]: this.buildHabitatView(HabitatType.GRASSLAND),
        [HabitatType.WETLAND]: this.buildHabitatView(HabitatType.WETLAND),
      },
      score: this.calculateScore(),
      roundGoalPoints: [...this.roundGoalPoints],
    };
  }

  /** Serialize for persistence. */
  serialize(): SerializedPlayer {
    return {
      id: this.id,
      name: this.name,
      actionCubes: this.actionCubes,
      food: [...this.food],
      hand: [...this.hand],
      bonusCards: [...this.bonusCards],
      board: this.board.serialize(),
      roundGoalPoints: [...this.roundGoalPoints],
    };
  }

  /** Deserialize from saved state. */
  static deserialize(data: SerializedPlayer): Player {
    const player = new Player(data.id, data.name, data.actionCubes);
    player.food = [...data.food];
    player.hand = [...data.hand];
    player.bonusCards = [...data.bonusCards];
    player.board = PlayerBoard.deserialize(data.board);
    player.roundGoalPoints = [...data.roundGoalPoints];
    return player;
  }
}
