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

.error-text {
  color: $color-danger;
  margin-top: $space-md;
}
</style>
