symetric key key
assymetric public key key

stream - encrypts one bit or character at a time, xor
block cypher -

cypher - algorithm. should be public, keys must be private

Chipher Block Chaining (CBC)
plaintext -> Initialization Vector (IV) -> key -> block cypher encryption -> ciphertext
ciphertext is then used as the IV for the next block
decrypt: ciphertext -> key -> block cipher decryption -> IV -> plaintext
use key as IV for next block


Output Feedback Mode (OFB): using xor, very fast
Cipher Feedback Mode
Counter Mode (CTR)


Nonce: random number used once


Key Stream Generator
- hard work, best done in hardware
- should not generate repeating patterns
- should not produce predictable output
- should not produce a key stream related to the key
- should product a nearly equal number of zeros and ones in the keys stream


One Time Pad
-Vernam's Cipher
-key must be same length or longer than plaintext
- "unbreakable"
-used only once
-shared by both sides
-as long as the message or longer
-composed of random values


substitution, also known as confusion
transposition, also known as diffusion



# Transposition Ciphers
does not change any letters of the original message, aka plaintext or simply just message
Rearranges letter according to a secret system

## Atbash Cipher

letters of alphabet are reversed, A's with Z's, B's with Y's

substitution key
```
ABCDEFGHIJKLMNOPQRSTUVWXYZ
ZYXWVUTSRQPONMLKJIHGFEDCBA
```


## The Rail Fence Cipher

make the message length be a multiple of 4 (4-group system)

for example

MEET ME TONIGHT

is 13 characters, so we add 3 extra letters at the end to make it 16

```
MEET ME TONIGHT XYZ
```

Then we seperate every other letter to a separate group

so we end up with

```
MEETMETONIGHTXYZ

M E M T N G T Y
 E T E O I H X Z
```

and append the second half to the first half, which gives us our ciphered string.

```
MEMT NGTY ETEO IHXZ
```

To decode will simply split the string in half

```
MEMTNGTY
ETEOIHXZ
```

and start joining the string by interveving the top string with the bottom string

```
M E M T N G T Y
 E T E O I H X Z

MEETMETONIGHTXYZ
```

Other variations can be made by using different grouping the letters in a zigzag pattern.
For example, this is a 3-line rail fence cipher:

```
M   M   N   T   A
 E T E O I H X Z B
  E   T   G   Y
```

Notice how it's resemembers a sin wave. You start writing each letter downwards diagonally, so there's only  one letter per column. Since it's a 3 line rails it needs to be a multiple of 4.

To encode simply append the third row to the second, and second row to the first row. We end up with:

```
MMNT ETEO IHXZ ETGY
```

To decipher, break the encoded string into equal groups for each rail.

```
MMNT ETEO IHXZ ETGY

X---X---X---X
-X-X-X-X-X-X-X-X
--X---X---X---X

M   M   N   T   A
 E T E O I H X Z B
  E   T   G   Y

MEETMETONIGHTXYZ
```

```
function railFenceCipher(ciphertext, nrails) {
  var len = ciphertext.length;
  var count = len/nrails;
  var parts = [];
  var plaintext = '';
  var i = 0;
  var j = 0;
  var k = 0;
  console.log(len)

  for (i = 0; i < nrails; i++) {
    parts.push([]);
    for (j = 0; j < count; j++) {
      parts[i].push(ciphertext[k++]);
    }
  }

  for (i = 0; i < count; i++) {
    for (j = 0; j < nrails; j++) {
      plaintext += parts[j][i];
    }
  }


  return plaintext;
}

console.log(railFenceCipher('AALUHNHSEDFYMNAGIGIHAOFZ', 2));
console.log(railFenceCipher('MTTIXAEMOGYBEENTZH', 3));
```
http://jsbin.com/pifimelibo/1/edit?js,console

# Twisted Path Cipher

letter scrambling, utilizing a rectangular grid, or matrix.

```
MEET ME THURSDAY NIGHT
```

should be a multiple of 4, totaling 20 length

5x4 matrix

```
M E E T M
E T H U R
S D A Y N
I G H T X
```

```
^
|  |--|  |--|
|  |  |  |  |
|  |  |  |  |
|__|  |__|  |
            ^
```

Do a farmer pattern called "plow path" starting from the oppsite end, so the bottom right, and do a zig zag to scramble the letters.

We end up with

```
XNRM TUYT HAHE ETDG ISEM
```

To decipher, start with an empty matrix and plot the letters the same path that they were retrieved, so starting from the bottom right.

The message is then read from left to right.

Another path is a spiral, starting from the center:

```
^
| |-----|
| | >-- |
| |___| |
|_______|
```

The spiral patter produces

```
HUYA DTEE TMRN XTHG ISEM
```

To make it harder to read, you initial write plot the letters in a matrix in a certain pattern instead of left to right, and then encrypt it with another pattern, like a diagonal pattern.

```
/ / / /
 / / / /
  / / / /
   / / / /
```

## Scambling with a keyword

As we did before we can further scramble the encrypted text by employing the use of key. In this example the key will be a word that corresponds to he colum numbers. Let me explain.

We'll be using the same text

```
MEET ME THURSDAY NIGHT
```

and since it's a 4x5 matrix, there are 5 columns.

```
M E E T M
Y N I G E
A X T H T
D S R U H

path used

>--------|
 |-----  |
 | <__|  |
 |_______|
```

We simply pick a 5 letter word to be the key, in this example `FRANK`. The key must not have repeating letters.

Then we number each letter in the key in which the order it appears in the alphabet.

```
2 5 1 4 3
F R A N K
```

Our matrix columns are now labeled:

```
2 5 1 4 3
---------
M E E T M
Y N I G E
A X T H T
D S R U H
```

To encrypt the message write each column in order, from top to bottom.

```
EITR MYAD METH TGHU ENXS
```

The advantage this model is that encryption keys can be switch ever so often because they are easy to remember.


# Easy Substitution Ciphers

Sbstitution ciphers swap each letter in the ciphered text for a different character or symbol, unlike the previous transposition cipher models where the letters are only scambled.

"monoalphabetic" meaning single alphabet, means that one letter is substituted for another. For example T for K, so whereever K appears T appears.


## Shift Ciphers

Shift ciphers, also known as [Julius] Caesar ciphers, are easy to encode and decode. As the name implies you shift the characters in the alphabets a number of characters.

If we had a key of number 7, then we shift the alphabet 7 characters:

```
T U V W X Y Z A B C D E F G H I J K L M N O P Q R S
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
```

For example, our message

```
MYRTLE
```

gets encoded to

```
TFYASL
```

To decode, find the letter in the bottom row and write the letter in the top row.

## Date Shift Ciphers

This cipher is pretty clever in that you use the current date to determine how many characters to shift each character in the message.

For example if today's date was October, 21, 1973 or 10-21-1973 with the dashes we have 10211973 as our key.

We then write the key repeatedly over the message.

```
102173 102 173 1021
MYRTLE HAS BIG FEET
```

In this case we shift each letter by the number above. So M becomes N. Y becomes Y. R becomes T and so on. If the letter is Z when go back to A.

Encrypted message.

```
NYTU SHIA UCPJ GEGU
```

Notice how in the last word, FEET, the E's are different. This means that the date-shift cipher is non monoalphabetic. It is polyalphabetic.


## Key Word Ciphers




I obviously did not come up with any this encryption methods. They are from a phenomenal little book called "", that came out before computers became personal and JavaScript was a thing. I hope you enjoyed the code exmples of my implementation of the classical encryption models in JavaScript.
