#[test]
fn test() {
    solve(String::from("1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet"));
}

pub fn solve(data: String) {
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

    println!("The sum of numbers created from the first and last digit from each line is: {}", sum); 
}
