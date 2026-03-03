import { Game } from '../../../../src/server/Game';
import { GameId } from '../../../../src/common/Types';
import { HabitatType } from '../../../../src/common/game/HabitatType';
import { BirdCardName } from '../../../../src/common/cards/BirdCardName';
import { InputType } from '../../../../src/common/input/InputType';
import { executeHabitatAction } from '../../../../src/server/habitats/HabitatAction';

const THRESHOLD_PREDATORS: Array<{ bird: BirdCardName; habitat: HabitatType }> = [
  { bird: BirdCardName.BARRED_OWL, habitat: HabitatType.FOREST },
  { bird: BirdCardName.COOPERS_HAWK, habitat: HabitatType.FOREST },
  { bird: BirdCardName.GREATER_ROADRUNNER, habitat: HabitatType.GRASSLAND },
  { bird: BirdCardName.NORTHERN_HARRIER, habitat: HabitatType.GRASSLAND },
  { bird: BirdCardName.RED_SHOULDERED_HAWK, habitat: HabitatType.FOREST },
  { bird: BirdCardName.RED_TAILED_HAWK, habitat: HabitatType.GRASSLAND },
  { bird: BirdCardName.SWAINSONS_HAWK, habitat: HabitatType.GRASSLAND },
];

describe('Threshold predator brown birds', () => {
  it.each(THRESHOLD_PREDATORS)(
    'prompts reveal/skip for $bird in $habitat',
    ({ bird, habitat }) => {
      const game = new Game(`test_threshold_${bird}` as GameId, ['Alice'], 42);
      const player = game.players[0];

      player.board.placeBird(habitat, {
        name: bird,
        eggs: 0,
        cachedFood: 0,
        tuckedCards: 0,
      });

      executeHabitatAction(player, habitat, game);

      const baseInput = game.deferredActions.runUntilInput(game) as any;
      if (baseInput.type === InputType.SELECT_EGG_LOCATION) {
        game.deferredActions.handleInput(game, { placements: {} });
      } else {
        expect(baseInput.type).toBe(InputType.SELECT_FOOD);
        const firstFood = baseInput.availableDice[0].foods[0];
        game.deferredActions.handleInput(game, { selectedFood: [firstFood] });
      }

      const revealInput = game.deferredActions.runUntilInput(game) as any;
      expect(revealInput.type).toBe(InputType.SELECT_OPTION);
      expect(revealInput.options).toEqual(expect.arrayContaining(['REVEAL_CARD', 'SKIP_REVEAL']));
    },
  );
});
