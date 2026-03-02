import { BonusCardName } from './BonusCardName';

export interface ClientBonusCard {
  readonly name: BonusCardName;
  readonly displayName: string;
  readonly description: string;
  readonly condition: string;
  readonly vpText: string;
  readonly score: number;
}
