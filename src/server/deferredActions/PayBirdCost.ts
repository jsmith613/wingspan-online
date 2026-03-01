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

function minTokensToPay(
  availableFood: ReadonlyArray<FoodType>,
  requiredFood: ReadonlyArray<FoodType>,
): number {
  const memo = new Map<string, number>();

  const recurse = (foods: ReadonlyArray<FoodType>, costs: ReadonlyArray<FoodType>): number => {
    if (costs.length === 0) return 0;

    const key = stateKey(foods, costs);
    const cached = memo.get(key);
    if (cached !== undefined) return cached;

    const [required, ...rest] = costs;
    let best = Number.POSITIVE_INFINITY;

    if (required === FoodType.WILD) {
      for (let i = 0; i < foods.length; i++) {
        const next = recurse(removeAt(foods, i), rest);
        if (Number.isFinite(next)) {
          best = Math.min(best, 1 + next);
        }
      }
      memo.set(key, best);
      return best;
    }

    const exactIdx = foods.indexOf(required);
    if (exactIdx !== -1) {
      const next = recurse(removeAt(foods, exactIdx), rest);
      if (Number.isFinite(next)) {
        best = Math.min(best, 1 + next);
      }
    }

    for (let i = 0; i < foods.length; i++) {
      for (let j = i + 1; j < foods.length; j++) {
        const afterFirst = removeAt(foods, j);
        const afterBoth = removeAt(afterFirst, i);
        const next = recurse(afterBoth, rest);
        if (Number.isFinite(next)) {
          best = Math.min(best, 2 + next);
        }
      }
    }

    memo.set(key, best);
    return best;
  };

  return recurse([...availableFood], [...requiredFood]);
}

function canSelectedFoodsPayCost(
  selectedFood: ReadonlyArray<FoodType>,
  requiredFood: ReadonlyArray<FoodType>,
): boolean {
  const memo = new Map<string, boolean>();

  const recurse = (foods: ReadonlyArray<FoodType>, costs: ReadonlyArray<FoodType>): boolean => {
    if (costs.length === 0) return true;
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
  return Number.isFinite(minTokensToPay(availableFood, requiredFood));
}

/**
 * Interactive payment for playing a bird card.
 * Applies only to bird play costs.
 */
export class PayBirdCost extends DeferredAction {
  private readonly cost: FoodType[];
  private readonly minTokensRequired: number;

  constructor(player: Player, cost: ReadonlyArray<FoodType>) {
    super(player, ActionPriority.COST);
    this.cost = [...cost];
    this.minTokensRequired = minTokensToPay(this.player.food, this.cost);
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
      selected.length !== this.minTokensRequired ||
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
    return true;
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
      max: this.minTokensRequired,
      message: `Pay bird cost (${costLabel})`,
      requiredCost: this.cost,
      lockBack: true,
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
