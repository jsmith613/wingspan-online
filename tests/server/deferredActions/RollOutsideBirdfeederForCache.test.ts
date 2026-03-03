import { Game } from '../../../src/server/Game';
import { GameId } from '../../../src/common/Types';
import { HabitatType } from '../../../src/common/game/HabitatType';
import { BirdCardName } from '../../../src/common/cards/BirdCardName';
import { FoodType } from '../../../src/common/game/FoodType';
import { InputType } from '../../../src/common/input/InputType';
import { RollOutsideBirdfeederForCache } from '../../../src/server/deferredActions/RollOutsideBirdfeederForCache';

describe('RollOutsideBirdfeederForCache', () => {
  it('allows skipping the roll', () => {
    const game = new Game('roll_cache_1' as GameId, ['Alice'], 42);
    const player = game.players[0];
    player.board.placeBird(HabitatType.GRASSLAND, {
      name: BirdCardName.AMERICAN_KESTREL,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });
    const bird = player.board.getAllBirds()[0];

    const action = new RollOutsideBirdfeederForCache(
      player,
      bird,
      FoodType.RODENT,
      'American Kestrel',
    );

    const choice = action.execute(game) as any;
    expect(choice.type).toBe(InputType.SELECT_OPTION);
    expect(choice.options).toEqual(expect.arrayContaining(['ROLL_OUTSIDE', 'SKIP_ROLL']));

    const result = action.handleInput(game, { selectedOption: 'SKIP_ROLL' });
    expect(result).toBeUndefined();
    expect(bird.cachedFood).toBe(0);
  });

  it('shows success then caches on Cache click', () => {
    const game = new Game('roll_cache_2' as GameId, ['Alice'], 42);
    const player = game.players[0];
    player.board.placeBird(HabitatType.GRASSLAND, {
      name: BirdCardName.AMERICAN_KESTREL,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });
    const bird = player.board.getAllBirds()[0];
    (game.birdfeeder as any).rollOutsideDice = () => [FoodType.RODENT];

    const action = new RollOutsideBirdfeederForCache(
      player,
      bird,
      FoodType.RODENT,
      'American Kestrel',
    );

    action.execute(game);
    const resultPrompt = action.handleInput(game, { selectedOption: 'ROLL_OUTSIDE' }) as any;
    expect(resultPrompt.type).toBe(InputType.SELECT_OPTION);
    expect(resultPrompt.options).toEqual(['CACHE_RESULT']);
    expect(resultPrompt.message).toContain('Success');

    const done = action.handleInput(game, { selectedOption: 'CACHE_RESULT' });
    expect(done).toBeUndefined();
    expect(bird.cachedFood).toBe(1);
  });

  it('shows no luck and does not cache on failure', () => {
    const game = new Game('roll_cache_3' as GameId, ['Alice'], 42);
    const player = game.players[0];
    player.board.placeBird(HabitatType.GRASSLAND, {
      name: BirdCardName.AMERICAN_KESTREL,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });
    const bird = player.board.getAllBirds()[0];
    (game.birdfeeder as any).rollOutsideDice = () => [FoodType.FISH];

    const action = new RollOutsideBirdfeederForCache(
      player,
      bird,
      FoodType.RODENT,
      'American Kestrel',
    );

    action.execute(game);
    const resultPrompt = action.handleInput(game, { selectedOption: 'ROLL_OUTSIDE' }) as any;
    expect(resultPrompt.type).toBe(InputType.SELECT_OPTION);
    expect(resultPrompt.options).toEqual(['CONFIRM_RESULT']);
    expect(resultPrompt.message).toContain('No Luck');

    const done = action.handleInput(game, { selectedOption: 'CONFIRM_RESULT' });
    expect(done).toBeUndefined();
    expect(bird.cachedFood).toBe(0);
  });
});

