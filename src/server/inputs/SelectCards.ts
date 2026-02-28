import { InputType } from '../../common/input/InputType';
import { SelectCardsInput } from '../../common/input/PlayerInputModel';
import { BirdCardName } from '../../common/cards/BirdCardName';

export function createSelectCardsInput(
  availableCards: BirdCardName[],
  min: number = 1,
  max: number = 1
): SelectCardsInput {
  return {
    type: InputType.SELECT_CARDS,
    availableCards,
    min,
    max,
  };
}
