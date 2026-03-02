<template>
  <div class="scoreboard panel">
    <h2>Final Scores</h2>
    <table class="score-table">
      <thead>
        <tr>
          <th>Player</th>
          <th>Birds</th>
          <th>Eggs</th>
          <th>Food</th>
          <th>Tucked</th>
          <th>Goals</th>
          <th>Bonus</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in scoreRows" :key="row.name" :class="{ 'winner-row': row.isWinner }">
          <td class="player-name">{{ row.name }}</td>
          <td>{{ row.birdPoints }}</td>
          <td>{{ row.eggPoints }}</td>
          <td>{{ row.cachedFoodPoints }}</td>
          <td>{{ row.tuckedCardPoints }}</td>
          <td>{{ row.goalPoints }}</td>
          <td>
            {{ row.bonusPoints }}
            <div v-if="row.bonusBreakdown.length > 0" class="bonus-breakdown">
              <div v-for="b in row.bonusBreakdown" :key="b.name" class="bonus-line">
                <span class="bonus-card-name">{{ b.displayName }}</span>
                <span class="bonus-card-score">{{ b.score }}</span>
              </div>
            </div>
          </td>
          <td class="total-cell">{{ row.total }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { PlayerViewModel } from '@common/models/PlayerViewModel';
import { ClientBonusCard } from '@common/cards/ClientBonusCard';
import { HabitatType } from '@common/game/HabitatType';

interface BonusBreakdownItem {
  name: string;
  displayName: string;
  score: number;
}

interface ScoreRow {
  name: string;
  birdPoints: number;
  eggPoints: number;
  cachedFoodPoints: number;
  tuckedCardPoints: number;
  goalPoints: number;
  bonusPoints: number;
  bonusBreakdown: BonusBreakdownItem[];
  total: number;
  isWinner: boolean;
}

export default defineComponent({
  name: 'Scoreboard',
  props: {
    players: { type: Array as PropType<PlayerViewModel[]>, required: true },
  },
  computed: {
    scoreRows(): ScoreRow[] {
      const rows = this.players.map((p) => {
        let birdPoints = 0;
        let eggPoints = 0;
        let cachedFoodPoints = 0;
        let tuckedCardPoints = 0;

        for (const habitat of [HabitatType.FOREST, HabitatType.GRASSLAND, HabitatType.WETLAND]) {
          for (const slot of p.board[habitat]) {
            if (slot.bird) {
              birdPoints += slot.bird.points;
              eggPoints += slot.bird.eggs;
              cachedFoodPoints += slot.bird.cachedFood;
              tuckedCardPoints += slot.bird.tuckedCards;
            }
          }
        }

        const goalPoints = p.roundGoalPoints.reduce((sum, pts) => sum + pts, 0);

        const bonusBreakdown: BonusBreakdownItem[] = (p.bonusCardDetails || []).map((bc: ClientBonusCard) => ({
          name: bc.name,
          displayName: bc.displayName,
          score: bc.score,
        }));

        const bonusPoints = bonusBreakdown.length > 0
          ? bonusBreakdown.reduce((sum, b) => sum + b.score, 0)
          : Math.max(0, p.score - (birdPoints + eggPoints + cachedFoodPoints + tuckedCardPoints + goalPoints));

        return {
          name: p.name,
          birdPoints,
          eggPoints,
          cachedFoodPoints,
          tuckedCardPoints,
          goalPoints,
          bonusPoints,
          bonusBreakdown,
          total: p.score,
          isWinner: false,
        };
      });

      const maxScore = Math.max(...rows.map((r) => r.total));
      for (const row of rows) {
        row.isWinner = row.total === maxScore;
      }

      return rows;
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../../styles/variables';

h2 {
  text-align: center;
  margin-bottom: $space-md;
}

.score-table {
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: $space-sm;
    text-align: center;
    border-bottom: 1px solid $color-border-light;
  }

  th {
    font-size: $font-size-sm;
    color: $color-text-light;
    font-weight: bold;
  }

  .player-name {
    text-align: left;
    font-weight: bold;
  }

  .total-cell {
    font-weight: bold;
    font-size: $font-size-lg;
    color: $color-forest;
  }

  .winner-row {
    background: $color-forest-bg;

    .total-cell {
      color: $color-forest;
    }
  }

  .bonus-breakdown {
    margin-top: 4px;
  }

  .bonus-line {
    display: flex;
    justify-content: space-between;
    gap: $space-sm;
    font-size: $font-size-xs;
    color: $color-text-light;
    line-height: 1.6;
  }

  .bonus-card-name {
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bonus-card-score {
    font-weight: bold;
    flex-shrink: 0;
  }

}
</style>
