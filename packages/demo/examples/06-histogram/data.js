import { range } from 'd3-array';
import { randomNormal, randomLogNormal } from 'd3-random';
import mockData from '@vx/mock-data';

const { letterFrequency } = mockData;

// raw data -------------------------------------------------------------------
function intBetween(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const n = 500;

export const mus = [0, 5, 10];
export const stddevs = [0.01, 0.5, 0.1];
export const normal = {};
export const logNormal = {};

mus.forEach((mu) => {
  normal[mu] = [];
  logNormal[mu] = [];

  stddevs.forEach((std) => {
    const normalGen = randomNormal(mu, std);
    const logNormalGen = randomLogNormal(mu, std);
    normal[mu].push(range(n).map(normalGen));
    logNormal[mu].push(range(n).map(logNormalGen));
  });
});

// randomly sample from the letters above
const letters = 'abcdefghijklmnopqrstuvwxyz';
export const categorical = range(n).map(() => letters[intBetween(0, letters.length - 1)]);

// binned data ----------------------------------------------------------------
export const binnedCategorical = letterFrequency.map(({ letter, frequency }) => ({
  bin: letter,
  count: Math.floor(10000 * frequency),
  id: letter,
}));

export const binnedNumeric = range(15).map(i => ({
  bin0: i,
  bin1: i + 1,
  count: intBetween(2, 200),
  id: String(i),
}));
