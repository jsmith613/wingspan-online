<template>
  <div class="birdfeeder panel">
    <h3 class="feeder-title">Birdfeeder</h3>
    <div class="feeder-dice">
      <div
        v-for="(die, i) in dice"
        :key="i"
        class="feeder-die"
        :class="{ 'die-selectable': selectable, 'die-selected': isSelected(i) }"
      >
        <!-- Single food die -->
        <template v-if="die.foods.length === 1">
          <div class="die-face" @click="onDieClick(i, die.foods[0])">
            <img :src="foodIcon(die.foods[0])" :alt="die.foods[0]" class="food-img" />
            <span class="die-label">{{ foodLabel(die.foods[0]) }}</span>
          </div>
        </template>
        <!-- Multi-choice die -->
        <template v-else>
          <div class="die-choice">
            <div
              v-for="(food, fi) in die.foods"
              :key="fi"
              class="choice-option"
              :class="{ 'choice-selected': selectedChoice[i] === food }"
              @click="onChoiceClick(i, food)"
            >
              <img :src="foodIcon(food)" :alt="food" class="food-img" />
              <span class="die-label">{{ foodLabel(food) }}</span>
            </div>
            <span class="choice-divider">or</span>
          </div>
        </template>
      </div>
      <div v-if="dice.length === 0" class="feeder-empty">
        Feeder empty - will reroll
      </div>
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

export interface DieFace {
  foods: FoodType[];
}

export default defineComponent({
  name: 'Birdfeeder',
  props: {
    dice: { type: Array as PropType<DieFace[]>, required: true },
    selectable: { type: Boolean, default: false },
    selectedIndices: { type: Array as PropType<number[]>, default: () => [] },
  },
  emits: ['select'],
  data() {
    return {
      selectedChoice: {} as Record<number, FoodType>,
    };
  },
  methods: {
    foodLabel(food: FoodType): string {
      return FOOD_LABELS[food] || food;
    },
    foodIcon(food: FoodType): string {
      return FOOD_ICONS[food] || '';
    },
    isSelected(index: number): boolean {
      return this.selectedIndices.includes(index);
    },
    onDieClick(index: number, food: FoodType): void {
      if (this.selectable) {
        this.$emit('select', index, food);
      }
    },
    onChoiceClick(index: number, food: FoodType): void {
      if (this.selectable) {
        this.selectedChoice = { ...this.selectedChoice, [index]: food };
        this.$emit('select', index, food);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../../styles/variables';

.feeder-title {
  text-align: center;
  margin-bottom: $space-sm;
}

.feeder-dice {
  display: flex;
  gap: $space-sm;
  justify-content: center;
  flex-wrap: wrap;
}

.feeder-die {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $space-sm;
  border: 2px solid $color-border;
  border-radius: $radius-md;
  background: $color-white;
  min-width: 56px;
  transition: all $transition-fast;

  &.die-selectable {
    cursor: pointer;
    border-color: $color-border;

    &:hover {
      background: rgba($color-success, 0.1);
      border-color: $color-success;
      transform: translateY(-2px);
    }
  }

  &.die-selected {
    border-color: $color-forest;
    border-width: 3px;
    background: rgba($color-forest, 0.16);
    box-shadow: 0 0 0 2px rgba($color-forest, 0.35);
  }
}

.die-face {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-xs;
}

.food-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.die-label {
  font-size: $font-size-xs;
  color: $color-text-light;
}

.die-choice {
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
}

.choice-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-xs;
  padding: 4px;
  border-radius: $radius-sm;
  cursor: pointer;
  transition: background $transition-fast;

  &:hover {
    background: rgba($color-success, 0.15);
  }

  &.choice-selected {
    background: rgba($color-forest, 0.15);
    outline: 2px solid $color-forest;
    border-radius: $radius-sm;
  }
}

.choice-divider {
  font-size: $font-size-xs;
  color: $color-text-muted;
  font-style: italic;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: $color-white;
  padding: 0 2px;
}

.feeder-empty {
  color: $color-text-muted;
  font-style: italic;
  padding: $space-md;
}
</style>
