<template>
  <div class="round-goal-tracker panel">
    <h3>Round Goals</h3>
    <div class="goals-list">
      <div
        v-for="(goal, i) in roundGoals"
        :key="goal.goalId"
        class="goal-item"
        :class="{ 'goal-current': i + 1 === currentRound }"
      >
        <div class="goal-round">Round {{ i + 1 }}</div>
        <div class="goal-description">{{ goal.description }}</div>
        <div class="goal-scores">
          <span
            v-for="score in goal.scores"
            :key="score.playerId"
            class="goal-score"
          >{{ score.points }}pt</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { RoundGoalView } from '@common/models/GameViewModel';

export default defineComponent({
  name: 'RoundGoalTracker',
  props: {
    roundGoals: { type: Array as PropType<RoundGoalView[]>, required: true },
    currentRound: { type: Number, required: true },
  },
});
</script>

<style lang="scss" scoped>
@import '../../../styles/variables';

h3 {
  margin-bottom: $space-sm;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
}

.goal-item {
  padding: $space-sm;
  border: 1px solid $color-border-light;
  border-radius: $radius-sm;
  background: $color-parchment;

  &.goal-current {
    border-color: $color-forest;
    background: $color-forest-bg;
  }
}

.goal-round {
  font-weight: bold;
  font-size: $font-size-sm;
  color: $color-bark;
}

.goal-description {
  font-size: $font-size-sm;
  color: $color-text-light;
  margin: 2px 0;
}

.goal-scores {
  display: flex;
  gap: $space-sm;
  font-size: $font-size-xs;
  color: $color-text-muted;
}
</style>
