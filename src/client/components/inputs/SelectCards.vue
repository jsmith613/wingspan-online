<template>
  <div class="input-panel panel">
    <h3>Select Cards</h3>
    <p class="input-hint">{{ hintText() }}</p>
    <div class="card-options">
      <div
        v-for="name in availableCards"
        :key="name"
        class="card-option"
        :class="{ 'option-selected': isSelected(name) }"
        @click="toggle(name)"
      >
        <span class="option-name">{{ formatName(name) }}</span>
      </div>
    </div>
    <div class="input-actions">
      <button
        v-if="min === 0"
        class="btn-secondary"
        @click="skip"
      >Skip</button>
      <button
        class="btn-primary"
        :disabled="selected.length < min"
        @click="confirm"
      >Confirm ({{ selected.length }}/{{ max }})</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { BirdCardName } from '@common/cards/BirdCardName';

export default defineComponent({
  name: 'SelectCards',
  props: {
    availableCards: { type: Array as PropType<BirdCardName[]>, required: true },
    message: { type: String, default: '' },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  emits: ['submit'],
  data() {
    return {
      selected: [] as BirdCardName[],
    };
  },
  methods: {
    hintText(): string {
      if (this.message) return this.message;
      return `Choose ${this.min}${this.max !== this.min ? ` to ${this.max}` : ''} card${this.max > 1 ? 's' : ''}`;
    },
    formatName(name: BirdCardName): string {
      return String(name).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    },
    isSelected(name: BirdCardName): boolean {
      return this.selected.includes(name);
    },
    toggle(name: BirdCardName) {
      const pos = this.selected.indexOf(name);
      if (pos >= 0) {
        this.selected.splice(pos, 1);
      } else if (this.min === this.max && this.max === 1) {
        this.selected = [name];
      } else if (this.selected.length < this.max) {
        this.selected.push(name);
      }
    },
    confirm() {
      this.$emit('submit', { type: 'SELECT_CARDS', selectedCards: [...this.selected] });
    },
    skip() {
      this.selected = [];
      this.confirm();
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

.card-options {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
  justify-content: center;
}

.card-option {
  padding: $space-sm $space-md;
  border: 2px solid $color-border;
  border-radius: $radius-md;
  cursor: pointer;
  background: $color-white;
  transition: all $transition-fast;

  &:hover { border-color: $color-success; }

  &.option-selected {
    border-color: $color-forest;
    background: $color-forest-bg;
  }

  .option-name { font-weight: bold; }
}

.input-actions {
  margin-top: $space-md;
  text-align: center;
}
</style>
