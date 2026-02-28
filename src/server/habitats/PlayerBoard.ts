import { HabitatType } from '../../common/game/HabitatType';
import { SLOTS_PER_HABITAT } from '../../common/constants';

/**
 * Represents a bird placed on the board.
 * The actual BirdCard type will be defined by the card system;
 * we use a minimal interface here for the engine.
 */
export interface PlacedBird {
  readonly name: string;
  eggs: number;
  cachedFood: number;
  tuckedCards: number;
}

export type HabitatSlot = PlacedBird | null;

export class PlayerBoard {
  private habitats: Map<HabitatType, HabitatSlot[]> = new Map();

  constructor() {
    for (const habitat of Object.values(HabitatType)) {
      this.habitats.set(habitat, new Array(SLOTS_PER_HABITAT).fill(null));
    }
  }

  /** Get all slots for a habitat. */
  getHabitat(habitat: HabitatType): ReadonlyArray<HabitatSlot> {
    return this.habitats.get(habitat)!;
  }

  /** Get the number of birds in a specific habitat. */
  getBirdCount(habitat: HabitatType): number {
    return this.habitats.get(habitat)!.filter(s => s !== null).length;
  }

  /** Get the total number of birds across all habitats. */
  getTotalBirdCount(): number {
    let count = 0;
    for (const habitat of Object.values(HabitatType)) {
      count += this.getBirdCount(habitat);
    }
    return count;
  }

  /** Get the next empty column index for a habitat, or -1 if full. */
  getNextEmptySlot(habitat: HabitatType): number {
    const slots = this.habitats.get(habitat)!;
    return slots.findIndex(s => s === null);
  }

  /** Check if a habitat has space for another bird. */
  hasSpace(habitat: HabitatType): boolean {
    return this.getNextEmptySlot(habitat) !== -1;
  }

  /** Place a bird in the next available slot. Returns the column index. */
  placeBird(habitat: HabitatType, bird: PlacedBird): number {
    const slots = this.habitats.get(habitat)!;
    const slot = this.getNextEmptySlot(habitat);
    if (slot === -1) {
      throw new Error(`No empty slot in ${habitat}`);
    }
    slots[slot] = bird;
    return slot;
  }

  /** Get a bird at a specific position. */
  getBirdAt(habitat: HabitatType, column: number): PlacedBird | null {
    return this.habitats.get(habitat)![column];
  }

  /** Get all placed birds across all habitats. */
  getAllBirds(): PlacedBird[] {
    const birds: PlacedBird[] = [];
    for (const habitat of Object.values(HabitatType)) {
      for (const slot of this.habitats.get(habitat)!) {
        if (slot !== null) {
          birds.push(slot);
        }
      }
    }
    return birds;
  }

  /** Get all placed birds in a specific habitat (in order, no nulls). */
  getBirdsInHabitat(habitat: HabitatType): PlacedBird[] {
    return this.habitats.get(habitat)!.filter((s): s is PlacedBird => s !== null);
  }

  /** Get total eggs on the board. */
  getTotalEggs(): number {
    return this.getAllBirds().reduce((sum, b) => sum + b.eggs, 0);
  }

  /** Get total cached food on the board. */
  getTotalCachedFood(): number {
    return this.getAllBirds().reduce((sum, b) => sum + b.cachedFood, 0);
  }

  /** Get total tucked cards on the board. */
  getTotalTuckedCards(): number {
    return this.getAllBirds().reduce((sum, b) => sum + b.tuckedCards, 0);
  }

  /** Serialize the board state. */
  serialize(): SerializedPlayerBoard {
    const result: SerializedPlayerBoard = {} as SerializedPlayerBoard;
    for (const habitat of Object.values(HabitatType)) {
      result[habitat] = this.habitats.get(habitat)!.map(slot => {
        if (slot === null) return null;
        return {
          name: slot.name,
          eggs: slot.eggs,
          cachedFood: slot.cachedFood,
          tuckedCards: slot.tuckedCards,
        };
      });
    }
    return result;
  }

  /** Deserialize board state. */
  static deserialize(data: SerializedPlayerBoard): PlayerBoard {
    const board = new PlayerBoard();
    for (const habitat of Object.values(HabitatType)) {
      const slots = data[habitat];
      if (slots) {
        board.habitats.set(habitat, slots.map(s => {
          if (s === null) return null;
          return {
            name: s.name,
            eggs: s.eggs,
            cachedFood: s.cachedFood,
            tuckedCards: s.tuckedCards,
          };
        }));
      }
    }
    return board;
  }
}

export interface SerializedPlacedBird {
  name: string;
  eggs: number;
  cachedFood: number;
  tuckedCards: number;
}

export type SerializedPlayerBoard = {
  [key in HabitatType]: Array<SerializedPlacedBird | null>;
};
