import { extent as d3Extent } from 'd3-array';
import caseInsensitiveSort from './caseInsensitiveSort';

/*
 * Computes the bin and value domains from numeric or categorical bins
 */
export default function computeDomainsFromBins({ binsByIndex, binType, valueKey, binValues }) {
  let binDomain = binValues;
  let valueDomain;

  Object.values(binsByIndex).forEach((bins) => {
    const currValueDomain = d3Extent(bins, d => d[valueKey]);
    if (!valueDomain) {
      valueDomain = currValueDomain;
    } else {
      valueDomain[0] = Math.min(currValueDomain[0], valueDomain[0]);
      valueDomain[1] = Math.max(currValueDomain[1], valueDomain[1]);
    }

    if (binType === 'numeric' && !binValues) {
      if (!binDomain) {
        binDomain = [bins[0].bin0, bins[bins.length - 1].bin1];
      } else {
        binDomain[0] = Math.min(bins[0].bin0, binDomain[0]);
        binDomain[1] = Math.max(bins[bins.length - 1].bin1, binDomain[1]);
      }
    } else if (!binValues) {
      if (!binDomain) binDomain = {}; // use lookup to avoid lots of Array scans
      bins.forEach((bin) => { binDomain[bin.bin] = true; });
    }
  });

  if (!Array.isArray(binDomain)) {
    binDomain = Object.values(binDomain).sort(caseInsensitiveSort);
  }

  return { binDomain, valueDomain };
}
