<template>
  <div class="round-goal-tracker panel goal-board">
    <h3>End-of-Round Goals</h3>
    <div class="board-grid">
      <div
        v-for="(goal, i) in roundGoals"
        :key="goal.goalId"
        class="board-row"
        :class="{ 'is-current': i + 1 === currentRound }"
      >
        <div class="round-cell">R{{ i + 1 }}</div>
        <div class="goal-cell">
          <span
            v-for="(token, tokenIndex) in goalTokens(goal.goalId)"
            :key="`${goal.goalId}-${tokenIndex}`"
            class="goal-token"
            :class="{ 'goal-token-text': token.kind === 'text' }"
          >
            <img
              v-if="token.kind === 'icon'"
              :src="token.value"
              class="goal-icon"
              alt=""
            />
            <span v-else>{{ token.value }}</span>
          </span>
        </div>
        <div class="rank-cells" :style="{ gridTemplateColumns: `repeat(${rankPointValues.length}, minmax(44px, 1fr))` }">
          <div
            v-for="(rankPoints, rankIndex) in rankPointValuesForRound(i + 1)"
            :key="rankIndex"
            class="rank-cell"
          >
            <div class="rank-head">{{ rankLabels[rankIndex] }} ({{ rankPoints }})</div>
            <div class="rank-markers">
              <template v-if="goal.scores.length > 0">
                <span
                  v-for="score in scoresForPoints(goal, rankPoints)"
                  :key="score.playerId"
                  class="player-marker"
                  :title="playerName(score.playerId)"
                >
                  {{ playerInitial(score.playerId) }}
                </span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="legend">
      <span v-for="p in players" :key="p.id" class="legend-item">
        <span class="player-marker">{{ p.name.slice(0, 1).toUpperCase() }}</span>{{ p.name }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { RoundGoalView } from '@common/models/GameViewModel';
import { PlayerViewModel } from '@common/models/PlayerViewModel';
import { PlayerId } from '@common/Types';
import birdIcon from '../../assets/icons/bird.webp';
import eggIcon from '../../assets/icons/egg.webp';
import cardIcon from '../../assets/icons/card.webp';
import { HABITAT_ICONS, NEST_ICONS, FOOD_ICONS } from '../../utils/cardAssets';

type GoalToken = { kind: 'icon'; value: string } | { kind: 'text'; value: string };

export default defineComponent({
  name: 'RoundGoalTracker',
  props: {
    roundGoals: { type: Array as PropType<RoundGoalView[]>, required: true },
    currentRound: { type: Number, required: true },
    players: { type: Array as PropType<PlayerViewModel[]>, required: true },
  },
  computed: {
    rankPointValues(): number[] {
      return this.players.length >= 3 ? [0, 0, 0] : [0, 0];
    },
    rankLabels(): string[] {
      return ['1st', '2nd', '3rd'];
    },
  },
  methods: {
    playerName(playerId: PlayerId): string {
      return this.players.find(p => p.id === playerId)?.name ?? String(playerId);
    },
    playerInitial(playerId: PlayerId): string {
      return this.playerName(playerId).slice(0, 1).toUpperCase();
    },
    scoresForPoints(goal: RoundGoalView, points: number): Array<{ playerId: PlayerId; points: number }> {
      return goal.scores.filter(score => score.points === points);
    },
    rankPointValuesForRound(round: number): number[] {
      const byRound: Record<number, number[]> = {
        1: [4, 1, 0],
        2: [5, 2, 1],
        3: [6, 3, 2],
        4: [7, 4, 3],
      };
      const values = byRound[round] ?? byRound[1];
      return this.players.length >= 3 ? values : values.slice(0, 2);
    },
    goalTokens(goalId: string): GoalToken[] {
      const t = (value: string): GoalToken => ({ kind: 'text', value });
      const i = (value: string): GoalToken => ({ kind: 'icon', value });

      const byId: Record<string, GoalToken[]> = {
        birds_in_forest: [i(birdIcon), t('IN'), i(HABITAT_ICONS.FOREST)],
        birds_in_grassland: [i(birdIcon), t('IN'), i(HABITAT_ICONS.GRASSLAND)],
        birds_in_wetland: [i(birdIcon), t('IN'), i(HABITAT_ICONS.WETLAND)],
        birds_with_eggs_in_bowl_nest: [i(birdIcon), t('WITH'), i(eggIcon), t('IN'), i(NEST_ICONS.BOWL)],
        birds_with_eggs_in_cavity_nest: [i(birdIcon), t('WITH'), i(eggIcon), t('IN'), i(NEST_ICONS.CAVITY)],
        birds_with_eggs_in_ground_nest: [i(birdIcon), t('WITH'), i(eggIcon), t('IN'), i(NEST_ICONS.GROUND)],
        birds_with_eggs_in_platform_nest: [i(birdIcon), t('WITH'), i(eggIcon), t('IN'), i(NEST_ICONS.PLATFORM)],
        eggs_in_forest: [i(eggIcon), t('IN'), i(HABITAT_ICONS.FOREST)],
        eggs_in_grassland: [i(eggIcon), t('IN'), i(HABITAT_ICONS.GRASSLAND)],
        eggs_in_wetland: [i(eggIcon), t('IN'), i(HABITAT_ICONS.WETLAND)],
        eggs_in_bowl_nest: [i(eggIcon), t('IN'), i(NEST_ICONS.BOWL)],
        eggs_in_cavity_nest: [i(eggIcon), t('IN'), i(NEST_ICONS.CAVITY)],
        eggs_in_ground_nest: [i(eggIcon), t('IN'), i(NEST_ICONS.GROUND)],
        eggs_in_platform_nest: [i(eggIcon), t('IN'), i(NEST_ICONS.PLATFORM)],
        egg_sets_in_all_habitats: [t('SETS OF'), i(eggIcon), i(eggIcon), i(eggIcon), t('IN'), i(HABITAT_ICONS.FOREST), i(HABITAT_ICONS.GRASSLAND), i(HABITAT_ICONS.WETLAND)],
        total_birds: [t('TOTAL'), i(birdIcon)],
        invertebrates_in_bird_costs: [i(FOOD_ICONS.INVERTEBRATE), t('IN COST OF'), i(birdIcon), i(cardIcon)],
      };

      return byId[goalId] ?? [t(goalId)];
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../../styles/variables';

h3 {
  margin-bottom: $space-sm;
}

.goal-board {
  background: #f6f3e8;
}

.board-grid {
  display: flex;
  flex-direction: column;
  gap: $space-xs;
}

.board-row {
  display: grid;
  grid-template-columns: 34px 1fr;
  grid-template-rows: auto auto;
  gap: 6px;
  border: 1px solid #cfcab7;
  border-radius: $radius-sm;
  padding: 6px;
  background: #ece8d7;
  position: relative;

  &.is-current {
    border-color: $color-forest;
    box-shadow: 0 0 0 1px rgba($color-forest, 0.25) inset;
  }
}

.round-cell {
  grid-row: 1 / span 2;
  font-weight: 700;
  color: $color-bark;
  align-self: center;
  text-align: center;
}

.goal-cell {
  font-size: 12px;
  color: #4b4b4b;
  line-height: 1.25;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.goal-token {
  display: inline-flex;
  align-items: center;
}

.goal-token-text {
  font-size: 10px;
  font-weight: 700;
  color: #4f4a40;
  letter-spacing: 0.02em;
}

.goal-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.rank-cells {
  display: grid;
  gap: 4px;
  grid-template-columns: repeat(3, minmax(44px, 1fr));
}

.rank-cell {
  border: 1px solid #d8d4c7;
  border-radius: 5px;
  background: #f8f5eb;
  min-height: 36px;
  padding: 2px 3px;
}

.rank-head {
  font-size: 10px;
  text-align: center;
  color: #6c6a60;
}

.rank-markers {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  justify-content: center;
  margin-top: 2px;
}

.player-marker {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #2e5f2f;
  color: white;
  font-size: 10px;
  line-height: 16px;
  text-align: center;
  font-weight: 700;
  display: inline-block;
}

.legend {
  margin-top: $space-sm;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: $color-text-light;
}
</style>
