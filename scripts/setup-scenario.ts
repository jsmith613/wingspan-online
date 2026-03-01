#!/usr/bin/env ts-node
/**
 * Setup a game scenario by building a SerializedGame and saving it to SQLite.
 *
 * Usage:
 *   npx ts-node scripts/setup-scenario.ts <path-to-scenario.json>
 *   npx ts-node scripts/setup-scenario.ts '<inline-json>'
 */
import * as fs from 'fs';
import * as path from 'path';
import { GameId, PlayerId } from '../src/common/Types';
import { Phase } from '../src/common/game/Phase';
import { FoodType } from '../src/common/game/FoodType';
import { HabitatType } from '../src/common/game/HabitatType';
import { BirdCardName } from '../src/common/cards/BirdCardName';
import { BonusCardName } from '../src/common/cards/BonusCardName';
import { ACTION_CUBES_PER_ROUND, SLOTS_PER_HABITAT, BIRD_TRAY_SIZE } from '../src/common/constants';
import { SerializedGame, SerializedPlayer } from '../src/server/SerializedGame';
import { SerializedPlayerBoard, SerializedPlacedBird } from '../src/server/habitats/PlayerBoard';
import { SerializedBirdfeeder } from '../src/server/birdfeeder/Birdfeeder';
import { Game } from '../src/server/Game';
import { SQLiteDatabase } from '../src/server/database/SQLite';
import { mulberry32, shuffle } from '../src/common/prng';
import { GameOptions, DEFAULT_GAME_OPTIONS } from '../src/common/models/GameOptions';

// ---------------------------------------------------------------------------
// Scenario spec types (simplified input format)
// ---------------------------------------------------------------------------

interface ScenarioBirdSpec {
  name: BirdCardName;
  eggs?: number;
  cachedFood?: number;
  tuckedCards?: number;
}

interface ScenarioBoardSpec {
  FOREST?: ScenarioBirdSpec[];
  GRASSLAND?: ScenarioBirdSpec[];
  WETLAND?: ScenarioBirdSpec[];
}

interface ScenarioPlayerSpec {
  name?: string;
  food?: FoodType[];
  hand?: BirdCardName[];
  bonusCards?: BonusCardName[];
  actionCubes?: number;
  board?: ScenarioBoardSpec;
}

interface ScenarioSpec {
  players: ScenarioPlayerSpec[];
  round?: number;
  currentPlayerIndex?: number;
  phase?: 'PLAYER_TURN' | 'SETUP' | 'GAME_END';
  birdfeeder?: { dice?: FoodType[] };
  birdTray?: BirdCardName[];
  seed?: number;
  options?: GameOptions;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateGameId(): GameId {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 12; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id as GameId;
}

/** Collect all bird card names that are "in use" by the scenario. */
function collectUsedBirds(spec: ScenarioSpec): Set<BirdCardName> {
  const used = new Set<BirdCardName>();
  for (const p of spec.players) {
    if (p.hand) p.hand.forEach(c => used.add(c));
    if (p.board) {
      for (const habitat of [p.board.FOREST, p.board.GRASSLAND, p.board.WETLAND]) {
        if (habitat) habitat.forEach(b => used.add(b.name));
      }
    }
  }
  if (spec.birdTray) spec.birdTray.forEach(c => used.add(c));
  return used;
}

/** Collect all bonus card names that are "in use". */
function collectUsedBonuses(spec: ScenarioSpec): Set<BonusCardName> {
  const used = new Set<BonusCardName>();
  for (const p of spec.players) {
    if (p.bonusCards) p.bonusCards.forEach(c => used.add(c));
  }
  return used;
}

/** Build birdfeeder dice from a simple food type list. */
function buildBirdfeeder(spec: ScenarioSpec, rng: () => number): SerializedBirdfeeder {
  if (spec.birdfeeder?.dice) {
    // Map each food type to a die entry (single-food face, not taken)
    const dice = spec.birdfeeder.dice.map(food => ({
      foods: [food],
      taken: false,
    }));
    // Pad to 5 dice if fewer provided
    while (dice.length < 5) {
      dice.push({ foods: [FoodType.SEED], taken: false });
    }
    return { dice: dice.slice(0, 5) };
  }

  // Default: generate random dice using the STANDARD_DIE_FACES
  const STANDARD_DIE_FACES = [
    [FoodType.INVERTEBRATE, FoodType.SEED],
    [FoodType.SEED],
    [FoodType.RODENT],
    [FoodType.INVERTEBRATE],
    [FoodType.FISH],
    [FoodType.FRUIT],
  ];
  const dice = [];
  for (let i = 0; i < 5; i++) {
    const faceIdx = Math.floor(rng() * STANDARD_DIE_FACES.length);
    dice.push({ foods: [...STANDARD_DIE_FACES[faceIdx]], taken: false });
  }
  return { dice };
}

/** Build a serialized player board from a scenario board spec. */
function buildBoard(boardSpec?: ScenarioBoardSpec): SerializedPlayerBoard {
  const buildHabitat = (birds?: ScenarioBirdSpec[]): Array<SerializedPlacedBird | null> => {
    const slots: Array<SerializedPlacedBird | null> = new Array(SLOTS_PER_HABITAT).fill(null);
    if (birds) {
      for (let i = 0; i < Math.min(birds.length, SLOTS_PER_HABITAT); i++) {
        slots[i] = {
          name: birds[i].name,
          eggs: birds[i].eggs ?? 0,
          cachedFood: birds[i].cachedFood ?? 0,
          tuckedCards: birds[i].tuckedCards ?? 0,
        };
      }
    }
    return slots;
  };

  return {
    [HabitatType.FOREST]: buildHabitat(boardSpec?.FOREST),
    [HabitatType.GRASSLAND]: buildHabitat(boardSpec?.GRASSLAND),
    [HabitatType.WETLAND]: buildHabitat(boardSpec?.WETLAND),
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  // Parse CLI argument
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: npx ts-node scripts/setup-scenario.ts <scenario.json | inline-json>');
    process.exit(1);
  }

  let spec: ScenarioSpec;
  try {
    if (arg.trim().startsWith('{')) {
      spec = JSON.parse(arg);
    } else {
      const filePath = path.resolve(arg);
      const raw = fs.readFileSync(filePath, 'utf-8');
      spec = JSON.parse(raw);
    }
  } catch (err: any) {
    console.error(`Failed to parse scenario: ${err.message}`);
    process.exit(1);
  }

  // ---- Validate ----
  if (!spec.players || spec.players.length < 2 || spec.players.length > 5) {
    console.error('Scenario must have 2-5 players');
    process.exit(1);
  }

  const round = spec.round ?? 1;
  if (round < 1 || round > 4) {
    console.error('Round must be 1-4');
    process.exit(1);
  }

  const phase = spec.phase ?? 'PLAYER_TURN';
  const currentPlayerIndex = spec.currentPlayerIndex ?? 0;
  const seed = spec.seed ?? Date.now();
  const rng = mulberry32(seed);

  // ---- Build deck (all cards minus those in use) ----
  const usedBirds = collectUsedBirds(spec);
  const allBirds = Object.values(BirdCardName);
  let deck = allBirds.filter(c => !usedBirds.has(c));
  deck = shuffle([...deck], rng);

  // ---- Build bird tray ----
  let birdTray: BirdCardName[];
  if (spec.birdTray) {
    birdTray = [...spec.birdTray];
  } else {
    // Draw BIRD_TRAY_SIZE from the deck
    birdTray = [];
    for (let i = 0; i < BIRD_TRAY_SIZE && deck.length > 0; i++) {
      birdTray.push(deck.pop()!);
    }
  }

  // ---- Build bonus deck ----
  const usedBonuses = collectUsedBonuses(spec);
  const allBonuses = Object.values(BonusCardName);
  let bonusDeck = allBonuses.filter(c => !usedBonuses.has(c));
  bonusDeck = shuffle([...bonusDeck], rng);

  // ---- Build birdfeeder ----
  const birdfeeder = buildBirdfeeder(spec, rng);

  // ---- Build players ----
  const gameId = generateGameId();
  const defaultCubes = ACTION_CUBES_PER_ROUND[round - 1];

  const players: SerializedPlayer[] = spec.players.map((p, i) => ({
    id: `player_${i}` as PlayerId,
    name: p.name ?? `Player ${i + 1}`,
    actionCubes: p.actionCubes ?? defaultCubes,
    food: p.food ? [...p.food] : [],
    hand: p.hand ? [...p.hand] : [],
    bonusCards: p.bonusCards ? [...p.bonusCards] : [],
    board: buildBoard(p.board),
    roundGoalPoints: [],
  }));

  // ---- Assemble SerializedGame ----
  const serializedGame: SerializedGame = {
    id: gameId,
    seed,
    phase: phase as Phase,
    round,
    currentPlayerIndex,
    players,
    birdfeeder,
    deck,
    discardPile: [],
    birdTray,
    bonusDeck,
    options: spec.options ?? DEFAULT_GAME_OPTIONS,
  };

  // ---- Validate via Game.deserialize() ----
  try {
    Game.deserialize(serializedGame);
  } catch (err: any) {
    console.error(`Scenario validation failed: ${err.message}`);
    process.exit(1);
  }

  // ---- Save to SQLite ----
  const db = new SQLiteDatabase();
  await db.initializeAsync();
  db.saveGame(serializedGame);

  // ---- Output ----
  const result = {
    gameId,
    playerIds: players.map(p => p.id),
    players: players.map(p => ({ id: p.id, name: p.name })),
  };
  console.log(JSON.stringify(result, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
