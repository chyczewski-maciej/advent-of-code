import * as fs from 'fs';
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


function part1() {
  type Configuration = { indicator: number, buttons: number[], joltage: number[] };

  function parse_manual(line: string): Configuration {
    let elements = line.split(' ');
    // Converts '[.#..]' -> '0100'
    let indicator_binary = [...elements[0]!.replace('[', '').replace(']', '').replaceAll('.', '0').replaceAll('#', '1')].reverse().join("");
    let indicator = parseInt(indicator_binary, 2);

    let buttons = elements.slice(1, elements.length - 1).map(b => parse_button(b));
    let joltage = elements[elements.length - 1]!.replace('{', '').replace('}', '').split(',').map(s => parseInt(s));

    return { indicator, buttons, joltage }
  }

  function parse_button(button: string): number {
    return button
      .replace('(', '')
      .replace(')', '')
      .split(',')
      .map(n => parseInt(n))
      .reduce((acc, n) => set_bit(acc, n, true), 0);

    function set_bit(x: number, bit: number, bit_value: boolean): number {
      if (bit < 0 || bit > 31)
        throw 'Cannot set bits outside 0-31 range';
      let b = 1 << bit;
      if (bit_value) {
        return x | b;
      }

      return x & ~b;
    }
  }

  function print_configuration(c: Configuration): string {
    let indicator = c.indicator.toString(2).padStart(10, '0').split('').reverse().join('').replaceAll('0', '.').replaceAll('1', '#');
    let buttons = c.buttons
      .map(b => [...b.toString(2)].reverse().map((v, i) => v === '1' ? i : null).filter(v => v !== null))
      .map(b => `(${b})`)
      .join(' ');
    let joltage = c.joltage.join(',');

    return `[${indicator}] ${buttons} {${joltage}}`;
  }

  function toggle_button(state: number, button: number): number {
    return state ^ button;

  }

  let min: number | undefined;
  // Can this be solved with dijkstra algorithm?
  function calc_min_button_clicks(c: Configuration, path: number[] = [0]): number | undefined {
    if (path.length == 1)
      min = undefined;
    return calc();

    function calc() {
      const state = path[path.length - 1]!;
      if (state == c.indicator)
        return path.length - 1;

      //let min = undefined;
      for (const button of c.buttons) {
        if (min != undefined && min <= path.length)
          continue;

        let new_state = toggle_button(state, button);
        //console.log(`Path: ${path}`)
        //let b_string = [...button.toString(2)].reverse().map((v, i) => v === '1' ? i : null).filter(v => v !== null);
        //console.log(`${b_string}: ${state.toString(2).padStart(6, '0').split('').reverse().join('')} -> ${new_state.toString(2).padStart(6, '0').split('').reverse().join('')}`)
        if (path.includes(new_state))
          continue;

        let clicks = calc_min_button_clicks(c, [...path, new_state]);
        if (clicks !== undefined) {
          if (min === undefined || clicks < min) {
            min = clicks;
            //console.log(`Min: ${min}`);
          }
        }
      }

      return min;
    }
  }


  const input = fs.readFileSync('./src/day-10.input', 'utf8');
  const manual = input
    .split('\n')
    .filter(l => l)
    .map(parse_manual);

  let total_count = 0;
  manual.forEach(m => {
    let count = calc_min_button_clicks(m);
    if (count == undefined)
      throw 'Failed to calculate count'
    total_count += count;
    console.log(`${print_configuration(m)} = ${count}`);
  });

  console.log(`Part 1: ${total_count}`);
}













async function part2() {
  type Configuration = { indicator: number, buttons: number[][], joltage: number[] };

  function parse_manual(line: string): Configuration {
    let elements = line.split(' ');
    // Converts '[.#..]' -> '0100'
    let indicator_binary = [...elements[0]!.replace('[', '').replace(']', '').replaceAll('.', '0').replaceAll('#', '1')].reverse().join("");
    let indicator = parseInt(indicator_binary, 2);

    let buttons = elements.slice(1, elements.length - 1).map(b => parse_button(b)).sort((a, b) => sum(b) - sum(a))
    let joltage = elements[elements.length - 1]!.replace('{', '').replace('}', '').split(',').map(s => parseInt(s));

    return { indicator, buttons, joltage }

    function sum(arr: number[]): number {
      return arr.reduce((acc, x) => acc + x, 0);
    }
    function parse_button(button: string): number[] {
      return button
        .replace('(', '')
        .replace(')', '')
        .split(',')
        .map(n => parseInt(n));
    }
  }

  function print_configuration(c: Configuration): string {
    let indicator = c.indicator.toString(2).padStart(10, '0').split('').reverse().join('').replaceAll('0', '.').replaceAll('1', '#');
    let buttons = c.buttons
      .map(b => b.join(','))
      .map(b => `(${b})`)
      .join(' ');
    let joltage = c.joltage.join(',');

    return `[${indicator}] ${buttons} {${joltage}}`;
  }

  // Dictionary that holds the map between state (joltages) and shortest path (buttons that needed to be pressed)
  // State is represented as coma separeted numbers
  let dict: { [id: string]: number } = {};
  let queue: string[] = [];
  function calc_min_button_clicks(c: Configuration, state: number[]): number | undefined {
    if (state.every(s => s == 0)) {
      //console.log(`Calculating: ${print_configuration(c)}`);
      dict = {};
      dict[state_to_key(state)] = 0;
      queue = [state_to_key(state)];
    }
    let desired_state_key = state_to_key(c.joltage);

    while (queue.length > 0) {
      let state_key = queue.pop()!;
      let state = state_key_to_state(state_key);
      let state_count = dict[state_key]!;

      for (const button of c.buttons) {
        let new_state = press_button(state, button);

        if (pair_wise_any_greater_than(new_state, c.joltage))
          continue;

        let new_state_key = state_to_key(new_state);
        let new_state_count = dict[new_state_key];

        if (new_state_count == undefined || new_state_count > state_count + 1) {
          dict[new_state_key] = state_count + 1;
          //console.log(`desired: ${desired_state_key}, current: ${new_state_key}, count: ${state_count + 1}`);

          //if (new_state_key == desired_state_key)
          //console.log(`Found: ${state_count + 1}`);

          if (!queue.includes(new_state_key))
            queue.push(new_state_key);

        }
      }
    }

    return dict[desired_state_key];
  }

  function state_to_key(state: number[]): string {
    return state.join(",");
  }

  function state_key_to_state(state_key: string): number[] {
    return state_key.split(',').map(s => parseInt(s));
  }

  function press_button(state: number[], button: number[]) {
    let new_state = [...state];
    for (let j of button)
      new_state[j]! += 1;
    return new_state;
  }

  function pair_wise_any_greater_than(x: number[], y: number[]): boolean {
    if (x.length != y.length)
      throw "Arrays have different length";

    for (let i in x) {
      if (x[i]! > y[i]!)
        return true;
    }

    return false;
  }

  async function calculate_in_worker_async(configuration: Configuration): Promise<number> {
    return new Promise((resolve, reject) => {
      let worker = new Worker(__filename, {
        workerData: {
          configuration
        }
      })

      worker.on("error", (err) => {
        reject(err);
      });

      worker.on("exit", () => {
      });

      worker.on("message", (msg) => {
        let count = parseInt(msg);
        resolve(count);
      });
    });
  }

  async function sleep(ms: number) {
    return new Promise((resolve, reject) => setTimeout(() => resolve(null), ms));
  }

  const input = fs.readFileSync('./src/day-10.input', 'utf8');
  const manual = input
    .split('\n')
    .filter(l => l)
    .map(parse_manual);

  if (isMainThread) {
    const worker_threads = 14;
    let total_count = 0;
    let queue = [...manual];
    let workers = new Set<Promise<number>>();
    let index = 0;
    while (queue.length > 0 || workers.size > 0) {
      while (workers.size > worker_threads)
        await sleep(1000);

      if (queue.length > 0) {
        let configuration = queue.pop()!;
        console.log(`Starting processing: ${++index}/${manual.length}`);
        (async () => {
          let promise = calculate_in_worker_async(configuration);
          workers.add(promise);

          let count = await promise;
          total_count += count;
          console.log(`${print_configuration(configuration)} = ${count}`);
          workers.delete(promise);
        })();
      }
    }

    console.log(`Part 2: ${total_count}`);
  } else {
    let count = calc_min_button_clicks(workerData.configuration, workerData.configuration.joltage.map((j: number) => 0));
    parentPort!.postMessage(count);
  }
}


//part1();
await part2();

