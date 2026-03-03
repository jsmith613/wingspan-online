<template>
  <div class="input-panel panel">
    <h3>Select Habitat</h3>
    <p class="input-hint">Choose a habitat to place your bird</p>
    <div class="habitat-options">
      <button
        v-for="h in availableHabitats"
        :key="h"
        class="habitat-btn"
        :class="['habitat-btn-' + h, { 'habitat-selected': selected === h }]"
        @click="selected = h"
      >{{ h }}</button>
    </div>
    <div class="input-actions">
      <button
        v-if="canSkip"
        class="btn-secondary"
        @click="$emit('submit', { type: 'SELECT_HABITAT_SLOT', skip: true })"
      >Skip</button>
      <button
        class="btn-primary"
        :disabled="!selected"
        @click="$emit('submit', { type: 'SELECT_HABITAT_SLOT', selectedHabitat: selected })"
      >Confirm</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { HabitatType } from '@common/game/HabitatType';

export default defineComponent({
  name: 'SelectHabitatSlot',
  props: {
    availableHabitats: { type: Array as PropType<HabitatType[]>, required: true },
    canSkip: { type: Boolean, default: false },
  },
  emits: ['submit'],
  data() {
    return {
      selected: null as HabitatType | null,
    };
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

.habitat-options {
  display: flex;
  gap: $space-md;
  justify-content: center;
}

.habitat-btn {
  padding: $space-md $space-xl;
  font-size: $font-size-lg;
  font-weight: bold;
  border: 2px solid;
  border-radius: $radius-lg;
  text-transform: uppercase;
  letter-spacing: 1px;

  &.habitat-btn-FOREST {
    background: $color-forest-bg;
    border-color: $color-forest;
    color: $color-forest;
    &:hover { background: darken($color-forest-bg, 5%); }
    &.habitat-selected { background: $color-forest; color: $color-white; }
  }

  &.habitat-btn-GRASSLAND {
    background: $color-grassland-bg;
    border-color: $color-grassland;
    color: $color-grassland;
    &:hover { background: darken($color-grassland-bg, 5%); }
    &.habitat-selected { background: $color-grassland; color: $color-white; }
  }

  &.habitat-btn-WETLAND {
    background: $color-wetland-bg;
    border-color: $color-wetland;
    color: $color-wetland;
    &:hover { background: darken($color-wetland-bg, 5%); }
    &.habitat-selected { background: $color-wetland; color: $color-white; }
  }
}

.input-actions {
  margin-top: $space-md;
  text-align: center;
}
</style>
