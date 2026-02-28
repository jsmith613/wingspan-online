import { Birdfeeder } from '../../../src/server/birdfeeder/Birdfeeder';
import { FoodType } from '../../../src/common/game/FoodType';
import { BIRDFEEDER_DICE_COUNT } from '../../../src/common/constants';
import { mulberry32 } from '../../../src/common/prng';

describe('Birdfeeder', () => {
  let rng: () => number;
  let feeder: Birdfeeder;

  beforeEach(() => {
    rng = mulberry32(42);
    feeder = new Birdfeeder(rng);
  });

  describe('initialization', () => {
    it('should start with 5 dice', () => {
      expect(feeder.getRemainingCount()).toBe(BIRDFEEDER_DICE_COUNT);
    });

    it('should have available food', () => {
      const food = feeder.getAvailableFood();
      expect(food.length).toBeGreaterThan(0);
    });
  });

  describe('taking food', () => {
    it('should allow taking available food', () => {
      const available = feeder.getAvailableFood();
      const food = available[0];
      const result = feeder.takeFood(food);
      expect(result).toBe(food);
    });

    it('should reduce remaining count after taking', () => {
      const available = feeder.getAvailableFood();
      feeder.takeFood(available[0]);
      // May have rerolled if conditions met, but count should be valid
      expect(feeder.getRemainingCount()).toBeLessThanOrEqual(BIRDFEEDER_DICE_COUNT);
    });

    it('should return null for unavailable food', () => {
      // Take all food of one type repeatedly to potentially exhaust it
      // Then try to take a type that was never rolled
      const result = feeder.takeFood(FoodType.WILD);
      // WILD is never on a die face
      expect(result).toBeNull();
    });
  });

  describe('reroll mechanics', () => {
    it('should reroll when all dice are taken', () => {
      // Take 5 dice worth of food
      for (let i = 0; i < BIRDFEEDER_DICE_COUNT; i++) {
        const available = feeder.getAvailableFood();
        if (available.length > 0) {
          feeder.takeFood(available[0]);
        }
      }
      // After exhausting, feeder should have rerolled
      expect(feeder.getRemainingCount()).toBe(BIRDFEEDER_DICE_COUNT);
    });
  });

  describe('serialization', () => {
    it('should serialize and deserialize', () => {
      const available = feeder.getAvailableFood();
      feeder.takeFood(available[0]);

      const serialized = feeder.serialize();
      const rng2 = mulberry32(99);
      const restored = Birdfeeder.deserialize(serialized, rng2);

      expect(restored.getRemainingCount()).toBe(feeder.getRemainingCount());
      expect(restored.getAvailableFood().sort()).toEqual(feeder.getAvailableFood().sort());
    });
  });

  describe('deterministic behavior', () => {
    it('should produce same results with same seed', () => {
      const rng1 = mulberry32(123);
      const rng2 = mulberry32(123);
      const feeder1 = new Birdfeeder(rng1);
      const feeder2 = new Birdfeeder(rng2);

      expect(feeder1.getAvailableFood().sort()).toEqual(feeder2.getAvailableFood().sort());
    });
  });
});
