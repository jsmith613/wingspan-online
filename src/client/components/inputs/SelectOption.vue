<template>
  <div class="input-panel panel">
    <h3>{{ message }}</h3>
    <div class="option-buttons">
      <button
        v-for="option in options"
        :key="option"
        class="option-btn"
        :class="{ 'option-selected': selected === option }"
        @click="selected = option"
      >{{ displayLabel(option) }}</button>
    </div>
    <div class="input-actions">
      <button
        class="btn-primary"
        :disabled="!selected"
        @click="$emit('submit', { type: 'SELECT_OPTION', selectedOption: selected })"
      >Confirm</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

const FRIENDLY_LABELS: Record<string, string> = {
  DRAW_FROM_DECK: 'Draw from Deck',
};

export default defineComponent({
  name: 'SelectOption',
  props: {
    options: { type: Array as PropType<string[]>, required: true },
    message: { type: String, required: true },
  },
  emits: ['submit'],
  data() {
    return {
      selected: null as string | null,
    };
  },
  methods: {
    displayLabel(option: string): string {
      // TRAY:CARD_NAME:Label format — show the label part
      if (option.startsWith('TRAY:')) {
        const parts = option.split(':');
        return parts[2] || parts[1];
      }
      return FRIENDLY_LABELS[option] || option;
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../../styles/variables';

h3 {
  text-align: center;
  margin-bottom: $space-md;
}

.option-buttons {
  display: flex;
  gap: $space-md;
  justify-content: center;
  flex-wrap: wrap;
}

.option-btn {
  padding: $space-md $space-xl;
  font-size: $font-size-lg;
  border: 2px solid $color-border;
  border-radius: $radius-md;
  background: $color-white;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    border-color: $color-success;
    background: rgba($color-success, 0.1);
  }

  &.option-selected {
    border-color: $color-forest;
    background: rgba($color-forest, 0.1);
    box-shadow: 0 0 0 2px $color-forest;
  }
}

.input-actions {
  margin-top: $space-md;
  text-align: center;
}
</style>
