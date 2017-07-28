import { range } from 'd3-array';
import { randomNormal, randomLogNormal } from 'd3-random';

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
