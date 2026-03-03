import { GameId, PlayerId } from '../common/Types';
import { Phase } from '../common/game/Phase';
import { ActionType } from '../common/game/ActionType';
import { HabitatType } from '../common/game/HabitatType';
import { FoodType } from '../common/game/FoodType';
import { BirdCardName } from '../common/cards/BirdCardName';
import { BonusCardName } from '../common/cards/BonusCardName';
import {
  MAX_ROUNDS,
  ACTION_CUBES_PER_ROUND,
  BIRD_TRAY_SIZE,
  STARTING_FOOD_COUNT,
} from '../common/constants';
import { PlayerInputModel } from '../common/input/PlayerInputModel';
import { InputType } from '../common/input/InputType';
import { GameViewModel } from '../common/models/GameViewModel';
import { Player } from './Player';
import { Birdfeeder } from './birdfeeder/Birdfeeder';
import { DeferredActionsQueue } from './deferredActions/DeferredActionsQueue';
import { executeHabitatAction } from './habitats/HabitatAction';
import { SerializedGame } from './SerializedGame';
import { mulberry32, shuffle } from '../common/prng';
import { createBirdCard } from './cards/createCard';
import { PowerEventBus, GameEvent } from './powers/PowerEventBus';
import { PowerType } from '../common/game/PowerType';
import { GameOptions, DEFAULT_GAME_OPTIONS } from '../common/models/GameOptions';
import { PayBirdCost, canAffordBirdFoodCost } from './deferredActions/PayBirdCost';
import { GoalTile, selectGoalTiles, scoreRoundGoal, getGoalTileById } from './goals/GoalRegistry';

export class Game {
  public readonly id: GameId;
  public phase: Phase;
  public round: number;
  public currentPlayerIndex: number;
  public players: Player[];
  public birdfeeder: Birdfeeder;
  public options: GameOptions;
  public deferredActions: DeferredActionsQueue;
  public powerEventBus: PowerEventBus;

  private seed: number;
  private rng: () => number;
  private deck: BirdCardName[];
  private discardPile: BirdCardName[];
  private birdTray: (BirdCardName | null)[];
  private bonusDeck: BonusCardName[];
  private roundGoalTiles: GoalTile[];
  private roundGoalScoresByRound: number[][];

  private waitingFor: PlayerInputModel | null = null;
  private pendingSetupBirdsKept: number = 0;
  private pendingBirdPlacement: {
    playerId: PlayerId;
    birdName: BirdCardName;
    card: import('./cards/BirdCard').BirdCard | null;
    habitat?: HabitatType;
  } | null = null;

  constructor(id: GameId, playerNames: string[], seed?: number, options?: GameOptions) {
    this.id = id;
    this.seed = seed ?? Date.now();
    this.rng = mulberry32(this.seed);
    this.phase = Phase.SETUP;
    this.round = 0;
    this.currentPlayerIndex = 0;
    this.options = options ?? DEFAULT_GAME_OPTIONS;
    this.deferredActions = new DeferredActionsQueue();
    this.powerEventBus = new PowerEventBus();

    // Create players
    this.players = playerNames.map((name, i) => {
      const playerId = `player_${i}` as PlayerId;
      return new Player(playerId, name, ACTION_CUBES_PER_ROUND[0]);
    });

    // Initialize birdfeeder
    this.birdfeeder = new Birdfeeder(this.rng);

    // Initialize decks
    this.deck = this.createBirdDeck();
    this.discardPile = [];
    this.bonusDeck = this.createBonusDeck();
    this.birdTray = [];
    this.roundGoalTiles = selectGoalTiles(this.rng);
    this.roundGoalScoresByRound = [];
  }

  private ensureRoundGoalsInitialized(): void {
    if (!this.roundGoalTiles || this.roundGoalTiles.length !== 4) {
      this.roundGoalTiles = selectGoalTiles(this.rng);
    }
    if (!this.roundGoalScoresByRound) {
      this.roundGoalScoresByRound = [];
    }
  }

  /** Get the current player. */
  get currentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }

  /** Get a player by ID. */
  getPlayer(id: PlayerId): Player | undefined {
    return this.players.find(p => p.id === id);
  }

  /** Create and shuffle the bird deck. */
  private createBirdDeck(): BirdCardName[] {
    const cards = Object.values(BirdCardName);
    return shuffle([...cards], this.rng);
  }

  /** Create and shuffle the bonus deck. */
  private createBonusDeck(): BonusCardName[] {
    const cards = Object.values(BonusCardName);
    return shuffle([...cards], this.rng);
  }

  /** Draw a card from the bird deck. Returns null if empty. */
  drawFromDeck(): BirdCardName | null {
    if (this.deck.length === 0) {
      // Reshuffle discard pile
      if (this.discardPile.length === 0) return null;
      this.deck = shuffle([...this.discardPile], this.rng);
      this.discardPile = [];
    }
    return this.deck.pop() ?? null;
  }

  /** Draw a bonus card from the bonus deck. */
  drawBonusCard(): BonusCardName | null {
    return this.bonusDeck.pop() ?? null;
  }

  /** Get the face-up bird tray cards (excludes empty slots). */
  getBirdTray(): BirdCardName[] {
    return this.birdTray.filter((c): c is BirdCardName => c !== null);
  }

  /** Take a specific card from the bird tray. Slot is kept as null until refill. */
  takeFromTray(card: BirdCardName): BirdCardName | null {
    const idx = this.birdTray.indexOf(card);
    if (idx === -1) return null;
    this.birdTray[idx] = null;
    return card;
  }

  /** Refill the bird tray — replace null slots in-place, then fill to size. */
  private refillBirdTray(): void {
    // Replace any null slots in-place
    for (let i = 0; i < this.birdTray.length; i++) {
      if (this.birdTray[i] === null) {
        const card = this.drawFromDeck();
        if (!card) break;
        this.birdTray[i] = card;
      }
    }
    // Fill remaining slots if tray is short
    while (this.birdTray.length < BIRD_TRAY_SIZE) {
      const card = this.drawFromDeck();
      if (!card) break;
      this.birdTray.push(card);
    }
  }

  /** Discard a card. */
  discardCard(card: BirdCardName): void {
    this.discardPile.push(card);
  }

  /** Alias for discardCard, used by bird powers. */
  discardBirdCard(card: BirdCardName): void {
    this.discardPile.push(card);
  }

  /** Get all players in the game. */
  getPlayers(): Player[] {
    return this.players;
  }

  /** Create a BirdCard instance from a card name (for checking properties). */
  createBirdCardInstance(name: BirdCardName): import('./cards/BirdCard').BirdCard | null {
    return createBirdCard(name);
  }

  // =========================================================================
  // Game Flow
  // =========================================================================

  /**
   * Start the game. Transitions from SETUP to dealing cards and starting setup choices.
   */
  startGame(): PlayerInputModel | undefined {
    this.ensureRoundGoalsInitialized();
    this.refillBirdTray();
    this.dealStartingCards();
    this.phase = Phase.SETUP;

    // Return first player's setup choices
    this.waitingFor = this.getSetupInput(this.players[0]);
    return this.waitingFor;
  }

  /** Deal starting hands: 5 bird cards + 5 food + 2 bonus cards per player. */
  private dealStartingCards(): void {
    for (const player of this.players) {
      // Deal 5 bird cards
      for (let i = 0; i < 5; i++) {
        const card = this.drawFromDeck();
        if (card) player.addCardToHand(card);
      }
      // Give starting food (5 of each, one per type... no: 1 of each of the 5 base types)
      const baseFoods = [
        FoodType.INVERTEBRATE,
        FoodType.SEED,
        FoodType.FISH,
        FoodType.FRUIT,
        FoodType.RODENT,
      ];
      for (const food of baseFoods) {
        player.addFood(food);
      }
      // Deal 2 bonus cards
      for (let i = 0; i < 2; i++) {
        const bonus = this.drawBonusCard();
        if (bonus) player.bonusCards.push(bonus);
      }
    }
  }

  /** Get the setup input for a player (choose which birds to keep). */
  private getSetupInput(player: Player): PlayerInputModel {
    const birdDetails = player.hand.map(name => {
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
      type: InputType.SELECT_BIRD_TO_KEEP,
      birds: [...player.hand],
      birdDetails,
      max: player.hand.length,
    };
  }

  /**
   * Handle a player's setup choice (which birds to keep).
   * Each kept bird costs 1 food from starting supply.
   */
  handleSetupChoice(playerId: PlayerId, keptBirds: BirdCardName[]): PlayerInputModel | undefined {
    const player = this.getPlayer(playerId);
    if (!player) throw new Error(`Player ${playerId} not found`);

    // Remove birds not kept
    const discarded = player.hand.filter(c => !keptBirds.includes(c));
    for (const card of discarded) {
      player.removeCardFromHand(card);
      this.discardCard(card);
    }

    // Store how many birds were kept so we know the food cost later
    this.pendingSetupBirdsKept = keptBirds.length;

    // If the player has 2+ bonus cards, ask them to pick 1
    if (player.bonusCards.length > 1) {
      this.waitingFor = {
        type: InputType.SELECT_BONUS_CARD,
        availableBonusCards: [...player.bonusCards],
        min: 1,
        max: 1,
      };
      return this.waitingFor;
    }

    return this.proceedToFoodSelection(player);
  }

  /** Handle a player's bonus card selection during setup (keep 1 of 2). */
  handleBonusCardChoice(playerId: PlayerId, keptBonusCards: BonusCardName[]): PlayerInputModel | undefined {
    const player = this.getPlayer(playerId);
    if (!player) throw new Error(`Player ${playerId} not found`);

    // Remove bonus cards not kept
    player.bonusCards = player.bonusCards.filter(c => keptBonusCards.includes(c));

    return this.proceedToFoodSelection(player);
  }

  /** After birds and bonus card selection, handle food discard. */
  private proceedToFoodSelection(player: Player): PlayerInputModel | undefined {
    const foodToDiscard = this.pendingSetupBirdsKept;
    const foodToKeep = STARTING_FOOD_COUNT - foodToDiscard;

    // If they need to discard food, ask them
    if (foodToDiscard > 0 && player.food.length > foodToKeep) {
      this.waitingFor = {
        type: InputType.SELECT_STARTING_FOOD,
        availableFood: [...player.food],
        count: foodToKeep,
      };
      return this.waitingFor;
    }

    // Move to next player's setup or start the game
    return this.advanceSetup();
  }

  /** Handle a player's starting food selection. */
  handleStartingFoodChoice(playerId: PlayerId, keptFood: FoodType[]): PlayerInputModel | undefined {
    const player = this.getPlayer(playerId);
    if (!player) throw new Error(`Player ${playerId} not found`);

    player.food = [...keptFood];

    return this.advanceSetup();
  }

  /** Advance to the next player's setup, or start round 1. */
  private advanceSetup(): PlayerInputModel | undefined {
    this.currentPlayerIndex++;
    if (this.currentPlayerIndex < this.players.length) {
      this.waitingFor = this.getSetupInput(this.players[this.currentPlayerIndex]);
      return this.waitingFor;
    }
    // All players done with setup — start round 1
    this.currentPlayerIndex = 0;
    return this.startRound();
  }

  // =========================================================================
  // Round Management
  // =========================================================================

  /** Start a new round. */
  startRound(): PlayerInputModel | undefined {
    this.ensureRoundGoalsInitialized();
    this.round++;
    if (this.round > MAX_ROUNDS) {
      return this.endGame();
    }

    this.phase = Phase.ROUND_START;

    // Set action cubes for this round
    const cubes = ACTION_CUBES_PER_ROUND[this.round - 1];
    for (const player of this.players) {
      player.actionCubes = cubes;
    }

    // Start first player's turn
    this.currentPlayerIndex = 0;
    return this.startPlayerTurn(true);
  }

  /** Start the current player's turn. */
  startPlayerTurn(isNewTurn: boolean = false): PlayerInputModel | undefined {
    const player = this.currentPlayer;

    if (player.actionCubes <= 0) {
      return this.advanceTurn();
    }

    // Reset the deferred actions queue so canCancel is fresh for this turn.
    this.deferredActions.clear();

    if (isNewTurn) {
      this.powerEventBus.startNewTurn();
    }

    this.phase = Phase.PLAYER_TURN;

    // Build available actions
    const availableActions: ActionType[] = [
      ActionType.GAIN_FOOD,
      ActionType.LAY_EGGS,
      ActionType.DRAW_CARDS,
    ];

    // PLAY_BIRD is available if the player has birds in hand
    if (player.hand.length > 0) {
      availableActions.unshift(ActionType.PLAY_BIRD);
    }

    this.waitingFor = {
      type: InputType.SELECT_ACTION,
      availableActions,
    };

    return this.waitingFor;
  }

  /**
   * Handle a player choosing an action for their turn.
   */
  handleActionChoice(playerId: PlayerId, action: ActionType): PlayerInputModel | undefined {
    const player = this.getPlayer(playerId);
    if (!player) throw new Error(`Player ${playerId} not found`);

    if (!player.useActionCube()) {
      throw new Error('No action cubes remaining');
    }

    switch (action) {
      case ActionType.PLAY_BIRD:
        return this.handlePlayBird(player);
      case ActionType.GAIN_FOOD:
        return this.handleGainFood(player);
      case ActionType.LAY_EGGS:
        return this.handleLayEggs(player);
      case ActionType.DRAW_CARDS:
        return this.handleDrawCards(player);
    }
  }

  /** Handle PLAY_BIRD action — ask which bird to play. */
  handlePlayBird(player: Player): PlayerInputModel | undefined {
    const birdDetails = player.hand.map(name => {
      const card = createBirdCard(name);
      if (card) return card.toClientCard();
      // Placeholder/unknown card — return minimal data
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

    const unaffordableBirds = player.hand.filter(name => {
      const card = createBirdCard(name);
      if (!card) return false;
      if (!canAffordBirdFoodCost(player.food, card.foodCost)) return true;
      return this.getPlayableHabitatsForCard(player, card).length === 0;
    });

    this.waitingFor = {
      type: InputType.SELECT_BIRD,
      availableBirds: [...player.hand],
      birdDetails,
      unaffordableBirds,
      min: 1,
      max: 1,
    };
    return this.waitingFor;
  }

  /**
   * Cancel the current action and return to action selection.
   * Restores the action cube that was spent.
   */
  handleCancelAction(playerId: PlayerId): PlayerInputModel | undefined {
    const player = this.getPlayer(playerId);
    if (!player) throw new Error(`Player ${playerId} not found`);

    // Restore the action cube
    player.actionCubes++;

    // Clear any pending state
    this.pendingBirdPlacement = null;
    this.deferredActions.clear();

    // Return to action selection
    return this.startPlayerTurn();
  }

  /**
   * Whether the current pending input can be canceled/backed out.
   */
  canCancelCurrentInput(): boolean {
    // If any completed actions exist in the queue's history, we can't go back.
    if (this.deferredActions.hasCompletedAny) {
      return false;
    }
    const currentDeferred = this.deferredActions.getCurrentAction();
    if (!currentDeferred) return true;
    return !currentDeferred.isCancellationLocked();
  }

  /** Which player's input is currently expected. */
  getExpectedInputPlayerId(): PlayerId {
    const currentDeferred = this.deferredActions.getCurrentAction();
    if (currentDeferred) {
      return currentDeferred.player.id;
    }
    return this.currentPlayer.id;
  }

  /**
   * Handle a player selecting a bird to play (after choosing PLAY_BIRD action).
   */
  handleBirdSelection(playerId: PlayerId, birdName: BirdCardName): PlayerInputModel | undefined {
    const player = this.getPlayer(playerId);
    if (!player) throw new Error(`Player ${playerId} not found`);

    // Look up the bird card data
    const card = createBirdCard(birdName);

    // Card is NOT removed from hand here — it's removed when the player confirms habitat placement.

    // Determine valid habitats
    const validHabitats = card
      ? this.getPlayableHabitatsForCard(player, card)
      : Object.values(HabitatType).filter(h => player.board.hasSpace(h) && player.canAffordEggCost(player.getEggCostForHabitat(h)));

    if (card && !canAffordBirdFoodCost(player.food, card.foodCost)) {
      return this.handlePlayBird(player);
    }

    if (validHabitats.length === 0) {
      // No space — shouldn't happen, but advance turn
      return this.finishTurn();
    }

    // Always ask which habitat (so user can back out)
    this.pendingBirdPlacement = { playerId, birdName, card };
    this.waitingFor = {
      type: InputType.SELECT_HABITAT_SLOT,
      availableHabitats: validHabitats,
    };
    return this.waitingFor;
  }

  /**
   * Handle habitat selection for placing a bird.
   */
  handleHabitatSelection(playerId: PlayerId, habitat: HabitatType): PlayerInputModel | undefined {
    const player = this.getPlayer(playerId);
    if (!player) throw new Error(`Player ${playerId} not found`);

    if (!this.pendingBirdPlacement) throw new Error('No bird pending placement');
    const card = this.pendingBirdPlacement.card ?? createBirdCard(this.pendingBirdPlacement.birdName);
    const validHabitats = card
      ? this.getPlayableHabitatsForCard(player, card)
      : Object.values(HabitatType).filter(h => player.board.hasSpace(h) && player.canAffordEggCost(player.getEggCostForHabitat(h)));

    if (!validHabitats.includes(habitat)) {
      this.waitingFor = {
        type: InputType.SELECT_HABITAT_SLOT,
        availableHabitats: validHabitats,
      };
      return this.waitingFor;
    }

    this.pendingBirdPlacement.playerId = playerId;
    this.pendingBirdPlacement.habitat = habitat;
    return this.startPendingBirdPayment(player);
  }

  /**
   * Cancel habitat selection and go back to bird selection.
   * Restores the bird to hand and refunds any food paid.
   */
  handleCancelHabitat(playerId: PlayerId): PlayerInputModel | undefined {
    const player = this.getPlayer(playerId);
    if (!player) throw new Error(`Player ${playerId} not found`);

    if (!this.pendingBirdPlacement) {
      return this.handleCancelAction(playerId);
    }

    if (this.pendingBirdPlacement.habitat !== undefined) {
      // Player is on the food payment screen — go back to habitat selection.
      // Clear the payment action and reset the habitat choice.
      this.deferredActions.clear();
      this.pendingBirdPlacement.habitat = undefined;
      return this.handleBirdSelection(playerId, this.pendingBirdPlacement.birdName);
    }

    this.pendingBirdPlacement = null;

    // Card never left hand and food was never paid, so nothing to refund.

    // Re-show bird selection
    return this.handlePlayBird(player);
  }

  /** Begin interactive payment for a pending bird placement. */
  private startPendingBirdPayment(player: Player): PlayerInputModel | undefined {
    const pending = this.pendingBirdPlacement;
    if (!pending || pending.habitat === undefined) {
      return this.startPlayerTurn();
    }

    const cost = pending.card?.foodCost ?? [];
    if (cost.length === 0) {
      return this.completePendingBirdPlacement();
    }

    this.deferredActions.push(new PayBirdCost(player, cost));
    const input = this.deferredActions.runUntilInput(this);
    if (input) {
      this.waitingFor = input;
      return input;
    }

    return this.completePendingBirdPlacement();
  }

  /** Complete pending bird placement after cost payment resolves. */
  private completePendingBirdPlacement(): PlayerInputModel | undefined {
    const pending = this.pendingBirdPlacement;
    if (!pending || pending.habitat === undefined) {
      return this.finishTurn();
    }

    const player = this.getPlayer(pending.playerId);
    if (!player) {
      this.pendingBirdPlacement = null;
      return this.finishTurn();
    }

    this.pendingBirdPlacement = null;
    this.playBirdFromHand(player, pending.birdName, pending.habitat, pending.card);

    // Pink powers can require input from non-active players before the turn advances.
    const betweenTurnsInput = this.deferredActions.runUntilInput(this);
    if (betweenTurnsInput) {
      this.waitingFor = betweenTurnsInput;
      return betweenTurnsInput;
    }

    return this.finishTurn();
  }

  /**
   * Legacy helper retained for tests/scenarios that place birds directly.
   * This bypasses interactive bird food payment.
   */
  private placeBirdInHabitat(
    player: Player,
    birdName: BirdCardName,
    habitat: HabitatType,
    card: import('./cards/BirdCard').BirdCard | null
  ): PlayerInputModel | undefined {
    this.playBirdFromHand(player, birdName, habitat, card);
    const betweenTurnsInput = this.deferredActions.runUntilInput(this);
    if (betweenTurnsInput) {
      this.waitingFor = betweenTurnsInput;
      return betweenTurnsInput;
    }
    return this.finishTurn();
  }

  /**
   * Play a bird from hand into a habitat, paying egg costs and triggering powers/events.
   * This is shared by normal PLAY_BIRD and "play an additional bird" white powers.
   */
  playBirdFromHand(
    player: Player,
    birdName: BirdCardName,
    habitat: HabitatType,
    cardOverride?: import('./cards/BirdCard').BirdCard | null,
  ): void {
    const card = cardOverride ?? createBirdCard(birdName);

    // Remove card from hand
    player.removeCardFromHand(birdName);

    // Pay egg cost for the column
    const eggCost = player.getEggCostForHabitat(habitat);
    if (!player.canAffordEggCost(eggCost)) {
      throw new Error(`Insufficient eggs to place bird in ${habitat}`);
    }
    // Simple: remove eggs from first birds that have them
    let eggsRemaining = eggCost;
    if (eggsRemaining > 0) {
      for (const bird of player.board.getAllBirds()) {
        while (bird.eggs > 0 && eggsRemaining > 0) {
          bird.eggs--;
          eggsRemaining--;
        }
        if (eggsRemaining === 0) break;
      }
    }

    // Place the bird
    player.board.placeBird(habitat, {
      name: birdName,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });

    // Register pink powers for future event triggers.
    if (card && card.powerType === PowerType.PINK) {
      this.registerPinkPower(card, player);
    }

    // Resolve white "when played" powers immediately after placement.
    if (card) {
      card.onPlay(player, this, habitat);
    }

    // Trigger "another player plays a bird" pink powers.
    this.fireGameEvent(GameEvent.BIRD_PLAYED, player);
  }

  private getPlayableHabitatsForCard(
    player: Player,
    card: import('./cards/BirdCard').BirdCard,
  ): HabitatType[] {
    return card.habitats.filter((h) =>
      player.board.hasSpace(h) && player.canAffordEggCost(player.getEggCostForHabitat(h)),
    );
  }

  /** Handle GAIN_FOOD action via habitat. */
  private handleGainFood(player: Player): PlayerInputModel | undefined {
    executeHabitatAction(player, HabitatType.FOREST, this);
    const input = this.deferredActions.runUntilInput(this);
    if (input) {
      this.waitingFor = input;
      return input;
    }
    // Nothing to do (e.g. empty birdfeeder) — finish turn
    return this.finishTurn();
  }

  /** Handle LAY_EGGS action via habitat. */
  private handleLayEggs(player: Player): PlayerInputModel | undefined {
    executeHabitatAction(player, HabitatType.GRASSLAND, this);
    const input = this.deferredActions.runUntilInput(this);
    if (input) {
      this.waitingFor = input;
      return input;
    }
    // Nothing to do (e.g. no birds to lay eggs on) — finish turn
    return this.finishTurn();
  }

  /** Handle DRAW_CARDS action via habitat. */
  private handleDrawCards(player: Player): PlayerInputModel | undefined {
    executeHabitatAction(player, HabitatType.WETLAND, this);
    const input = this.deferredActions.runUntilInput(this);
    if (input) {
      this.waitingFor = input;
      return input;
    }
    // Nothing to do (e.g. empty deck) — finish turn
    return this.finishTurn();
  }

  /**
   * Handle player input for the current deferred action.
   */
  handleDeferredInput(playerId: PlayerId, response: unknown): PlayerInputModel | undefined {
    const currentDeferred = this.deferredActions.getCurrentAction();
    if (!currentDeferred) {
      throw new Error('No deferred action waiting for input');
    }
    if (currentDeferred.player.id !== playerId) {
      throw new Error('Input submitted by wrong player for current deferred action');
    }

    const result = this.deferredActions.handleInput(this, response);
    if (result) {
      this.waitingFor = result;
      return result;
    }

    // Current action done — try next action in queue
    const next = this.deferredActions.runUntilInput(this);
    if (next) {
      this.waitingFor = next;
      return next;
    }

    // All deferred actions done — advance the turn
    if (this.pendingBirdPlacement?.habitat !== undefined) {
      this.waitingFor = null;
      return this.completePendingBirdPlacement();
    }
    this.waitingFor = null;
    return this.finishTurn();
  }

  /** Finish the current player's turn and advance. */
  private finishTurn(): PlayerInputModel | undefined {
    // Refill the bird tray at end of turn (not mid-turn per rulebook).
    this.refillBirdTray();
    this.phase = Phase.BETWEEN_TURNS;
    this.waitingFor = this.advanceTurn() || null;
    return this.waitingFor ?? undefined;
  }

  /** Advance to the next player or end the round. */
  private advanceTurn(): PlayerInputModel | undefined {
    // Check if all players are out of cubes
    const allDone = this.players.every(p => p.actionCubes <= 0);
    if (allDone) {
      return this.endRound();
    }

    // Move to next player
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;

    // Skip players with no cubes
    let attempts = 0;
    while (this.currentPlayer.actionCubes <= 0 && attempts < this.players.length) {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
      attempts++;
    }

    if (this.currentPlayer.actionCubes <= 0) {
      return this.endRound();
    }

    return this.startPlayerTurn(true);
  }

  /** End the current round. Score round goals, then start next round. */
  endRound(): PlayerInputModel | undefined {
    this.ensureRoundGoalsInitialized();
    this.phase = Phase.ROUND_END;

    const goalIndex = this.round - 1;
    const goal = this.roundGoalTiles[goalIndex];
    if (goal) {
      const pointsByPlayer = scoreRoundGoal(goal, this.players, this.round);
      const roundScores = this.players.map((player) => pointsByPlayer.get(player) ?? 0);
      this.roundGoalScoresByRound[goalIndex] = roundScores;
      for (let i = 0; i < this.players.length; i++) {
        this.players[i].roundGoalPoints[goalIndex] = roundScores[i];
      }
    }

    return this.startRound();
  }

  /** End the game. */
  private endGame(): PlayerInputModel | undefined {
    this.phase = Phase.GAME_END;
    this.waitingFor = null;
    return undefined;
  }

  /** Fire a game event to evaluate pink powers. */
  fireGameEvent(event: GameEvent, triggeringPlayer: Player): void {
    this.powerEventBus.fireEvent(event, triggeringPlayer, this);
  }

  /** Register this pink card for all events it listens to. */
  private registerPinkPower(card: import('./cards/BirdCard').BirdCard, owner: Player): void {
    for (const event of card.getTriggeredEvents()) {
      this.powerEventBus.register(event, card, owner);
    }
  }

  /** Rebuild all pink-power listeners from birds currently on player boards. */
  rebuildPowerListeners(): void {
    this.powerEventBus.clear();
    for (const player of this.players) {
      for (const placed of player.board.getAllBirds()) {
        const card = createBirdCard(placed.name as BirdCardName);
        if (card && card.powerType === PowerType.PINK) {
          this.registerPinkPower(card, player);
        }
      }
    }
  }

  // =========================================================================
  // View Model
  // =========================================================================

  /** Get the game view model for the client. */
  toViewModel(viewerPlayerId?: PlayerId): GameViewModel {
    this.ensureRoundGoalsInitialized();
    const viewerId = viewerPlayerId ?? this.getExpectedInputPlayerId();
    return {
      id: this.id,
      phase: this.phase,
      round: this.round,
      currentPlayerId: this.currentPlayer.id,
      expectedInputPlayerId: this.getExpectedInputPlayerId(),
      players: this.players.map(p => p.toViewModel(viewerId)),
      birdfeeder: {
        dice: this.birdfeeder.getAvailableDice().map(d => ({ foods: [...d.face.foods] })),
      },
      birdTray: {
        faceUpCards: this.birdTray.filter((c): c is BirdCardName => c !== null),
        cardDetails: this.birdTray.filter((c): c is BirdCardName => c !== null).map(name => {
          const card = createBirdCard(name);
          if (card) return card.toClientCard();
          return {
            name,
            commonName: String(name).replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
            scientificName: '',
            habitats: [] as any,
            foodCost: [] as any,
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
        }),
      },
      roundGoals: this.roundGoalTiles.map((goal, goalIndex) => ({
        goalId: goal.id,
        description: goal.description,
        scores: (this.roundGoalScoresByRound[goalIndex] ?? []).map((points, playerIndex) => ({
          playerId: this.players[playerIndex].id,
          points,
        })),
      })),
      waitingFor: this.waitingFor,
      canCancel: this.canCancelCurrentInput(),
      options: this.options,
    };
  }

  // =========================================================================
  // Serialization
  // =========================================================================

  serialize(): SerializedGame {
    this.ensureRoundGoalsInitialized();
    return {
      id: this.id,
      seed: this.seed,
      phase: this.phase,
      round: this.round,
      currentPlayerIndex: this.currentPlayerIndex,
      players: this.players.map(p => p.serialize()),
      birdfeeder: this.birdfeeder.serialize(),
      deck: [...this.deck],
      discardPile: [...this.discardPile],
      birdTray: [...this.birdTray],
      bonusDeck: [...this.bonusDeck],
      roundGoalTileIds: this.roundGoalTiles.map(goal => goal.id),
      roundGoalScores: this.roundGoalScoresByRound.map(scores => [...scores]),
      options: this.options,
    };
  }

  static deserialize(data: SerializedGame): Game {
    const game = new Game(data.id, [], data.seed, data.options ?? DEFAULT_GAME_OPTIONS);
    game.phase = data.phase;
    game.round = data.round;
    game.currentPlayerIndex = data.currentPlayerIndex;
    game.players = data.players.map(p => Player.deserialize(p));
    game.birdfeeder = Birdfeeder.deserialize(data.birdfeeder, game.rng);
    game.deck = [...data.deck];
    game.discardPile = [...data.discardPile];
    game.birdTray = [...data.birdTray];
    game.bonusDeck = [...data.bonusDeck];
    if (data.roundGoalTileIds && data.roundGoalTileIds.length > 0) {
      game.roundGoalTiles = data.roundGoalTileIds
        .map((id) => getGoalTileById(id))
        .filter((goal): goal is GoalTile => goal !== undefined);
    }
    game.roundGoalScoresByRound = (data.roundGoalScores ?? []).map(scores => [...scores]);
    game.ensureRoundGoalsInitialized();
    game.rebuildPowerListeners();
    game.restoreInputState();
    return game;
  }

  /**
   * Reconstruct `waitingFor` from the current game phase and player state.
   * Called after deserialize() so that games loaded from DB have correct input state.
   */
  public restoreInputState(): void {
    if (this.phase === Phase.PLAYER_TURN) {
      const player = this.currentPlayer;
      const availableActions: ActionType[] = [
        ActionType.GAIN_FOOD,
        ActionType.LAY_EGGS,
        ActionType.DRAW_CARDS,
      ];
      if (player.hand.length > 0) {
        availableActions.unshift(ActionType.PLAY_BIRD);
      }
      this.waitingFor = { type: InputType.SELECT_ACTION, availableActions };
    } else if (this.phase === Phase.SETUP) {
      this.waitingFor = this.getSetupInput(this.players[this.currentPlayerIndex]);
    }
    // GAME_END / other phases: waitingFor stays null
  }
}




