import { InputType } from '../../common/input/InputType';
import { SelectEggLocationInput } from '../../common/input/PlayerInputModel';
import { BirdCardName } from '../../common/cards/BirdCardName';

export function createSelectEggLocationInput(
  availableBirds: BirdCardName[],
  eggsToLay: number
): SelectEggLocationInput {
  return {
    type: InputType.SELECT_EGG_LOCATION,
    availableBirds,
    eggsToLay,
  };
}
