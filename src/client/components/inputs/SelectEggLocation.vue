<template>
  <div class="input-panel panel">
    <h3>Place Eggs</h3>
    <p v-if="eggsToLay === 0 || availableBirds.length === 0" class="input-hint">No valid birds to place eggs on.</p>
    <p v-else class="input-hint">Place {{ eggsRemaining }} more egg{{ eggsRemaining !== 1 ? 's' : '' }} on your birds</p>
    <div class="bird-options">
      <div
        v-for="name in availableBirds"
        :key="name"
        class="bird-option"
        @click="placeEgg(name)"
      >
        <span class="option-name">{{ formatName(name) }}</span>
        <span v-if="placements[name]" class="egg-count">+{{ placements[name] }}</span>
      </div>
    </div>
    <div class="input-actions">
      <button
        class="btn-secondary"
        :disabled="Object.keys(placements).length === 0"
        @click="undo"
      >Undo</button>
      <button
        class="btn-primary"
        :disabled="eggsRemaining > 0"
        @click="confirm"
      >Confirm</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { BirdCardName } from '@common/cards/BirdCardName';

export default defineComponent({
  name: 'SelectEggLocation',
  props: {
    availableBirds: { type: Array as PropType<BirdCardName[]>, required: true },
    eggsToLay: { type: Number, required: true },
  },
  emits: ['submit'],
  data() {
    return {
      placements: {} as Record<string, number>,
      history: [] as BirdCardName[],
    };
  },
  computed: {
    totalPlaced(): number {
      return Object.values(this.placements).reduce((sum, n) => sum + n, 0);
    },
    eggsRemaining(): number {
      return this.eggsToLay - this.totalPlaced;
    },
  },
  methods: {
    formatName(name: BirdCardName): string {
      return String(name).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    },
    placeEgg(name: BirdCardName) {
      if (this.eggsRemaining <= 0) return;
      this.placements[name] = (this.placements[name] || 0) + 1;
      this.history.push(name);
    },
    undo() {
      const last = this.history.pop();
      if (last && this.placements[last]) {
        this.placements[last]--;
        if (this.placements[last] === 0) {
          delete this.placements[last];
        }
      }
    },
    confirm() {
      this.$emit('submit', { type: 'SELECT_EGG_LOCATION', placements: { ...this.placements } });
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
  gap: $space-sm;
  justify-content: center;
}

.bird-option {
  padding: $space-sm $space-md;
  border: 2px solid $color-border;
  border-radius: $radius-md;
  cursor: pointer;
  background: $color-white;
  transition: all $transition-fast;

  &:hover { border-color: $color-warning; }

  .option-name { font-weight: bold; }
  .egg-count {
    margin-left: $space-sm;
    color: $color-warning;
    font-weight: bold;
  }
}

.input-actions {
  margin-top: $space-md;
  text-align: center;
  display: flex;
  gap: $space-sm;
  justify-content: center;
}
</style>
