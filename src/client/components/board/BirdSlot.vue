<template>
  <div
    class="bird-slot"
    :class="{
      'slot-empty': !slot.bird,
      'slot-filled': !!slot.bird,
      'slot-selectable': selectable,
    }"
    @click="selectable && $emit('select')"
    @mouseenter="showHover = true"
    @mouseleave="showHover = false"
    ref="slotEl"
  >
    <template v-if="slot.bird">
      <div class="slot-card-wrapper">
        <BirdCard :card="slot.bird" class="slot-bird-card" />
      </div>
      <div v-if="slot.bird.eggs > 0 || slot.bird.cachedFood > 0 || slot.bird.tuckedCards > 0" class="slot-tokens-overlay">
        <span v-if="slot.bird.eggs > 0" class="token token-egg">{{ slot.bird.eggs }}</span>
        <span v-if="slot.bird.cachedFood > 0" class="token token-food">{{ slot.bird.cachedFood }}</span>
        <span v-if="slot.bird.tuckedCards > 0" class="token token-tuck">{{ slot.bird.tuckedCards }}</span>
      </div>
    </template>
    <template v-else>
      <span v-if="eggCost > 0" class="slot-egg-cost" :title="eggCost + ' egg cost'">{{ eggCost }}</span>
      <div class="slot-empty-content">
        <div class="slot-action-track" v-if="habitatType">
          <div class="primary-row">
            <img
              v-for="n in actionStrength"
              :key="'icon-' + n"
              :src="actionIcon"
              class="action-icon"
            />
          </div>
          <div v-if="hasTrade" class="trade-row">
            <img :src="tradeCostIcon" class="action-icon trade-cost" />
            <span class="trade-arrow">-&gt;</span>
            <img :src="actionIcon" class="action-icon" />
          </div>
        </div>
      </div>
    </template>

    <!-- Full-size hover popup teleported to body -->
    <Teleport to="body">
      <div
        v-if="slot.bird && showHover"
        class="bird-hover-popup"
        :style="popupStyle"
      >
        <BirdCard :card="slot.bird" />
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { PlayerBoardSlot } from '@common/models/PlayerViewModel';
import { HabitatType } from '@common/game/HabitatType';
import { EGG_COST_BY_COLUMN } from '@common/constants';
import { EGG_ICON, FOOD_ICONS } from '../../utils/cardAssets';
import BirdCard from '../cards/BirdCard.vue';
import cardIcon from '../../assets/icons/card.webp';

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

const TRADE_COLUMNS = new Set([1, 3]);

export default defineComponent({
  name: 'BirdSlot',
  components: { BirdCard },
  props: {
    slot: { type: Object as PropType<PlayerBoardSlot>, required: true },
    columnIndex: { type: Number, required: true },
    selectable: { type: Boolean, default: false },
    habitatType: { type: String as PropType<HabitatType>, default: null },
  },
  emits: ['select'],
  data() {
    return {
      showHover: false,
    };
  },
  computed: {
    eggCost(): number {
      return EGG_COST_BY_COLUMN[this.columnIndex] ?? 0;
    },
    actionStrength(): number {
      if (!this.habitatType) return 0;
      const strengths = COLUMN_ACTION_STRENGTH[this.habitatType];
      return strengths?.[this.columnIndex] ?? 0;
    },
    hasTrade(): boolean {
      return TRADE_COLUMNS.has(this.columnIndex);
    },
    actionIcon(): string {
      return this.habitatType ? ACTION_ICONS[this.habitatType] || '' : '';
    },
    tradeCostIcon(): string {
      return this.habitatType ? TRADE_COST_ICONS[this.habitatType] || '' : '';
    },
    popupStyle(): Record<string, string> {
      const el = this.$refs.slotEl as HTMLElement | undefined;
      if (!el) return { display: 'none' };
      const rect = el.getBoundingClientRect();
      // Position popup to the right of the slot
      let left = rect.right + 12;
      let top = rect.top;
      // If it would go off the right edge, show to the left instead
      if (left + 248 > window.innerWidth) {
        left = rect.left - 252;
      }
      // Keep it on screen vertically
      if (top + 368 > window.innerHeight) {
        top = window.innerHeight - 372;
      }
      if (top < 4) top = 4;
      return {
        position: 'fixed',
        left: left + 'px',
        top: top + 'px',
        zIndex: '10000',
      };
    },
  },
});
</script>

<style lang="scss" scoped>
$card-scale: 0.45;
$scaled-w: 240px * $card-scale;  // 108px
$scaled-h: 360px * $card-scale;  // 162px

.bird-slot {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &.slot-filled {
    width: $scaled-w;
    height: $scaled-h;
    border-radius: 6px;
  }
}

.slot-card-wrapper {
  width: $scaled-w;
  height: $scaled-h;
  position: relative;

  .slot-bird-card {
    position: absolute;
    top: 0;
    left: 0;
    width: 240px;
    height: 360px;
    transform: scale($card-scale);
    transform-origin: top left;
  }
}

.slot-action-track {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 36px;
}

.slot-empty-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-row,
.trade-row {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 10px;
}

.action-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.trade-cost {
  width: 13px;
  height: 13px;
  opacity: 0.65;
}

.trade-arrow {
  font-size: 10px;
  color: #666;
  line-height: 1;
}

.slot-tokens-overlay {
  position: absolute;
  bottom: 2px;
  right: 2px;
  display: flex;
  gap: 3px;
  z-index: 2;
}

.token {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: bold;
  color: white;
  border: 1.5px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

  &.token-egg { background: #7ab5d6; }
  &.token-food { background: #a8b54a; }
  &.token-tuck { background: #c4956a; }
}
</style>

<style lang="scss">
/* Global style for the teleported hover popup */
.bird-hover-popup {
  pointer-events: none;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.35));
  animation: hover-fade-in 0.15s ease;
}

@keyframes hover-fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>

