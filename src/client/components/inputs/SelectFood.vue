<template>
  <div class="input-panel panel">
    <h3>Select Food</h3>
    <p class="input-hint">Choose {{ min }}<span v-if="max !== min"> to {{ max }}</span> food from the birdfeeder</p>
    <Birdfeeder
      :dice="availableDice"
      :selectable="true"
      :selected-indices="selectedDieIndices"
      @select="onSelect"
    />
    <div class="input-actions">
      <button
        class="btn-primary"
        :disabled="selections.length < min"
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

export default defineComponent({
  name: 'SelectFood',
  components: { Birdfeeder },
  props: {
    availableDice: { type: Array as PropType<DieFace[]>, required: true },
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
    selectedDieIndices(): number[] {
      return this.selections.map(s => s.dieIndex);
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
      const foods = this.selections.map(s => s.food);
      this.$emit('submit', { type: 'SELECT_FOOD', selectedFood: foods });
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

.input-actions {
  margin-top: $space-md;
  text-align: center;
}
</style>
