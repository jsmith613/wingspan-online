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

    <!-- Main area: board + bird tray + sidebar -->
    <div class="game-main">
      <div class="main-left">
        <PlayerBoard
          :board="currentPlayer.board"
          :selectable-habitats="selectableHabitats"
          @select-slot="onSlotSelected"
        />
        <div class="bird-tray">
          <h3>Bird Tray</h3>
          <div class="tray-cards">
            <div
              v-for="card in game.birdTray.cardDetails"
              :key="card.name"
              class="tray-card-wrapper"
              @mouseenter="hoveredTrayCard = card"
              @mouseleave="hoveredTrayCard = null"
              ref="trayCardRefs"
            >
              <BirdCard :card="card" class="tray-bird-card" />
            </div>
            <span v-if="game.birdTray.cardDetails.length === 0" class="no-items">Empty</span>
          </div>
        </div>
        <Teleport to="body">
          <div
            v-if="hoveredTrayCard"
            class="bird-hover-popup"
            :style="trayHoverStyle"
          >
            <BirdCard :card="hoveredTrayCard" />
          </div>
        </Teleport>
      </div>
      <div class="main-right">
        <Birdfeeder
          :dice="game.birdfeeder.dice"
          :selectable="false"
        />
        <RoundGoalTracker
          :round-goals="game.roundGoals"
          :current-round="game.round"
          :players="game.players"
        />
      </div>
    </div>

    <!-- Input area -->
    <div v-if="game.waitingFor" class="input-area">
      <PlayerInputFactory
        :input="game.waitingFor"
        :can-cancel="game.canCancel"
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
      <div v-if="game.options?.showVpTotals" class="stash-score">
        <h4 class="stash-label">Victory Points</h4>
        <span class="vp-total">{{ currentPlayer.score }}</span>
      </div>
      <div v-if="bonusCards.length > 0" class="stash-bonus">
        <h4 class="stash-label">Bonus Cards</h4>
        <div class="bonus-cards-row">
          <div
            v-for="bc in bonusCards"
            :key="bc.name"
            class="bonus-card-wrapper"
            @mouseenter="hoveredBonusCard = bc"
            @mouseleave="hoveredBonusCard = null"
            ref="bonusCardRefs"
          >
            <BonusCard :card="bc" class="bonus-card-mini" />
          </div>
        </div>
      </div>
      <Teleport to="body">
        <div
          v-if="hoveredBonusCard"
          class="bird-hover-popup"
          :style="bonusHoverStyle"
        >
          <BonusCard :card="hoveredBonusCard" />
        </div>
      </Teleport>
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
import { ClientBonusCard } from '@common/cards/ClientBonusCard';
import { BirdCardName } from '@common/cards/BirdCardName';
import { HabitatType } from '@common/game/HabitatType';
import { FoodType } from '@common/game/FoodType';
import { PlayerId } from '@common/Types';
import { FOOD_ICONS } from '../utils/cardAssets';
import PlayerBoard from './board/PlayerBoard.vue';
import Birdfeeder from './birdfeeder/Birdfeeder.vue';
import RoundGoalTracker from './scoring/RoundGoalTracker.vue';
import HandCards from './cards/HandCards.vue';
import BirdCard from './cards/BirdCard.vue';
import BonusCard from './cards/BonusCard.vue';
import PlayerInputFactory from './PlayerInputFactory.vue';

export default defineComponent({
  name: 'PlayerHome',
  components: { PlayerBoard, Birdfeeder, RoundGoalTracker, HandCards, BirdCard, BonusCard, PlayerInputFactory },
  props: {
    game: { type: Object as PropType<GameViewModel>, required: true },
    playerId: { type: String as unknown as PropType<PlayerId>, required: true },
  },
  emits: ['submit'],
  data() {
    return {
      hoveredTrayCard: null as ClientBirdCard | null,
      hoveredBonusCard: null as ClientBonusCard | null,
    };
  },
  computed: {
    currentPlayer(): PlayerViewModel {
      return this.game.players.find((p) => p.id === this.playerId) || this.game.players[0];
    },
    handCards(): ClientBirdCard[] {
      return [...(this.currentPlayer.handDetails || [])];
    },
    bonusCards(): ClientBonusCard[] {
      return [...(this.currentPlayer.bonusCardDetails || [])];
    },
    bonusHoverStyle(): Record<string, string> {
      if (!this.hoveredBonusCard) return { display: 'none' };
      const refs = this.$refs.bonusCardRefs as HTMLElement[] | undefined;
      if (!refs || refs.length === 0) return { display: 'none' };
      const idx = this.bonusCards.findIndex(
        (c: ClientBonusCard) => c.name === this.hoveredBonusCard!.name
      );
      const el = refs[idx];
      if (!el) return { display: 'none' };
      const rect = el.getBoundingClientRect();
      let left = rect.left - 252;
      let top = rect.top - 200;
      if (left < 4) left = rect.right + 12;
      if (top + 368 > window.innerHeight) top = window.innerHeight - 372;
      if (top < 4) top = 4;
      return {
        position: 'fixed',
        left: left + 'px',
        top: top + 'px',
        zIndex: '10000',
      };
    },
    trayHoverStyle(): Record<string, string> {
      if (!this.hoveredTrayCard) return { display: 'none' };
      const refs = this.$refs.trayCardRefs as HTMLElement[] | undefined;
      if (!refs || refs.length === 0) return { display: 'none' };
      const idx = this.game.birdTray.cardDetails.findIndex(
        (c: ClientBirdCard) => c.name === this.hoveredTrayCard!.name
      );
      const el = refs[idx];
      if (!el) return { display: 'none' };
      const rect = el.getBoundingClientRect();
      // Position to the left of the card
      let left = rect.left - 252;
      let top = rect.top;
      // If it would go off the left edge, show to the right instead
      if (left < 4) left = rect.right + 12;
      // Keep on screen vertically
      if (top + 368 > window.innerHeight) top = window.innerHeight - 372;
      if (top < 4) top = 4;
      return {
        position: 'fixed',
        left: left + 'px',
        top: top + 'px',
        zIndex: '10000',
      };
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
    display: flex;
    gap: $space-md;
  }

  .main-right {
    width: 240px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: $space-md;
  }
}

$tray-card-scale: 0.45;
$tray-scaled-w: 240px * $tray-card-scale;
$tray-scaled-h: 360px * $tray-card-scale;

.bird-tray {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-sm;
  flex-shrink: 0;

  h3 { margin: 0; white-space: nowrap; }

  .tray-cards {
    display: flex;
    flex-direction: column;
    gap: $space-sm;
    align-items: center;
  }

  .tray-card-wrapper {
    width: $tray-scaled-w;
    height: $tray-scaled-h;
    position: relative;
    cursor: pointer;
    flex-shrink: 0;

    .tray-bird-card {
      position: absolute;
      top: 0;
      left: 0;
      width: 240px;
      height: 360px;
      transform: scale($tray-card-scale);
      transform-origin: top left;
      pointer-events: none;
    }
  }

  .no-items {
    color: $color-text-muted;
    font-style: italic;
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

  .stash-score {
    flex-shrink: 0;
    min-width: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .vp-total {
      font-size: 36px;
      font-weight: bold;
      color: $color-forest;
    }
  }

  .stash-bonus {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
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

$bonus-card-scale: 0.45;
$bonus-scaled-w: 240px * $bonus-card-scale;
$bonus-scaled-h: 360px * $bonus-card-scale;

.bonus-cards-row {
  display: flex;
  gap: $space-sm;
  align-items: flex-start;
}

.bonus-card-wrapper {
  width: $bonus-scaled-w;
  height: $bonus-scaled-h;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;

  .bonus-card-mini {
    position: absolute;
    top: 0;
    left: 0;
    width: 240px;
    height: 360px;
    transform: scale($bonus-card-scale);
    transform-origin: top left;
    pointer-events: none;
  }
}
</style>
