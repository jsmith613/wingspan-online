<template>
  <div class="input-panel panel">
    <h3>Choose Food to Keep</h3>
    <p class="input-hint">
      You kept {{ totalFood - count }} bird{{ totalFood - count !== 1 ? 's' : '' }},
      so you must return {{ totalFood - count }} food.
      Select {{ count }} food to keep.
    </p>
    <div class="food-options">
      <div
        v-for="(food, i) in availableFood"
        :key="i"
        class="food-option"
        :class="{ 'option-selected': isSelected(i) }"
        @click="toggle(i)"
      >
        <img :src="foodIcon(food)" :alt="food" class="food-img" />
        <span class="food-label">{{ foodLabel(food) }}</span>
      </div>
    </div>
    <div class="input-actions">
      <button
        class="btn-primary"
        :disabled="selected.length !== count"
        @click="confirm"
      >Confirm ({{ selected.length }}/{{ count }})</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { FoodType } from '@common/game/FoodType';
import { FOOD_ICONS } from '../../utils/cardAssets';

const FOOD_LABELS: Record<string, string> = {
  [FoodType.INVERTEBRATE]: 'Worm',
  [FoodType.SEED]: 'Seed',
  [FoodType.FISH]: 'Fish',
  [FoodType.FRUIT]: 'Fruit',
  [FoodType.RODENT]: 'Rodent',
  [FoodType.WILD]: 'Wild',
};

export default defineComponent({
  name: 'SelectStartingFood',
  props: {
    availableFood: { type: Array as PropType<FoodType[]>, required: true },
    count: { type: Number, required: true },
  },
  emits: ['submit'],
  data() {
    return {
      selected: [] as number[],
    };
  },
  computed: {
    totalFood(): number {
      return this.availableFood.length;
    },
  },
  methods: {
    foodIcon(food: FoodType): string {
      return FOOD_ICONS[food] || '';
    },
    foodLabel(food: FoodType): string {
      return FOOD_LABELS[food] || food;
    },
    isSelected(index: number): boolean {
      return this.selected.includes(index);
    },
    toggle(index: number) {
      const pos = this.selected.indexOf(index);
      if (pos >= 0) {
        this.selected.splice(pos, 1);
      } else if (this.selected.length < this.count) {
        this.selected.push(index);
      }
    },
    confirm() {
      const foods = this.selected.map((i) => this.availableFood[i]);
      this.$emit('submit', { type: 'SELECT_STARTING_FOOD', selectedFood: foods });
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

.food-options {
  display: flex;
  gap: $space-md;
  justify-content: center;
  flex-wrap: wrap;
}

.food-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-xs;
  padding: $space-sm $space-md;
  border: 2px solid $color-border;
  border-radius: $radius-md;
  background: $color-white;
  cursor: pointer;
  transition: all $transition-fast;
  min-width: 64px;

  &:hover {
    border-color: $color-success;
    background: rgba($color-success, 0.05);
  }

  &.option-selected {
    border-color: $color-forest;
    background: rgba($color-forest, 0.1);
    box-shadow: 0 0 0 2px $color-forest;
  }

  .food-img {
    width: 36px;
    height: 36px;
    object-fit: contain;
  }

  .food-label {
    font-size: $font-size-xs;
    color: $color-text-light;
  }
}

.input-actions {
  margin-top: $space-md;
  text-align: center;
}
</style>
