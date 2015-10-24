
stack is a container of  objects that can be added or removed accoriding the the LIFO principle.

  you can think of it as a stack of dishes at your favorite buffet.

  Stack has two main operations which are push and pop. Push adds an object to the top of the stack. Pop removes the object at the top of the stack. Therefore you can only interact with only the object at the top at once.

  you can use a stack to reverse the letters of a word. Or backtracking such as "undo" in an operation in a txt editor where all the changes are kept in a stack.

  the underlying data structure for a stack is typical an array although a linked list can be used to which are more efficient because you do not need to allocate adtionaly array slots ahead of time in languages such as Java.

  tie complyexyity of O(1)

push
pop
peek - return object at top without removing it
size
isEmpty


queue

array or linked list


peek
size
enqueeu(item)
dequeue()
clear
isEmpty

O(1)




The simplest two search techniques are known as Depth-First Search(DFS) and Breadth-First Search (BFS). These two searches are described by looking at how the search tree (representing all the possible paths from the start) will be traversed.

Deapth-First Search with a Stack

In depth-first search we go down a path until we get to a dead end; then we backtrack or back up (by popping a stack) to get an alternative path.

Create a stack
Create a new choice point
Push the choice point onto the stack
while (not found and stack is not empty)
Pop the stack
Find all possible choices after the last one tried
Push these choices onto the stack
Return
Breadth-First Search with a Queue

In breadth-first search we explore all the nearest possibilities by finding all possible successors and enqueue them to a queue.

Create a queue
Create a new choice point
Enqueue the choice point onto the queue
while (not found and queue is not empty)
Dequeue the queue
Find all possible choices after the last one tried
Enqueue these choices onto the queue
Return



1. Stack is LIFO (Last In First Out)
2. Queue is FIFO (First In First Out)
