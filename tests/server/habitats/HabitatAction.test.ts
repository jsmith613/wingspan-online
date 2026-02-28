import { Game } from '../../../src/server/Game';
import { GameId } from '../../../src/common/Types';
import { HabitatType } from '../../../src/common/game/HabitatType';
import { BirdCardName } from '../../../src/common/cards/BirdCardName';
import { InputType } from '../../../src/common/input/InputType';
import { executeHabitatAction } from '../../../src/server/habitats/HabitatAction';

describe('HabitatAction brown powers', () => {
  it('activates brown powers right-to-left after the base habitat action', () => {
    const game = new Game('test_habitat_1' as GameId, ['Alice'], 42);
    const player = game.players[0];

    // Left slot then right slot.
    player.board.placeBird(HabitatType.GRASSLAND, {
      name: BirdCardName.KILLDEER,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });
    player.board.placeBird(HabitatType.GRASSLAND, {
      name: BirdCardName.AMERICAN_ROBIN,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });

    executeHabitatAction(player, HabitatType.GRASSLAND, game);

    const baseInput = game.deferredActions.runUntilInput(game) as any;
    expect(baseInput.type).toBe(InputType.SELECT_EGG_LOCATION);
    expect(baseInput.eggsToLay).toBe(3); // Grassland base at strength for 2 birds
    game.deferredActions.handleInput(game, { placements: {} });

    const rightmostBrownInput = game.deferredActions.runUntilInput(game) as any;
    expect(rightmostBrownInput.type).toBe(InputType.SELECT_EGG_LOCATION);
    expect(rightmostBrownInput.eggsToLay).toBe(1); // American Robin first (rightmost)
    game.deferredActions.handleInput(game, { placements: {} });

    const leftBrownInput = game.deferredActions.runUntilInput(game) as any;
    expect(leftBrownInput.type).toBe(InputType.SELECT_EGG_LOCATION);
    expect(leftBrownInput.eggsToLay).toBe(2); // Killdeer second (left)
  });

  it('does not enqueue extra activations for non-brown birds', () => {
    const game = new Game('test_habitat_2' as GameId, ['Alice'], 42);
    const player = game.players[0];

    player.board.placeBird(HabitatType.GRASSLAND, {
      name: BirdCardName.DARK_EYED_JUNCO,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });
    player.board.placeBird(HabitatType.GRASSLAND, {
      name: BirdCardName.HOUSE_FINCH,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });

    executeHabitatAction(player, HabitatType.GRASSLAND, game);

    const baseInput = game.deferredActions.runUntilInput(game) as any;
    expect(baseInput.type).toBe(InputType.SELECT_EGG_LOCATION);
    expect(baseInput.eggsToLay).toBe(3);
    game.deferredActions.handleInput(game, { placements: {} });

    const nextInput = game.deferredActions.runUntilInput(game);
    expect(nextInput).toBeUndefined();
  });
});
