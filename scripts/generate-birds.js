/**
 * Generate bird card files from wingsearch_master.json for all core birds.
 *
 * Generates:
 *  - src/common/cards/BirdCardName.ts (enum)
 *  - src/server/cards/base/<ClassName>.ts (one per bird)
 *  - src/server/cards/base/_manifest.ts
 *  - src/client/utils/birdImages.ts
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const data = require(path.join(ROOT, 'wingsearch_master.json'));

const core = data.filter(b => b['Set'] === 'core');

// Helper: common name -> ENUM_NAME
function toEnumName(commonName) {
  return commonName
    .toUpperCase()
    .replace(/['']/g, '')
    .replace(/[-\s]+/g, '_')
    .replace(/[^A-Z0-9_]/g, '');
}

// Helper: common name -> ClassName (PascalCase)
function toClassName(commonName) {
  return commonName
    .replace(/['']/g, '')
    .replace(/[-]+/g, ' ')
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

// Helper: map food costs from JSON
function getFoodCost(bird) {
  const foods = [];
  const types = [
    ['Invertebrate', 'FoodType.INVERTEBRATE'],
    ['Seed', 'FoodType.SEED'],
    ['Fish', 'FoodType.FISH'],
    ['Fruit', 'FoodType.FRUIT'],
    ['Rodent', 'FoodType.RODENT'],
    ['Wild (food)', 'FoodType.WILD'],
  ];
  for (const [key, enumVal] of types) {
    const count = bird[key];
    if (count) {
      for (let i = 0; i < count; i++) {
        foods.push(enumVal);
      }
    }
  }
  return foods;
}

// Helper: map habitats
function getHabitats(bird) {
  const habitats = [];
  if (bird['Forest'] === 'X') habitats.push('HabitatType.FOREST');
  if (bird['Grassland'] === 'X') habitats.push('HabitatType.GRASSLAND');
  if (bird['Wetland'] === 'X') habitats.push('HabitatType.WETLAND');
  return habitats;
}

// Helper: map nest type
function getNestType(bird) {
  const map = {
    'platform': 'NestType.PLATFORM',
    'bowl': 'NestType.BOWL',
    'cavity': 'NestType.CAVITY',
    'ground': 'NestType.GROUND',
    'wild': 'NestType.WILD',
    'none': 'NestType.NONE',
    'star': 'NestType.STAR',
  };
  return map[bird['Nest type']] || 'NestType.BOWL';
}

// Helper: map power type (color)
function getPowerType(bird) {
  const map = {
    'brown': 'PowerType.BROWN',
    'pink': 'PowerType.PINK',
    'white': 'PowerType.WHITE',
  };
  if (!bird['Color']) return 'PowerType.NONE';
  return map[bird['Color']] || 'PowerType.NONE';
}

// Helper: escape single quotes in strings
function esc(str) {
  return (str || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// Process all birds
const birds = core.map(bird => ({
  commonName: bird['Common name'],
  scientificName: bird['Scientific name'],
  enumName: toEnumName(bird['Common name']),
  className: toClassName(bird['Common name']),
  habitats: getHabitats(bird),
  foodCost: getFoodCost(bird),
  nestType: getNestType(bird),
  eggCapacity: bird['Egg limit'] || 0,
  wingspan: bird['Wingspan'] || 0,
  points: bird['Victory points'] || 0,
  powerType: getPowerType(bird),
  powerText: bird['Power text'] || '',
  color: bird['Color'],
  id: bird['id'],
})).sort((a, b) => a.commonName.localeCompare(b.commonName));

console.log(`Processing ${birds.length} birds...`);

// =====================================================
// 1. Generate BirdCardName.ts
// =====================================================
const enumEntries = birds.map(b => `  ${b.enumName} = '${b.enumName}',`).join('\n');
const enumContent = `export enum BirdCardName {\n${enumEntries}\n}\n`;
fs.writeFileSync(path.join(ROOT, 'src/common/cards/BirdCardName.ts'), enumContent);
console.log('Generated BirdCardName.ts');

// =====================================================
// 2. Generate individual bird card files
// =====================================================
const baseDir = path.join(ROOT, 'src/server/cards/base');

for (const bird of birds) {
  const foodCostStr = bird.foodCost.length > 0
    ? `[${bird.foodCost.join(', ')}]`
    : '[]';
  const habitatStr = `[${bird.habitats.join(', ')}]`;

  // Check if power needs Game/Player imports
  const needsGameImport = bird.color === 'brown' || bird.color === 'white';

  let content = `import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';

export class ${bird.className} extends BirdCard {
  readonly name = BirdCardName.${bird.enumName};
  readonly commonName = '${esc(bird.commonName)}';
  readonly scientificName = '${esc(bird.scientificName)}';
  readonly habitats = ${habitatStr};
  readonly foodCost = ${foodCostStr};
  readonly nestType = ${bird.nestType};
  readonly eggCapacity = ${bird.eggCapacity};
  readonly wingspan = ${bird.wingspan};
  readonly points = ${bird.points};
  readonly powerType = ${bird.powerType};
  readonly powerText = '${esc(bird.powerText)}';
}
`;

  const filePath = path.join(baseDir, `${bird.className}.ts`);
  fs.writeFileSync(filePath, content);
}
console.log(`Generated ${birds.length} bird card files`);

// =====================================================
// 3. Generate _manifest.ts
// =====================================================
const importLines = birds.map(b =>
  `import { ${b.className} } from './${b.className}';`
).join('\n');
const setLines = birds.map(b =>
  `BASE_BIRD_MANIFEST.set(BirdCardName.${b.enumName}, () => new ${b.className}());`
).join('\n');

const manifestContent = `import { BirdCardName } from '../../../common/cards/BirdCardName';
import { BirdCardManifest } from '../CardManifest';
${importLines}

export const BASE_BIRD_MANIFEST: BirdCardManifest = new Map();
${setLines}
`;
fs.writeFileSync(path.join(baseDir, '_manifest.ts'), manifestContent);
console.log('Generated _manifest.ts');

// =====================================================
// 4. Generate birdImages.ts
// =====================================================
const imgImports = birds.map(b =>
  `import ${b.enumName} from '../assets/birds/${b.enumName}.webp';`
).join('\n');
const imgEntries = birds.map(b =>
  `  [BirdCardName.${b.enumName}]: ${b.enumName},`
).join('\n');

const imgContent = `import { BirdCardName } from '@common/cards/BirdCardName';

${imgImports}

const BIRD_IMAGES: Record<string, string> = {
${imgEntries}
};

export function getBirdImage(name: string): string | undefined {
  return BIRD_IMAGES[name];
}
`;
fs.writeFileSync(path.join(ROOT, 'src/client/utils/birdImages.ts'), imgContent);
console.log('Generated birdImages.ts');

// =====================================================
// 5. Output bird IDs for image download
// =====================================================
const idMap = birds.map(b => `${b.id}:${b.enumName}`).join('\n');
fs.writeFileSync(path.join(ROOT, 'scripts/bird-ids.txt'), idMap);
console.log('Wrote bird-ids.txt for image download');
console.log('Done!');
