// Icon imports
import forestIcon from '../assets/icons/forest.webp';
import grasslandIcon from '../assets/icons/grassland.webp';
import wetlandIcon from '../assets/icons/wetland.webp';
import wildIcon from '../assets/icons/wild.webp';
import seedIcon from '../assets/icons/seed.webp';
import fruitIcon from '../assets/icons/fruit.webp';
import fishIcon from '../assets/icons/fish.webp';
import invertIcon from '../assets/icons/invertebrate.webp';
import rodentIcon from '../assets/icons/rodent.webp';
import eggIcon from '../assets/icons/egg.webp';
import bowlIcon from '../assets/icons/bowl.webp';
import cavityIcon from '../assets/icons/cavity.webp';
import groundIcon from '../assets/icons/ground.webp';
import platformIcon from '../assets/icons/platform.webp';
import starIcon from '../assets/icons/star.webp';

// Power icons
import brownPower from '../assets/powers/brown.webp';
import pinkPower from '../assets/powers/pink.webp';
import whitePower from '../assets/powers/white.webp';
import tealPower from '../assets/powers/teal.webp';

// Background
import cardBackground from '../assets/backgrounds/bird-background.webp';

export const HABITAT_ICONS: Record<string, string> = {
  FOREST: forestIcon,
  GRASSLAND: grasslandIcon,
  WETLAND: wetlandIcon,
};

export const FOOD_ICONS: Record<string, string> = {
  SEED: seedIcon,
  FRUIT: fruitIcon,
  FISH: fishIcon,
  INVERTEBRATE: invertIcon,
  RODENT: rodentIcon,
  WILD: wildIcon,
};

export const NEST_ICONS: Record<string, string> = {
  BOWL: bowlIcon,
  CAVITY: cavityIcon,
  GROUND: groundIcon,
  PLATFORM: platformIcon,
  STAR: starIcon,
};

export const POWER_ICONS: Record<string, string> = {
  BROWN: brownPower,
  PINK: pinkPower,
  WHITE: whitePower,
  GAME_END: tealPower,
};

export const EGG_ICON = eggIcon;
export const WILD_ICON = wildIcon;
export const CARD_BACKGROUND = cardBackground;
