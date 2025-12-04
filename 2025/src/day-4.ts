import * as fs from 'fs';

const input = fs.readFileSync('./src/day-4.input', 'utf8');
const map = input.split('\n').map(row => [...row]) as string[][];
//const locations = map
//  .flatMap((row: string, y: number) => [...row]
//    .flatMap((i, x: number) => i == '@' ? [{ x, y }] : []));

//console.log(JSON.stringify(locations));

function* iterate_map() {
  for (const _y in map) {
    const y = Number(_y);
    for (const _x in map[y]) {
      const x = Number(_x);

      const value: string = map[y][x]!;
      yield { x, y, value };
    }
  }
}

function get_map_entries() {
  return [...iterate_map()];

}

function* find_adjacent(x: number, y: number) {
  for (const e of iterate_map()) {
    if (Math.abs(y - e.y) <= 1 && Math.abs(x - e.x) <= 1)
      if (e.x != x || e.y != y)
        yield e;
  }
}

function isRemovableRoll(e: { x: number, y: number, value: string }) {
  return e.value == '@' && [...find_adjacent(e.x, e.y)].filter(e => e.value == '@').length < 4;
}

// Part 1 
{
  const part1Answer = get_map_entries()
    .filter(e => isRemovableRoll(e))
    //.filter(e => e.value === '@')
    //.filter(e => [...find_adjacent(map, e.x, e.y)].filter(e => e.value == '@').length < 4)
    .length;

  //console.log(JSON.stringify(part1Answer, null, 2));
  console.log(`Part 1: ${part1Answer}`);
}

{
  const rolls_count_before = get_map_entries().filter(e => e.value == '@').length;
  while (true) {
    const removableRolls = get_map_entries().filter(isRemovableRoll)
    if (removableRolls.length == 0)
      break;
    for (const r of removableRolls) {
      map[r.y]![r.x] = 'x';
    }
  }

  const rolls_count_after = get_map_entries().filter(e => e.value == '@').length;
  console.log(`Part 2: ${rolls_count_before - rolls_count_after}`);
}
