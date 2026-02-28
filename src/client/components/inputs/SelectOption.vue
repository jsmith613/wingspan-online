<template>
  <div class="input-panel panel">
    <h3>{{ message }}</h3>
    <div class="card-option-area">
      <div class="tray-card-options">
        <template v-for="option in options" :key="option">
          <BirdCard
            v-if="isTrayOption(option) && getCardDetails(option)"
            :card="getCardDetails(option)!"
            :selectable="true"
            :selected="selected === option"
            @select="selected = option"
          />
          <button
            v-else
            class="option-btn"
            :class="{ 'option-selected': selected === option }"
            @click="selected = option"
          >{{ displayLabel(option) }}</button>
        </template>
      </div>
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
import { ClientBirdCard } from '@common/cards/ClientBirdCard';
import BirdCard from '../cards/BirdCard.vue';

const FRIENDLY_LABELS: Record<string, string> = {
  DRAW_FROM_DECK: 'Draw from Deck',
};

export default defineComponent({
  name: 'SelectOption',
  components: { BirdCard },
  props: {
    options: { type: Array as PropType<string[]>, required: true },
    message: { type: String, required: true },
    cardDetails: { type: Array as PropType<ClientBirdCard[]>, default: () => [] },
  },
  emits: ['submit'],
  data() {
    return {
      selected: null as string | null,
    };
  },
  methods: {
    isTrayOption(option: string): boolean {
      return option.startsWith('TRAY:');
    },
    displayLabel(option: string): string {
      // TRAY:CARD_NAME:Label format - show the label part
      if (this.isTrayOption(option)) {
        const parts = option.split(':');
        return parts[2] || parts[1];
      }
      return FRIENDLY_LABELS[option] || option;
    },
    getCardName(option: string): string | undefined {
      if (!this.isTrayOption(option)) return undefined;
      const parts = option.split(':');
      return parts[1];
    },
    getCardDetails(option: string): ClientBirdCard | undefined {
      const cardName = this.getCardName(option);
      if (!cardName) return undefined;
      return this.cardDetails.find(card => card.name === cardName);
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

.card-option-area {
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.tray-card-options {
  display: flex;
  flex-wrap: wrap;
  gap: $space-md;
  justify-content: center;
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
