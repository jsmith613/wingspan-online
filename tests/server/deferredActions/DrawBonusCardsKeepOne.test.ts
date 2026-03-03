import { Game } from '../../../src/server/Game';
import { GameId } from '../../../src/common/Types';
import { InputType } from '../../../src/common/input/InputType';
import { DrawBonusCardsKeepOne } from '../../../src/server/deferredActions/DrawBonusCardsKeepOne';

describe('DrawBonusCardsKeepOne', () => {
  it('draws two and prompts to keep one', () => {
    const game = new Game('test_bonus_draw_1' as GameId, ['Alice'], 42);
    const player = game.players[0];
    const action = new DrawBonusCardsKeepOne(player);

    const prompt = action.execute(game) as any;
    expect(prompt.type).toBe(InputType.SELECT_BONUS_CARD);
    expect(prompt.availableBonusCards.length).toBe(2);
    expect(prompt.min).toBe(1);
    expect(prompt.max).toBe(1);

    const kept = prompt.availableBonusCards[0];
    const done = action.handleInput(game, { selectedBonusCards: [kept] });
    expect(done).toBeUndefined();
    expect(player.bonusCards).toEqual([kept]);
  });

  it('auto-keeps when draw count is equal to keep count', () => {
    const game = new Game('test_bonus_draw_2' as GameId, ['Alice'], 42);
    const player = game.players[0];
    const action = new DrawBonusCardsKeepOne(player, 1, 1);

    const done = action.execute(game);
    expect(done).toBeUndefined();
    expect(player.bonusCards.length).toBe(1);
  });
});

