import { Game } from '../../../../src/server/Game';
import { GameId } from '../../../../src/common/Types';
import { HabitatType } from '../../../../src/common/game/HabitatType';
import { BirdCardName } from '../../../../src/common/cards/BirdCardName';
import { InputType } from '../../../../src/common/input/InputType';
import { executeHabitatAction } from '../../../../src/server/habitats/HabitatAction';

const MIGRATORY_BIRDS: BirdCardName[] = [
  BirdCardName.BEWICKS_WREN,
  BirdCardName.BLUE_GROSBEAK,
  BirdCardName.CHIMNEY_SWIFT,
  BirdCardName.COMMON_NIGHTHAWK,
  BirdCardName.SONG_SPARROW,
  BirdCardName.WHITE_CROWNED_SPARROW,
  BirdCardName.YELLOW_BREASTED_CHAT,
];

describe('Migratory brown birds', () => {
  it.each(MIGRATORY_BIRDS)('prompts to move when %s is rightmost', (birdName) => {
    const game = new Game(`test_migratory_${birdName}_1` as GameId, ['Alice'], 42);
    const player = game.players[0];

    player.board.placeBird(HabitatType.GRASSLAND, {
      name: birdName,
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
    expect(moveInput.availableHabitats).toEqual(
      expect.arrayContaining([HabitatType.FOREST, HabitatType.WETLAND]),
    );
  });

  it.each(MIGRATORY_BIRDS)('does not move when %s is not rightmost', (birdName) => {
    const game = new Game(`test_migratory_${birdName}_2` as GameId, ['Alice'], 42);
    const player = game.players[0];

    player.board.placeBird(HabitatType.GRASSLAND, {
      name: birdName,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });
    player.board.placeBird(HabitatType.GRASSLAND, {
      name: BirdCardName.BOBOLINK,
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
    expect(player.board.getBirdsInHabitat(HabitatType.GRASSLAND)[0].name).toBe(birdName);
  });
});
