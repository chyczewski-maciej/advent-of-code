#[test]
fn part1_test() {
    part1("1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet");
}

#[test]
fn part2_test(){
    part2("two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen")
}

pub fn solve(data: String) {
    part1(&data);
    part2(&data);
}

fn part1(data: &str) {
    let sum:i32 = data
            .split('\n')
            .map(|line| {
                let digits:Vec<char> = line.chars()
                    .into_iter()
                    .filter(|c| c.is_digit(10))
                    .collect();

                let first = digits.first().unwrap();
                let last = digits.last().unwrap();

                let number = first.to_string() + &last.to_string();
                number.parse::<i32>().unwrap()
            })
            .sum();

    println!("Part1: The sum of numbers created from the first and last digit from each line is: {}", sum); 
}

fn part2(data: &str) {
    let digits: [&str; 10]= [
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine" ];
    let sum:i32 = data
            .split('\n')
            .map(|line| {
                let mut min_index:i32= line.len() as i32  +1;
                let mut max_index:i32 = -1;
                let mut min_digit:i32 = 0;
                let mut max_digit:i32 = 0;

                for i in 0..(digits.len()) {
                    for s in [&i.to_string(), digits[i]] {
                        match line.find(s) {
                            Some(index) => {
                                if (index as i32) < min_index {
                                    min_index = index as i32;
                                    min_digit = i as i32;
                                }
                            }
                            None => {}
                        }

                        match line.rfind(s) {
                            Some(index) => {
                                if (index as i32) > max_index{
                                    max_index = index as i32;
                                    max_digit = i as i32;
                                }
                            }
                            None => {}
                        }
                    }
                }
                
                let number = min_digit * 10 + max_digit;
                println!("Line: {}. Number: {}", line, number);

                number
            })
            .sum();

    println!("Part2: The sum of numbers created from the first and last digit from each line is: {}", sum); 
}
