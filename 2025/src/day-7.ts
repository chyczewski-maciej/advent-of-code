import * as fs from 'fs';

const input = fs.readFileSync('./src/day-7.input', 'utf8');

function display(state: string[][]) {
  for (const line of state) {
    console.log(line.join(""));
  }
}

{
  const lines = input.split('\n').filter(l => l).map(l => [...l]);

  let splits = 0;
  for (let i = 1; i < lines.length; i++) {
    let line = lines[i]!;
    let prev = lines[i - 1]!;

    for (let p = 0; p < line.length; p++) {
      if (prev[p] == 'S')
        line[p] = '|';

      if (prev[p] == '|' && line[p] == '^') {
        splits++;
        if (p - 1 >= 0)
          line[p - 1] = '|';

        if (p + 1 < line.length)
          line[p + 1] = '|';
      }

      if (prev[p] == '|' && line[p] == '.')
        line[p] = '|'

    }
  }

  //display(lines);
  console.log(`Part 1: ${splits}`)
}

// Part 2 
{
  const cache: { [id: string]: number } = {};
  const lines = input.split('\n').filter(l => l).map(l => [...l]);
  const initialPath = lines[0]!.indexOf("S");

  const answer = count_branches(lines, initialPath, 1);
  console.log(`Part 2: ${answer}`);

  function count_branches(lines: string[][], path: number, step: number): number {
    if (step >= lines.length)
      return 1;

    const cache_key = `${path},${step}`;
    const cache_value = cache[cache_key];
    if (cache_value !== undefined)
      return cache_value;

    const line = lines[step]!;
    let c = line![path];
    let count = 0;

    if (c == '.')
      count += count_branches(lines, path, ++step);


    if (c == '^')
      if (path - 1 >= 0)
        count += count_branches(lines, path - 1, ++step);

    if (c == '^')
      if (path + 1 < line.length)
        count += count_branches(lines, path + 1, ++step);

    //console.log(`Step: ${step} Path: ${path} Count: ${count}`);

    cache[cache_key] = count;
    return count;
  }
}
