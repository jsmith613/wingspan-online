<template>
  <div class="input-panel panel">
    <h3>Select Food</h3>
    <p class="input-hint">
      {{ hintText }}
    </p>
    <p v-if="selections.length > 0" class="input-selection">
      Selected: {{ selectedSummary }}
    </p>
    <Birdfeeder
      :dice="availableDice"
      :selectable="true"
      :selected-indices="selectedDieIndices"
      @select="onSelect"
    />
    <div class="input-actions">
      <button
        v-if="canReroll"
        class="btn-secondary"
        @click="reroll"
      >Reroll Birdfeeder</button>
      <button
        class="btn-primary"
        :disabled="!canConfirm"
        @click="confirm"
      >Confirm ({{ selections.length }}/{{ max }})</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { FoodType } from '@common/game/FoodType';
import Birdfeeder from '../birdfeeder/Birdfeeder.vue';

interface DieFace {
  foods: FoodType[];
}

function removeAt<T>(arr: ReadonlyArray<T>, index: number): T[] {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

function canSelectedFoodsPayCost(
  selectedFood: ReadonlyArray<FoodType>,
  requiredFood: ReadonlyArray<FoodType>,
): boolean {
  const memo = new Map<string, boolean>();

  const recurse = (foods: ReadonlyArray<FoodType>, costs: ReadonlyArray<FoodType>): boolean => {
    if (costs.length === 0) return true;
    const key = `${[...foods].sort().join('|')}::${costs.join('|')}`;
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

const FOOD_LABELS: Record<string, string> = {
  [FoodType.INVERTEBRATE]: 'Worm',
  [FoodType.SEED]: 'Seed',
  [FoodType.FISH]: 'Fish',
  [FoodType.FRUIT]: 'Fruit',
  [FoodType.RODENT]: 'Rodent',
  [FoodType.WILD]: 'Wild',
};

export default defineComponent({
  name: 'SelectFood',
  components: { Birdfeeder },
  props: {
    availableDice: { type: Array as PropType<DieFace[]>, required: true },
    message: { type: String, default: '' },
    requiredCost: { type: Array as PropType<FoodType[]>, default: () => [] },
    canReroll: { type: Boolean, default: false },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  emits: ['submit'],
  data() {
    return {
      selections: [] as Array<{ dieIndex: number; food: FoodType }>,
    };
  },
  computed: {
    hintText(): string {
      if (this.message) return this.message;
      return `Choose ${this.min}${this.max !== this.min ? ` to ${this.max}` : ''} food from the birdfeeder`;
    },
    selectedDieIndices(): number[] {
      return this.selections.map(s => s.dieIndex);
    },
    selectedSummary(): string {
      return this.selections.map(s => FOOD_LABELS[s.food] || s.food).join(', ');
    },
    canConfirm(): boolean {
      if (this.selections.length < this.min || this.selections.length > this.max) {
        return false;
      }
      if (this.requiredCost.length === 0) {
        return true;
      }
      const selectedFoods = this.selections.map(s => s.food);
      return canSelectedFoodsPayCost(selectedFoods, this.requiredCost);
    },
  },
  methods: {
    onSelect(dieIndex: number, food: FoodType) {
      const existing = this.selections.findIndex(s => s.dieIndex === dieIndex);
      if (existing >= 0) {
        // Already selected this die — deselect it
        this.selections.splice(existing, 1);
      } else if (this.min === this.max && this.max === 1) {
        // Single-select mode — replace
        this.selections = [{ dieIndex, food }];
      } else if (this.selections.length < this.max) {
        this.selections.push({ dieIndex, food });
      }
    },
    confirm() {
      if (!this.canConfirm) return;
      const foods = this.selections.map(s => s.food);
      this.$emit('submit', { type: 'SELECT_FOOD', selectedFood: foods });
    },
    reroll() {
      this.selections = [];
      this.$emit('submit', { type: 'SELECT_FOOD', rerollBirdfeeder: true });
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../../styles/variables';

.input-hint {
  color: $color-text-light;
  margin-bottom: $space-md;
  text-align: center;
}

.input-selection {
  text-align: center;
  margin-bottom: $space-sm;
  color: $color-forest;
  font-weight: 600;
}

.input-actions {
  margin-top: $space-md;
  text-align: center;
  display: flex;
  gap: $space-sm;
  justify-content: center;
}
</style>
