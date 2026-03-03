import { Game } from '../../../../src/server/Game';
import { GameId } from '../../../../src/common/Types';
import { HabitatType } from '../../../../src/common/game/HabitatType';
import { BirdCardName } from '../../../../src/common/cards/BirdCardName';
import { InputType } from '../../../../src/common/input/InputType';
import { executeHabitatAction } from '../../../../src/server/habitats/HabitatAction';

describe('Brown tuck-from-hand powers', () => {
  it('prompts for which card to tuck and applies the follow-up effect', () => {
    const game = new Game('tuck_brown_1' as GameId, ['Alice'], 42);
    const player = game.players[0];

    player.board.placeBird(HabitatType.GRASSLAND, {
      name: BirdCardName.AMERICAN_ROBIN,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });
    player.addCardToHand(BirdCardName.BOBOLINK);
    const handBefore = player.hand.length;

    executeHabitatAction(player, HabitatType.GRASSLAND, game);

    const baseInput = game.deferredActions.runUntilInput(game) as any;
    expect(baseInput.type).toBe(InputType.SELECT_EGG_LOCATION);
    game.deferredActions.handleInput(game, { placements: {} });

    const tuckInput = game.deferredActions.runUntilInput(game) as any;
    expect(tuckInput.type).toBe(InputType.SELECT_CARDS);
    expect(tuckInput.min).toBe(0);
    expect(tuckInput.max).toBe(1);
    expect(tuckInput.availableCards).toEqual(expect.arrayContaining([BirdCardName.BOBOLINK]));
    game.deferredActions.handleInput(game, { selectedCards: [BirdCardName.BOBOLINK] });

    expect(game.deferredActions.runUntilInput(game)).toBeUndefined();
    expect(player.hand.length).toBe(handBefore);
    expect(player.board.getAllBirds()[0].tuckedCards).toBe(1);
  });

  it('allows skipping tuck selection', () => {
    const game = new Game('tuck_brown_2' as GameId, ['Alice'], 42);
    const player = game.players[0];

    player.board.placeBird(HabitatType.GRASSLAND, {
      name: BirdCardName.AMERICAN_ROBIN,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });
    player.addCardToHand(BirdCardName.BOBOLINK);
    const handBefore = player.hand.length;

    executeHabitatAction(player, HabitatType.GRASSLAND, game);

    const baseInput = game.deferredActions.runUntilInput(game) as any;
    expect(baseInput.type).toBe(InputType.SELECT_EGG_LOCATION);
    game.deferredActions.handleInput(game, { placements: {} });

    const tuckInput = game.deferredActions.runUntilInput(game) as any;
    expect(tuckInput.type).toBe(InputType.SELECT_CARDS);
    game.deferredActions.handleInput(game, { selectedCards: [] });

    expect(game.deferredActions.runUntilInput(game)).toBeUndefined();
    expect(player.hand.length).toBe(handBefore);
    expect(player.board.getAllBirds()[0].tuckedCards).toBe(0);
  });
});
