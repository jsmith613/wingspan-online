import { Game } from '../../../../src/server/Game';
import { GameId } from '../../../../src/common/Types';
import { BirdCardName } from '../../../../src/common/cards/BirdCardName';
import { HabitatType } from '../../../../src/common/game/HabitatType';
import { InputType } from '../../../../src/common/input/InputType';
import { FoodType } from '../../../../src/common/game/FoodType';
import { executeHabitatAction } from '../../../../src/server/habitats/HabitatAction';

describe('Simple brown confirm/skip birds', () => {
  it('prompts confirm/skip for Northern Cardinal gain fruit', () => {
    const game = new Game('simple_brown_1' as GameId, ['Alice'], 42);
    const player = game.players[0];
    player.board.placeBird(HabitatType.FOREST, {
      name: BirdCardName.NORTHERN_CARDINAL,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });
    const foodBefore = player.food.length;

    executeHabitatAction(player, HabitatType.FOREST, game);

    const baseInput = game.deferredActions.runUntilInput(game) as any;
    expect(baseInput.type).toBe(InputType.SELECT_FOOD);
    const firstFood = baseInput.availableDice[0].foods[0];
    game.deferredActions.handleInput(game, { selectedFood: [firstFood] });

    const simpleInput = game.deferredActions.runUntilInput(game) as any;
    expect(simpleInput.type).toBe(InputType.SELECT_OPTION);
    expect(simpleInput.options).toEqual(expect.arrayContaining(['CONFIRM_BROWN_EFFECT', 'SKIP_BROWN_EFFECT']));
    expect(simpleInput.message).toBe('Gain 1 fruit from the supply.');

    game.deferredActions.handleInput(game, { selectedOption: 'CONFIRM_BROWN_EFFECT' });
    expect(game.deferredActions.runUntilInput(game)).toBeUndefined();
    expect(player.food.length).toBe(foodBefore + 2);
    expect(player.food).toContain(FoodType.FRUIT);
  });

  it('prompts confirm/skip for Carolina Chickadee cache seed', () => {
    const game = new Game('simple_brown_2' as GameId, ['Alice'], 42);
    const player = game.players[0];
    player.board.placeBird(HabitatType.FOREST, {
      name: BirdCardName.CAROLINA_CHICKADEE,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });

    executeHabitatAction(player, HabitatType.FOREST, game);

    const baseInput = game.deferredActions.runUntilInput(game) as any;
    expect(baseInput.type).toBe(InputType.SELECT_FOOD);
    const firstFood = baseInput.availableDice[0].foods[0];
    game.deferredActions.handleInput(game, { selectedFood: [firstFood] });

    const simpleInput = game.deferredActions.runUntilInput(game) as any;
    expect(simpleInput.type).toBe(InputType.SELECT_OPTION);
    expect(simpleInput.options).toEqual(expect.arrayContaining(['CONFIRM_BROWN_EFFECT', 'SKIP_BROWN_EFFECT']));
    expect(simpleInput.message).toBe('Cache 1 seed from the supply on this bird.');

    game.deferredActions.handleInput(game, { selectedOption: 'CONFIRM_BROWN_EFFECT' });
    expect(game.deferredActions.runUntilInput(game)).toBeUndefined();
    expect(player.board.getAllBirds()[0].cachedFood).toBe(1);
  });
});
