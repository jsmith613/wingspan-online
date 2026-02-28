import { InputType } from '../../common/input/InputType';
import { SelectHabitatSlotInput } from '../../common/input/PlayerInputModel';
import { HabitatType } from '../../common/game/HabitatType';

export function createSelectHabitatSlotInput(
  availableHabitats: HabitatType[]
): SelectHabitatSlotInput {
  return {
    type: InputType.SELECT_HABITAT_SLOT,
    availableHabitats,
  };
}
