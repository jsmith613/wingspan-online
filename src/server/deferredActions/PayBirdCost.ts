import { DeferredAction, ActionPriority } from './DeferredAction';
import type { Player } from '../Player';
import type { Game } from '../Game';
import { PlayerInputModel } from '../../common/input/PlayerInputModel';
import { InputType } from '../../common/input/InputType';
import { FoodType } from '../../common/game/FoodType';

function removeAt<T>(arr: ReadonlyArray<T>, index: number): T[] {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

function removeOneByValue(arr: ReadonlyArray<FoodType>, value: FoodType): FoodType[] | null {
  const idx = arr.indexOf(value);
  if (idx === -1) return null;
  return removeAt(arr, idx);
}

function countByFood(arr: ReadonlyArray<FoodType>): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const food of arr) {
    counts[food] = (counts[food] || 0) + 1;
  }
  return counts;
}

function stateKey(foods: ReadonlyArray<FoodType>, costs: ReadonlyArray<FoodType>): string {
  return `${[...foods].sort().join('|')}::${costs.join('|')}`;
}

function possibleTokenCounts(
  availableFood: ReadonlyArray<FoodType>,
  requiredFood: ReadonlyArray<FoodType>,
): Set<number> {
  const memo = new Map<string, Set<number>>();

  const recurse = (foods: ReadonlyArray<FoodType>, costs: ReadonlyArray<FoodType>): Set<number> => {
    if (costs.length === 0) return new Set([0]);

    const key = stateKey(foods, costs);
    const cached = memo.get(key);
    if (cached) return cached;

    const [required, ...rest] = costs;
    const result = new Set<number>();

    if (required === FoodType.WILD) {
      for (let i = 0; i < foods.length; i++) {
        const nextCounts = recurse(removeAt(foods, i), rest);
        for (const n of nextCounts) {
          result.add(1 + n);
        }
      }
      memo.set(key, result);
      return result;
    }

    const exactIdx = foods.indexOf(required);
    if (exactIdx !== -1) {
      const nextCounts = recurse(removeAt(foods, exactIdx), rest);
      for (const n of nextCounts) {
        result.add(1 + n);
      }
    }

    for (let i = 0; i < foods.length; i++) {
      for (let j = i + 1; j < foods.length; j++) {
        // House rule: exchange pair for a specific symbol cannot include that symbol.
        if (foods[i] === required || foods[j] === required) {
          continue;
        }
        const afterFirst = removeAt(foods, j);
        const afterBoth = removeAt(afterFirst, i);
        const nextCounts = recurse(afterBoth, rest);
        for (const n of nextCounts) {
          result.add(2 + n);
        }
      }
    }

    memo.set(key, result);
    return result;
  };

  return recurse([...availableFood], [...requiredFood]);
}

function canSelectedFoodsPayCost(
  selectedFood: ReadonlyArray<FoodType>,
  requiredFood: ReadonlyArray<FoodType>,
): boolean {
  const memo = new Map<string, boolean>();

  const recurse = (foods: ReadonlyArray<FoodType>, costs: ReadonlyArray<FoodType>): boolean => {
    if (costs.length === 0) return foods.length === 0;
    const key = stateKey(foods, costs);
    const cached = memo.get(key);
    if (cached !== undefined) return cached;

    const [required, ...rest] = costs;
    if (required === FoodType.WILD) {
      for (let i = 0; i < foods.length; i++) {
        if (recurse(removeAt(foods, i), rest)) {
          memo.set(key, true);
          return true;
        }
      }
      memo.set(key, false);
      return false;
    }

    const exactIdx = foods.indexOf(required);
    if (exactIdx !== -1 && recurse(removeAt(foods, exactIdx), rest)) {
      memo.set(key, true);
      return true;
    }

    for (let i = 0; i < foods.length; i++) {
      for (let j = i + 1; j < foods.length; j++) {
        // House rule: exchange pair for a specific symbol cannot include that symbol.
        if (foods[i] === required || foods[j] === required) {
          continue;
        }
        const afterFirst = removeAt(foods, j);
        const afterBoth = removeAt(afterFirst, i);
        if (recurse(afterBoth, rest)) {
          memo.set(key, true);
          return true;
        }
      }
    }

    memo.set(key, false);
    return false;
  };

  return recurse([...selectedFood], [...requiredFood]);
}

/**
 * Rule variant for bird costs:
 * - Any specific required food can be paid by either:
 *   1) exact matching food, or
 *   2) any two food.
 * - WILD cost still means any one food.
 */
export function canAffordBirdFoodCost(
  availableFood: ReadonlyArray<FoodType>,
  requiredFood: ReadonlyArray<FoodType>,
): boolean {
  return possibleTokenCounts(availableFood, requiredFood).size > 0;
}

/**
 * Interactive payment for playing a bird card.
 * Applies only to bird play costs.
 */
export class PayBirdCost extends DeferredAction {
  private readonly cost: FoodType[];
  private readonly allowedCounts: Set<number>;
  private readonly minTokensRequired: number;
  private readonly maxTokensAllowed: number;

  constructor(player: Player, cost: ReadonlyArray<FoodType>) {
    super(player, ActionPriority.COST);
    this.cost = [...cost];
    this.allowedCounts = possibleTokenCounts(this.player.food, this.cost);
    if (this.allowedCounts.size === 0) {
      this.minTokensRequired = Number.POSITIVE_INFINITY;
      this.maxTokensAllowed = Number.NEGATIVE_INFINITY;
    } else {
      this.minTokensRequired = Math.min(...this.allowedCounts);
      this.maxTokensAllowed = Math.max(...this.allowedCounts);
    }
  }

  execute(_game: Game): PlayerInputModel | undefined {
    if (!Number.isFinite(this.minTokensRequired)) {
      return undefined;
    }
    return this.buildFoodPrompt();
  }

  handleInput(_game: Game, response: unknown): PlayerInputModel | undefined {
    const selected = this.normalizeSelectedFoods(response);
    if (
      !this.allowedCounts.has(selected.length) ||
      !canSelectedFoodsPayCost(selected, this.cost)
    ) {
      return this.buildFoodPrompt();
    }

    let nextFood = [...this.player.food];
    for (const food of selected) {
      const after = removeOneByValue(nextFood, food);
      if (!after) {
        return this.buildFoodPrompt();
      }
      nextFood = after;
    }
    this.player.food = nextFood;
    return undefined;
  }

  isCancellationLocked(): boolean {
    return false;
  }

  private buildFoodPrompt(): PlayerInputModel {
    const costLabel = this.cost.join(', ');
    const counts = countByFood(this.player.food);
    const availableDice = Object.entries(counts).flatMap(([food, count]) =>
      new Array(count).fill(0).map(() => ({ foods: [food as FoodType] })),
    );
    return {
      type: InputType.SELECT_FOOD,
      availableDice,
      min: this.minTokensRequired,
      max: Math.min(this.maxTokensAllowed, this.cost.length * 2),
      message: `Pay bird cost (${costLabel})`,
      requiredCost: this.cost,
      lockBack: false,
    };
  }

  private normalizeSelectedFoods(response: unknown): FoodType[] {
    const selectedFood = (response as any)?.selectedFood;
    if (Array.isArray(selectedFood)) {
      return selectedFood as FoodType[];
    }
    if (selectedFood) {
      return [selectedFood as FoodType];
    }
    if ((response as any) && !Array.isArray(response)) {
      return [response as FoodType];
    }
    return [];
  }
}
