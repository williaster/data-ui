/* eslint import/prefer-default-export: 0 */
import { scaleOrdinal } from '@vx/scale';
import { allColors, grayColors } from '@data-ui/theme/build/color';

export function fillScaleFactory(color) {
  return scaleOrdinal({ range: [...(allColors[color] || grayColors)].reverse() });
}
