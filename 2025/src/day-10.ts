import * as fs from 'fs';
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Deserializer } from 'node:v8';

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

  async function calc_min_button_clicks(c: Configuration): Promise<number | undefined> {
    const initial_state = c.joltage.map(() => 0);

    const desired_state = c.joltage;
    return await calc_min(desired_state, initial_state, 0);

    async function calc_min(desired_state: number[], state: number[], button_index: number): Promise<number | undefined> {
      if (button_index == c.buttons.length) {
        return 0;
      }

      let maxpresses = max_presses(c.buttons[button_index]!, desired_state);
      let button = c.buttons[button_index]!;
      for (let i = maxpresses; i >= 0; i--) {
        let new_state = press_button_times(state, button, i);
        if (pair_wise_any_greater_than(new_state, desired_state))
          continue;

        if (button_index == c.buttons.length - 1)
          if (pair_wise_equal(new_state, desired_state))
            return i;

        let min = await calc_min(desired_state, new_state, button_index + 1);
        if (min)
          return min + i;
      }

      function max_presses(button: number[], desired_state: number[]): number {
        return Math.min(...button.map(b => desired_state[b]!))
      }

      function divide(state: number[], d: number): number[] {
        return state.map(x => x / d);
      }

      function calculate_remainer(state: number[]): [number[], number[]] {
        const remainers = state.map(x => x % 2);
        const wholes = state.map((x, i) => x - remainers[i]!);
        return [wholes, remainers];
      }

    }

  }

  function pair_wise_equal(current_state: number[], desired_state: number[]) {
    for (let i in current_state)
      if (current_state[i] != desired_state[i])
        return false;

    return true;
  }

  function calc_total_distance(current_state: number[], desired_state: number[]) {
    let total = 0;

    for (let i in current_state)
      total += Math.abs(desired_state[i]! - current_state[i]!);

    return total;
  }

  function calc_min_distance(current_state: number[], desired_state: number[]) {
    let min = desired_state[0]!;

    for (let i in current_state)
      min = Math.min(min, Math.abs(desired_state[i]! - current_state[i]!));

    return min;
  }

  function state_to_key(state: number[]): string {
    return state.join(",");
  }

  function state_key_to_state(state_key: string): number[] {
    return state_key.split(',').map(s => parseInt(s));
  }

  function press_button_times(state: number[], button: number[], times: number) {
    let new_state = [...state];
    for (let j of button)
      new_state[j]! += times;
    return new_state;
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

  const use_workers = false;
  const input = fs.readFileSync('./src/day-10.input.debug', 'utf8');
  const manual = input
    .split('\n')
    .filter(l => l)
    .map(parse_manual);

  if (!use_workers) {
    let total_count = 0;
    for (const configuration of manual) {
      let start = Date.now();
      let count = await calc_min_button_clicks(configuration);
      if (!count)
        throw 'Failed to find the count';
      total_count += count;
      let time = (Date.now() - start) / 1000;
      console.log(`${print_configuration(configuration)} = ${count}          took ${time}s`);
    }
    console.log(`Part 2: ${total_count}`);
  } else {
    if (isMainThread) {
      const worker_threads = 6;
      let total_count = 0;
      let queue = [...manual];
      let workers = new Set<Promise<number>>();
      let index = 0;
      while (queue.length > 0 || workers.size > 0) {
        await sleep(1000);
        if (workers.size > worker_threads)
          continue;

        if (queue.length > 0) {
          let configuration = queue.pop()!;
          console.log(`Starting processing: ${++index}/${manual.length}`);
          (async () => {
            let promise = calculate_in_worker_async(configuration);
            workers.add(promise);

            let start = Date.now();

            let count = await promise;
            let time = (Date.now() - start) / 1000;
            total_count += count;
            console.log(`${print_configuration(configuration)} = ${count}          took ${time}s`);
            workers.delete(promise);
          })();
        }
      }

      console.log(`Part 2: ${total_count}`);
    } else {
      let count = await calc_min_button_clicks(workerData.configuration);
      parentPort!.postMessage(count);
    }
  }
}


//part1();
await part2();

