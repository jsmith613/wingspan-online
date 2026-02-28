<template>
  <div class="screen turn-transition">
    <div class="transition-card panel">
      <h2>Pass the device to</h2>
      <h1 class="player-name">{{ playerName }}</h1>
      <p class="transition-info">Round {{ round }} &mdash; {{ actionCubes }} action{{ actionCubes !== 1 ? 's' : '' }} remaining</p>
      <button class="btn-primary ready-btn" @click="$emit('ready')">I'm Ready</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TurnTransition',
  props: {
    playerName: { type: String, required: true },
    round: { type: Number, required: true },
    actionCubes: { type: Number, required: true },
  },
  emits: ['ready'],
});
</script>

<style lang="scss" scoped>
@import '../../styles/variables';

.turn-transition {
  background: linear-gradient(135deg, $color-forest-bg, $color-wetland-bg);
}

.transition-card {
  text-align: center;
  padding: $space-xxl;
  max-width: 400px;

  h2 {
    color: $color-text-light;
    font-size: $font-size-lg;
    margin-bottom: $space-sm;
  }

  .player-name {
    font-size: $font-size-xxl;
    color: $color-forest;
    margin-bottom: $space-md;
  }

  .transition-info {
    color: $color-text-muted;
    margin-bottom: $space-xl;
  }

  .ready-btn {
    padding: $space-md $space-xxl;
    font-size: $font-size-lg;
  }
}
</style>
