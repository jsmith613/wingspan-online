<template>
  <div class="hand-cards">
    <div v-if="cards.length === 0" class="hand-empty">No cards in hand</div>
    <BirdCard
      v-for="card in cards"
      :key="card.name"
      :card="card"
      :selectable="selectable"
      :selected="isSelected(card.name)"
      @select="$emit('select', card.name)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ClientBirdCard } from '@common/cards/ClientBirdCard';
import { BirdCardName } from '@common/cards/BirdCardName';
import BirdCard from './BirdCard.vue';

export default defineComponent({
  name: 'HandCards',
  components: { BirdCard },
  props: {
    cards: { type: Array as PropType<ClientBirdCard[]>, required: true },
    selectable: { type: Boolean, default: false },
    selectedCards: { type: Array as PropType<BirdCardName[]>, default: () => [] },
  },
  emits: ['select'],
  methods: {
    isSelected(name: BirdCardName): boolean {
      return this.selectedCards.includes(name);
    },
  },
});
</script>
