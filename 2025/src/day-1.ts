import * as fs from 'fs';

const input = fs.readFileSync('./src/day-1.input', 'utf8');
const partOneAnswer =
  input
    .split('\n')
    .map(l => l.replace('L', '-').replace('R', ''))
    .filter(l => !!l.trim())
    .map(l => parseInt(l))
    .reduce((acc, n) => {
      const newPosition = (((acc.dialPosition + n) % 100) + 100) % 100;
      return { dialPosition: newPosition, count: newPosition == 0 ? acc.count + 1 : acc.count };
    }, { dialPosition: 50, count: 0 });

console.log(`Part one: ${partOneAnswer.count}`);

const partTwoAnswer = input
  .split('\n')
  .map(l => l.replace('L', '-').replace('R', ''))
  .filter(l => !!l.trim())
  .map(l => parseInt(l))
  .reduce((acc, n) => {
    let newPosition = acc.dialPosition;
    let count = 0;

    while (n != 0) {
      let change = n / Math.abs(n);
      n -= change;
      newPosition += change;
      newPosition = newPosition % 100;

      if (newPosition == 0)
        count++;
    }

    return { dialPosition: newPosition, count: acc.count + count };
  }, { dialPosition: 50, count: 0 })

console.log(`Part two: ${partTwoAnswer.count}`);
