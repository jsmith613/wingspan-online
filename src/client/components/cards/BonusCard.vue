<template>
  <div class="bonus-card">
    <div class="bonus-header">
      <span class="bonus-label">BONUS</span>
    </div>
    <div class="bonus-name">{{ card.displayName }}</div>
    <div class="bonus-description">{{ card.description }}</div>
    <div class="bonus-condition">{{ card.condition }}</div>
    <div class="bonus-vp">{{ card.vpText }}</div>
    <div class="bonus-footer">
      <span class="bonus-score">{{ card.score }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ClientBonusCard } from '@common/cards/ClientBonusCard';

export default defineComponent({
  name: 'BonusCard',
  props: {
    card: { type: Object as PropType<ClientBonusCard>, required: true },
  },
});
</script>

<style lang="scss" scoped>
.bonus-card {
  width: 240px;
  height: 360px;
  border-radius: 10px;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  background: linear-gradient(180deg, #e0f2f1 0%, #f5f0e8 40%);
  border-top: 4px solid #00897b;
  display: flex;
  flex-direction: column;
  position: relative;
}

.bonus-header {
  display: flex;
  justify-content: center;
  padding: 8px 10px 4px;
}

.bonus-label {
  display: inline-block;
  padding: 2px 12px;
  border-radius: 4px;
  background: #00897b;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.bonus-name {
  font-size: 15px;
  font-weight: 700;
  color: #333;
  text-align: center;
  padding: 6px 12px 2px;
  line-height: 1.3;
}

.bonus-description {
  font-size: 12px;
  color: #555;
  text-align: center;
  padding: 4px 14px;
  line-height: 1.4;
  flex: 1;
}

.bonus-condition {
  font-size: 11px;
  color: #00695c;
  font-style: italic;
  text-align: center;
  padding: 4px 14px;
  line-height: 1.3;
}

.bonus-vp {
  font-size: 11px;
  color: #666;
  text-align: center;
  padding: 6px 14px;
  line-height: 1.4;
  background: rgba(0, 0, 0, 0.03);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.bonus-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 6px 10px 8px;
}

.bonus-score {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #00897b;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  border: 2px solid #00695c;
}
</style>
