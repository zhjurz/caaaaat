# ccc

The ultimate URL lengthner - now with cats!

## Character Map

This project uses 5 visually similar "c" characters for encoding:

| Character | Unicode | Name                         | Value |
| --------- | ------- | ---------------------------- | ----- |
| c         | U+0063  | Latin Small Letter C         | 0     |
| C         | U+0043  | Latin Capital Letter C       | 1     |
| с         | U+0441  | Cyrillic Small Letter Es     | 2     |
| ϲ         | U+03F2  | Greek Lunate Sigma Symbol    | 3     |
| ᴄ         | U+1D04  | Latin Letter Small Capital C | 4     |

## How it works

1. URLs are converted to UTF-8 byte arrays
2. Each byte is encoded to base-5 (4 digits per byte)
3. Each base-5 digit (0-4) is mapped to one of the 5 "c" characters
4. A version prefix "cccc" is added
5. The result is a very long, cat-themed URL!

## Domain

Base domain: `ccccccccccccccccccc.cc`
