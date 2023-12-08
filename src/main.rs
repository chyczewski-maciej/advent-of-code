pub mod year2023;

use std::fs;

use crate::year2023::day1;

fn main() {
    let args = std::env::args().collect::<Vec<String>>();
    match args.len() {
        1 => {
            panic!("Not enough arguments. Pass in the first argument as the day you want to solve")
        },
        _ => {
            let day = args[1].as_str();
            // Consider adjusting the error in case the file does not exist
            let data = fs::read_to_string(format!("./src/year2023/data/{}.txt", day)).unwrap().trim().to_owned();
            match day {
                "day1" => day1::solve(data),
                day => panic!("Uknown day argument: '{}'", day)
            }
        }
    }
}
