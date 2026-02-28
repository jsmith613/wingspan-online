import { Player } from '../../src/server/Player';
import { FoodType } from '../../src/common/game/FoodType';
import { HabitatType } from '../../src/common/game/HabitatType';
import { BirdCardName } from '../../src/common/cards/BirdCardName';
import { FoodCost } from '../../src/common/Units';
import { PlayerId } from '../../src/common/Types';
import { createTestPlayer, giveFood, giveCards } from './helpers/TestPlayer';

describe('Player', () => {
  let player: Player;

  beforeEach(() => {
    player = createTestPlayer('Alice', 8);
  });

  describe('food management', () => {
    it('should add and count food', () => {
      player.addFood(FoodType.SEED);
      player.addFood(FoodType.SEED);
      player.addFood(FoodType.FISH);
      expect(player.getFoodCount(FoodType.SEED)).toBe(2);
      expect(player.getFoodCount(FoodType.FISH)).toBe(1);
      expect(player.getFoodCount(FoodType.FRUIT)).toBe(0);
    });

    it('should remove food', () => {
      player.addFood(FoodType.SEED);
      expect(player.removeFood(FoodType.SEED)).toBe(true);
      expect(player.getFoodCount(FoodType.SEED)).toBe(0);
    });

    it('should return false when removing food not in supply', () => {
      expect(player.removeFood(FoodType.RODENT)).toBe(false);
    });
  });

  describe('hand management', () => {
    it('should add and remove cards', () => {
      player.addCardToHand(BirdCardName.AMERICAN_ROBIN);
      expect(player.hand).toHaveLength(1);
      expect(player.removeCardFromHand(BirdCardName.AMERICAN_ROBIN)).toBe(true);
      expect(player.hand).toHaveLength(0);
    });

    it('should return false when removing card not in hand', () => {
      expect(player.removeCardFromHand(BirdCardName.BLUE_JAY)).toBe(false);
    });
  });

  describe('cost validation', () => {
    it('should validate specific food costs', () => {
      giveFood(player, [FoodType.SEED, FoodType.FISH]);
      const cost: FoodCost = {
        foods: [FoodType.SEED],
        totalRequired: 1,
        wildCount: 0,
      };
      expect(player.canAffordFoodCost(cost)).toBe(true);
    });

    it('should reject unaffordable food costs', () => {
      giveFood(player, [FoodType.SEED]);
      const cost: FoodCost = {
        foods: [FoodType.FISH],
        totalRequired: 1,
        wildCount: 0,
      };
      expect(player.canAffordFoodCost(cost)).toBe(false);
    });

    it('should handle wild food costs', () => {
      giveFood(player, [FoodType.SEED, FoodType.FISH]);
      const cost: FoodCost = {
        foods: [],
        totalRequired: 1,
        wildCount: 1,
      };
      expect(player.canAffordFoodCost(cost)).toBe(true);
    });

    it('should validate combined specific and wild costs', () => {
      giveFood(player, [FoodType.SEED, FoodType.FISH, FoodType.FRUIT]);
      const cost: FoodCost = {
        foods: [FoodType.SEED],
        totalRequired: 2,
        wildCount: 1,
      };
      expect(player.canAffordFoodCost(cost)).toBe(true);
    });

    it('should reject wild costs when not enough food remains after specific', () => {
      giveFood(player, [FoodType.SEED]);
      const cost: FoodCost = {
        foods: [FoodType.SEED],
        totalRequired: 2,
        wildCount: 1,
      };
      expect(player.canAffordFoodCost(cost)).toBe(false);
    });
  });

  describe('egg costs', () => {
    it('should report correct egg cost by column', () => {
      // Column 0 = 0 eggs
      expect(player.getEggCostForHabitat(HabitatType.FOREST)).toBe(0);
    });

    it('should report Infinity for a full habitat', () => {
      // Fill forest entirely
      for (let i = 0; i < 5; i++) {
        player.board.placeBird(HabitatType.FOREST, {
          name: `bird_${i}`,
          eggs: 0,
          cachedFood: 0,
          tuckedCards: 0,
        });
      }
      expect(player.getEggCostForHabitat(HabitatType.FOREST)).toBe(Infinity);
    });

    it('should validate egg affordability', () => {
      expect(player.canAffordEggCost(0)).toBe(true);
      expect(player.canAffordEggCost(1)).toBe(false);

      // Place a bird with 2 eggs
      player.board.placeBird(HabitatType.FOREST, {
        name: 'test_bird',
        eggs: 2,
        cachedFood: 0,
        tuckedCards: 0,
      });
      expect(player.canAffordEggCost(2)).toBe(true);
      expect(player.canAffordEggCost(3)).toBe(false);
    });
  });

  describe('action cubes', () => {
    it('should use action cubes', () => {
      expect(player.useActionCube()).toBe(true);
      expect(player.actionCubes).toBe(7);
    });

    it('should return false when no cubes remain', () => {
      player.actionCubes = 0;
      expect(player.useActionCube()).toBe(false);
    });
  });

  describe('scoring', () => {
    it('should count eggs in score', () => {
      player.board.placeBird(HabitatType.FOREST, {
        name: 'test', eggs: 3, cachedFood: 0, tuckedCards: 0,
      });
      expect(player.calculateScore()).toBe(3);
    });

    it('should count cached food in score', () => {
      player.board.placeBird(HabitatType.FOREST, {
        name: 'test', eggs: 0, cachedFood: 2, tuckedCards: 0,
      });
      expect(player.calculateScore()).toBe(2);
    });

    it('should count tucked cards in score', () => {
      player.board.placeBird(HabitatType.FOREST, {
        name: 'test', eggs: 0, cachedFood: 0, tuckedCards: 4,
      });
      expect(player.calculateScore()).toBe(4);
    });

    it('should sum all scoring categories', () => {
      player.board.placeBird(HabitatType.FOREST, {
        name: 'test', eggs: 2, cachedFood: 1, tuckedCards: 3,
      });
      player.roundGoalPoints = [4, 2];
      expect(player.calculateScore()).toBe(2 + 1 + 3 + 4 + 2);
    });
  });

  describe('serialization', () => {
    it('should serialize and deserialize', () => {
      giveFood(player, [FoodType.SEED, FoodType.FISH]);
      giveCards(player, [BirdCardName.AMERICAN_ROBIN, BirdCardName.BLUE_JAY]);
      player.board.placeBird(HabitatType.FOREST, {
        name: 'test_bird', eggs: 1, cachedFood: 0, tuckedCards: 0,
      });
      player.roundGoalPoints = [3];

      const serialized = player.serialize();
      const restored = Player.deserialize(serialized);

      expect(restored.id).toBe(player.id);
      expect(restored.name).toBe(player.name);
      expect(restored.food).toEqual(player.food);
      expect(restored.hand).toEqual(player.hand);
      expect(restored.board.getBirdCount(HabitatType.FOREST)).toBe(1);
      expect(restored.roundGoalPoints).toEqual([3]);
    });
  });
});
