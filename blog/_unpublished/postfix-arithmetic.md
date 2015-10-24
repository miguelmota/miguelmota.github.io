http://c2.com/cgi/wiki?PostfixNotation

Arithmetic Expression Evaluation

An important application of stacks is in parsing. For example, a compiler must parse arithmetic expressions written using infix notation:
1 + ((2 + 3) * 4 + 5)*6
We break the problem of parsing infix expressions into two stages. First, we convert from infix to a different representation called postfix. Then we parse the postfix expression, which is a somewhat easier problem than directly parsing infix.
Converting from Infix to Postfix. Typically, we deal with expressions in infix notation

2 + 5
where the operators (e.g. +, *) are written between the operands (e.q, 2 and 5). Writing the operators after the operands gives a postfix expression 2 and 5 are called operands, and the '+' is operator. The above arithmetic expression is called infix, since the operator is in between operands. The expression
2 5 +
Writing the operators before the operands gives a prefix expression
+2 5
Suppose you want to compute the cost of your shopping trip. To do so, you add a list of numbers and multiply them by the local sales tax (7.25%):
70 + 150 * 1.0725
Depending on the calculator, the answer would be either 235.95 or 230.875. To avoid this confusion we shall use a postfix notation
70  150 + 1.0725 *
Postfix has the nice property that parentheses are unnecessary.
Now, we describe how to convert from infix to postfix.

Read in the tokens one at a time
If a token is an integer, write it into the output
If a token is an operator, push it to the stack, if the stack is empty. If the stack is not empty, you pop entries with higher or equal priority and only then you push that token to the stack.
If a token is a left parentheses '(', push it to the stack
If a token is a right parentheses ')', you pop entries until you meet '('.
When you finish reading the string, you pop up all tokens which are left there.
Arithmetic precedence is in increasing order: '+', '-', '*', '/';
Example. Suppose we have an infix expression:2+(4+3*2+1)/3. We read the string by characters.
'2' - send to the output.
'+' - push on the stack.
'(' - push on the stack.
'4' - send to the output.
'+' - push on the stack.
'3' - send to the output.
'*' - push on the stack.
'2' - send to the output.
Evaluating a Postfix Expression. We describe how to parse and evaluate a postfix expression.

We read the tokens in one at a time.
If it is an integer, push it on the stack
If it is a binary operator, pop the top two elements from the stack, apply the operator, and push the result back on the stack.
Consider the following postfix expression
5 9 3 + 4 2 * * 7 + *
Here is a chain of operations
Stack Operations              Output
--------------------------------------
push(5);                        5
push(9);                        5 9
push(3);                        5 9 3
push(pop() + pop())             5 12
push(4);                        5 12 4
push(2);                        5 12 4 2
push(pop() * pop())             5 12 8
push(pop() * pop())             5 96
push(7)                         5 96 7
push(pop() + pop())             5 103
push(pop() * pop())             515
Note, that division is not a commutative operation, so 2/3 is not the same as 3/2.


// http://www.smccd.net/accounts/hasson/C++2Notes/ArithmeticParsing.html
// http://c2.com/cgi/wiki?PostfixNotation
