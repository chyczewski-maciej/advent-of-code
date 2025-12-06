# !/bin/bash

declare -A map

load_map(){
  i=100000

  y=0
  while IFS= read -r row; do
    x=0
    for col in $(echo $row | fold -w1);
    do
      if [[ "$col" == "@" ]]; 
      then
        map["$y,$x"]="$i"
        i=$((i + 1))
      fi
      x=$((x+1))
    done
    y=$((y+1))
  done < day-4.input
}

get_positions_and_neighbors(){
  load_map

  for key in "${!map[@]}"
  do
    id=${map[$key]}
    y=${key%,*}
    x=${key#*,}
    if [[ "$id" != "" ]]; then
      line="$id"

      # append neighbors which are also rolls
      for i in $(seq -1 1);
      do
        for j in $(seq -1 1);
        do
          neighbor_pos="$((y+i)),$((x+j))"
          neighbor_id=${map[$neighbor_pos]}

          if [[ "$neighbor_id" != "" && "$neighbor_id" != "$id" ]];
          then 
            line="$line $neighbor_id"
          fi
        done
      done

      echo $line
    fi

  done
}

positions=$(get_positions_and_neighbors | awk '{ print length, $0 }' | sort -n | cut -d" " -f2-)

# Part 1 
# Count rolls which have 4 or less rolls as it's direct neighbors


count_rolls_with_less_than_4_rolls_as_neighbors() {
  echo "$positions" | awk -F ' ' '{ if ( NF <= 4 ) sum += 1 } END { print sum }'

}

echo "Part 1: $(count_rolls_with_less_than_4_rolls_as_neighbors)"


# Part 2 
# While any roll has 4 or less other rolls as it's direct neighbors


sort_positions(){
  positions=$(echo "$positions" | awk '{ print length, $0 }' | sort -n | cut -d" " -f2-)
}

least_neighbors(){
  sort_positions
  echo "$positions" | head -1 | awk -F ' ' '{ print NF - 1 }'
}

# positions=$(get_positions_and_neighbors)
total_rolls=$(echo "$positions" | wc -l)

while [[ $(least_neighbors) < 4 ]]; 
do
  sort_positions
  # find the roll with least amount of neighbors
  least_neighbors_id=$(echo "$positions" | head -1 | cut -d ' ' -f1)
  # drop it's line
  # echo "$positions"
  # echo "least_neighbors_id $least_neighbors_id"
  positions=$(echo "$positions" | tail -n +2) # remove the row for the least rolls row 
  positions=$(echo "$positions" | sed "s/ $least_neighbors_id//g") # remove the reference to it from other lines
  # echo "$positions"

  sort_positions
done

remaining_rolls=$(echo "$positions" | wc -l)
removed=$((total_rolls - remaining_rolls))
echo "total_rolls $total_rolls remaining_rolls $remaining_rolls removed $removed"
