import { Game } from '../../../../src/server/Game';
import { GameId } from '../../../../src/common/Types';
import { BirdCardName } from '../../../../src/common/cards/BirdCardName';
import { HabitatType } from '../../../../src/common/game/HabitatType';
import { InputType } from '../../../../src/common/input/InputType';
import { executeHabitatAction } from '../../../../src/server/habitats/HabitatAction';

describe('Draw-then-discard brown birds', () => {
  it('Black Tern (draw 1) prompts confirm/skip and then discard', () => {
    const game = new Game('draw_discard_bird_1' as GameId, ['Alice'], 42);
    const player = game.players[0];
    player.board.placeBird(HabitatType.WETLAND, {
      name: BirdCardName.BLACK_TERN,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });
    player.addCardToHand(BirdCardName.BOBOLINK);
    const handBefore = player.hand.length;

    executeHabitatAction(player, HabitatType.WETLAND, game);

    const baseInput = game.deferredActions.runUntilInput(game) as any;
    expect(baseInput.type).toBe(InputType.SELECT_OPTION);
    game.deferredActions.handleInput(game, { selectedOption: 'DRAW_FROM_DECK' });

    const simplePrompt = game.deferredActions.runUntilInput(game) as any;
    expect(simplePrompt.type).toBe(InputType.SELECT_OPTION);
    expect(simplePrompt.options).toEqual(expect.arrayContaining(['CONFIRM_DRAW_DISCARD', 'SKIP_DRAW_DISCARD']));
    const discardPrompt = game.deferredActions.handleInput(game, { selectedOption: 'CONFIRM_DRAW_DISCARD' }) as any;
    expect(discardPrompt.type).toBe(InputType.SELECT_CARDS);
    expect(discardPrompt.min).toBe(1);
    expect(discardPrompt.max).toBe(1);

    const toDiscard = player.hand[0];
    game.deferredActions.handleInput(game, { selectedCards: [toDiscard] });
    expect(game.deferredActions.runUntilInput(game)).toBeUndefined();
    expect(player.hand.length).toBe(handBefore + 1);
  });

  it('Wood Duck (draw 2) prompts confirm/skip and then discard', () => {
    const game = new Game('draw_discard_bird_2' as GameId, ['Alice'], 42);
    const player = game.players[0];
    player.board.placeBird(HabitatType.WETLAND, {
      name: BirdCardName.WOOD_DUCK,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });
    player.addCardToHand(BirdCardName.BOBOLINK);
    const handBefore = player.hand.length;

    executeHabitatAction(player, HabitatType.WETLAND, game);

    const baseInput = game.deferredActions.runUntilInput(game) as any;
    expect(baseInput.type).toBe(InputType.SELECT_OPTION);
    game.deferredActions.handleInput(game, { selectedOption: 'DRAW_FROM_DECK' });

    const simplePrompt = game.deferredActions.runUntilInput(game) as any;
    expect(simplePrompt.type).toBe(InputType.SELECT_OPTION);
    expect(simplePrompt.options).toEqual(expect.arrayContaining(['CONFIRM_DRAW_DISCARD', 'SKIP_DRAW_DISCARD']));
    const discardPrompt = game.deferredActions.handleInput(game, { selectedOption: 'CONFIRM_DRAW_DISCARD' }) as any;
    expect(discardPrompt.type).toBe(InputType.SELECT_CARDS);
    expect(discardPrompt.min).toBe(1);
    expect(discardPrompt.max).toBe(1);

    const toDiscard = player.hand[0];
    game.deferredActions.handleInput(game, { selectedCards: [toDiscard] });
    expect(game.deferredActions.runUntilInput(game)).toBeUndefined();
    expect(player.hand.length).toBe(handBefore + 2);
  });
});
