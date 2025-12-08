import { privateEncrypt } from 'crypto';
import * as fs from 'fs';

type Position = [number, number, number];


const input = fs.readFileSync('./src/day-8.input', 'utf8');
const positions = input
  .split('\n')
  .filter(l => l)
  .map(line => {
    const position = line.split(',').map(n => Number(n));
    return position as Position;
  });

function distance(p1: Position, p2: Position) {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2) + Math.pow(p1[2] - p2[2], 2))
}

function find_closest(p1: Position): Position {
  return positions
    .filter(p2 => distance(p1, p2) != 0)
    .sort((a, b) => distance(a, p1) - distance(b, p1))[0]!;
}

function find_closest_pairs(): [Position, Position][] {

  let pairs: [Position, Position][] = [];
  for (let i = 0; i < positions.length - 1; i++) {
    for (let j = i + 1; j < positions.length; j++)
      pairs.push([positions[i]!, positions[j]!]);
  }

  pairs.sort((a, b) => distance(...a) - distance(...b));

  return pairs;
}

{

  let circuits: Position[][] = [];

  function find_circuit(p: Position) {
    return circuits.find(c => c.includes(p));
  }

  for (const p of positions)
    circuits.push([p]);

  for (const pair of find_closest_pairs().slice(0, 1000)) {
    let c1 = find_circuit(pair[0]);
    let c2 = find_circuit(pair[1]);
    if (c1 && c2 && c1 == c2) {
      continue;
    }

    if (!c1 && !c2) {
      circuits.push([...pair]);
    }

    if (c1 && c2) {
      circuits = [...circuits.filter(c => c != c1 && c != c2), [...c1, ...c2]];
    }

    if (c1 && !c2)
      c1.push(pair[1]);

    if (c2 && !c1)
      c2.push(pair[0]);

  }

  const part1 = circuits.map(c => c.length).sort((a, b) => b - a).slice(0, 3).reduce((acc, n) => acc * n, 1);
  console.log(`Part 1: ${part1}`);
}


// Part 2
{
  let circuits: Position[][] = [];

  function find_circuit(p: Position) {
    return circuits.find(c => c.includes(p));
  }

  for (const p of positions)
    circuits.push([p]);

  for (const pair of find_closest_pairs()) {
    let c1 = find_circuit(pair[0]);
    let c2 = find_circuit(pair[1]);
    if (c1 && c2 && c1 == c2)
      continue;

    if (!c1 && !c2) {
      circuits.push([...pair]);
    }

    if (c1 && c2) {
      if (circuits.length == 2) {
        console.log(`Part 2: ${pair[0][0]} x ${pair[1][0]} = ${pair[0][0] * pair[1][0]}`)
        break;
      }


      circuits = [...circuits.filter(c => c != c1 && c != c2), [...c1, ...c2]];
    }

    if (c1 && !c2)
      c1.push(pair[1]);

    if (c2 && !c1)
      c2.push(pair[0]);
  }
}
