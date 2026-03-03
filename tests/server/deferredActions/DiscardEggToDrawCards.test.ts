import { Game } from '../../../src/server/Game';
import { GameId } from '../../../src/common/Types';
import { BirdCardName } from '../../../src/common/cards/BirdCardName';
import { HabitatType } from '../../../src/common/game/HabitatType';
import { InputType } from '../../../src/common/input/InputType';
import { DiscardEggToDrawCards } from '../../../src/server/deferredActions/DiscardEggToDrawCards';

describe('DiscardEggToDrawCards', () => {
  it('allows skipping without discarding or drawing', () => {
    const game = new Game('discard_egg_draw_1' as GameId, ['Alice'], 42);
    const player = game.players[0];
    player.board.placeBird(HabitatType.WETLAND, {
      name: BirdCardName.KILLDEER,
      eggs: 1,
      cachedFood: 0,
      tuckedCards: 0,
    });
    const handBefore = player.hand.length;

    const action = new DiscardEggToDrawCards(player, 2, 'Optional: discard 1 egg to draw 2 cards, or skip.');
    const prompt = action.execute(game) as any;
    expect(prompt.type).toBe(InputType.SELECT_OPTION);
    expect(prompt.options).toEqual(expect.arrayContaining(['SKIP_DISCARD_EGG_DRAW']));
    expect(prompt.options.some((o: string) => o.startsWith('TARGET:'))).toBe(true);

    const done = action.handleInput(game, { selectedOption: 'SKIP_DISCARD_EGG_DRAW' });
    expect(done).toBeUndefined();
    expect(player.board.getAllBirds()[0].eggs).toBe(1);
    expect(player.hand.length).toBe(handBefore);
  });
});
