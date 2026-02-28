<template>
  <div
    class="bird-card"
    :class="[
      'card-habitat-' + card.habitats[0]?.toLowerCase(),
      { 'card-selectable': selectable, 'card-selected': selected }
    ]"
    @click="selectable && $emit('select')"
  >
    <!-- Top section: habitat + food cost on left, name on right -->
    <div class="card-top">
      <div class="card-left-strip">
        <div class="habitat-box">
          <img
            v-for="h in card.habitats"
            :key="h"
            :src="habitatIcon(h)"
            :alt="h"
            class="habitat-icon"
          />
        </div>
        <div class="food-cost-strip">
          <img
            v-for="(f, i) in card.foodCost"
            :key="i"
            :src="foodIcon(f)"
            :alt="f"
            class="food-cost-icon"
          />
          <span v-if="card.foodCost.length === 0" class="no-cost-label">-</span>
        </div>
      </div>
      <div class="card-name-banner">
        <div class="card-common-name">{{ card.commonName }}</div>
        <div class="card-scientific-name">{{ card.scientificName }}</div>
      </div>
    </div>

    <!-- Bird image area -->
    <div class="card-image-area">
      <div class="image-left-info">
        <div class="egg-capacity">
          <img :src="eggIcon" alt="eggs" class="info-icon" />
          <span>{{ card.eggCapacity }}</span>
        </div>
        <div class="nest-type">
          <img :src="nestIcon(card.nestType)" :alt="card.nestType" class="info-icon" />
        </div>
      </div>
      <div class="bird-illustration">
        <img v-if="birdImage" :src="birdImage" :alt="card.commonName" />
        <div v-else class="bird-placeholder"></div>
      </div>
      <div class="image-right-info">
        <span class="wingspan-label">{{ card.wingspan }}cm</span>
      </div>
    </div>

    <!-- Power text area -->
    <div class="card-power-area" :class="'power-bg-' + card.powerType.toLowerCase()">
      <template v-if="card.powerType !== 'NONE'">
        <img :src="powerIcon(card.powerType)" :alt="card.powerType" class="power-type-icon" />
        <span class="power-label">{{ powerLabel(card.powerType) }}:</span>
        <span class="power-text">{{ card.powerText }}</span>
      </template>
      <template v-else>
        <span class="power-text no-power">No power</span>
      </template>
    </div>

    <!-- Footer: points -->
    <div class="card-footer">
      <span class="card-points">{{ card.points }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ClientBirdCard } from '@common/cards/ClientBirdCard';
import { HabitatType } from '@common/game/HabitatType';
import { NestType } from '@common/game/NestType';
import { PowerType } from '@common/game/PowerType';
import { FoodType } from '@common/game/FoodType';
import { getBirdImage } from '../../utils/birdImages';
import {
  HABITAT_ICONS,
  FOOD_ICONS,
  NEST_ICONS,
  POWER_ICONS,
  EGG_ICON,
} from '../../utils/cardAssets';

const POWER_LABELS: Record<string, string> = {
  [PowerType.BROWN]: 'WHEN ACTIVATED',
  [PowerType.PINK]: 'ONCE BETWEEN TURNS',
  [PowerType.WHITE]: 'WHEN PLAYED',
  [PowerType.GAME_END]: 'GAME END',
};

export default defineComponent({
  name: 'BirdCard',
  props: {
    card: { type: Object as PropType<ClientBirdCard>, required: true },
    selectable: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
  },
  emits: ['select'],
  computed: {
    birdImage(): string | undefined {
      return getBirdImage(this.card.name);
    },
    eggIcon(): string {
      return EGG_ICON;
    },
  },
  methods: {
    habitatIcon(h: HabitatType): string {
      return HABITAT_ICONS[h] || '';
    },
    foodIcon(f: FoodType): string {
      return FOOD_ICONS[f] || '';
    },
    nestIcon(n: NestType): string {
      return NEST_ICONS[n] || '';
    },
    powerIcon(p: PowerType): string {
      return POWER_ICONS[p] || '';
    },
    powerLabel(p: PowerType): string {
      return POWER_LABELS[p] || p;
    },
  },
});
</script>

<style lang="scss" scoped>
.bird-card {
  width: 240px;
  height: 360px;
  border-radius: 10px;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  background: #f5f0e8;
  display: flex;
  flex-direction: column;
  transition: transform 0.15s, box-shadow 0.15s;
  position: relative;

  &.card-selectable {
    cursor: pointer;
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
    }
  }

  &.card-selected {
    box-shadow: 0 0 0 3px #2e7d32, 0 4px 12px rgba(0, 0, 0, 0.3);
  }
}

// Habitat-tinted card
.card-habitat-forest {
  border-top: 4px solid #4a7c59;
  background: linear-gradient(180deg, #e8f0e0 0%, #f5f0e8 35%);
}
.card-habitat-grassland {
  border-top: 4px solid #a8b54a;
  background: linear-gradient(180deg, #f5f0d0 0%, #f5f0e8 35%);
}
.card-habitat-wetland {
  border-top: 4px solid #4a90a8;
  background: linear-gradient(180deg, #d6eaf8 0%, #f5f0e8 35%);
}

.card-top {
  display: flex;
  min-height: 56px;
}

.card-left-strip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px;
  gap: 4px;
  min-width: 44px;
}

.habitat-box {
  background: rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  padding: 4px 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 3px;
  min-height: 32px;
}

.habitat-icon {
  width: 26px;
  height: 26px;
  object-fit: contain;
  flex-shrink: 0;
}

.food-cost-strip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.food-cost-icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.no-cost-label {
  font-size: 14px;
  color: #999;
}

.card-name-banner {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 6px 10px 6px 4px;
}

.card-common-name {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  color: #333;
}

.card-scientific-name {
  font-size: 10px;
  font-style: italic;
  color: #777;
  line-height: 1.2;
}

// Bird image area
.card-image-area {
  display: flex;
  align-items: center;
  padding: 4px 6px;
  flex: 1;
  background: linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(200,195,180,0.3) 100%);
}

.image-left-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 36px;
}

.egg-capacity {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #555;

  .info-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
}

.nest-type {
  .info-icon {
    width: 26px;
    height: 26px;
    object-fit: contain;
  }
}

.bird-illustration {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 100%;
    max-height: 110px;
    object-fit: contain;
    border-radius: 4px;
  }
}

.bird-placeholder {
  width: 80px;
  height: 80px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 50%;
}

.image-right-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  min-width: 40px;
  align-self: flex-end;
}

.wingspan-label {
  font-size: 11px;
  color: #888;
  font-style: italic;
}

// Power area
.card-power-area {
  padding: 8px 10px;
  min-height: 40px;
  max-height: 80px;
  overflow-y: auto;
  font-size: 11px;
  line-height: 1.4;
  color: #333;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 4px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);

  &.power-bg-brown { background: rgba(139, 90, 43, 0.1); }
  &.power-bg-pink { background: rgba(199, 80, 117, 0.1); }
  &.power-bg-white { background: rgba(200, 200, 200, 0.15); }
  &.power-bg-game_end { background: rgba(0, 128, 128, 0.1); }
  &.power-bg-none { background: rgba(0, 0, 0, 0.03); }
}

.power-type-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
  flex-shrink: 0;
}

.power-label {
  font-weight: 700;
  font-size: 10px;
  text-transform: uppercase;
  white-space: nowrap;
}

.power-text {
  font-size: 11px;

  &.no-power {
    color: #aaa;
    font-style: italic;
  }
}

// Footer
.card-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 4px 10px 6px;
}

.card-points {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e8e0d0;
  font-size: 16px;
  font-weight: 700;
  color: #555;
  border: 2px solid #ccc3b0;
}
</style>
