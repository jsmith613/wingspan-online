<template>
  <div class="player-home">
    <!-- Top bar: round info, player info, food supply -->
    <header class="game-header">
      <div class="header-left">
        <span class="round-badge">Round {{ game.round }}/4</span>
        <span class="phase-badge">{{ game.phase }}</span>
      </div>
      <div class="header-center">
        <h2>{{ currentPlayer.name }}'s Turn</h2>
        <span class="cubes-info">{{ currentPlayer.actionCubes }} actions left</span>
      </div>
      <div class="header-right">
        <div class="hand-count">
          Cards: {{ currentPlayer.hand.length }} | Food: {{ currentPlayer.food.length }}
        </div>
      </div>
    </header>

    <!-- Main area: board + sidebar -->
    <div class="game-main">
      <div class="main-left">
        <PlayerBoard
          :board="currentPlayer.board"
          :selectable-habitats="selectableHabitats"
          @select-slot="onSlotSelected"
        />
      </div>
      <div class="main-right">
        <Birdfeeder
          :dice="game.birdfeeder.dice"
          :selectable="false"
        />
        <RoundGoalTracker
          :round-goals="game.roundGoals"
          :current-round="game.round"
        />
        <div class="bird-tray panel" v-if="game.birdTray.faceUpCards.length > 0">
          <h3>Bird Tray</h3>
          <div class="tray-cards">
            <div v-for="name in game.birdTray.faceUpCards" :key="name" class="tray-card">
              {{ formatCardName(name) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input area -->
    <div v-if="game.waitingFor" class="input-area">
      <PlayerInputFactory
        :input="game.waitingFor"
        @submit="onInputSubmit"
      />
    </div>

    <!-- Personal stash: hand + food supply -->
    <div class="personal-stash">
      <div class="stash-hand">
        <HandCards
          :cards="handCards"
          :selectable="false"
        />
      </div>
      <div class="stash-food">
        <h4 class="stash-label">Food Supply</h4>
        <div class="food-supply">
          <div v-for="(f, i) in currentPlayer.food" :key="i" class="food-token">
            <img :src="foodIcon(f)" :alt="f" :title="f" class="food-img" />
          </div>
          <span v-if="currentPlayer.food.length === 0" class="no-items">None</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { GameViewModel } from '@common/models/GameViewModel';
import { PlayerViewModel } from '@common/models/PlayerViewModel';
import { ClientBirdCard } from '@common/cards/ClientBirdCard';
import { BirdCardName } from '@common/cards/BirdCardName';
import { HabitatType } from '@common/game/HabitatType';
import { FoodType } from '@common/game/FoodType';
import { PlayerId } from '@common/Types';
import { FOOD_ICONS } from '../utils/cardAssets';
import PlayerBoard from './board/PlayerBoard.vue';
import Birdfeeder from './birdfeeder/Birdfeeder.vue';
import RoundGoalTracker from './scoring/RoundGoalTracker.vue';
import HandCards from './cards/HandCards.vue';
import PlayerInputFactory from './PlayerInputFactory.vue';

export default defineComponent({
  name: 'PlayerHome',
  components: { PlayerBoard, Birdfeeder, RoundGoalTracker, HandCards, PlayerInputFactory },
  props: {
    game: { type: Object as PropType<GameViewModel>, required: true },
    playerId: { type: String as unknown as PropType<PlayerId>, required: true },
  },
  emits: ['submit'],
  computed: {
    currentPlayer(): PlayerViewModel {
      return this.game.players.find((p) => p.id === this.playerId) || this.game.players[0];
    },
    handCards(): ClientBirdCard[] {
      return [...(this.currentPlayer.handDetails || [])];
    },
    selectableHabitats(): Partial<Record<HabitatType, number[]>> {
      // Derived from current input if applicable
      return {};
    },
  },
  methods: {
    foodIcon(food: FoodType): string {
      return FOOD_ICONS[food] || '';
    },
    formatCardName(name: BirdCardName | string): string {
      return String(name).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    },
    onInputSubmit(response: unknown) {
      this.$emit('submit', response);
    },
    onSlotSelected(habitat: HabitatType, index: number) {
      // Will be used when SELECT_HABITAT_SLOT input is active
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../styles/variables';

.player-home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-sm $space-lg;
  background: $color-white;
  border-bottom: 2px solid $color-border;
  flex-shrink: 0;

  .header-center {
    text-align: center;

    h2 { margin: 0; font-size: $font-size-lg; }
    .cubes-info {
      font-size: $font-size-sm;
      color: $color-text-light;
    }
  }

  .header-right {
    text-align: right;
    font-size: $font-size-sm;

    .hand-count { color: $color-text-light; }
  }
}

.round-badge, .phase-badge {
  display: inline-block;
  padding: 2px $space-sm;
  border-radius: $radius-sm;
  font-size: $font-size-sm;
  font-weight: bold;
  margin-right: $space-sm;
}

.round-badge {
  background: $color-forest;
  color: $color-white;
}

.phase-badge {
  background: $color-earth-bg;
  color: $color-earth;
}

.game-main {
  display: flex;
  flex: 1;
  gap: $space-md;
  padding: $space-md;
  overflow: auto;

  .main-left {
    flex: 1;
    min-width: 0;
  }

  .main-right {
    width: 240px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: $space-md;
  }
}

.bird-tray {
  h3 { margin-bottom: $space-sm; }

  .tray-cards {
    display: flex;
    flex-direction: column;
    gap: $space-xs;
  }

  .tray-card {
    padding: $space-xs $space-sm;
    background: $color-parchment;
    border: 1px solid $color-border-light;
    border-radius: $radius-sm;
    font-size: $font-size-sm;
  }
}

.input-area {
  padding: $space-md;
  background: rgba($color-forest-bg, 0.5);
  border-top: 2px solid $color-forest;
  border-bottom: 2px solid $color-forest;
}

.personal-stash {
  display: flex;
  gap: $space-md;
  padding: $space-md;
  background: $color-parchment;
  border-top: 2px solid $color-border;

  .stash-hand {
    flex: 1;
    min-width: 0;
  }

  .stash-food {
    flex-shrink: 0;
    min-width: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stash-label {
    font-size: $font-size-sm;
    font-weight: bold;
    color: $color-text-light;
    margin: 0 0 $space-sm 0;
  }

  .food-supply {
    display: flex;
    flex-wrap: wrap;
    gap: $space-xs;
    justify-content: center;
  }

  .food-token {
    .food-img {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }
  }

  .no-items {
    color: $color-text-muted;
    font-style: italic;
    font-size: $font-size-sm;
  }
}
</style>
