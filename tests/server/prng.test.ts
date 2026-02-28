import { mulberry32, shuffle } from '../../src/common/prng';

describe('mulberry32', () => {
  it('produces deterministic output for the same seed', () => {
    const rng1 = mulberry32(42);
    const rng2 = mulberry32(42);

    const values1 = Array.from({ length: 10 }, () => rng1());
    const values2 = Array.from({ length: 10 }, () => rng2());

    expect(values1).toEqual(values2);
  });

  it('produces values between 0 and 1', () => {
    const rng = mulberry32(12345);
    for (let i = 0; i < 1000; i++) {
      const val = rng();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });

  it('produces different sequences for different seeds', () => {
    const rng1 = mulberry32(1);
    const rng2 = mulberry32(2);

    const values1 = Array.from({ length: 5 }, () => rng1());
    const values2 = Array.from({ length: 5 }, () => rng2());

    expect(values1).not.toEqual(values2);
  });
});

describe('shuffle', () => {
  it('shuffles deterministically with same seed', () => {
    const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    shuffle(arr1, mulberry32(42));
    shuffle(arr2, mulberry32(42));

    expect(arr1).toEqual(arr2);
  });

  it('contains all original elements', () => {
    const arr = [1, 2, 3, 4, 5];
    shuffle(arr, mulberry32(99));

    expect(arr.sort()).toEqual([1, 2, 3, 4, 5]);
  });
});
