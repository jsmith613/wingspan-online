<template>
  <div class="input-panel panel">
    <h3>Select Bird{{ max > 1 ? 's' : '' }}</h3>
    <p class="input-hint">Choose {{ min }}<span v-if="max !== min"> to {{ max }}</span> bird{{ max > 1 ? 's' : '' }}</p>
    <div class="bird-options">
      <div
        v-for="name in availableBirds"
        :key="name"
        class="bird-option-wrapper"
        :class="{
          'option-selected': isSelected(name),
          'option-disabled': isUnaffordable(name),
        }"
      >
        <BirdCard
          v-if="getCardDetails(name)"
          :card="getCardDetails(name)!"
          :selectable="!isUnaffordable(name)"
          :selected="isSelected(name)"
          @select="toggle(name)"
        />
        <!-- Fallback for birds without details -->
        <div v-else class="bird-fallback" @click="!isUnaffordable(name) && toggle(name)">
          <span class="option-name">{{ formatName(name) }}</span>
        </div>
        <span v-if="isUnaffordable(name)" class="unaffordable-label">Can't afford</span>
      </div>
    </div>
    <div class="input-actions">
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
import { ClientBirdCard } from '@common/cards/ClientBirdCard';
import BirdCard from '../cards/BirdCard.vue';

export default defineComponent({
  name: 'SelectBird',
  components: { BirdCard },
  props: {
    availableBirds: { type: Array as PropType<BirdCardName[]>, required: true },
    birdDetails: { type: Array as PropType<ClientBirdCard[]>, default: () => [] },
    unaffordableBirds: { type: Array as PropType<BirdCardName[]>, default: () => [] },
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
    formatName(name: BirdCardName): string {
      return String(name).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    },
    getCardDetails(name: BirdCardName): ClientBirdCard | undefined {
      return this.birdDetails.find(d => d.name === name);
    },
    isSelected(name: BirdCardName): boolean {
      return this.selected.includes(name);
    },
    isUnaffordable(name: BirdCardName): boolean {
      return this.unaffordableBirds.includes(name);
    },
    toggle(name: BirdCardName) {
      if (this.isUnaffordable(name)) return;
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
      this.$emit('submit', { type: 'SELECT_BIRD', selectedBirds: [...this.selected] });
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

.bird-options {
  display: flex;
  flex-wrap: wrap;
  gap: $space-md;
  justify-content: center;
}

.bird-option-wrapper {
  position: relative;

  &.option-disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .unaffordable-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(200, 0, 0, 0.85);
    color: white;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: $font-size-sm;
    font-weight: bold;
    pointer-events: none;
  }
}

.bird-fallback {
  padding: $space-md;
  border: 2px solid $color-border;
  border-radius: $radius-md;
  cursor: pointer;
  background: $color-white;
  text-align: center;

  .option-name { font-weight: bold; }
}

.input-actions {
  margin-top: $space-md;
  text-align: center;
}
</style>
