<template>
  <div id="wingspan-app">
    <!-- Start Screen -->
    <StartScreen
      v-if="screen === 'start'"
      @start="onGameStart"
    />

    <!-- Turn Transition -->
    <TurnTransition
      v-else-if="screen === 'transition'"
      :player-name="transitionPlayerName"
      :round="gameState!.round"
      :action-cubes="transitionActionCubes"
      @ready="onTransitionReady"
    />

    <!-- Game Over / Scoreboard -->
    <div v-else-if="screen === 'gameover'" class="screen">
      <Scoreboard :players="gameState!.players" />
      <button class="btn-primary" style="margin-top: 24px" @click="screen = 'start'">New Game</button>
    </div>

    <!-- Main Game -->
    <PlayerHome
      v-else-if="screen === 'game' && gameState"
      :game="gameState"
      :player-id="currentPlayerId!"
      @submit="onPlayerSubmit"
    />

    <!-- Loading -->
    <div v-else class="screen">
      <p>Loading...</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { GameViewModel } from '@common/models/GameViewModel';
import { PlayerId, GameId } from '@common/Types';
import { Phase } from '@common/game/Phase';
import * as api from '../utils/api';
import StartScreen from './StartScreen.vue';
import TurnTransition from './TurnTransition.vue';
import PlayerHome from './PlayerHome.vue';
import Scoreboard from './scoring/Scoreboard.vue';

type Screen = 'start' | 'transition' | 'game' | 'gameover';

export default defineComponent({
  name: 'App',
  components: { StartScreen, TurnTransition, PlayerHome, Scoreboard },
  data() {
    return {
      screen: 'start' as Screen,
      gameId: null as GameId | null,
      playerIds: [] as PlayerId[],
      currentPlayerId: null as PlayerId | null,
      gameState: null as GameViewModel | null,
      previousPlayerId: null as PlayerId | null,
      error: '',
    };
  },
  computed: {
    transitionPlayerName(): string {
      if (!this.gameState || !this.currentPlayerId) return '';
      const player = this.gameState.players.find((p) => p.id === this.currentPlayerId);
      return player?.name || '';
    },
    transitionActionCubes(): number {
      if (!this.gameState || !this.currentPlayerId) return 0;
      const player = this.gameState.players.find((p) => p.id === this.currentPlayerId);
      return player?.actionCubes || 0;
    },
  },
  methods: {
    async onGameStart(playerNames: string[]) {
      try {
        const result = await api.createGame(playerNames);
        this.gameId = result.gameId;
        this.playerIds = result.playerIds;
        await this.refreshGameState();
      } catch (err) {
        this.error = String(err);
      }
    },

    async refreshGameState() {
      if (!this.gameId) return;
      try {
        const state = await api.getGameState(this.gameId);
        this.gameState = state;
        this.currentPlayerId = state.currentPlayerId;

        if (state.phase === Phase.GAME_END) {
          this.screen = 'gameover';
        } else if (this.previousPlayerId && this.previousPlayerId !== state.currentPlayerId) {
          // Different player's turn - show transition screen for hot-seat
          this.screen = 'transition';
        } else {
          this.screen = 'game';
        }
      } catch (err) {
        this.error = String(err);
      }
    },

    onTransitionReady() {
      this.screen = 'game';
    },

    async onPlayerSubmit(response: unknown) {
      if (!this.currentPlayerId) return;
      try {
        this.previousPlayerId = this.currentPlayerId;
        const state = await api.submitInput(this.currentPlayerId, response);
        this.gameState = state;
        this.currentPlayerId = state.currentPlayerId;

        if (state.phase === Phase.GAME_END) {
          this.screen = 'gameover';
        } else if (this.previousPlayerId !== state.currentPlayerId) {
          this.screen = 'transition';
        }
        // Otherwise stay on game screen (same player still has input pending)
      } catch (err) {
        this.error = String(err);
      }
    },
  },
});
</script>

<style lang="scss">
@import '../../styles/main';
@import '../../styles/board';
@import '../../styles/cards';
</style>
