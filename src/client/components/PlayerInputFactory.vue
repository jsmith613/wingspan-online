<template>
  <div class="player-input-factory">
    <!-- Action selection (top-level turn choice) -->
    <div v-if="input.type === 'SELECT_ACTION'" class="input-panel panel">
      <h3>Choose Action</h3>
      <div class="action-buttons">
        <button
          v-for="action in input.availableActions"
          :key="action"
          class="btn-primary action-btn"
          @click="$emit('submit', { type: 'SELECT_ACTION', selectedAction: action })"
        >{{ actionLabel(action) }}</button>
      </div>
    </div>

    <SelectFood
      v-else-if="input.type === 'SELECT_FOOD'"
      :available-dice="input.availableDice"
      :message="input.message || ''"
      :required-cost="input.requiredCost || []"
      :can-reroll="input.canReroll || false"
      :min="input.min"
      :max="input.max"
      @submit="(v) => $emit('submit', v)"
    />

    <SelectBird
      v-else-if="input.type === 'SELECT_BIRD'"
      :available-birds="input.availableBirds"
      :bird-details="input.birdDetails || []"
      :unaffordable-birds="input.unaffordableBirds || []"
      :min="input.min"
      :max="input.max"
      @submit="(v) => $emit('submit', v)"
    />

    <SelectHabitatSlot
      v-else-if="input.type === 'SELECT_HABITAT_SLOT'"
      :available-habitats="input.availableHabitats"
      :can-skip="input.canSkip || false"
      @submit="(v) => $emit('submit', v)"
    />

    <SelectEggLocation
      v-else-if="input.type === 'SELECT_EGG_LOCATION'"
      :available-birds="input.availableBirds"
      :eggs-to-lay="input.eggsToLay"
      @submit="(v) => $emit('submit', v)"
    />

    <SelectCards
      v-else-if="input.type === 'SELECT_CARDS'"
      :available-cards="input.availableCards"
      :message="input.message || ''"
      :min="input.min"
      :max="input.max"
      @submit="(v) => $emit('submit', v)"
    />

    <SelectOption
      v-else-if="input.type === 'SELECT_OPTION'"
      :options="input.options"
      :message="input.message"
      :disabled-options="input.disabledOptions || []"
      :card-details="input.cardDetails || []"
      @submit="(v) => $emit('submit', v)"
    />

    <SelectBird
      v-else-if="input.type === 'SELECT_BIRD_TO_KEEP'"
      :available-birds="input.birds"
      :bird-details="input.birdDetails || []"
      :min="0"
      :max="input.max"
      @submit="(v) => $emit('submit', { type: 'SELECT_BIRD_TO_KEEP', selectedBirds: v.selectedBirds })"
    />

    <SelectCards
      v-else-if="input.type === 'SELECT_BONUS_CARD'"
      :available-cards="input.availableBonusCards"
      :min="input.min"
      :max="input.max"
      @submit="(v) => $emit('submit', { type: 'SELECT_BONUS_CARD', selectedBonusCards: v.selectedCards })"
    />

    <SelectStartingFood
      v-else-if="input.type === 'SELECT_STARTING_FOOD'"
      :available-food="input.availableFood"
      :count="input.count"
      @submit="(v) => $emit('submit', v)"
    />

    <!-- OR_OPTIONS: let player pick which sub-option to use -->
    <div v-else-if="input.type === 'OR_OPTIONS'" class="input-panel panel">
      <h3>Choose One</h3>
      <div v-if="!chosenOption" class="or-options">
        <button
          v-for="(opt, i) in input.options"
          :key="i"
          class="btn-secondary or-option-btn"
          @click="chosenOption = opt"
        >Option {{ i + 1 }}: {{ opt.type }}</button>
      </div>
      <PlayerInputFactory
        v-else
        :input="chosenOption"
        @submit="(v) => $emit('submit', v)"
      />
    </div>

    <div v-else class="input-panel panel">
      <p>Unknown input type: {{ input.type }}</p>
    </div>

    <div v-if="showBackButton" class="back-button-area">
      <button class="btn-secondary back-btn" @click="onBack">
        &larr; {{ backLabel }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { PlayerInputModel } from '@common/input/PlayerInputModel';
import { ActionType } from '@common/game/ActionType';
import SelectFood from './inputs/SelectFood.vue';
import SelectBird from './inputs/SelectBird.vue';
import SelectHabitatSlot from './inputs/SelectHabitatSlot.vue';
import SelectEggLocation from './inputs/SelectEggLocation.vue';
import SelectCards from './inputs/SelectCards.vue';
import SelectOption from './inputs/SelectOption.vue';
import SelectStartingFood from './inputs/SelectStartingFood.vue';

const ACTION_LABELS: Record<string, string> = {
  [ActionType.PLAY_BIRD]: 'Play a Bird',
  [ActionType.GAIN_FOOD]: 'Gain Food',
  [ActionType.LAY_EGGS]: 'Lay Eggs',
  [ActionType.DRAW_CARDS]: 'Draw Cards',
};

export default defineComponent({
  name: 'PlayerInputFactory',
  components: { SelectFood, SelectBird, SelectHabitatSlot, SelectEggLocation, SelectCards, SelectOption, SelectStartingFood },
  props: {
    input: { type: Object as PropType<PlayerInputModel>, required: true },
    canCancel: { type: Boolean, default: true },
  },
  emits: ['submit'],
  data() {
    return {
      chosenOption: null as PlayerInputModel | null,
    };
  },
  computed: {
    showBackButton(): boolean {
      if (!this.canCancel) {
        return false;
      }
      if ((this.input as any).lockBack) {
        return false;
      }
      const noBack = ['SELECT_ACTION', 'SELECT_BIRD_TO_KEEP', 'SELECT_STARTING_FOOD', 'SELECT_BONUS_CARD'];
      return !noBack.includes(this.input.type);
    },
    backLabel(): string {
      if (this.input.type === 'SELECT_HABITAT_SLOT') {
        return 'Back to Bird Selection';
      }
      if (this.isBirdPayment) {
        return 'Back to Habitat Selection';
      }
      return 'Back to Action Selection';
    },
    isBirdPayment(): boolean {
      return this.input.type === 'SELECT_FOOD' && ((this.input as any).message || '').startsWith('Pay bird cost');
    },
  },
  methods: {
    actionLabel(action: ActionType): string {
      return ACTION_LABELS[action] || action;
    },
    onBack() {
      if (this.input.type === 'SELECT_HABITAT_SLOT' || this.isBirdPayment) {
        this.$emit('submit', { cancel: true, cancelType: 'habitat' });
      } else {
        this.$emit('submit', { cancel: true });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../styles/variables';

.action-buttons {
  display: flex;
  gap: $space-md;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: $space-md $space-xl;
  font-size: $font-size-lg;
}

.or-options {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
  align-items: center;
}

.or-option-btn {
  width: 280px;
  padding: $space-md;
  font-size: $font-size-md;
}

.back-button-area {
  margin-top: $space-md;
  text-align: center;
}

.back-btn {
  padding: $space-sm $space-lg;
  font-size: $font-size-sm;
  opacity: 0.8;

  &:hover { opacity: 1; }
}
</style>
