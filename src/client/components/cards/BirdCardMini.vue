<template>
  <div class="bird-card-mini" :class="'mini-habitat-' + card.habitats[0]?.toLowerCase()">
    <img v-if="birdImage" :src="birdImage" :alt="card.commonName" class="mini-bird-img" />
    <div class="mini-info">
      <div class="mini-name" :title="card.commonName">{{ card.commonName }}</div>
      <div class="mini-stats">
        <span class="mini-points">{{ card.points }}pt</span>
        <span v-if="card.powerType !== 'NONE'" class="mini-power" :class="'power-dot-' + card.powerType.toLowerCase()"></span>
      </div>
    </div>
    <div v-if="card.eggs > 0 || card.cachedFood > 0 || card.tuckedCards > 0" class="mini-tokens">
      <span v-if="card.eggs > 0" class="token token-egg">{{ card.eggs }}</span>
      <span v-if="card.cachedFood > 0" class="token token-food">{{ card.cachedFood }}</span>
      <span v-if="card.tuckedCards > 0" class="token token-tuck">{{ card.tuckedCards }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ClientBirdCard } from '@common/cards/ClientBirdCard';
import { getBirdImage } from '../../utils/birdImages';

export default defineComponent({
  name: 'BirdCardMini',
  props: {
    card: { type: Object as PropType<ClientBirdCard>, required: true },
  },
  computed: {
    birdImage(): string | undefined {
      return getBirdImage(this.card.name);
    },
  },
});
</script>

<style lang="scss" scoped>
.bird-card-mini {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  border-radius: 6px;
  background: #f5f0e8;
  min-width: 0;

  &.mini-habitat-forest { border-left: 3px solid #4a7c59; }
  &.mini-habitat-grassland { border-left: 3px solid #a8b54a; }
  &.mini-habitat-wetland { border-left: 3px solid #4a90a8; }
}

.mini-bird-img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  border-radius: 3px;
  flex-shrink: 0;
}

.mini-info {
  flex: 1;
  min-width: 0;
}

.mini-name {
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #333;
}

.mini-stats {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #777;
}

.mini-points { font-weight: bold; }

.mini-power {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;

  &.power-dot-brown { background: #8b5a2b; }
  &.power-dot-pink { background: #c75075; }
  &.power-dot-white { background: #ccc; border: 1px solid #aaa; }
  &.power-dot-game_end { background: #008080; }
}

.mini-tokens {
  display: flex;
  gap: 3px;
}

.token {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 10px;
  font-weight: bold;
  color: white;

  &.token-egg { background: #7ab5d6; }
  &.token-food { background: #a8b54a; }
  &.token-tuck { background: #c4956a; }
}
</style>
