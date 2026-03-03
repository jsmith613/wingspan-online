import { Game } from '../../../../src/server/Game';
import { GameId } from '../../../../src/common/Types';
import { BirdCardName } from '../../../../src/common/cards/BirdCardName';
import { HabitatType } from '../../../../src/common/game/HabitatType';
import { InputType } from '../../../../src/common/input/InputType';
import { executeHabitatAction } from '../../../../src/server/habitats/HabitatAction';

const LAY_ONE_EGG_BIRDS: Array<{ bird: BirdCardName; habitat: HabitatType }> = [
  { bird: BirdCardName.CALIFORNIA_QUAIL, habitat: HabitatType.GRASSLAND },
  { bird: BirdCardName.MOURNING_DOVE, habitat: HabitatType.GRASSLAND },
  { bird: BirdCardName.NORTHERN_BOBWHITE, habitat: HabitatType.GRASSLAND },
  { bird: BirdCardName.SCALED_QUAIL, habitat: HabitatType.GRASSLAND },
];

describe('Lay 1 egg simple brown birds', () => {
  it.each(LAY_ONE_EGG_BIRDS)('prompts confirm/skip for $bird', ({ bird, habitat }) => {
    const game = new Game(`lay_one_${bird}` as GameId, ['Alice'], 42);
    const player = game.players[0];
    player.board.placeBird(habitat, {
      name: bird,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });

    executeHabitatAction(player, habitat, game);

    const baseInput = game.deferredActions.runUntilInput(game) as any;
    expect(baseInput.type).toBe(InputType.SELECT_EGG_LOCATION);
    game.deferredActions.handleInput(game, { placements: {} });

    const simpleInput = game.deferredActions.runUntilInput(game) as any;
    expect(simpleInput.type).toBe(InputType.SELECT_OPTION);
    expect(simpleInput.options).toEqual(expect.arrayContaining(['CONFIRM_BROWN_EFFECT', 'SKIP_BROWN_EFFECT']));
    expect(simpleInput.message).toBe('Lay 1 egg on this bird.');

    game.deferredActions.handleInput(game, { selectedOption: 'CONFIRM_BROWN_EFFECT' });
    expect(game.deferredActions.runUntilInput(game)).toBeUndefined();
    expect(player.board.getAllBirds()[0].eggs).toBe(1);
  });
});
