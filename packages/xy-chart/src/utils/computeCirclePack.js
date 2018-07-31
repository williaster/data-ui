/* eslint no-param-reassign: 0 */
/**
 * The algorthm is an implementation of the paper
 *   Wang et al. Visualization of large hierarchical data by circle packing.
 * by adding horizontal constrains for each circle.
 * Assume that the position of x and the size of circles have been scaled.
 * And each circle has the following properties:
 *  x: the position of x,
 *  size: the radius,
 */
const DEFAULT_POINT_SIZE = 4;
function packCircles(data, xScale, getSize = d => d.size || DEFAULT_POINT_SIZE) {
  const packBounds = [];
  const packOutline = [];
  const globalMinX = xScale(data[0].x);
  const globalMaxX = xScale(data[data.length - 1].x);
  const rect = {
    xMin: 0,
    yMin: 0,
    xMax: 0,
    yMax: 0,
  };

  const outline = {
    up: [],
    down: [],
  };

  function bound(node, bd) {
    bd.xMin = Math.min(node.px - node.r, bd.xMin);
    bd.xMax = Math.max(node.px + node.r, bd.xMax);
    bd.yMin = Math.min(node.py - node.r, bd.yMin);
    bd.yMax = Math.max(node.py + node.r, bd.yMax);
  }

  function outside(node, bd) {
    return node.x + node.r < bd.xMin || node.x - node.r > bd.xMax;
  }

  function xpackBestPlace(startn, node) {
    const goodnodes = [];
    for (let p = startn.nextPack; p !== startn; p = p.nextPack) {
      if (
        !(
          p.px + p.r < node.x - node.r ||
          p.px - p.r > node.x + node.r ||
          p.px - p.r - node.r < globalMinX ||
          p.px + p.r + node.r > globalMaxX
        )
      ) {
        goodnodes.push(p);
      }
    }

    if (goodnodes.length === 0) {
      return startn;
    }
    goodnodes.sort((a, b) => Math.abs(a.py) - Math.abs(b.py));

    return goodnodes[0];
  }

  function xpackInsert(a, b) {
    const c = a.nextPack;
    a.nextPack = b;
    b.prevPack = a;
    b.nextPack = c;
    c.prevPack = b;
  }

  function xpackPlace(a, b, c) {
    let db = a.r + c.r;
    const dx = b.px - a.px;
    const dy = b.py - a.py;
    if (db && (dx || dy)) {
      let da = b.r + c.r;
      const dc = dx * dx + dy * dy;
      da *= da;
      db *= db;
      const x = 0.5 + (db - da) / (2 * dc); // eslint-disable-line no-magic-numbers
      const y = Math.sqrt(Math.max(0, 2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc);
      c.px = a.px + x * dx + y * dy;
      c.py = a.py + x * dy - y * dx;
    } else {
      c.px = a.px + db;
      c.py = a.py;
    }
  }

  function xpackIntersects(a, b) {
    const dx = b.px - a.px;
    const dy = b.py - a.py;
    const dr = a.r + b.r;

    return 0.999 * dr * dr > dx * dx + dy * dy; // eslint-disable-line no-magic-numbers
  }

  function xpackSplice(a, b) {
    a.nextPack = b;
    b.prevPack = a;
  }

  function xpackLink(node) {
    node.nextPack = node;
    node.prevPack = node;
  }

  function packNodes(nodes, start, n) {
    const bd = packBounds[n];
    let a;
    let b;
    let c;
    let i;
    let j;
    let k;

    if (nodes.length - start >= 1) {
      // the first node
      a = nodes[start];
      a.px = a.x;
      a.py = 0;
      bound(a, bd);

      if (nodes.length - start >= 2) {
        // the second node
        if (outside(nodes[start + 1], bd)) {
          return start + 1;
        }

        b = nodes[start + 1];
        b.px = a.x + a.r + b.r;
        b.py = 0;
        bound(b, bd);

        xpackInsert(a, b);

        if (nodes.length - start >= 3) {
          // the third node
          if (outside(nodes[start + 2], bd)) {
            return start + 2;
          }

          c = nodes[start + 2];
          xpackPlace(a, b, c);
          bound(c, bd);

          xpackInsert(a, c);

          // iterate through the rest
          let preiter = false;
          for (i = start + 3; i < nodes.length; i += 1) {
            if (!preiter) {
              if (outside(nodes[i], bd)) {
                return i;
              }
              a = xpackBestPlace(a, nodes[i]);
              b = a.nextPack;
            }

            xpackPlace(a, b, (c = nodes[i]));
            // search for the closest intersection
            let isect = 0;
            let s1 = 1;
            let s2 = 1;
            for (j = b.nextPack; j !== b; j = j.nextPack, s1 += 1) {
              if (xpackIntersects(j, c)) {
                isect = 1;
                break;
              }
            }
            if (isect === 1) {
              for (k = a.prevPack; k !== j.prevPack; k = k.prevPack, s2 += 1) {
                if (xpackIntersects(k, c)) {
                  break;
                }
              }
            }
            // update front chain
            if (isect) {
              if (s1 < s2 || (s1 === s2 && b.r < a.r)) {
                xpackSplice(a, (b = j));
              } else {
                xpackSplice((a = k), b);
              }
              i -= 1;
              preiter = true;
            } else {
              xpackInsert(a, c);
              b = c;
              bound(c, bd);
              preiter = false;
            }
          }
        }
      }
    }

    return nodes.length;
  }

  if (data.length === 0) {
    return data;
  }

  const nodes = [];
  data.forEach(node => {
    nodes.push({ ...node, x: xScale(node.x), r: getSize(node) });
  });

  for (let i = 0; i < nodes.length; i += 1) {
    xpackLink(nodes[i]);
  }

  let i = 0;
  let n = 0;
  while (i < nodes.length) {
    packBounds.push({
      xMin: Infinity,
      yMin: Infinity,
      xMax: -Infinity,
      yMax: -Infinity,
    });

    // pack this nodes group
    i = packNodes(nodes, i, n);

    // get the packing outline
    packOutline.push(nodes[i - 1]);
    for (let p = nodes[i - 1].nextPack; p !== nodes[i - 1]; p = p.nextPack) {
      packOutline.push(p);
    }
    n += 1;
  }

  rect.xMin = Infinity;
  rect.xMax = -Infinity;
  rect.yMin = Infinity;
  rect.yMax = -Infinity;
  packBounds.forEach(bd => {
    rect.xMin = Math.min(rect.xMin, bd.xMin);
    rect.xMax = Math.max(rect.xMax, bd.xMax);
    rect.yMin = Math.min(rect.yMin, bd.yMin);
    rect.yMax = Math.max(rect.yMax, bd.yMax);
  });

  // compute the global outline
  packOutline.sort((a, b) => a.px - b.px);
  packOutline.forEach(p => {
    if (p.py < 0) {
      outline.up.push(p);
    } else if (p.py > 0) {
      outline.down.push(p);
    } else {
      outline.up.push(p);
      outline.down.push(p);
    }
  });

  return nodes;
}

export default function computeCirclePack(data, xScale, getSize) {
  const sorted = data.sort((a, b) => a.x - b.x);
  const calculatedNodes = packCircles(data, xScale, getSize);
  const result = [];
  for (let i = 0; i < calculatedNodes.length; i += 1) {
    result.push({
      ...sorted[i],
      x: xScale.invert(calculatedNodes[i].px),
      y: calculatedNodes[i].py,
    });
  }

  return result;
}
