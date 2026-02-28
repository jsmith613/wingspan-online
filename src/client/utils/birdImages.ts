import { BirdCardName } from '@common/cards/BirdCardName';

// Import all bird images
import AMERICAN_ROBIN from '../assets/birds/AMERICAN_ROBIN.webp';
import BARN_SWALLOW from '../assets/birds/BARN_SWALLOW.webp';
import BLUE_JAY from '../assets/birds/BLUE_JAY.webp';
import CANADA_GOOSE from '../assets/birds/CANADA_GOOSE.webp';
import CEDAR_WAXWING from '../assets/birds/CEDAR_WAXWING.webp';
import CHIMNEY_SWIFT from '../assets/birds/CHIMNEY_SWIFT.webp';
import COMMON_RAVEN from '../assets/birds/COMMON_RAVEN.webp';
import DARK_EYED_JUNCO from '../assets/birds/DARK_EYED_JUNCO.webp';
import EASTERN_BLUEBIRD from '../assets/birds/EASTERN_BLUEBIRD.webp';
import EASTERN_PHOEBE from '../assets/birds/EASTERN_PHOEBE.webp';
import EUROPEAN_STARLING from '../assets/birds/EUROPEAN_STARLING.webp';
import GREAT_BLUE_HERON from '../assets/birds/GREAT_BLUE_HERON.webp';
import HOUSE_FINCH from '../assets/birds/HOUSE_FINCH.webp';
import KILLDEER from '../assets/birds/KILLDEER.webp';
import MALLARD from '../assets/birds/MALLARD.webp';
import MOURNING_DOVE from '../assets/birds/MOURNING_DOVE.webp';
import NORTHERN_CARDINAL from '../assets/birds/NORTHERN_CARDINAL.webp';
import OSPREY from '../assets/birds/OSPREY.webp';
import RED_TAILED_HAWK from '../assets/birds/RED_TAILED_HAWK.webp';
import RUBY_THROATED_HUMMINGBIRD from '../assets/birds/RUBY_THROATED_HUMMINGBIRD.webp';

const BIRD_IMAGES: Record<string, string> = {
  [BirdCardName.AMERICAN_ROBIN]: AMERICAN_ROBIN,
  [BirdCardName.BARN_SWALLOW]: BARN_SWALLOW,
  [BirdCardName.BLUE_JAY]: BLUE_JAY,
  [BirdCardName.CANADA_GOOSE]: CANADA_GOOSE,
  [BirdCardName.CEDAR_WAXWING]: CEDAR_WAXWING,
  [BirdCardName.CHIMNEY_SWIFT]: CHIMNEY_SWIFT,
  [BirdCardName.COMMON_RAVEN]: COMMON_RAVEN,
  [BirdCardName.DARK_EYED_JUNCO]: DARK_EYED_JUNCO,
  [BirdCardName.EASTERN_BLUEBIRD]: EASTERN_BLUEBIRD,
  [BirdCardName.EASTERN_PHOEBE]: EASTERN_PHOEBE,
  [BirdCardName.EUROPEAN_STARLING]: EUROPEAN_STARLING,
  [BirdCardName.GREAT_BLUE_HERON]: GREAT_BLUE_HERON,
  [BirdCardName.HOUSE_FINCH]: HOUSE_FINCH,
  [BirdCardName.KILLDEER]: KILLDEER,
  [BirdCardName.MALLARD]: MALLARD,
  [BirdCardName.MOURNING_DOVE]: MOURNING_DOVE,
  [BirdCardName.NORTHERN_CARDINAL]: NORTHERN_CARDINAL,
  [BirdCardName.OSPREY]: OSPREY,
  [BirdCardName.RED_TAILED_HAWK]: RED_TAILED_HAWK,
  [BirdCardName.RUBY_THROATED_HUMMINGBIRD]: RUBY_THROATED_HUMMINGBIRD,
};

export function getBirdImage(name: string): string | undefined {
  return BIRD_IMAGES[name];
}
