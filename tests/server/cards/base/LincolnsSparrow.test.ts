import { Game } from '../../../../src/server/Game';
import { GameId } from '../../../../src/common/Types';
import { HabitatType } from '../../../../src/common/game/HabitatType';
import { BirdCardName } from '../../../../src/common/cards/BirdCardName';
import { InputType } from '../../../../src/common/input/InputType';
import { executeHabitatAction } from '../../../../src/server/habitats/HabitatAction';

describe("Lincoln's Sparrow", () => {
  it('prompts to move when it is rightmost in its habitat', () => {
    const game = new Game('test_lincoln_1' as GameId, ['Alice'], 42);
    const player = game.players[0];

    player.board.placeBird(HabitatType.GRASSLAND, {
      name: BirdCardName.LINCOLNS_SPARROW,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });

    executeHabitatAction(player, HabitatType.GRASSLAND, game);

    const baseInput = game.deferredActions.runUntilInput(game) as any;
    expect(baseInput.type).toBe(InputType.SELECT_EGG_LOCATION);
    game.deferredActions.handleInput(game, { placements: {} });

    const moveTargetInput = game.deferredActions.runUntilInput(game) as any;
    expect(moveTargetInput.type).toBe(InputType.SELECT_HABITAT_SLOT);
    expect(moveTargetInput.canSkip).toBe(true);
    expect(moveTargetInput.availableHabitats).toEqual(
      expect.arrayContaining([HabitatType.FOREST, HabitatType.WETLAND]),
    );

    game.deferredActions.handleInput(game, { selectedHabitat: HabitatType.FOREST });
    expect(game.deferredActions.runUntilInput(game)).toBeUndefined();

    expect(player.board.getBirdCount(HabitatType.GRASSLAND)).toBe(0);
    expect(player.board.getBirdCount(HabitatType.FOREST)).toBe(1);
    expect(player.board.getBirdsInHabitat(HabitatType.FOREST)[0].name).toBe(BirdCardName.LINCOLNS_SPARROW);
  });

  it('does not move when it is not rightmost in its habitat', () => {
    const game = new Game('test_lincoln_2' as GameId, ['Alice'], 42);
    const player = game.players[0];

    player.board.placeBird(HabitatType.GRASSLAND, {
      name: BirdCardName.LINCOLNS_SPARROW,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });
    player.board.placeBird(HabitatType.GRASSLAND, {
      name: BirdCardName.DARK_EYED_JUNCO,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });

    executeHabitatAction(player, HabitatType.GRASSLAND, game);

    const baseInput = game.deferredActions.runUntilInput(game) as any;
    expect(baseInput.type).toBe(InputType.SELECT_EGG_LOCATION);
    game.deferredActions.handleInput(game, { placements: {} });

    expect(game.deferredActions.runUntilInput(game)).toBeUndefined();
    expect(player.board.getBirdCount(HabitatType.GRASSLAND)).toBe(2);
    expect(player.board.getBirdsInHabitat(HabitatType.GRASSLAND)[0].name).toBe(BirdCardName.LINCOLNS_SPARROW);
  });

  it('allows skipping the entire brown action', () => {
    const game = new Game('test_lincoln_3' as GameId, ['Alice'], 42);
    const player = game.players[0];

    player.board.placeBird(HabitatType.GRASSLAND, {
      name: BirdCardName.LINCOLNS_SPARROW,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });

    executeHabitatAction(player, HabitatType.GRASSLAND, game);

    const baseInput = game.deferredActions.runUntilInput(game) as any;
    expect(baseInput.type).toBe(InputType.SELECT_EGG_LOCATION);
    game.deferredActions.handleInput(game, { placements: {} });

    const moveInput = game.deferredActions.runUntilInput(game) as any;
    expect(moveInput.type).toBe(InputType.SELECT_HABITAT_SLOT);
    expect(moveInput.canSkip).toBe(true);
    game.deferredActions.handleInput(game, { skip: true });

    expect(game.deferredActions.runUntilInput(game)).toBeUndefined();
    expect(player.board.getBirdCount(HabitatType.GRASSLAND)).toBe(1);
    expect(player.board.getBirdsInHabitat(HabitatType.GRASSLAND)[0].name).toBe(BirdCardName.LINCOLNS_SPARROW);
  });
});
