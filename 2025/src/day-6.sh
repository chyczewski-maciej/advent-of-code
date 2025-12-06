#!/bin/bash

transpose_matrix() {
  awk '
  {
    for(i = 1; i <= NF; i++){
      a[NR,i] = $i
    }
  }
  NF > p { p = NF }
  END {
    for(j=1; j<=p; j++){
      str=a[1,j]
      for(i=2; i<=NR; i++){
        str=str " " a[i,j];
      }
      print str
    }
  }'
}

transpose_line() {
  awk '
      {
        str=$1
        for(i = 2; i < NF; i++) {
          str = str " " $NF " " $i
        }
        print str
      }
      '
}

calc() {
    while IFS= read -r line; do
      echo $(( $line ))
    done
}

sum() {
  awk '
  {
    sum+=$1
  }
  END {
    print sum
  }
  '
}

echo "Part 1: "
cat ./day-6.input | 
  transpose_matrix | 
  transpose_line |
  calc |
  sum



# Part 2
find_columns() {
  operators=$(tail -1)

  echo "$operators"
}

fill_operators(){
  i=$(cat)
  echo "$i" | head -n-1

  echo "$i" |
  tail -1 |
  # sed -E 's/([*+])([ \n$]+)/\2,/g' #|
  sed -E 's/([*+])\s(\s|\n|$)/\1\1\2/g' |
  sed -E 's/([*+])\s(\s|\n|$)/\1\1\2/g' |
  sed -E 's/([*+])\s(\s|\n|$)/\1\1\2/g' |
  sed -E 's/([*+])\s(\s|\n|$)/\1\1\2/g' |
  sed -E 's/([*+])\s(\s|\n|$)/\1\1\2/g' 
}

transpose_matrix() {
  awk '
  {
    split($0, chars, "")
    for (j=1; j <= length($0); j++) {
      a[NR,j]=chars[j]
      if(p < length($0))
      { 
        p = length($0) 
      }
    }
  }
  END {
    for(j=1; j<=p; j++){

      op=a[NR,j]
      str=" "
      for(i=1; i<NR; i++) {
        if(a[i,j] != " ") {
          str=str a[i,j];
        }
      }
      print str op
    }
  }'
}


echo 
echo "Part 2: "
cat ./day-6.input | 
  fill_operators |
  transpose_matrix |
  tr '\n' ' ' |
  sed -E 's/^/\(/g' |
  sed -E 's/[*+]   /)+(/g' |
  sed -E 's/[*+]\s*$/\)\n/g' |
  sed -E 's/\s//g' | 
  calc 
