# !/bin/bash

max_digit() {
    echo $(echo $1 | fold -w1 | sort -n | tail -1)
}

remove_prefix() {
  n=$1
  prefix=$2
  echo ${n#*$prefix}
}

max_joltage()
{
  while read -r n; do
    len=${#n}
    n_without_last=${n:0:$((len-1))} 
    max_without_last_digit=$(max_digit $n_without_last)
    after_max=$(remove_prefix $n $max_without_last_digit)
    after_max_max=$(max_digit $after_max)

    # echo "n $n n_without_last $n_without_last max_without_last_digit $max_without_last_digit after_max $after_max after_max_max $after_max_max"

    echo "$max_without_last_digit$after_max_max"
    # echo "$n $max_without_last_digit$after_max_max"
  done
}

echo "Part 1: "
cat ./day-3.input | 
  max_joltage |
  awk '{ sum += $1 } END { print sum }'

max_digit() {
    echo $(echo $1 | fold -w1 | sort -n | tail -1)
}

remove_prefix() {
  n=$1
  prefix=$2
  echo ${n#*$prefix}
}

index_of(){
  echo $(echo $1 | grep -bo $2 | head -1 | cut -d ':' -f 1)
}

max_joltage()
{
  while read -r n; do
    len=${#n}
    start_pos=0
    result=""

    end_pos=0
    for i in $(seq $1 -1 1)
    do
      end_pos=$((len - i + 1))
      l=$((end_pos - start_pos))
      sub=${n:$start_pos:$l}

      max_digit=$(max_digit $sub)
      max_digit_pos=$(index_of $sub $max_digit)
     
      start_pos=$((start_pos + max_digit_pos + 1))
      # echo "max_digit_pos $max_digit_pos"
      # echo "start_pos $start_pos"
      result="$result$max_digit"

      # echo "n $n len $len start_pos $start_pos end_pos $end_pos l $l sub $sub max_digit $max_digit"
      # echo "max_digit_pos $max_digit_pos start_pos $start_pos result $result"
    # echo "$n $max_without_last_digit$after_max_max"
    done
    echo $result
  done
}

echo "Part 1: "
cat ./day-3.input | 
  max_joltage 2 |
  awk '{ sum += $1 } END { print sum }'

echo "Part 2: "
cat ./day-3.input | 
  max_joltage 12 |
  awk '{ sum += $1 } END { print sum }'

