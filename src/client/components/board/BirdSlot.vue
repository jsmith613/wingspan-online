<template>
  <div
    class="bird-slot"
    :class="{
      'slot-empty': !slot.bird,
      'slot-filled': !!slot.bird,
      'slot-selectable': selectable,
    }"
    @click="selectable && $emit('select')"
  >
    <template v-if="slot.bird">
      <BirdCardMini :card="slot.bird" />
    </template>
    <template v-else>
      <span class="slot-label">{{ columnIndex + 1 }}</span>
      <span v-if="eggCost > 0" class="slot-egg-cost" :title="eggCost + ' egg cost'">{{ eggCost }}</span>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { PlayerBoardSlot } from '@common/models/PlayerViewModel';
import { EGG_COST_BY_COLUMN } from '@common/constants';
import BirdCardMini from '../cards/BirdCardMini.vue';

export default defineComponent({
  name: 'BirdSlot',
  components: { BirdCardMini },
  props: {
    slot: { type: Object as PropType<PlayerBoardSlot>, required: true },
    columnIndex: { type: Number, required: true },
    selectable: { type: Boolean, default: false },
  },
  emits: ['select'],
  computed: {
    eggCost(): number {
      return EGG_COST_BY_COLUMN[this.columnIndex] ?? 0;
    },
  },
});
</script>
