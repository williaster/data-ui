const DEFAULT_LABEL_OFFSET = 8;

export default function positionLabel(orientation, labelOffset = DEFAULT_LABEL_OFFSET) {
  if (orientation === 'top') {
    return { textAnchor: 'middle', dy: -Math.abs(labelOffset), dx: 0 };
  } else if (orientation === 'right') {
    return { textAnchor: 'start', dy: 0, dx: Math.abs(labelOffset) };
  } else if (orientation === 'bottom') {
    return { textAnchor: 'middle', dy: Math.abs(labelOffset), dx: 0 };
  } else if (orientation === 'left') {
    return { textAnchor: 'end', dy: 0, dx: -Math.abs(labelOffset) };
  }

  return orientation;
}
