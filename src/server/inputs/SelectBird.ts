import { InputType } from '../../common/input/InputType';
import { SelectBirdInput } from '../../common/input/PlayerInputModel';
import { BirdCardName } from '../../common/cards/BirdCardName';

export function createSelectBirdInput(
  availableBirds: BirdCardName[],
  min: number = 1,
  max: number = 1
): SelectBirdInput {
  return {
    type: InputType.SELECT_BIRD,
    availableBirds,
    min,
    max,
  };
}
