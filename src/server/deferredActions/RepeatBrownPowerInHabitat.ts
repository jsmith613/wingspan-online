import { InputType } from '../../common/input/InputType';
import { PowerType } from '../../common/game/PowerType';
import type { PlayerInputModel } from '../../common/input/PlayerInputModel';
import type { Game } from '../Game';
import type { Player } from '../Player';
import type { BirdCardName } from '../../common/cards/BirdCardName';
import { createBirdCard } from '../cards/createCard';
import { ActionPriority, DeferredAction } from './DeferredAction';

const CONFIRM_REPEAT_POWER = 'CONFIRM_REPEAT_POWER';
const SKIP_REPEAT_POWER = 'SKIP_REPEAT_POWER';

type RepeatMode = 'ANY_BROWN' | 'PREDATOR_ONLY';
type Phase = 'choose' | 'pickTarget';

interface Candidate {
  label: string;
  habitat: import('../../common/game/HabitatType').HabitatType;
  slot: number;
  name: BirdCardName;
}

export class RepeatBrownPowerInHabitat extends DeferredAction {
  private readonly sourceHabitat: import('../../common/game/HabitatType').HabitatType;
  private readonly sourceSlot: number;
  private readonly mode: RepeatMode;
  private readonly message: string;
  private phase: Phase = 'choose';

  constructor(
    player: Player,
    sourceHabitat: import('../../common/game/HabitatType').HabitatType,
    sourceSlot: number,
    mode: RepeatMode,
    message: string,
  ) {
    super(player, ActionPriority.DEFAULT);
    this.sourceHabitat = sourceHabitat;
    this.sourceSlot = sourceSlot;
    this.mode = mode;
    this.message = message;
  }

  execute(_game: Game): PlayerInputModel | undefined {
    const candidates = this.getCandidates();
    return {
      type: InputType.SELECT_OPTION,
      options: [CONFIRM_REPEAT_POWER, SKIP_REPEAT_POWER],
      disabledOptions: candidates.length > 0 ? [] : [CONFIRM_REPEAT_POWER],
      message: candidates.length > 0 ? this.message : `${this.message} (No valid bird to repeat)`,
    };
  }

  handleInput(game: Game, response: unknown): PlayerInputModel | undefined {
    if (this.phase === 'choose') {
      const selected = (response as any)?.selectedOption as string | undefined;
      if (selected === SKIP_REPEAT_POWER) return undefined;
      if (selected !== CONFIRM_REPEAT_POWER) return this.execute(game);
      const candidates = this.getCandidates();
      if (candidates.length === 0) return this.execute(game);
      if (candidates.length === 1) {
        this.repeatCandidate(candidates[0], game);
        return undefined;
      }
      this.phase = 'pickTarget';
      return this.askTarget(candidates);
    }

    const selected = (response as any)?.selectedOption as string | undefined;
    const candidates = this.getCandidates();
    const candidate = candidates.find((c) => c.label === selected);
    if (!candidate) return this.askTarget(candidates);
    this.repeatCandidate(candidate, game);
    return undefined;
  }

  private askTarget(candidates: Candidate[]): PlayerInputModel {
    return {
      type: InputType.SELECT_OPTION,
      options: candidates.map((c) => c.label),
      message: 'Choose a bird power to repeat.',
    };
  }

  private repeatCandidate(candidate: Candidate, game: Game): void {
    const card = createBirdCard(candidate.name);
    if (!card || card.powerType !== PowerType.BROWN) return;
    card.onActivate(this.player, game, {
      habitat: candidate.habitat,
      slotIndex: candidate.slot,
    });
  }

  private getCandidates(): Candidate[] {
    const habitatSlots = this.player.board.getHabitat(this.sourceHabitat);
    const candidates: Candidate[] = [];
    for (let i = 0; i < habitatSlots.length; i++) {
      if (i === this.sourceSlot) continue;
      const placed = habitatSlots[i];
      if (!placed) continue;
      const card = createBirdCard(placed.name as BirdCardName);
      if (!card || card.powerType !== PowerType.BROWN) continue;
      if (this.mode === 'PREDATOR_ONLY' && !this.isPredatorPower(card.powerText)) continue;
      candidates.push({
        label: `TARGET:${i}:${card.commonName}`,
        habitat: this.sourceHabitat,
        slot: i,
        name: placed.name as BirdCardName,
      });
    }
    return candidates;
  }

  private isPredatorPower(powerText: string): boolean {
    return powerText.startsWith('Look at a card from the deck')
      || powerText.startsWith('Roll all dice not in birdfeeder');
  }
}
