import { BirdCardName } from '../../common/cards/BirdCardName';
import { InputType } from '../../common/input/InputType';
import type { PlayerInputModel } from '../../common/input/PlayerInputModel';
import type { Game } from '../Game';
import type { Player } from '../Player';
import { ActionPriority, DeferredAction } from './DeferredAction';
import { DrawCards } from './DrawCards';
import { createBirdCard } from '../cards/createCard';

const SKIP_DISCARD_EGG_DRAW = 'SKIP_DISCARD_EGG_DRAW';

export class DiscardEggToDrawCards extends DeferredAction {
  private readonly drawCount: number;
  private readonly message: string;

  constructor(player: Player, drawCount: number, message: string) {
    super(player, ActionPriority.DEFAULT);
    this.drawCount = drawCount;
    this.message = message;
  }

  execute(_game: Game): PlayerInputModel | undefined {
    const birdsWithEggs = this.getEggBirds();
    const options = birdsWithEggs.map((b) => {
      const card = createBirdCard(b.name as BirdCardName);
      const label = card?.commonName
        ?? String(b.name).replace(/_/g, ' ').replace(/\b\w/g, (ch: string) => ch.toUpperCase());
      return `TARGET:${b.name}:${label}`;
    });
    options.push(SKIP_DISCARD_EGG_DRAW);

    return {
      type: InputType.SELECT_OPTION,
      options,
      message: birdsWithEggs.length > 0 ? this.message : `${this.message} (No eggs to discard)`,
    };
  }

  handleInput(game: Game, response: unknown): PlayerInputModel | undefined {
    const selected = (response as any)?.selectedOption as string | undefined;
    if (!selected || selected === SKIP_DISCARD_EGG_DRAW) return undefined;
    if (!selected.startsWith('TARGET:')) return this.execute(game);
    const chosenName = selected.split(':')[1];
    if (!chosenName) return this.execute(game);
    const bird = this.getEggBirds().find((b) => b.name === chosenName);
    if (!bird) return this.execute(game);

    bird.eggs--;
    game.deferredActions.push(new DrawCards(this.player, this.drawCount));
    return undefined;
  }

  private getEggBirds() {
    return this.player.board.getAllBirds().filter((b) => b.eggs > 0);
  }
}
