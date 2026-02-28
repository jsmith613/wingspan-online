import { InputType } from '../../common/input/InputType';
import { OrOptionsInput, PlayerInputModel } from '../../common/input/PlayerInputModel';

export function createOrOptionsInput(
  options: PlayerInputModel[]
): OrOptionsInput {
  return {
    type: InputType.OR_OPTIONS,
    options,
  };
}
