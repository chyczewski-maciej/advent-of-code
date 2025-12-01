use regex::Regex;

#[test]
fn day2_part1_test() {
    part1("
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green");
}

#[test]
fn day2_part2_test(){
    part2("")
}

pub fn solve(data: String) {
    part1(&data);
    part2(&data);
}

fn part1(data: &str) {
    let allowed_red = 12;
    let allowed_green = 13;
    let allowed_blue = 14;

    // Find games which never use more than number of allowed cubes
    

    let sum_of_ids:i32 = data
        .trim()
        .split('\n')
        .map(|line| parse_game(line))
        .filter(|game| game.red <= allowed_red && game.green <= allowed_green && game.blue <= allowed_blue)
        .map(|game| game.id)
        .sum();

    println!("Day2 part1: Sum of ids of all games which don't use more than allowed amount of cubes is: {}", sum_of_ids);
}

#[derive(Debug)]
pub struct Game {
    pub id: i32,
    pub red: i32,
    pub green: i32,
    pub blue: i32
}

fn parse_game(str: &str) -> Game {
    let game_id_regex = Regex::new("Game (?<game_id>\\d+)").unwrap();
    let cube_count_regex = Regex::new("(?<cube> (?<count>\\d+) (?<color>\\w+))").unwrap();
    // println!("{}", str);
    // let colon_index = str.find(":").unwrap();
    let game_id = (&game_id_regex.captures(str).unwrap()["game_id"]).parse().unwrap();
    let cubes = cube_count_regex.captures_iter(str);

    let mut red = 0;
    let mut green = 0;
    let mut blue = 0;

    for cap in cubes {
        let color = &cap["color"];
        let count:i32 = cap["count"].parse().unwrap();

        let current_color = match color {
            "red" => &mut red,
            "green" => &mut green,
            "blue" => &mut blue,
            _ => panic!("{} is not a known color", color)
        };

        if *current_color < count {
            *current_color = count;
        }
        
    }

    Game { 
        id: game_id, 
        red, 
        green, 
        blue
    }
}

fn part2(data: &str) {
}
