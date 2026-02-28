import { BirdCardName } from '../../common/cards/BirdCardName';
import { BonusCardName } from '../../common/cards/BonusCardName';
import { BirdCard } from './BirdCard';
import { BonusCard } from './BonusCard';

/**
 * A manifest maps card names to factory functions that create card instances.
 */
export type BirdCardManifest = Map<BirdCardName, () => BirdCard>;
export type BonusCardManifest = Map<BonusCardName, () => BonusCard>;
