# !/bin/bash

count=0
while IFS=',' read -ra ADDR; do
  for i in "${ADDR[@]}"; do
    # echo $i

    from="$(cut -d'-' -f1 <<<"$i")"
    to="$(cut -d'-' -f2 <<<"$i")"

    while [ $from -lt $to ]; do 
      if [ $((${#from} % 2)) -eq 0 ];
      then
        # echo $from
        half_len=$((${#from} / 2))
        left=${from:0:$half_len} 
        right=${from:$half_len:$half_len} 

        if [ $left -eq $right ]; 
        then
          count=$(($count + $from))
          # echo $from
        fi
      fi
      from=$(($from + 1))
    done

    # echo $from 
    # echo $to
  done
done < day-2.input

echo "Part 1: $count"

function repeat(){
  x=$1
  y=""
  times=$2
  for i in $(seq 1 $times);
  do
    y="$y$x"
  done;

  echo $y
}

export -f repeat

numbers() {
  while read -r i; do
    from="${i%-*}"
    to="${i#*-}"
    seq "$from" "$to"
  done
}

export -f numbers 

divisors() {
  local n=$1
  for ((i=1; i<=n; i++)); do
    if (( n % i == 0 )); then
      echo "$i"
    fi
  done
}

export -f divisors 

sub() {
  d=$1
  len=$2
  cur=${#d}

  echo $(( $d / (10 ** ($cur - $len) )))
}
export -f sub

filter_numbers() {
  while read -r n; do
    len=${#n}
    for i in $(divisors $len);
    do
      if [[ $i -gt 1 ]];
      then
        d=$(($len / $i))
        s=$(sub $n $d)
        y=$(repeat $s $i)

        # echo "d $d s $s y $y sub $sub n $n i $i"
        if [ $y -eq $n ];
        then
          echo $n
          # echo 
        fi
      fi
    done
  done
}

export -f filter_numbers

echo "This takes a while, be patient. Idk if this is even correct"
cat ./day-2.input | 
  tr ',' '\n' |
  numbers |
  sort -n  |
  uniq  > day-2.numbers

cat ./day-2.numbers | 
  parallel --pipe --block 5K --bt 1 filter_numbers > day-2.filter_numbers

cat ./day-2.filter_numbers |
  sort -n  |
  uniq |
  awk '{ sum += $1 } END { print sum }'

echo "Part 2: $count"

rm ./day-2.numbers
rm ./day-2.filter_numbers
