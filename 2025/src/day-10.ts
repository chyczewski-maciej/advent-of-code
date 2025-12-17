import * as fs from 'fs';

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

      for (const button of c.buttons) {
        if (min != undefined && min <= path.length)
          continue;

        let new_state = toggle_button(state, button);
        if (path.includes(new_state))
          continue;

        let clicks = calc_min_button_clicks(c, [...path, new_state]);
        if (clicks !== undefined) {
          if (min === undefined || clicks < min) {
            min = clicks;
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
  let index = 0;
  manual.forEach(m => {
    let count = calc_min_button_clicks(m);
    if (count == undefined)
      throw 'Failed to calculate count'
    total_count += count;
    console.log(`${index++}/${manual.length} = ${count}`);
  });

  console.log(`Part 1: ${total_count}`);
}


function part2() {
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


  let cache: { [id: string]: number } = {};
  function calc_min_button_clicks(c: Configuration, state: number[] | undefined = undefined): number | undefined {
    if (state === undefined) {
      state = c.joltage;
      cache = {};
    }

    let state_key = state_to_key(state);
    let cached = cache[state_key];

    if (cached == -1)
      return undefined;

    if (cached != undefined)
      return cached;

    if (state.some(x => x < 0)) {
      cache[state_key] = -1;
      return undefined;
    }

    if (state.every(x => x == 0)) {
      cache[state_key] = 0;
      return 0;
    }

    let res = [];

    if (res.length == 0) {
      for (const buttons of button_combinations(c)) {
        let new_state = depress_buttons(state, buttons, 1);
        if (!new_state.every(x => x % 2 == 0))
          continue;

        let div_state = new_state.map(x => Math.round(x / 2));
        let clicks = calc_min_button_clicks(c, div_state);
        if (clicks == undefined)
          cache[state_to_key(div_state)] = -1;
        if (clicks != undefined) {
          cache[state_to_key(div_state)] = clicks;
          res.push((clicks * 2) + (buttons.length));
        }
      }
    }

    if (res.length > 0) {
      let r = Math.min(...res);
      let cached = cache[state_key];
      if (cached == undefined || cached > r)
        cache[state_key] = r;
      return r;
    }

    cache[state_key] = -1;
    return undefined;
  }

  function button_combinations(c: Configuration): number[][][] {
    const range: number[] = [...Array(Math.pow(2, c.buttons.length)).keys()];
    const flags = range.map(n => n.toString(2).padStart(c.buttons.length, "0").split('').map(x => x === "1" ? true : false));
    return flags.map(flag => flag.map((v, i) => v ? c.buttons[i]! : undefined).filter(b => b != undefined));
  }

  function state_to_key(state: number[]): string {
    return state.join(",");
  }

  function depress_button(state: number[], button: number[], times: number) {
    let new_state = [...state];
    for (let j of button)
      new_state[j]! -= times;
    return new_state;
  }

  function depress_buttons(state: number[], buttons: number[][], times: number) {
    return buttons.reduce((acc, button) => depress_button(acc, button, times), state);
  }

  const input = fs.readFileSync('./src/day-10.input', 'utf8');
  const manual = input
    .split('\n')
    .filter(l => l)
    .map(parse_manual);

  let total_count = 0;
  for (const configuration of manual) {
    let start = Date.now();
    let count = calc_min_button_clicks(configuration);
    if (!count)
      throw 'Failed to find the count';
    total_count += count;
    let time = (Date.now() - start) / 1000;
    // console.log(`${print_configuration(configuration)} = ${count}          took ${time}s`);
  }
  console.log(`Part 2: ${total_count}`);
}

part1();
part2();

