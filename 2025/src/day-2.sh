# !/bin/bash
#
# count=0
# while IFS=',' read -ra ADDR; do
#   for i in "${ADDR[@]}"; do
#     # echo $i
#
#     from="$(cut -d'-' -f1 <<<"$i")"
#     to="$(cut -d'-' -f2 <<<"$i")"
#
#     while [ $from -lt $to ]; do 
#       if [ $((${#from} % 2)) -eq 0 ];
#       then
#         # echo $from
#         half_len=$((${#from} / 2))
#         left=${from:0:$half_len} 
#         right=${from:$half_len:$half_len} 
#
#         if [ $left -eq $right ]; 
#         then
#           count=$(($count + $from))
#           # echo $from
#         fi
#       fi
#       from=$(($from + 1))
#     done
#
#     # echo $from 
#     # echo $to
#   done
# done < day-2.input
#
# echo "Part 1: $count"
#
echo "This takes a while, be patient"


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
  while IFS=',' read -ra ADDR; do
    for i in "${ADDR[@]}"; do
      from="${i%-*}"
      to="${i#*-}"
      seq "$from" "$to"
    done
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

echo "Part 2:"
cat ./day-2.input | 
  numbers |
  filter_numbers |
  parallel --pipe --block 5K filter_numbers |
  sort -n |
  uniq   |
  awk '{ sum += $1 } END { print sum }'


# count=0
# declare -A numbers
# while IFS=',' read -ra ADDR; do
#   for i in "${ADDR[@]}"; do
#     # echo $i
#     from="$(cut -d'-' -f1 <<<"$i")"
#     to="$(cut -d'-' -f2 <<<"$i")"
#     len=${#from}
#     echo "from $from to $to"
#
#     to_sub=$(( $to / (10 ** ($len / 2)) +1))
#
#     for from_sub in $(seq 1 $to_sub)
#     do 
#       if [[ $(( ${#to} % ${#from_sub} == 0 )) && ${#to} -gt ${#from_sub} ]]; 
#       then 
#         z=$((${#to} / ${#from_sub}))
#         for r in $(seq 1 $z);
#         do
#           y=$(repeat $from_sub $r)
#           # echo "i $i r $r from $from to $to from_sub $from_sub to_sub $to_sub y $y"
#           # echo "i $i r $r from $from to $to from_sub $from_sub to_sub $to_sub y $y"
#           if [[ $y -ge $from && $y -le $to ]];
#           then
#             # echo $y
#             echo "i $i r $r from $from to $to from_sub $from_sub to_sub $to_sub y $y"
#             # count=$(( $count + y ))
#             numbers[$y]=1
#           fi;
#         done
#       fi
#     done
#
#     # while [ $from -lt $to ]; do 
#     #   len=${#from}
#     #   for i in $(seq 1 $(($len / 2)));
#     #   do
#     #     if ! (( $len % $i == 0 ));
#     #     then
#     #       continue
#     #     fi
#     #
#     #     # echo
#     #     # echo "from $from"
#     #     x=$(( $from / (10 ** ($len - $i)) ))
#     #     # echo "i $i"
#     #     # echo "x $x"
#     #     # echo "r $r"
#     #     r=$(($len / $i))
#     #
#     #     y=$(repeat $x $r)
#     #     # echo "from $from,   x $x,    r $r,    y $y"
#     #     # echo "y $y"
#     #     if [ $y -eq $from ];
#     #     then 
#     #       echo $from
#     #       count=$(($count + $from))
#     #     fi
#     #
#     #   done
#     #   from=$(($from + 1))
#     # done
#
#     # echo $from 
#     # echo $to
#   done
# done < day-2.input


# for i in "${!numbers[@]}"
# do
#   count=$(( $count + $i ))
# done

# Answers:
# 55287825268 too high
# 27469414355 too low
# 27469417443 too high

echo "Part 2: $count"
