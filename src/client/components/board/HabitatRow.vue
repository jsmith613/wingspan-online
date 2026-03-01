<template>
  <div class="habitat-row" :class="'habitat-' + habitat">
    <div class="habitat-header">
      <div class="habitat-name habitat-label" :class="'habitat-' + habitat">{{ habitat }}</div>
      <div class="action-strength">{{ actionDescription }}</div>
    </div>
    <div class="slots">
      <BirdSlot
        v-for="(slot, i) in slots"
        :key="i"
        :slot="slot"
        :column-index="i"
        :habitat-type="habitat"
        :selectable="isSlotSelectable(i)"
        @select="$emit('select-slot', habitat, i)"
      />
    </div>
    <div class="max-reward" v-if="actionIcon">
      <div class="primary-row">
        <img
          v-for="n in maxActionStrength"
          :key="'max-icon-' + n"
          :src="actionIcon"
          class="action-icon"
        />
      </div>
      <div class="trade-row" v-if="hasMaxTrade">
        <img :src="tradeCostIcon" class="action-icon trade-cost" />
        <span class="trade-arrow">→</span>
        <img :src="actionIcon" class="action-icon" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { HabitatType } from '@common/game/HabitatType';
import { PlayerBoardSlot } from '@common/models/PlayerViewModel';
import { EGG_ICON, FOOD_ICONS } from '../../utils/cardAssets';
import cardIcon from '../../assets/icons/card.webp';
import BirdSlot from './BirdSlot.vue';

const ACTION_DESCRIPTIONS: Record<string, string> = {
  [HabitatType.FOREST]: 'Gain Food',
  [HabitatType.GRASSLAND]: 'Lay Eggs',
  [HabitatType.WETLAND]: 'Draw Cards',
};

const ACTION_ICONS: Record<string, string> = {
  [HabitatType.FOREST]: FOOD_ICONS.WILD,
  [HabitatType.GRASSLAND]: EGG_ICON,
  [HabitatType.WETLAND]: cardIcon,
};

const TRADE_COST_ICONS: Record<string, string> = {
  [HabitatType.FOREST]: cardIcon,
  [HabitatType.GRASSLAND]: FOOD_ICONS.WILD,
  [HabitatType.WETLAND]: EGG_ICON,
};

const COLUMN_ACTION_STRENGTH: Record<string, number[]> = {
  [HabitatType.FOREST]: [1, 1, 2, 2, 3],
  [HabitatType.GRASSLAND]: [2, 2, 3, 3, 4],
  [HabitatType.WETLAND]: [1, 1, 2, 2, 3],
};

const TRADE_COLUMNS = new Set([1, 3, 4]);

export default defineComponent({
  name: 'HabitatRow',
  components: { BirdSlot },
  props: {
    habitat: { type: String as PropType<HabitatType>, required: true },
    slots: { type: Array as PropType<PlayerBoardSlot[]>, required: true },
    selectableSlots: { type: Array as PropType<number[]>, default: () => [] },
  },
  emits: ['select-slot'],
  computed: {
    actionDescription(): string {
      return ACTION_DESCRIPTIONS[this.habitat] || '';
    },
    actionIcon(): string {
      return ACTION_ICONS[this.habitat] || '';
    },
    tradeCostIcon(): string {
      return TRADE_COST_ICONS[this.habitat] || '';
    },
    maxActionStrength(): number {
      return COLUMN_ACTION_STRENGTH[this.habitat]?.[4] ?? 0;
    },
    hasMaxTrade(): boolean {
      return TRADE_COLUMNS.has(4);
    },
  },
  methods: {
    isSlotSelectable(index: number): boolean {
      return this.selectableSlots.includes(index);
    },
  },
});
</script>

