import * as fs from 'fs';
import * as path from 'path';

type Position = [number, number];

const input = fs.readFileSync('./src/day-9.input', 'utf8');
const positions = input
  .split('\n')
  .filter(l => l).map(line => {
    const position = line.split(',').map(n => Number(n));
    return [position[1], position[0]] as Position;
  });
  
function calculate_area(rect: [Position, Position]) {
  let [p1, p2] = rect;
  const height = Math.abs(p1[0] - p2[0]) + 1;
  const width = Math.abs(p1[1] - p2[1]) + 1;
  return height * width;
}

function find_pairs(positions: Position[]): [Position, Position][] {
  let pairs: [Position, Position][] = [];
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      pairs.push([positions[i]!, positions[j]!]);
    }
  }

  return pairs;
}

{


  const part1 = find_pairs(positions)
    .map(x => calculate_area(x))
    .sort((a, b) => b - a)[0];

  console.log(`Part 1: ${part1}`);
}

function part2() {
  const pairs = find_pairs(positions)
    .map(x => ({ pair: x, area: calculate_area(x) }))
    .sort((a, b) => b.area - a.area);


  for (const pair of pairs) {
    if (!is_rect_inside_polygon(pair.pair))
      continue;

    console.log(`Part2: ${pair!.area}`);
    console.log(`Part2: ${pair!.pair}`);
    break;
  }

  function get_polygon_border(): [Position, Position][] {
    let borders: [Position, Position][] = [];
    for (const i in positions) {
      let next = positions[(Number(i) + 1) % positions.length]!;
      let pos = positions[i]!;

      borders.push([pos, next]);
    }

    return borders;
  }

  function is_point_inside_rect(p: Position, rect: [Position, Position]) {
    let [y_min, y_max] = rect.map(p => p[0]).sort((a, b) => a - b) as [number, number];
    let [x_min, x_max] = rect.map(p => p[1]).sort((a, b) => a - b) as [number, number];

    let [y, x] = p;

    return y_min < y && y_max > y && x_min < x && x_max > x;
  }

  function is_rect_inside_polygon(rect: [Position, Position]) {
    let rect_sides = rect_to_lines(rect);
    let borders = get_polygon_border();

    for (const border of borders) {
      let [p1, p2] = border;

      if (is_point_inside_rect(p1, rect))
        return false;

      if (is_point_inside_rect(p2, rect))
        return false;

      for (const side of rect_sides) {
        if (lines_intersect(side, border))
          return false;
      }
    }

    return true;
  }

  function rect_to_lines(rect: [Position, Position]): [Position, Position][] {
    let [y_min, y_max] = rect.map(p => p[0]).sort((a, b) => a - b) as [number, number];
    let [x_min, x_max] = rect.map(p => p[1]).sort((a, b) => a - b) as [number, number];

    return [
      [[y_min, x_min], [y_min, x_max]],  // Top horizontal
      [[y_max, x_min], [y_max, x_max]],  // Bottom horizontal
      [[y_min, x_min], [y_max, x_min]],  // Left vertical
      [[y_min, x_max], [y_max, x_max]],  // Right vertical
    ];
  }

  function lines_intersect(i: [Position, Position], j: [Position, Position]): boolean {
    let [i1, i2] = i;
    let [i1y, i1x] = i1;
    let [i2y, i2x] = i2;

    let [j1, j2] = j;
    let [j1y, j1x] = j1;
    let [j2y, j2x] = j2;

    
    let [a, b, c, d, p, q, r, s] = [i1y, i1x, i2y, i2x, j1y, j1x, j2y, j2x];

    const det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      return false;
    } else {
      const lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      const gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
  };
}


part2();
