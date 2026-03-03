<template>
  <div class="screen start-screen">
    <div class="start-card panel">
      <h1 class="game-title">Wingspan</h1>
      <p class="game-subtitle">A competitive bird-collection board game</p>

      <div class="player-count">
        <label>Players:</label>
        <div class="count-buttons">
          <button
            v-for="n in [2, 3, 4, 5]"
            :key="n"
            :class="{ 'btn-primary': playerCount === n, 'btn-secondary': playerCount !== n }"
            @click="setPlayerCount(n)"
          >{{ n }}</button>
        </div>
      </div>

      <div class="player-names">
        <div v-for="i in playerCount" :key="i" class="name-field">
          <label :for="'player-' + i">Player {{ i }}:</label>
          <input
            :id="'player-' + i"
            v-model="names[i - 1]"
            type="text"
            :placeholder="'Player ' + i"
            maxlength="20"
          />
        </div>
      </div>

      <div class="game-options">
        <label class="option-checkbox">
          <input type="checkbox" v-model="showVpTotals" />
          Show victory point totals during game
        </label>
      </div>

      <button
        class="btn-primary start-btn"
        :disabled="!canStart"
        @click="startGame"
      >Start Game</button>

      <a
        class="source-link"
        href="https://github.com/jsmith613/wingspan-online"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View source code on GitHub"
        title="View source code on GitHub"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" class="github-icon">
          <path
            fill="currentColor"
            d="M12 0.3C5.4 0.3 0 5.7 0 12.4c0 5.3 3.4 9.8 8.2 11.4c0.6 0.1 0.8-0.3 0.8-0.6c0-0.3 0-1.1 0-2.1c-3.3 0.7-4-1.6-4-1.6c-0.5-1.4-1.3-1.8-1.3-1.8c-1.1-0.8 0.1-0.8 0.1-0.8c1.2 0.1 1.9 1.3 1.9 1.3c1.1 1.9 2.9 1.4 3.6 1.1c0.1-0.8 0.4-1.4 0.8-1.7c-2.7-0.3-5.6-1.4-5.6-6.2c0-1.4 0.5-2.5 1.3-3.3c-0.1-0.3-0.6-1.6 0.1-3.2c0 0 1.1-0.4 3.5 1.3c1-0.3 2.1-0.5 3.2-0.5s2.2 0.2 3.2 0.5c2.4-1.7 3.5-1.3 3.5-1.3c0.7 1.6 0.2 2.9 0.1 3.2c0.8 0.9 1.3 2 1.3 3.3c0 4.8-2.9 5.9-5.6 6.2c0.4 0.4 0.8 1.1 0.8 2.3c0 1.7 0 3 0 3.4c0 0.3 0.2 0.7 0.8 0.6c4.8-1.6 8.2-6.1 8.2-11.4C24 5.7 18.6 0.3 12 0.3z"
          />
        </svg>
      </a>

      <p v-if="error" class="error-text">{{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MIN_PLAYERS, MAX_PLAYERS } from '@common/constants';

export default defineComponent({
  name: 'StartScreen',
  emits: ['start'],
  data() {
    return {
      playerCount: MIN_PLAYERS,
      names: ['', '', '', '', ''] as string[],
      showVpTotals: true,
      error: '',
    };
  },
  computed: {
    canStart(): boolean {
      return this.activeNames.every((n) => n.trim().length > 0);
    },
    activeNames(): string[] {
      return this.names.slice(0, this.playerCount);
    },
  },
  methods: {
    setPlayerCount(n: number) {
      this.playerCount = Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, n));
    },
    startGame() {
      const playerNames = this.activeNames.map((n) => n.trim());
      if (playerNames.some((n) => n.length === 0)) {
        this.error = 'All players must have a name.';
        return;
      }
      const unique = new Set(playerNames);
      if (unique.size !== playerNames.length) {
        this.error = 'Player names must be unique.';
        return;
      }
      this.error = '';
      this.$emit('start', { playerNames, options: { showVpTotals: this.showVpTotals } });
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../styles/variables';

.start-screen {
  background: linear-gradient(135deg, $color-forest-bg, $color-sky);
}

.start-card {
  text-align: center;
  max-width: 480px;
  width: 100%;
  position: relative;
  padding-bottom: $space-xl;
}

.game-title {
  font-size: 48px;
  color: $color-forest;
  margin-bottom: $space-xs;
}

.game-subtitle {
  color: $color-text-light;
  margin-bottom: $space-xl;
}

.player-count {
  margin-bottom: $space-lg;

  label {
    display: block;
    font-weight: bold;
    margin-bottom: $space-sm;
    color: $color-bark;
  }

  .count-buttons {
    display: flex;
    gap: $space-sm;
    justify-content: center;

    button {
      width: 48px;
      height: 48px;
      font-size: $font-size-lg;
      border-radius: $radius-round;
    }
  }
}

.player-names {
  margin-bottom: $space-xl;
}

.name-field {
  display: flex;
  align-items: center;
  gap: $space-md;
  margin-bottom: $space-sm;

  label {
    width: 80px;
    text-align: right;
    font-weight: bold;
    color: $color-bark;
    flex-shrink: 0;
  }

  input {
    flex: 1;
    padding: $space-sm $space-md;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    font-size: $font-size-md;
    font-family: $font-secondary;

    &:focus {
      outline: none;
      border-color: $color-forest;
      box-shadow: 0 0 0 2px rgba($color-forest, 0.2);
    }
  }
}

.game-options {
  margin-bottom: $space-lg;

  .option-checkbox {
    display: flex;
    align-items: center;
    gap: $space-sm;
    justify-content: center;
    font-weight: bold;
    color: $color-bark;
    cursor: pointer;

    input[type='checkbox'] {
      width: 18px;
      height: 18px;
      accent-color: $color-forest;
      cursor: pointer;
    }
  }
}

.start-btn {
  padding: $space-md $space-xxl;
  font-size: $font-size-lg;
}

.source-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: $space-md;
  bottom: $space-md;
  color: $color-text-light;
  text-decoration: none;
  opacity: 0.9;

  &:hover {
    color: $color-forest;
    opacity: 1;
  }
}

.github-icon {
  width: 20px;
  height: 20px;
}

.error-text {
  color: $color-danger;
  margin-top: $space-md;
}
</style>
