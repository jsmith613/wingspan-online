import { FoodType } from '../../common/game/FoodType';
import { BIRDFEEDER_DICE_COUNT } from '../../common/constants';
import { DieFace, STANDARD_DIE_FACES } from './DieFace';

export interface RolledDie {
  face: DieFace;
  taken: boolean;
}

export class Birdfeeder {
  private dice: RolledDie[] = [];
  private rng: () => number;

  constructor(rng: () => number) {
    this.rng = rng;
    this.rollAll();
  }

  /** Roll all dice fresh. */
  rollAll(): void {
    this.dice = [];
    for (let i = 0; i < BIRDFEEDER_DICE_COUNT; i++) {
      this.dice.push({ face: this.rollDie(), taken: false });
    }
  }

  /** Roll a single die, returning a random face. */
  private rollDie(): DieFace {
    const index = Math.floor(this.rng() * STANDARD_DIE_FACES.length);
    return STANDARD_DIE_FACES[index];
  }

  /** Get all available (not yet taken) dice. */
  getAvailableDice(): ReadonlyArray<RolledDie> {
    return this.dice.filter(d => !d.taken);
  }

  /** Get food types for each available (untaken) die in the feeder. */
  getAvailableFood(): FoodType[] {
    const foods: FoodType[] = [];
    for (const die of this.dice) {
      if (!die.taken) {
        if (die.face.foods.length === 1) {
          foods.push(die.face.foods[0]);
        } else {
          // Multi-food face (e.g. fruit/rodent): add each option separately
          for (const food of die.face.foods) {
            foods.push(food);
          }
        }
      }
    }
    return foods;
  }

  /**
   * Take food from the birdfeeder.
   * If the chosen food appears on a multi-food face, takes from that die.
   * Returns the food taken, or null if not available.
   */
  takeFood(food: FoodType): FoodType | null {
    // Prefer single-food faces first (exact match)
    let targetDie = this.dice.find(
      d => !d.taken && d.face.foods.length === 1 && d.face.foods[0] === food
    );
    // Fall back to multi-food face
    if (!targetDie) {
      targetDie = this.dice.find(
        d => !d.taken && d.face.foods.includes(food)
      );
    }
    if (!targetDie) {
      return null;
    }
    targetDie.taken = true;
    this.rerollIfEmpty();
    return food;
  }

  /** Immediately reroll when all dice are taken. */
  private rerollIfEmpty(): void {
    const available = this.dice.filter(d => !d.taken);
    if (available.length === 0) {
      this.rollAll();
    }
  }

  /**
   * Whether a manual reroll is allowed by the base Wingspan rule:
   * all currently available dice show the same face.
   */
  canRerollByRule(): boolean {
    return this.allSameFace(this.getAvailableDice());
  }

  /** Check if all dice show the same face. */
  private allSameFace(dice: ReadonlyArray<RolledDie>): boolean {
    if (dice.length <= 1) return false;
    const first = dice[0].face.foods;
    return dice.every(d =>
      d.face.foods.length === first.length &&
      d.face.foods.every((f, i) => f === first[i])
    );
  }

  /**
   * Roll all dice that are NOT currently in the birdfeeder (i.e. already taken).
   * Used by predator birds. Returns the food types shown on those re-rolled dice.
   */
  rollOutsideDice(): FoodType[] {
    const results: FoodType[] = [];
    for (const die of this.dice) {
      if (die.taken) {
        die.face = this.rollDie();
        for (const food of die.face.foods) {
          results.push(food);
        }
        // Die stays taken — it was rolled for the predator check, not returned to feeder
      }
    }
    return results;
  }

  /** Get the count of remaining dice. */
  getRemainingCount(): number {
    return this.dice.filter(d => !d.taken).length;
  }

  /** For serialization. */
  serialize(): SerializedBirdfeeder {
    return {
      dice: this.dice.map(d => ({
        foods: [...d.face.foods],
        taken: d.taken,
      })),
    };
  }

  /** Restore from serialized state. */
  static deserialize(data: SerializedBirdfeeder, rng: () => number): Birdfeeder {
    const feeder = new Birdfeeder(rng);
    feeder.dice = data.dice.map(d => ({
      face: { foods: d.foods },
      taken: d.taken,
    }));
    return feeder;
  }
}

export interface SerializedBirdfeeder {
  dice: Array<{ foods: FoodType[]; taken: boolean }>;
}
