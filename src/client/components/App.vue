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
  async mounted() {
    const gameIdFromUrl = this.getGameIdFromUrl();
    this.gameId = gameIdFromUrl;
    if (!this.gameId) return;
    await this.refreshGameState();
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
    getGameIdFromUrl(): GameId | null {
      const url = new URL(window.location.href);
      const queryGameId = url.searchParams.get('gameId');
      if (queryGameId) {
        return queryGameId as GameId;
      }

      const pathMatch = window.location.pathname.match(/^\/game\/([^/]+)$/);
      if (pathMatch && pathMatch[1]) {
        return decodeURIComponent(pathMatch[1]) as GameId;
      }

      return null;
    },
    setUrlGameId(gameId: GameId | null) {
      const url = new URL(window.location.href);
      if (gameId) {
        url.pathname = '/';
        url.searchParams.set('gameId', gameId);
      } else {
        url.pathname = '/';
        url.searchParams.delete('gameId');
      }
      window.history.replaceState({}, '', url.toString());
    },
    persistSession() {
      if (this.gameId) {
        localStorage.setItem('wingspan_game_id', this.gameId);
        this.setUrlGameId(this.gameId);
      }
    },
    clearSession() {
      localStorage.removeItem('wingspan_game_id');
      this.setUrlGameId(null);
    },

    getInputPlayerId(state: GameViewModel): PlayerId {
      return state.expectedInputPlayerId || state.currentPlayerId;
    },

    async onGameStart(playerNames: string[]) {
      try {
        const result = await api.createGame(playerNames);
        this.gameId = result.gameId;
        this.playerIds = result.playerIds;
        this.persistSession();
        await this.refreshGameState();
      } catch (err) {
        this.error = String(err);
      }
    },

    async refreshGameState() {
      if (!this.gameId) return;
      try {
        const state = await api.getGameState(this.gameId);
        const nextInputPlayerId = this.getInputPlayerId(state);
        this.gameState = state;
        this.currentPlayerId = nextInputPlayerId;
        this.persistSession();

        if (state.phase === Phase.GAME_END) {
          this.clearSession();
          this.screen = 'gameover';
        } else if (this.previousPlayerId && this.previousPlayerId !== nextInputPlayerId) {
          // Different player is expected to provide input - show hot-seat transition.
          this.screen = 'transition';
        } else {
          this.screen = 'game';
        }
      } catch (err) {
        this.clearSession();
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
        const nextInputPlayerId = this.getInputPlayerId(state);
        this.gameState = state;
        this.currentPlayerId = nextInputPlayerId;

        if (state.phase === Phase.GAME_END) {
          this.screen = 'gameover';
        } else if (this.previousPlayerId !== nextInputPlayerId) {
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
