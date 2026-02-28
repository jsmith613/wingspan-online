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
        :selectable="isSlotSelectable(i)"
        @select="$emit('select-slot', habitat, i)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { HabitatType } from '@common/game/HabitatType';
import { PlayerBoardSlot } from '@common/models/PlayerViewModel';
import BirdSlot from './BirdSlot.vue';

const ACTION_DESCRIPTIONS: Record<string, string> = {
  [HabitatType.FOREST]: 'Gain Food',
  [HabitatType.GRASSLAND]: 'Lay Eggs',
  [HabitatType.WETLAND]: 'Draw Cards',
};

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
  },
  methods: {
    isSlotSelectable(index: number): boolean {
      return this.selectableSlots.includes(index);
    },
  },
});
</script>
