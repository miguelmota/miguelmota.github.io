9, 179, 139, 38, 10, 5, 36

list
0
1
2
3
4
5
6
7
8
9

first bind least signifant digit, in the 1s column
start with mod 10 then divide the number by 1

int m = 10;
int n = 1;

array[0] = 9
9 % 10 = 9
9 / 1 = 9

9 goes into 9's list
list[9].push(9)

array[1] = 179
> (179 % 10) / 1
9
= 9
list[9].push(179)

139 in 9 9's list

38 in 8's list

10 in 0's list

5 in 5's list

36 in 6's list

alright so next iteration start with mod 100 and divide by 10
m = m * 10
n = n * 10

start with linked list items, add to new list

array[0] = 10
10 mod 100 = 10
10/1 = 1

list[1].push(10)

(5%100)/10 = 0.5 = 0 cast

and so on

next iterationo
m = m * 10 // 1000
n = n * 10 // 100

and so on.,done.


wo arguments come to my mind:

Quicksort/Introsort is more flexible:

Quicksort and Introsort work well with all kinds of data. All you need for sorting is the possibility to compare items. This is trivial with numbers but you can sort other data as well.

Radix sort on the other hand just sorts things by their binary representation. It never compares items against each other.

Radix sort needs more memory.

All radix sort implementations that I've seen use a secondary buffer to store partial sorting results. This increases the memory requirements of the sorting algorithm. That may not be a problem if you only sort a couple of kilobytes, but if you go into the gigabyte range it makes a huge difference.
