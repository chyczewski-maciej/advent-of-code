import * as fs from 'fs';

const input = fs.readFileSync('./src/day-5.input', 'utf8');
const [fresh, available] = input.split('\n\n') as [string, string];
let fresh_ranges = fresh.split('\n').map(x => [Number(x.split('-')[0]), Number(x.split('-')[1])]) as [number, number][];
const available_ingredients = available.split('\n').map(i => Number(i));

{
  const available_fresh_ingredients_count =
    available_ingredients
      .filter(i => fresh_ranges.some(([from, to]) => from <= i && to >= i))
      .length;

  console.log(`Part 1: ${available_fresh_ingredients_count}`);
}


{
  let count = 0;
  let max_seen = 0;
  fresh_ranges = fresh_ranges.sort((a, b) => a[0] - b[0]);
  for (const [min, max] of fresh_ranges) {
    const from = Math.max(min, max_seen + 1);
    const c = max - from + 1;
    console.log(`From: ${from} to ${max} c: ${c}`);

    if (c > 0)
      count += c;
    max_seen = Math.max(max_seen, max);
  }

  console.log(`Part 2: ${count}`);
}
