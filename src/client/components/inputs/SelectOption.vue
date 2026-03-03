<template>
  <div class="input-panel panel">
    <h3>{{ message }}</h3>
    <div v-if="!autoConfirmOption" class="card-option-area">
      <div class="tray-card-options">
        <template v-for="option in displayOptions" :key="option">
          <BirdCard
            v-if="isTrayOption(option) && getCardDetails(option)"
            :card="getCardDetails(option)!"
            :selectable="true"
            :selected="selected === option"
            @select="selected = option"
          />
          <button
            v-else-if="getFoodIcon(option)"
            class="option-btn food-option-btn"
            :class="{ 'option-selected': selected === option }"
            :disabled="isOptionDisabled(option)"
            @click="onSelect(option)"
            :title="displayLabel(option)"
          >
            <img :src="getFoodIcon(option)!" :alt="option" class="food-option-icon" />
          </button>
          <button
            v-else
            class="option-btn"
            :class="{ 'option-selected': selected === option }"
            :disabled="isOptionDisabled(option)"
            @click="onSelect(option)"
          >{{ displayLabel(option) }}</button>
        </template>
      </div>
    </div>
    <div class="input-actions">
      <button
        v-if="singleActionOption"
        class="btn-primary"
        :disabled="isOptionDisabled(singleActionOption)"
        @click="$emit('submit', { type: 'SELECT_OPTION', selectedOption: singleActionOption })"
      >{{ displayLabel(singleActionOption) }}</button>
      <button
        v-else-if="backOption"
        class="btn-secondary"
        @click="$emit('submit', { type: 'SELECT_OPTION', selectedOption: backOption })"
      >&larr; Back</button>
      <button
        v-if="!singleActionOption && skipOption"
        class="btn-secondary"
        @click="$emit('submit', { type: 'SELECT_OPTION', selectedOption: skipOption })"
      >Skip</button>
      <button
        v-if="!singleActionOption"
        class="btn-primary"
        :disabled="!effectiveSelectedOption || isOptionDisabled(effectiveSelectedOption)"
        @click="$emit('submit', { type: 'SELECT_OPTION', selectedOption: effectiveSelectedOption })"
      >Confirm</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ClientBirdCard } from '@common/cards/ClientBirdCard';
import { FOOD_ICONS } from '../../utils/cardAssets';
import BirdCard from '../cards/BirdCard.vue';

const FRIENDLY_LABELS: Record<string, string> = {
  DRAW_FROM_DECK: 'Draw from Deck',
  SKIP_TRADE: 'Skip',
  ROLL_OUTSIDE: 'Roll',
  CACHE_RESULT: 'Cache',
  CONFIRM_RESULT: 'Confirm',
  REVEAL_CARD: 'Reveal Card',
  TUCK_REVEALED: 'Tuck',
  DISCARD_REVEALED: 'Discard',
  CONFIRM_BROWN_EFFECT: 'Confirm',
  CONFIRM_DRAW_DISCARD: 'Confirm',
  CONFIRM_ALL_PLAYERS_GAIN: 'Confirm',
  CONFIRM_ALL_PLAYERS_DRAW: 'Confirm',
  CONFIRM_DISCARD_EGG_GAIN_WILD: 'Confirm',
  CONFIRM_PAY_TUCK: 'Confirm',
  CONFIRM_TUCK_RESULT: 'Confirm',
  CONFIRM_GAIN_BIRDFEEDER: 'Confirm',
  CONFIRM_REPEAT_POWER: 'Confirm',
  CONFIRM_FEWEST_WETLAND_DRAW: 'Confirm',
  CONFIRM_TRADE_ONE_FOOD: 'Confirm',
};

const SKIP_OPTIONS = new Set([
  'SKIP_TRADE',
  'SKIP_ROLL',
  'SKIP_REVEAL',
  'SKIP_BROWN_EFFECT',
  'SKIP_DRAW_DISCARD',
  'SKIP_ALL_PLAYERS_GAIN',
  'SKIP_ALL_PLAYERS_DRAW',
  'SKIP_DISCARD_EGG_GAIN_WILD',
  'SKIP_DISCARD_EGG_DRAW',
  'SKIP_PAY_TUCK',
  'SKIP_GAIN_BIRDFEEDER',
  'SKIP_REPEAT_POWER',
  'SKIP_FEWEST_WETLAND_DRAW',
  'SKIP_TRADE_ONE_FOOD',
]);
const BACK_OPTIONS = new Set(['BACK_TRADE']);

export default defineComponent({
  name: 'SelectOption',
  components: { BirdCard },
  props: {
    options: { type: Array as PropType<string[]>, required: true },
    message: { type: String, required: true },
    disabledOptions: { type: Array as PropType<string[]>, default: () => [] },
    cardDetails: { type: Array as PropType<ClientBirdCard[]>, default: () => [] },
  },
  emits: ['submit'],
  data() {
    return {
      selected: null as string | null,
    };
  },
  computed: {
    skipOption(): string | null {
      const skip = this.options.find(o => SKIP_OPTIONS.has(o));
      return skip ?? null;
    },
    backOption(): string | null {
      const back = this.options.find(o => BACK_OPTIONS.has(o));
      return back ?? null;
    },
    displayOptions(): string[] {
      if (this.isAutoConfirmSkipMode) {
        return [];
      }
      return this.options.filter(o => !SKIP_OPTIONS.has(o) && !BACK_OPTIONS.has(o));
    },
    singleActionOption(): string | null {
      if (this.backOption || this.skipOption) return null;
      if (this.displayOptions.length !== 1) return null;
      return this.displayOptions[0];
    },
    autoConfirmOption(): string | null {
      if (this.displayOptions.length !== 1) return null;
      return this.displayOptions[0];
    },
    isAutoConfirmSkipMode(): boolean {
      const hasSkipReveal = this.options.includes('REVEAL_CARD') && this.options.includes('SKIP_REVEAL');
      const hasSkipPayTuck = this.options.includes('CONFIRM_PAY_TUCK') && this.options.includes('SKIP_PAY_TUCK');
      return hasSkipReveal || hasSkipPayTuck;
    },
    effectiveSelectedOption(): string | null {
      if (this.selected) return this.selected;
      if (this.options.includes('REVEAL_CARD') && this.options.includes('SKIP_REVEAL')) return 'REVEAL_CARD';
      if (this.options.includes('CONFIRM_PAY_TUCK') && this.options.includes('SKIP_PAY_TUCK')) return 'CONFIRM_PAY_TUCK';
      if (this.autoConfirmOption) return this.autoConfirmOption;
      return null;
    },
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
      if (option.startsWith('TARGET:')) {
        const parts = option.split(':');
        return parts[2] || option;
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
    getFoodIcon(option: string): string | undefined {
      return FOOD_ICONS[option];
    },
    isOptionDisabled(option: string | null): boolean {
      if (!option) return true;
      return this.disabledOptions.includes(option);
    },
    onSelect(option: string): void {
      if (this.isOptionDisabled(option)) return;
      this.selected = option;
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

.food-option-btn {
  padding: $space-sm;
  display: flex;
  align-items: center;
  justify-content: center;

  .food-option-icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }
}

.input-actions {
  margin-top: $space-md;
  display: flex;
  justify-content: center;
  gap: $space-md;
}
</style>
