import { BirdCardName } from '../../common/cards/BirdCardName';
import { BonusCardName } from '../../common/cards/BonusCardName';
import { BirdCardManifest, BonusCardManifest } from './CardManifest';
import { BASE_BIRD_MANIFEST } from './base/_manifest';
import { BONUS_CARD_MANIFEST } from './bonus/_manifest';

/**
 * Aggregated bird card manifest from all expansions.
 * Add new expansion manifests here.
 */
export function getAllBirdManifests(): BirdCardManifest {
  const combined: BirdCardManifest = new Map();
  for (const [name, factory] of BASE_BIRD_MANIFEST) {
    combined.set(name, factory);
  }
  // Future expansions: merge additional manifests here
  return combined;
}

/**
 * Aggregated bonus card manifest.
 */
export function getAllBonusManifests(): BonusCardManifest {
  const combined: BonusCardManifest = new Map();
  for (const [name, factory] of BONUS_CARD_MANIFEST) {
    combined.set(name, factory);
  }
  return combined;
}

/** Get all registered bird card names. */
export function getRegisteredBirdNames(): BirdCardName[] {
  return Array.from(getAllBirdManifests().keys());
}

/** Get all registered bonus card names. */
export function getRegisteredBonusNames(): BonusCardName[] {
  return Array.from(getAllBonusManifests().keys());
}
