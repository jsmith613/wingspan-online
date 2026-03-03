import { Game } from '../../../src/server/Game';
import { GameId } from '../../../src/common/Types';
import { HabitatType } from '../../../src/common/game/HabitatType';
import { BirdCardName } from '../../../src/common/cards/BirdCardName';
import { InputType } from '../../../src/common/input/InputType';
import { RevealDeckCardForTuckThreshold } from '../../../src/server/deferredActions/RevealDeckCardForTuckThreshold';

describe('RevealDeckCardForTuckThreshold', () => {
  it('allows skipping reveal', () => {
    const game = new Game('reveal_tuck_1' as GameId, ['Alice'], 42);
    const player = game.players[0];
    player.board.placeBird(HabitatType.FOREST, {
      name: BirdCardName.GREAT_HORNED_OWL,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });
    const bird = player.board.getAllBirds()[0];

    const action = new RevealDeckCardForTuckThreshold(player, bird, 100, 'Great Horned Owl');
    const input = action.execute(game) as any;
    expect(input.type).toBe(InputType.SELECT_OPTION);
    expect(input.options).toEqual(expect.arrayContaining(['REVEAL_CARD', 'SKIP_REVEAL']));

    const done = action.handleInput(game, { selectedOption: 'SKIP_REVEAL' });
    expect(done).toBeUndefined();
    expect(bird.tuckedCards).toBe(0);
  });

  it('shows success and tucks on tuck click', () => {
    const game = new Game('reveal_tuck_2' as GameId, ['Alice'], 42);
    const player = game.players[0];
    player.board.placeBird(HabitatType.FOREST, {
      name: BirdCardName.GREAT_HORNED_OWL,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });
    const bird = player.board.getAllBirds()[0];
    (game as any).drawFromDeck = () => BirdCardName.BOBOLINK;

    const action = new RevealDeckCardForTuckThreshold(player, bird, 100, 'Great Horned Owl');
    action.execute(game);
    const resultInput = action.handleInput(game, { selectedOption: 'REVEAL_CARD' }) as any;
    expect(resultInput.type).toBe(InputType.SELECT_OPTION);
    expect(resultInput.options).toEqual(['TUCK_REVEALED']);
    expect(resultInput.message).toContain('Success');

    const done = action.handleInput(game, { selectedOption: 'TUCK_REVEALED' });
    expect(done).toBeUndefined();
    expect(bird.tuckedCards).toBe(1);
  });

  it('shows no luck and discards on discard click', () => {
    const game = new Game('reveal_tuck_3' as GameId, ['Alice'], 42);
    const player = game.players[0];
    player.board.placeBird(HabitatType.FOREST, {
      name: BirdCardName.GREAT_HORNED_OWL,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });
    const bird = player.board.getAllBirds()[0];
    (game as any).drawFromDeck = () => BirdCardName.GOLDEN_EAGLE;

    let discarded: BirdCardName | null = null;
    (game as any).discardBirdCard = (name: BirdCardName) => {
      discarded = name;
    };

    const action = new RevealDeckCardForTuckThreshold(player, bird, 100, 'Great Horned Owl');
    action.execute(game);
    const resultInput = action.handleInput(game, { selectedOption: 'REVEAL_CARD' }) as any;
    expect(resultInput.type).toBe(InputType.SELECT_OPTION);
    expect(resultInput.options).toEqual(['DISCARD_REVEALED']);
    expect(resultInput.message).toContain('No Luck');

    const done = action.handleInput(game, { selectedOption: 'DISCARD_REVEALED' });
    expect(done).toBeUndefined();
    expect(discarded).toBe(BirdCardName.GOLDEN_EAGLE);
    expect(bird.tuckedCards).toBe(0);
  });
});

