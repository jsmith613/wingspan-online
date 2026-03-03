/**
 * Generate bird card files WITH power implementations from wingsearch_master.json.
 * Categorizes power text and generates appropriate method overrides.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const data = require(path.join(ROOT, 'wingsearch_master.json'));
const core = data.filter(b => b['Set'] === 'core');

// ======================== HELPERS ========================

function toEnumName(commonName) {
  return commonName.toUpperCase().replace(/['']/g, '').replace(/[-\s]+/g, '_').replace(/[^A-Z0-9_]/g, '');
}

function toClassName(commonName) {
  return commonName.replace(/['']/g, '').replace(/[-]+/g, ' ').split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}

function getFoodCost(bird) {
  const foods = [];
  const types = [['Invertebrate', 'FoodType.INVERTEBRATE'], ['Seed', 'FoodType.SEED'], ['Fish', 'FoodType.FISH'], ['Fruit', 'FoodType.FRUIT'], ['Rodent', 'FoodType.RODENT'], ['Wild (food)', 'FoodType.WILD']];
  for (const [key, enumVal] of types) {
    const count = bird[key];
    if (count) { for (let i = 0; i < count; i++) foods.push(enumVal); }
  }
  return foods;
}

function getHabitats(bird) {
  const habitats = [];
  if (bird['Forest'] === 'X') habitats.push('HabitatType.FOREST');
  if (bird['Grassland'] === 'X') habitats.push('HabitatType.GRASSLAND');
  if (bird['Wetland'] === 'X') habitats.push('HabitatType.WETLAND');
  return habitats;
}

function getNestType(bird) {
  const map = { 'platform': 'NestType.PLATFORM', 'bowl': 'NestType.BOWL', 'cavity': 'NestType.CAVITY', 'ground': 'NestType.GROUND', 'wild': 'NestType.WILD', 'none': 'NestType.NONE', 'star': 'NestType.STAR' };
  return map[bird['Nest type']] || 'NestType.BOWL';
}

function getPowerType(bird) {
  const map = { 'brown': 'PowerType.BROWN', 'pink': 'PowerType.PINK', 'white': 'PowerType.WHITE' };
  if (!bird['Color']) return 'PowerType.NONE';
  return map[bird['Color']] || 'PowerType.NONE';
}

function esc(str) { return (str || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\[/g, '').replace(/\]/g, ''); }

// ======================== POWER PATTERN MATCHING ========================

function classifyPower(bird) {
  const power = bird['Power text'] || '';
  const color = bird['Color'] || '';
  const isPredator = bird['Predator'] === 'X';
  const isFlocking = bird['Flocking'] === 'X';

  if (!color || !power) return { type: 'NONE' };

  // ---- BROWN POWERS ----
  if (color === 'brown') {
    // Predator: Roll dice, cache food
    if (power.includes('Roll all dice not in birdfeeder')) {
      const foodMatch = power.match(/If any are \[(\w+)\]/);
      const foodType = foodMatch ? foodMatch[1] : 'rodent';
      return { type: 'PREDATOR_ROLL', foodType };
    }

    // Predator: Look at card from deck, tuck if wingspan < X
    if (power.includes('Look at a [card] from the deck')) {
      const sizeMatch = power.match(/less than (\d+)cm/);
      const maxSize = sizeMatch ? parseInt(sizeMatch[1]) : 75;
      return { type: 'PREDATOR_TUCK', maxSize };
    }

    // Tuck + draw
    if (power.includes('Tuck 1 [card] from your hand') && power.includes('draw 1 [card]')) {
      return { type: 'TUCK_DRAW' };
    }

    // Tuck + lay egg on this bird
    if (power.includes('Tuck 1 [card] from your hand') && power.includes('lay 1 [egg] on this bird')) {
      return { type: 'TUCK_LAY_EGG_THIS' };
    }

    // Tuck + lay egg on any bird
    if (power.includes('Tuck 1 [card] from your hand') && power.includes('lay 1 [egg] on any bird')) {
      return { type: 'TUCK_LAY_EGG_ANY' };
    }

    // Tuck + gain specific food from supply
    if (power.includes('Tuck 1 [card] from your hand') && power.includes('gain 1')) {
      if (power.includes('[fruit]')) return { type: 'TUCK_GAIN_FOOD', foodType: 'FRUIT' };
      if (power.includes('[seed]')) return { type: 'TUCK_GAIN_FOOD', foodType: 'SEED' };
      if (power.includes('[invertebrate]')) return { type: 'TUCK_GAIN_FOOD', foodType: 'INVERTEBRATE' };
      if (power.includes('[invertebrate] or [seed]')) return { type: 'TUCK_GAIN_FOOD', foodType: 'INVERTEBRATE' }; // simplified
    }

    // Discard food to tuck from deck
    if (power.includes('Discard 1') && power.includes('tuck 2 [card] from the deck')) {
      const foodMatch = power.match(/Discard 1 \[(\w+)\]/);
      const foodType = foodMatch ? foodMatch[1] : 'fish';
      return { type: 'DISCARD_FOOD_TUCK_DECK', foodType, tuckCount: 2 };
    }

    // Gain specific food from birdfeeder + cache
    if (power.includes('Gain 1') && power.includes('from the birdfeeder') && power.includes('cache it')) {
      const foodMatch = power.match(/Gain 1 \[(\w+)\]/);
      const foodType = foodMatch ? foodMatch[1] : 'seed';
      return { type: 'GAIN_FOOD_CACHE', foodType };
    }

    // Cache specific food from supply
    if (power.match(/^Cache 1 \[(\w+)\] from the supply/)) {
      const foodMatch = power.match(/Cache 1 \[(\w+)\]/);
      return { type: 'CACHE_FROM_SUPPLY', foodType: foodMatch[1] };
    }

    // Gain specific food from supply (not birdfeeder)
    if (power.match(/^Gain 1 \[(\w+)\] from the supply/)) {
      const foodMatch = power.match(/Gain 1 \[(\w+)\]/);
      return { type: 'GAIN_FOOD_SUPPLY', foodType: foodMatch[1] };
    }

    // Gain food from birdfeeder (generic)
    if (power === 'Gain 1 [die] from the birdfeeder.') {
      return { type: 'GAIN_FOOD_FEEDER', count: 1 };
    }

    // Gain 1 specific food from birdfeeder, if available
    if (power.match(/^Gain 1 \[(\w+)\] from the birdfeeder/)) {
      return { type: 'GAIN_FOOD_FEEDER', count: 1 };
    }

    // Gain invertebrate or fruit from birdfeeder
    if (power.includes('Gain 1 [invertebrate] or [fruit] from the birdfeeder')) {
      return { type: 'GAIN_FOOD_FEEDER', count: 1 };
    }

    // Each player gains food from birdfeeder
    if (power.includes('Each player gains 1 [die] from the birdfeeder')) {
      return { type: 'ALL_GAIN_FOOD_FEEDER' };
    }

    // All players gain food from supply
    if (power.match(/All players gain 1 \[(\w+)\] from the supply/)) {
      const foodMatch = power.match(/All players gain 1 \[(\w+)\]/);
      return { type: 'ALL_GAIN_FOOD_SUPPLY', foodType: foodMatch[1] };
    }

    // All players draw card
    if (power.includes('All players draw 1 [card]')) {
      return { type: 'ALL_DRAW_CARD' };
    }

    // All players lay egg on specific nest
    if (power.includes('All players lay 1 [egg]')) {
      return { type: 'ALL_LAY_EGG' };
    }

    // Draw 1 card, discard 1 at end of turn
    if (power.includes('Draw 1 [card]') && power.includes('discard 1 [card]')) {
      return { type: 'DRAW_DISCARD' };
    }

    // Draw 1 card (simple)
    if (power === 'Draw 1 [card].') {
      return { type: 'DRAW_CARDS', count: 1 };
    }

    // Lay 1 egg on any bird
    if (power === 'Lay 1 [egg] on any bird.') {
      return { type: 'LAY_EGGS', count: 1 };
    }

    // Lay 1 egg on this bird
    if (power === 'Lay 1 [egg] on this bird.') {
      return { type: 'LAY_EGG_THIS' };
    }

    // Discard egg to gain wild food
    if (power.includes('Discard 1 [egg]') && power.includes('gain 1 [wild]')) {
      return { type: 'DISCARD_EGG_GAIN_FOOD' };
    }

    // Discard egg to draw cards
    if (power.includes('Discard 1 [egg]') && power.includes('draw 2 [card]')) {
      return { type: 'DISCARD_EGG_DRAW' };
    }

    // Trade food
    if (power.includes('Trade 1 [wild] for any other')) {
      return { type: 'TRADE_FOOD' };
    }

    // Repeat brown power
    if (power.includes('Repeat a brown power')) {
      return { type: 'REPEAT_BROWN' };
    }

    // Repeat predator power
    if (power.includes('Repeat 1 [predator] power')) {
      return { type: 'REPEAT_PREDATOR' };
    }

    // Move bird to another habitat
    if (power.includes('move it to another habitat')) {
      return { type: 'MOVE_BIRD' };
    }

    // Player(s) with fewest birds draw/gain
    if (power.includes('Player(s) with the fewest birds')) {
      if (power.includes('draw 1 [card]')) return { type: 'FEWEST_BIRDS_DRAW' };
      if (power.includes('gain 1 [die]')) return { type: 'FEWEST_BIRDS_GAIN_FOOD' };
    }

    return { type: 'BROWN_UNIMPLEMENTED' };
  }

  // ---- PINK POWERS ----
  if (color === 'pink') {
    if (power.includes('predator') && power.includes('succeeds')) {
      return { type: 'PINK_PREDATOR_SUCCEEDS' };
    }
    if (power.includes('lay eggs') && power.includes('lay 1 [egg]')) {
      const nestMatch = power.match(/\[(\w+)\] nest/);
      const nestType = nestMatch ? nestMatch[1] : 'bowl';
      return { type: 'PINK_ON_LAY_EGGS', nestType };
    }
    if (power.includes('plays a bird') && power.includes('gain 1 [fish]')) {
      return { type: 'PINK_ON_BIRD_PLAYED_GAIN_FOOD', foodType: 'fish' };
    }
    if (power.includes('plays a bird') && power.includes('tuck 1 [card]')) {
      return { type: 'PINK_ON_BIRD_PLAYED_TUCK' };
    }
    if (power.includes('gain food') && power.includes('[rodent]') && power.includes('cache')) {
      return { type: 'PINK_ON_GAIN_FOOD_CACHE' };
    }
    return { type: 'PINK_UNIMPLEMENTED' };
  }

  // ---- WHITE POWERS ----
  if (color === 'white') {
    // Draw bonus cards
    if (power.includes('Draw 2 new bonus cards and keep 1')) {
      return { type: 'WHITE_DRAW_BONUS' };
    }

    // Play additional bird
    if (power.includes('Play an additional bird')) {
      return { type: 'WHITE_PLAY_BIRD' };
    }

    // Lay egg on nest type
    if (power.includes('Lay 1 [egg] on each of your birds with a')) {
      const nestMatch = power.match(/\[(\w+)\] nest/);
      const nestType = nestMatch ? nestMatch[1] : 'cavity';
      return { type: 'WHITE_LAY_EGGS_NEST', nestType };
    }

    // Gain all of food type from birdfeeder
    if (power.includes('Gain all')) {
      const foodMatch = power.match(/Gain all \[(\w+)\]/);
      const foodType = foodMatch ? foodMatch[1] : 'fish';
      return { type: 'WHITE_GAIN_ALL_FOOD', foodType };
    }

    // Gain food from supply
    if (power.match(/Gain \d+ \[(\w+)\] from the supply/)) {
      const match = power.match(/Gain (\d+) \[(\w+)\]/);
      return { type: 'WHITE_GAIN_FOOD_SUPPLY', count: parseInt(match[1]), foodType: match[2] };
    }

    // Draw cards
    if (power === 'Draw 2 [card].') {
      return { type: 'WHITE_DRAW_CARDS', count: 2 };
    }

    // Draw tray cards
    if (power.includes('Draw the 3 face-up [card]')) {
      return { type: 'WHITE_DRAW_TRAY' };
    }

    // Draw cards equal to number of players
    if (power.includes('Draw [card] equal to the number of players')) {
      return { type: 'WHITE_DRAW_PLAYERS' };
    }

    return { type: 'WHITE_UNIMPLEMENTED' };
  }

  return { type: 'UNKNOWN' };
}

// ======================== CODE GENERATION ========================

function generateImports(classification, bird) {
  const imports = new Set();
  imports.add("import { BirdCard } from '../BirdCard';");
  imports.add("import { BirdCardName } from '../../../common/cards/BirdCardName';");
  imports.add("import { FoodType } from '../../../common/game/FoodType';");
  imports.add("import { NestType } from '../../../common/game/NestType';");
  imports.add("import { HabitatType } from '../../../common/game/HabitatType';");
  imports.add("import { PowerType } from '../../../common/game/PowerType';");

  const t = classification.type;

  // Player import needed for most powers
  // Any type with a power method needs Player and Game
  const noImportsNeeded = ['NONE', 'BROWN_UNIMPLEMENTED', 'PINK_UNIMPLEMENTED', 'WHITE_UNIMPLEMENTED', 'UNKNOWN'];
  const needsPlayer = !noImportsNeeded.includes(t);
  const needsGame = needsPlayer;

  if (needsPlayer) {
    imports.add("import type { Player } from '../../Player';");
  }
  if (needsGame) {
    imports.add("import type { Game } from '../../Game';");
  }

  // Deferred actions
  if (['LAY_EGGS', 'TUCK_LAY_EGG_ANY', 'ALL_LAY_EGG', 'WHITE_LAY_EGGS_NEST'].includes(t)) {
    imports.add("import { LayEggs } from '../../deferredActions/LayEggs';");
  }
  if (['GAIN_FOOD_FEEDER', 'ALL_GAIN_FOOD_FEEDER', 'FEWEST_BIRDS_GAIN_FOOD', 'PINK_PREDATOR_SUCCEEDS', 'GAIN_FOOD_CACHE'].includes(t)) {
    imports.add("import { GainFood } from '../../deferredActions/GainFood';");
  }
  if (['DRAW_CARDS', 'DRAW_DISCARD', 'ALL_DRAW_CARD', 'FEWEST_BIRDS_DRAW', 'DISCARD_EGG_DRAW',
       'WHITE_DRAW_CARDS', 'WHITE_DRAW_TRAY'].includes(t)) {
    imports.add("import { DrawCards } from '../../deferredActions/DrawCards';");
  }

  // Pink power needs GameEvent
  if (t.startsWith('PINK_')) {
    imports.add("import { GameEvent } from '../../powers/PowerEventBus';");
  }

  return [...imports].join('\n');
}

function generatePowerMethods(classification, bird) {
  const t = classification.type;
  const color = bird['Color'];

  if (t === 'NONE') return '';

  let methods = '';

  // ===== BROWN POWERS =====
  if (color === 'brown') {
    switch (t) {
      case 'PREDATOR_ROLL': {
        const ft = classification.foodType === 'fish' ? 'FoodType.FISH' : 'FoodType.RODENT';
        methods = `
  onActivate(player: Player, game: Game): void {
    const result = game.birdfeeder.rollOutsideDice();
    if (result.includes(${ft === 'FoodType.FISH' ? 'FoodType.FISH' : 'FoodType.RODENT'})) {
      const self = player.board.getAllBirds().find(b => b.name === this.name);
      if (self) self.cachedFood++;
    }
  }`;
        break;
      }
      case 'PREDATOR_TUCK': {
        methods = `
  onActivate(player: Player, game: Game): void {
    const card = game.drawFromDeck();
    if (!card) return;
    const birdCard = game.createBirdCardInstance(card);
    if (birdCard && birdCard.wingspan < ${classification.maxSize}) {
      const self = player.board.getAllBirds().find(b => b.name === this.name);
      if (self) self.tuckedCards++;
    } else {
      game.discardBirdCard(card);
    }
  }`;
        break;
      }
      case 'TUCK_DRAW':
        methods = `
  onActivate(player: Player, game: Game): void {
    if (player.hand.length === 0) return;
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    // Auto-tuck the first card and draw
    const card = player.hand.shift();
    if (card) {
      self.tuckedCards++;
      const drawn = game.drawFromDeck();
      if (drawn) player.addCardToHand(drawn);
    }
  }`;
        break;
      case 'TUCK_LAY_EGG_THIS':
        methods = `
  onActivate(player: Player, game: Game): void {
    if (player.hand.length === 0) return;
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    const card = player.hand.shift();
    if (card) {
      self.tuckedCards++;
      if (self.eggs < this.eggCapacity) {
        self.eggs++;
      }
    }
  }`;
        break;
      case 'TUCK_LAY_EGG_ANY':
        methods = `
  onActivate(player: Player, game: Game): void {
    if (player.hand.length === 0) return;
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    const card = player.hand.shift();
    if (card) {
      self.tuckedCards++;
      game.deferredActions.push(new LayEggs(player, 1));
    }
  }`;
        break;
      case 'TUCK_GAIN_FOOD': {
        const ft = 'FoodType.' + classification.foodType;
        methods = `
  onActivate(player: Player, _game: Game): void {
    if (player.hand.length === 0) return;
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    const card = player.hand.shift();
    if (card) {
      self.tuckedCards++;
      player.addFood(${ft});
    }
  }`;
        break;
      }
      case 'DISCARD_FOOD_TUCK_DECK': {
        const ft = 'FoodType.' + classification.foodType.toUpperCase();
        methods = `
  onActivate(player: Player, game: Game): void {
    if (!player.removeFood(${ft})) return;
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    for (let i = 0; i < ${classification.tuckCount}; i++) {
      const card = game.drawFromDeck();
      if (card) {
        self.tuckedCards++;
        game.discardBirdCard(card);
      }
    }
  }`;
        break;
      }
      case 'GAIN_FOOD_CACHE': {
        methods = `
  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new GainFood(player, 1));
    // Caching is optional - simplified to auto-cache
    // Full implementation would ask player if they want to cache
  }`;
        break;
      }
      case 'CACHE_FROM_SUPPLY': {
        const ft = 'FoodType.' + classification.foodType.toUpperCase();
        methods = `
  onActivate(player: Player, _game: Game): void {
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (self) self.cachedFood++;
  }`;
        break;
      }
      case 'GAIN_FOOD_SUPPLY': {
        const ft = 'FoodType.' + classification.foodType.toUpperCase();
        methods = `
  onActivate(player: Player, _game: Game): void {
    player.addFood(${ft});
  }`;
        break;
      }
      case 'GAIN_FOOD_FEEDER':
        methods = `
  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new GainFood(player, ${classification.count}));
  }`;
        break;
      case 'ALL_GAIN_FOOD_FEEDER':
        methods = `
  onActivate(player: Player, game: Game): void {
    for (const p of game.getPlayers()) {
      game.deferredActions.push(new GainFood(p, 1));
    }
  }`;
        break;
      case 'ALL_GAIN_FOOD_SUPPLY': {
        const ft = 'FoodType.' + classification.foodType.toUpperCase();
        methods = `
  onActivate(_player: Player, game: Game): void {
    for (const p of game.getPlayers()) {
      p.addFood(${ft});
    }
  }`;
        break;
      }
      case 'ALL_DRAW_CARD':
        methods = `
  onActivate(_player: Player, game: Game): void {
    for (const p of game.getPlayers()) {
      const card = game.drawFromDeck();
      if (card) p.addCardToHand(card);
    }
  }`;
        break;
      case 'ALL_LAY_EGG':
        methods = `
  onActivate(_player: Player, game: Game): void {
    for (const p of game.getPlayers()) {
      game.deferredActions.push(new LayEggs(p, 1));
    }
  }`;
        break;
      case 'DRAW_DISCARD':
        methods = `
  onActivate(player: Player, game: Game): void {
    const card = game.drawFromDeck();
    if (card) player.addCardToHand(card);
    // Discard at end of turn is simplified to immediate draw only
  }`;
        break;
      case 'DRAW_CARDS':
        methods = `
  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new DrawCards(player, ${classification.count}));
  }`;
        break;
      case 'LAY_EGGS':
        methods = `
  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new LayEggs(player, ${classification.count}));
  }`;
        break;
      case 'LAY_EGG_THIS':
        methods = `
  onActivate(player: Player, _game: Game): void {
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (self && self.eggs < this.eggCapacity) {
      self.eggs++;
    }
  }`;
        break;
      case 'DISCARD_EGG_GAIN_FOOD':
        methods = `
  onActivate(player: Player, _game: Game): void {
    // Find a bird with eggs to discard from
    const birds = player.board.getAllBirds().filter(b => b.eggs > 0 && b.name !== this.name);
    if (birds.length === 0) return;
    birds[0].eggs--;
    // Gain a wild food (player picks any type) - simplified to invertebrate
    player.addFood(FoodType.INVERTEBRATE);
  }`;
        break;
      case 'DISCARD_EGG_DRAW':
        methods = `
  onActivate(player: Player, game: Game): void {
    const birds = player.board.getAllBirds().filter(b => b.eggs > 0);
    if (birds.length === 0) return;
    birds[0].eggs--;
    game.deferredActions.push(new DrawCards(player, 2));
  }`;
        break;
      case 'FEWEST_BIRDS_DRAW':
        methods = `
  onActivate(_player: Player, game: Game): void {
    const players = game.getPlayers();
    const minBirds = Math.min(...players.map(p => p.board.getBirdCount(HabitatType.WETLAND)));
    for (const p of players) {
      if (p.board.getBirdCount(HabitatType.WETLAND) === minBirds) {
        const card = game.drawFromDeck();
        if (card) p.addCardToHand(card);
      }
    }
  }`;
        break;
      case 'FEWEST_BIRDS_GAIN_FOOD':
        methods = `
  onActivate(_player: Player, game: Game): void {
    const players = game.getPlayers();
    const minBirds = Math.min(...players.map(p => p.board.getBirdCount(HabitatType.FOREST)));
    for (const p of players) {
      if (p.board.getBirdCount(HabitatType.FOREST) === minBirds) {
        game.deferredActions.push(new GainFood(p, 1));
      }
    }
  }`;
        break;
      // Complex powers - simplified implementations
      case 'MOVE_BIRD':
      case 'REPEAT_BROWN':
      case 'REPEAT_PREDATOR':
      case 'TRADE_FOOD':
        methods = `
  // TODO: Complex power - requires additional UI interaction
  onActivate(_player: Player, _game: Game): void {
    // ${bird['Power text']}
  }`;
        break;
    }
  }

  // ===== PINK POWERS =====
  if (color === 'pink') {
    switch (t) {
      case 'PINK_PREDATOR_SUCCEEDS':
        methods = `
  getTriggeredEvents(): GameEvent[] {
    return [GameEvent.CARD_TUCKED]; // Predator success results in tuck
  }

  onTrigger(event: GameEvent, triggeringPlayer: Player, owner: Player, game: Game): boolean {
    if (triggeringPlayer === owner) return false;
    game.deferredActions.push(new GainFood(owner, 1));
    return true;
  }`;
        break;
      case 'PINK_ON_LAY_EGGS': {
        methods = `
  getTriggeredEvents(): GameEvent[] {
    return [GameEvent.EGG_LAID];
  }

  onTrigger(event: GameEvent, triggeringPlayer: Player, owner: Player, _game: Game): boolean {
    if (triggeringPlayer === owner) return false;
    // Lay 1 egg on a bird with the matching nest type
    const birds = owner.board.getAllBirds().filter(b => b.eggs < 5);
    if (birds.length > 0) {
      birds[0].eggs++;
      return true;
    }
    return false;
  }`;
        break;
      }
      case 'PINK_ON_BIRD_PLAYED_GAIN_FOOD':
        methods = `
  getTriggeredEvents(): GameEvent[] {
    return [GameEvent.BIRD_PLAYED];
  }

  onTrigger(event: GameEvent, triggeringPlayer: Player, owner: Player, _game: Game): boolean {
    if (triggeringPlayer === owner) return false;
    owner.addFood(FoodType.FISH);
    return true;
  }`;
        break;
      case 'PINK_ON_BIRD_PLAYED_TUCK':
        methods = `
  getTriggeredEvents(): GameEvent[] {
    return [GameEvent.BIRD_PLAYED];
  }

  onTrigger(event: GameEvent, triggeringPlayer: Player, owner: Player, _game: Game): boolean {
    if (triggeringPlayer === owner) return false;
    if (owner.hand.length === 0) return false;
    const self = owner.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return false;
    const card = owner.hand.shift();
    if (card) {
      self.tuckedCards++;
      return true;
    }
    return false;
  }`;
        break;
      case 'PINK_ON_GAIN_FOOD_CACHE':
        methods = `
  getTriggeredEvents(): GameEvent[] {
    return [GameEvent.FOOD_GAINED];
  }

  onTrigger(event: GameEvent, triggeringPlayer: Player, owner: Player, _game: Game): boolean {
    if (triggeringPlayer === owner) return false;
    const self = owner.board.getAllBirds().find(b => b.name === this.name);
    if (self) {
      self.cachedFood++;
      return true;
    }
    return false;
  }`;
        break;
    }
  }

  // ===== WHITE POWERS =====
  if (color === 'white') {
    switch (t) {
      case 'WHITE_DRAW_BONUS':
        methods = `
  onPlay(_player: Player, _game: Game): void {
    // TODO: Draw 2 bonus cards and keep 1 - requires bonus card draw system
  }`;
        break;
      case 'WHITE_PLAY_BIRD':
        methods = `
  onPlay(_player: Player, _game: Game): void {
    // TODO: Play an additional bird - requires re-entering play bird flow
  }`;
        break;
      case 'WHITE_LAY_EGGS_NEST': {
        const nestMap = { 'cavity': 'NestType.CAVITY', 'bowl': 'NestType.BOWL', 'ground': 'NestType.GROUND', 'platform': 'NestType.PLATFORM' };
        const nt = nestMap[classification.nestType] || 'NestType.CAVITY';
        methods = `
  onPlay(player: Player, _game: Game): void {
    for (const bird of player.board.getAllBirds()) {
      const birdCard = _game.createBirdCardInstance(bird.name as any);
      if (birdCard && birdCard.nestType === ${nt} && bird.eggs < birdCard.eggCapacity) {
        bird.eggs++;
      }
    }
  }`;
        break;
      }
      case 'WHITE_GAIN_ALL_FOOD': {
        const ft = 'FoodType.' + classification.foodType.toUpperCase();
        methods = `
  onPlay(player: Player, game: Game): void {
    let gained = true;
    while (gained) {
      gained = false;
      const food = game.birdfeeder.takeFood(${ft});
      if (food !== null) {
        player.addFood(food);
        gained = true;
      }
    }
  }`;
        break;
      }
      case 'WHITE_GAIN_FOOD_SUPPLY': {
        const ft = 'FoodType.' + classification.foodType.toUpperCase();
        methods = `
  onPlay(player: Player, _game: Game): void {
    for (let i = 0; i < ${classification.count}; i++) {
      player.addFood(${ft});
    }
  }`;
        break;
      }
      case 'WHITE_DRAW_CARDS':
        methods = `
  onPlay(player: Player, game: Game): void {
    for (let i = 0; i < ${classification.count}; i++) {
      const card = game.drawFromDeck();
      if (card) player.addCardToHand(card);
    }
  }`;
        break;
      case 'WHITE_DRAW_TRAY':
        methods = `
  onPlay(player: Player, game: Game): void {
    const trayCards = game.getBirdTray();
    for (const card of trayCards) {
      const taken = game.takeFromTray(card);
      if (taken) player.addCardToHand(taken);
    }
  }`;
        break;
      case 'WHITE_DRAW_PLAYERS':
        methods = `
  onPlay(player: Player, game: Game): void {
    const count = game.getPlayers().length + 1;
    for (let i = 0; i < count; i++) {
      const card = game.drawFromDeck();
      if (card) player.addCardToHand(card);
    }
  }`;
        break;
    }
  }

  return methods;
}

// ======================== MAIN GENERATION ========================

const baseDir = path.join(ROOT, 'src/server/cards/base');

let implementedCount = 0;
let stubCount = 0;

for (const bird of core) {
  const enumName = toEnumName(bird['Common name']);
  const className = toClassName(bird['Common name']);
  const habitats = getHabitats(bird);
  const foodCost = getFoodCost(bird);
  const nestType = getNestType(bird);
  const powerType = getPowerType(bird);
  const eggCapacity = bird['Egg limit'] || 0;
  const wingspan = bird['Wingspan'] || 0;
  const points = bird['Victory points'] || 0;
  const powerText = bird['Power text'] || '';

  const classification = classifyPower(bird);
  const imports = generateImports(classification, bird);
  const powerMethods = generatePowerMethods(classification, bird);

  const foodCostStr = foodCost.length > 0 ? `[${foodCost.join(', ')}]` : '[]';
  const habitatStr = `[${habitats.join(', ')}]`;

  if (powerMethods) implementedCount++;
  else stubCount++;

  const content = `${imports}

export class ${className} extends BirdCard {
  readonly name = BirdCardName.${enumName};
  readonly commonName = '${esc(bird['Common name'])}';
  readonly scientificName = '${esc(bird['Scientific name'])}';
  readonly habitats = ${habitatStr};
  readonly foodCost = ${foodCostStr};
  readonly nestType = ${nestType};
  readonly eggCapacity = ${eggCapacity};
  readonly wingspan = ${wingspan};
  readonly points = ${points};
  readonly powerType = ${powerType};
  readonly powerText = '${esc(powerText)}';
${powerMethods}
}
`;

  fs.writeFileSync(path.join(baseDir, `${className}.ts`), content);
}

console.log(`Generated ${core.length} bird cards:`);
console.log(`  ${implementedCount} with power implementations`);
console.log(`  ${stubCount} without powers (NONE type)`);
