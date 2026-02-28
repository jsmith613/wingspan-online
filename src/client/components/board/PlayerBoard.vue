<template>
  <div class="player-board">
    <HabitatRow
      v-for="habitat in habitats"
      :key="habitat"
      :habitat="habitat"
      :slots="board[habitat]"
      :selectable-slots="selectableSlotsFor(habitat)"
      @select-slot="(h, i) => $emit('select-slot', h, i)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { HabitatType } from '@common/game/HabitatType';
import { PlayerBoardView } from '@common/models/PlayerViewModel';
import HabitatRow from './HabitatRow.vue';

export default defineComponent({
  name: 'PlayerBoard',
  components: { HabitatRow },
  props: {
    board: { type: Object as PropType<PlayerBoardView>, required: true },
    selectableHabitats: { type: Object as PropType<Partial<Record<HabitatType, number[]>>>, default: () => ({}) },
  },
  emits: ['select-slot'],
  data() {
    return {
      habitats: [HabitatType.FOREST, HabitatType.GRASSLAND, HabitatType.WETLAND] as const,
    };
  },
  methods: {
    selectableSlotsFor(habitat: HabitatType): number[] {
      return this.selectableHabitats[habitat] || [];
    },
  },
});
</script>
