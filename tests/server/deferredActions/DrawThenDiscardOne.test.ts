import { Game } from '../../../src/server/Game';
import { GameId } from '../../../src/common/Types';
import { BirdCardName } from '../../../src/common/cards/BirdCardName';
import { InputType } from '../../../src/common/input/InputType';
import { DrawThenDiscardOne } from '../../../src/server/deferredActions/DrawThenDiscardOne';

describe('DrawThenDiscardOne', () => {
  it('skips when skip is selected', () => {
    const game = new Game('draw_discard_1' as GameId, ['Alice'], 42);
    const player = game.players[0];
    player.addCardToHand(BirdCardName.BOBOLINK);
    const handBefore = player.hand.length;

    const action = new DrawThenDiscardOne(player, 2, 'Draw 2 card. If you do, discard 1 card from your hand at the end of your turn.');
    const prompt = action.execute(game) as any;
    expect(prompt.type).toBe(InputType.SELECT_OPTION);
    expect(prompt.options).toEqual(expect.arrayContaining(['CONFIRM_DRAW_DISCARD', 'SKIP_DRAW_DISCARD']));

    const done = action.handleInput(game, { selectedOption: 'SKIP_DRAW_DISCARD' });
    expect(done).toBeUndefined();
    expect(player.hand.length).toBe(handBefore);
  });

  it('draws then requires exactly one discard on confirm', () => {
    const game = new Game('draw_discard_2' as GameId, ['Alice'], 42);
    const player = game.players[0];
    player.addCardToHand(BirdCardName.BOBOLINK);
    const handBefore = player.hand.length;

    const action = new DrawThenDiscardOne(player, 2, 'Draw 2 card. If you do, discard 1 card from your hand at the end of your turn.');
    action.execute(game);

    const discardPrompt = action.handleInput(game, { selectedOption: 'CONFIRM_DRAW_DISCARD' }) as any;
    expect(discardPrompt.type).toBe(InputType.SELECT_CARDS);
    expect(discardPrompt.min).toBe(1);
    expect(discardPrompt.max).toBe(1);

    // With +2 draws and -1 discard, net +1 hand size.
    const cardToDiscard = player.hand[0];
    const done = action.handleInput(game, { selectedCards: [cardToDiscard] });
    expect(done).toBeUndefined();
    expect(player.hand.length).toBe(handBefore + 1);
  });
});

