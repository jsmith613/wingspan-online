import { BirdCardName } from '../../common/cards/BirdCardName';
import { BonusCardName } from '../../common/cards/BonusCardName';
import { BirdCard } from './BirdCard';
import { BonusCard } from './BonusCard';
import { getAllBirdManifests, getAllBonusManifests } from './AllManifests';

// Cache manifests on first use
let _birdManifest: ReturnType<typeof getAllBirdManifests> | null = null;
let _bonusManifest: ReturnType<typeof getAllBonusManifests> | null = null;

function getBirdManifest() {
  if (!_birdManifest) _birdManifest = getAllBirdManifests();
  return _birdManifest;
}

function getBonusManifest() {
  if (!_bonusManifest) _bonusManifest = getAllBonusManifests();
  return _bonusManifest;
}

/**
 * Factory: create a bird card instance by name.
 * Returns null if the card is not registered (e.g. placeholder).
 */
export function createBirdCard(name: BirdCardName): BirdCard | null {
  const factory = getBirdManifest().get(name);
  if (!factory) return null;
  return factory();
}

/**
 * Factory: create a bonus card instance by name.
 * Returns null if the card is not registered.
 */
export function createBonusCard(name: BonusCardName): BonusCard | null {
  const factory = getBonusManifest().get(name);
  if (!factory) return null;
  return factory();
}
