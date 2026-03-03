import { BirdCardName } from '../../../../src/common/cards/BirdCardName';
import { InputType } from '../../../../src/common/input/InputType';
import { GameId } from '../../../../src/common/Types';
import { createBirdCard } from '../../../../src/server/cards/createCard';
import { Game } from '../../../../src/server/Game';

const BONUS_DRAW_BIRDS: BirdCardName[] = [
  BirdCardName.ATLANTIC_PUFFIN,
  BirdCardName.BELLS_VIREO,
  BirdCardName.CALIFORNIA_CONDOR,
  BirdCardName.CASSINS_FINCH,
  BirdCardName.CERULEAN_WARBLER,
  BirdCardName.CHESTNUT_COLLARED_LONGSPUR,
  BirdCardName.GREATER_PRAIRIE_CHICKEN,
  BirdCardName.KING_RAIL,
  BirdCardName.PAINTED_BUNTING,
  BirdCardName.RED_COCKADED_WOODPECKER,
  BirdCardName.ROSEATE_SPOONBILL,
  BirdCardName.SPOTTED_OWL,
  BirdCardName.SPRAGUES_PIPIT,
  BirdCardName.WHOOPING_CRANE,
  BirdCardName.WOOD_STORK,
];

describe('Draw-2-keep-1 bonus birds', () => {
  it.each(BONUS_DRAW_BIRDS)('%s queues bonus-card selection on play', (birdName) => {
    const game = new Game('test_bonus_bird' as GameId, ['Alice'], 42);
    const player = game.players[0];
    const card = createBirdCard(birdName);
    expect(card).not.toBeNull();

    card!.onPlay(player, game);
    const input = game.deferredActions.runUntilInput(game) as any;
    expect(input.type).toBe(InputType.SELECT_BONUS_CARD);
    expect(input.min).toBe(1);
    expect(input.max).toBe(1);
    expect(input.availableBonusCards.length).toBeGreaterThan(0);
  });
});

