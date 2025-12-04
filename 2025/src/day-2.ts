import * as fs from 'fs';

function isRepeated(x: number, times: number) {
  const str = x.toString();
  if (str.length % times != 0)
    return false;

  const sub_length = str.length / times;
  const sub = str.substring(0, sub_length);

  const repeated = sub.repeat(str.length / sub_length);

  return str == repeated;
}

const input = fs.readFileSync('./src/day-2.input', 'utf8');
const ranges = input.split(',').map(l => [Number(l.split('-')[0]), Number(l.split('-')[1])]) as [number, number][];

{
  let repeatingNumbers = new Set<number>();
  for (const [from, to] of ranges) {
    for (let i: number = from; i <= to; i++) {
      if (isRepeated(i, 2)) {
        console.log(`${i}`)
        repeatingNumbers.add(i);
      }
    }
  }

  const sum = [...repeatingNumbers].reduce((acc, x) => acc + x, 0);
  console.log(`Part 1: ${sum}`)
}

{
  let repeatingNumbers = new Set<number>();
  for (const [from, to] of ranges) {
    for (let i: number = from; i <= to; i++) {
      for(let b: number = 2; b <= i.toString().length; b++){
        if (isRepeated(i, b)) {
          repeatingNumbers.add(i);
        }
      }
    }
  }

  const sum = [...repeatingNumbers].reduce((acc, x) => acc + x, 0);
  console.log(`Part 2: ${sum}`)
}
