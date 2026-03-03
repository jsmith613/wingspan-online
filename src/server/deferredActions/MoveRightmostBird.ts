import { InputType } from '../../common/input/InputType';
import { HabitatType } from '../../common/game/HabitatType';
import { PlayerInputModel } from '../../common/input/PlayerInputModel';
import type { Game } from '../Game';
import type { Player } from '../Player';
import { DeferredAction, ActionPriority } from './DeferredAction';

/**
 * Move a specific rightmost bird to a different valid habitat.
 * Used by "move this bird" brown powers (e.g., Lincoln's Sparrow).
 */
export class MoveRightmostBird extends DeferredAction {
  private readonly sourceHabitat: HabitatType;
  private readonly sourceSlot: number;
  private readonly birdName: string;
  private readonly allowedHabitats: HabitatType[];

  constructor(
    player: Player,
    sourceHabitat: HabitatType,
    sourceSlot: number,
    birdName: string,
    allowedHabitats: ReadonlyArray<HabitatType>,
  ) {
    super(player, ActionPriority.DEFAULT);
    this.sourceHabitat = sourceHabitat;
    this.sourceSlot = sourceSlot;
    this.birdName = birdName;
    this.allowedHabitats = [...allowedHabitats];
  }

  isCancellationLocked(): boolean {
    return true;
  }

  execute(_game: Game): PlayerInputModel | undefined {
    const destinations = this.getAvailableDestinations();
    if (!this.canStillMove() || destinations.length === 0) {
      return undefined;
    }
    if (destinations.length === 1) {
      this.player.board.moveBird(this.sourceHabitat, this.sourceSlot, destinations[0]);
      return undefined;
    }
    return this.buildPrompt(destinations);
  }

  handleInput(_game: Game, response: unknown): PlayerInputModel | undefined {
    if ((response as any)?.skip) {
      return undefined;
    }
    const selected = (response as any)?.selectedHabitat as HabitatType | undefined;
    const destinations = this.getAvailableDestinations();
    if (!this.canStillMove() || destinations.length === 0) {
      return undefined;
    }
    if (!selected || !destinations.includes(selected)) {
      return this.buildPrompt(destinations);
    }
    this.player.board.moveBird(this.sourceHabitat, this.sourceSlot, selected);
    return undefined;
  }

  private canStillMove(): boolean {
    const placed = this.player.board.getBirdAt(this.sourceHabitat, this.sourceSlot);
    if (!placed || placed.name !== this.birdName) return false;
    return this.player.board.getRightmostOccupiedSlot(this.sourceHabitat) === this.sourceSlot;
  }

  private getAvailableDestinations(): HabitatType[] {
    return this.allowedHabitats.filter((habitat) =>
      habitat !== this.sourceHabitat && this.player.board.hasSpace(habitat),
    );
  }

  private buildPrompt(destinations: HabitatType[]): PlayerInputModel {
    return {
      type: InputType.SELECT_HABITAT_SLOT,
      availableHabitats: destinations,
      canSkip: true,
      lockBack: true,
    };
  }
}
