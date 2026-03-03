import { Game } from '../../../src/server/Game';
import { GameId } from '../../../src/common/Types';
import { InputType } from '../../../src/common/input/InputType';
import { ConfirmSimpleBrownEffect } from '../../../src/server/deferredActions/ConfirmSimpleBrownEffect';

describe('ConfirmSimpleBrownEffect', () => {
  it('skips when skip is selected', () => {
    const game = new Game('confirm_simple_1' as GameId, ['Alice'], 42);
    const player = game.players[0];
    let applied = false;
    const action = new ConfirmSimpleBrownEffect(player, 'Gain 1 fruit from the supply.', () => {
      applied = true;
    });

    const input = action.execute(game) as any;
    expect(input.type).toBe(InputType.SELECT_OPTION);
    expect(input.options).toEqual(expect.arrayContaining(['CONFIRM_BROWN_EFFECT', 'SKIP_BROWN_EFFECT']));

    const done = action.handleInput(game, { selectedOption: 'SKIP_BROWN_EFFECT' });
    expect(done).toBeUndefined();
    expect(applied).toBe(false);
  });

  it('applies effect when confirm is selected', () => {
    const game = new Game('confirm_simple_2' as GameId, ['Alice'], 42);
    const player = game.players[0];
    let applied = false;
    const action = new ConfirmSimpleBrownEffect(player, 'Gain 1 fruit from the supply.', () => {
      applied = true;
    });

    action.execute(game);
    const done = action.handleInput(game, { selectedOption: 'CONFIRM_BROWN_EFFECT' });
    expect(done).toBeUndefined();
    expect(applied).toBe(true);
  });
});

