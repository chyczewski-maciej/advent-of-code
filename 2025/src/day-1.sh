#!/bin/bash

dial_position=50
count=0
while IFS= read -r line; do
  move=$(echo "$line" | sed -e 's/L/-/i' -e 's/R//i')
  dial_position=$(($dial_position + $move))

  # Clamp to 0-99 range
  dial_position=$(((100 + dial_position) % 100))

  if [ $dial_position -eq 0 ];
  then
    ((count++))
  fi

done < day-1.input

echo "Part one: $count"


dial_position=50
count=0
while IFS= read -r line; do
  move=$(echo "$line" | sed -e 's/L/-/i' -e 's/R//i')

  while [ $move -ne 0 ]; do
    moveAbs=${move#-}
    change=$((move / moveAbs))
    move=$((move - change))
    dial_position=$(((100 + ($dial_position + $change)) % 100))

    if [ $dial_position -eq 0 ];
    then
      ((count++))
    fi
  done
done < day-1.input

echo "Part two: $count"
