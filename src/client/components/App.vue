<template>
  <div id="wingspan-app">
    <!-- Start Screen -->
    <StartScreen
      v-if="screen === 'start'"
      @start="onGameStart"
    />

    <!-- Pick Player Identity (multi-device) -->
    <div v-else-if="screen === 'pickplayer'" class="screen">
      <div class="panel pick-player-panel">
        <h2>Share Game, Then Choose Your Player</h2>
        <p class="pick-player-subtitle">Send this link to all players. Each device picks one player name.</p>
        <div class="share-link-row">
          <div class="share-link">{{ shareLink }}</div>
          <button
            class="copy-link-btn"
            @click="copyShareLink"
            :title="copiedLink ? 'Copied' : 'Copy link'"
            aria-label="Copy game link"
          >⧉</button>
        </div>
        <div class="pick-player-buttons">
          <template v-for="p in (gameState?.seatStatus || [])" :key="p.playerId">
            <button
              class="btn-primary"
              :disabled="p.claimed"
              @click="selectViewerPlayer(p.playerId)"
            >
              {{ p.playerName }}{{ p.claimed ? ' (Taken)' : '' }}
            </button>
          </template>
        </div>
      </div>
    </div>

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
      <div class="gameover-actions">
        <button class="btn-secondary" @click="screen = 'review'">Review Boards</button>
        <button class="btn-primary" @click="screen = 'start'">New Game</button>
      </div>
    </div>

    <!-- Post-game board review -->
    <div v-else-if="screen === 'review' && gameState" class="screen review-screen">
      <div class="review-actions">
        <button class="btn-secondary" @click="screen = 'gameover'">Back to Scores</button>
        <button class="btn-primary" @click="screen = 'start'">New Game</button>
      </div>
      <PlayerHome
        :game="gameState"
        :player-id="(viewerPlayerId || currentPlayerId)!"
        @submit="() => {}"
      />
    </div>

    <!-- Main Game -->
    <PlayerHome
      v-else-if="screen === 'game' && gameState"
      :game="gameState"
      :player-id="(viewerPlayerId || currentPlayerId)!"
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

type Screen = 'start' | 'pickplayer' | 'transition' | 'game' | 'gameover' | 'review';

export default defineComponent({
  name: 'App',
  components: { StartScreen, TurnTransition, PlayerHome, Scoreboard },
  data() {
    return {
      screen: 'start' as Screen,
      gameId: null as GameId | null,
      deviceId: '' as string,
      viewerPlayerId: null as PlayerId | null,
      currentPlayerId: null as PlayerId | null,
      gameState: null as GameViewModel | null,
      previousPlayerId: null as PlayerId | null,
      copiedLink: false,
      pollHandle: null as ReturnType<typeof setInterval> | null,
      isRefreshing: false,
      error: '',
    };
  },
  async mounted() {
    const gameIdFromUrl = this.getGameIdFromUrl();
    this.deviceId = this.ensureDeviceId();
    this.gameId = gameIdFromUrl;
    if (!this.gameId) return;
    this.startPolling();
    await this.refreshGameState();
  },
  beforeUnmount() {
    this.stopPolling();
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
    shareLink(): string {
      if (!this.gameId) return '';
      return `${window.location.origin}/?gameId=${encodeURIComponent(this.gameId)}`;
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
    setUrlGameContext(gameId: GameId | null) {
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
    ensureDeviceId(): string {
      const key = 'wingspan_device_id';
      const existing = localStorage.getItem(key);
      if (existing) return existing;
      const generated = `dev_${Math.random().toString(36).slice(2, 12)}_${Date.now().toString(36)}`;
      localStorage.setItem(key, generated);
      return generated;
    },
    persistSession() {
      if (this.gameId) {
        localStorage.setItem('wingspan_game_id', this.gameId);
        this.setUrlGameContext(this.gameId);
      }
    },
    clearStoredSession() {
      localStorage.removeItem('wingspan_game_id');
    },
    clearSession() {
      this.clearStoredSession();
      this.viewerPlayerId = null;
      this.setUrlGameContext(null);
      this.stopPolling();
    },
    startPolling() {
      if (this.pollHandle) return;
      this.pollHandle = setInterval(() => {
        if (!this.gameId) return;
        void this.refreshGameState();
      }, 2000);
    },
    stopPolling() {
      if (!this.pollHandle) return;
      clearInterval(this.pollHandle);
      this.pollHandle = null;
    },

    getInputPlayerId(state: GameViewModel): PlayerId {
      return state.expectedInputPlayerId || state.currentPlayerId;
    },

    async onGameStart({ playerNames, options }: { playerNames: string[]; options?: import('@common/models/GameOptions').GameOptions }) {
      try {
        const result = await api.createGame(playerNames, options);
        this.gameId = result.gameId;
        this.viewerPlayerId = null;
        this.startPolling();
        this.persistSession();
        await this.refreshGameState();
      } catch (err) {
        this.error = String(err);
      }
    },
    async copyShareLink() {
      if (!this.shareLink) return;
      try {
        await navigator.clipboard.writeText(this.shareLink);
        this.copiedLink = true;
        setTimeout(() => {
          this.copiedLink = false;
        }, 1200);
      } catch {
        this.copiedLink = false;
      }
    },

    async selectViewerPlayer(playerId: PlayerId) {
      if (!this.gameId) return;
      try {
        await api.claimSeat(this.gameId, playerId, this.deviceId);
        await this.refreshGameState();
      } catch (err) {
        this.error = String(err);
      }
    },

    async refreshGameState() {
      if (!this.gameId || this.isRefreshing) return;
      this.isRefreshing = true;
      try {
        const state = await api.getGameState(this.gameId, this.deviceId);
        const nextInputPlayerId = this.getInputPlayerId(state);
        this.gameState = state;
        this.viewerPlayerId = state.viewerPlayerId;
        this.currentPlayerId = state.currentPlayerId;
        this.persistSession();

        if (!this.viewerPlayerId && this.gameId) {
          this.screen = 'pickplayer';
          return;
        }

        if (state.phase === Phase.GAME_END) {
          // Keep gameId in URL so finished games can be re-opened/reloaded.
          this.clearStoredSession();
          this.screen = 'gameover';
        } else if (!this.viewerPlayerId && this.previousPlayerId && this.previousPlayerId !== nextInputPlayerId) {
          // Different player is expected to provide input - show hot-seat transition.
          this.screen = 'transition';
        } else {
          this.screen = 'game';
        }
      } catch (err) {
        this.clearSession();
        this.error = String(err);
      } finally {
        this.isRefreshing = false;
      }
    },

    onTransitionReady() {
      this.screen = 'game';
    },

    async onPlayerSubmit(response: unknown) {
      if (!this.viewerPlayerId) return;
      try {
        this.previousPlayerId = this.gameState?.currentPlayerId || this.currentPlayerId;
        const state = await api.submitInput(this.viewerPlayerId, response, this.gameId || undefined, this.deviceId);
        const nextInputPlayerId = this.getInputPlayerId(state);
        this.gameState = state;
        this.viewerPlayerId = state.viewerPlayerId;
        this.currentPlayerId = state.currentPlayerId;

        if (state.phase === Phase.GAME_END) {
          this.screen = 'gameover';
        } else if (!this.viewerPlayerId && this.previousPlayerId !== nextInputPlayerId) {
          this.screen = 'transition';
        } else {
          this.screen = 'game';
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

.gameover-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.review-screen {
  padding: 0;
}

.review-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 12px 16px;
  border-bottom: 1px solid #d9d4bf;
  background: #f6f3e6;
}

.pick-player-panel {
  max-width: 540px;
  margin: 40px auto;
  text-align: center;
}

.pick-player-subtitle {
  margin: 0 0 16px;
  color: #666;
}

.share-link-row {
  margin: 0 auto 14px;
  display: flex;
  align-items: stretch;
  gap: 6px;
}

.share-link {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #d7d1bc;
  border-radius: 6px;
  background: #faf8ee;
  color: #3c3a31;
  font-size: 13px;
  word-break: break-all;
  text-align: left;
}

.copy-link-btn {
  width: 34px;
  min-width: 34px;
  border: 1px solid #d7d1bc;
  border-radius: 6px;
  background: #f3efe2;
  color: #5a5546;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  line-height: 1;

  &:hover {
    background: #ebe4cf;
  }
}

.pick-player-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
