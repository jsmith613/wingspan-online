import { InputType } from '../../common/input/InputType';
import { SelectOptionInput } from '../../common/input/PlayerInputModel';

export function createSelectOptionInput(
  options: string[],
  message: string
): SelectOptionInput {
  return {
    type: InputType.SELECT_OPTION,
    options,
    message,
  };
}
