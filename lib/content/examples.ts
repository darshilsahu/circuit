import type { Example } from './types';

export const categories = ['Basic Programs', 'Conditions', 'Loops', 'Functions', 'Arrays', 'Strings', 'Pointers', 'Structures', 'File Handling'];

const program = (body: string, extra = '') => `#include <stdio.h>\n${extra}\nint main(void) {\n${body}\n    return 0;\n}\n`;

export const examples: Example[] = [
  {
    slug: 'hello-world', title: 'Hello World', category: 'Basic Programs',
    description: 'Print a greeting and learn the smallest useful structure of a C program.',
    code: program('    printf("Hello, world!\\n");'), output: 'Hello, world!',
    explanation: ['The stdio.h header declares printf. Execution begins in main; the call writes a string to standard output. The escaped \\n ends the line, and return 0 reports successful completion.', 'Change only the words inside the quotation marks and run again. Then remove the semicolon to see how a compiler diagnostic points to a syntax error. Restore it before continuing.'], concepts: ['Headers', 'main', 'String literals', 'Exit status'], guide: 'first-c-program',
  },
  {
    slug: 'add-two-numbers', title: 'Add Two Numbers', category: 'Basic Programs',
    description: 'Read two integers interactively, validate input, and print their sum.',
    code: program('    int a, b;\n    printf("First number: ");\n    if (scanf("%d", &a) != 1) return 1;\n    printf("Second number: ");\n    if (scanf("%d", &b) != 1) return 1;\n    if (a < -1000000 || a > 1000000 || b < -1000000 || b > 1000000) {\n        puts("Use numbers between -1000000 and 1000000.");\n        return 1;\n    }\n    printf("Sum: %d\\n", a + b);'), input: '45\n20', output: 'First number: 45\nSecond number: 20\nSum: 65',
    explanation: ['Each scanf call waits for the next integer. Its return value must be 1 before the variable is used. The ampersand passes the address where scanf should store the number.', 'The range check keeps the sum within the supported integer range. Enter ordinary representable integers; scanf is not a robust parser for arbitrarily large numeric text. Try one negative value and predict the sum before running.'], concepts: ['Interactive stdin', 'Addresses', 'Input validation', 'Arithmetic'], guide: 'printf-and-scanf',
  },
  {
    slug: 'even-or-odd', title: 'Even or Odd', category: 'Conditions',
    description: 'Use the remainder operator to classify a positive, negative, or zero integer.',
    code: program('    int n;\n    printf("Integer: ");\n    if (scanf("%d", &n) != 1) return 1;\n    if (n % 2 == 0) puts("Even");\n    else puts("Odd");'), input: '7', output: 'Integer: 7\nOdd',
    explanation: ['Dividing an even integer by two leaves a remainder of zero. Testing n % 2 == 0 also works for negative even numbers and zero.', 'Do not test n % 2 == 1 for all odd numbers: negative odd operands can produce -1. The else branch correctly covers every nonzero remainder. Test -3, 0, and 8 as boundary cases.'], concepts: ['if / else', 'Remainder', 'Negative numbers'], guide: 'basic-c-examples',
  },
  {
    slug: 'largest-of-three', title: 'Largest of Three Numbers', category: 'Conditions',
    description: 'Compare three integers while keeping track of the largest value seen so far.',
    code: program('    int a, b, c;\n    printf("Three integers: ");\n    if (scanf("%d %d %d", &a, &b, &c) != 3) return 1;\n    int largest = a;\n    if (b > largest) largest = b;\n    if (c > largest) largest = c;\n    printf("Largest: %d\\n", largest);'), input: '8 15 4', output: 'Three integers: 8 15 4\nLargest: 15',
    explanation: ['Start with an actual input as the candidate, rather than zero. That matters when all three numbers are negative. Each comparison either preserves or replaces the current candidate.', 'Equal values need no special branch because the goal is the maximum value, not a unique winning position. Try 5 5 2 and then -8 -3 -10. This running-candidate pattern extends naturally to arrays.'], concepts: ['Comparison', 'Assignment', 'Maximum'], guide: 'arrays-in-c',
  },
  {
    slug: 'factorial', title: 'Factorial', category: 'Loops',
    description: 'Multiply a sequence of integers with a bounded loop and handle zero factorial.',
    code: program('    int n;\n    unsigned long long result = 1;\n    printf("n (0 to 20): ");\n    if (scanf("%d", &n) != 1 || n < 0 || n > 20) return 1;\n    for (int i = 2; i <= n; ++i) result *= (unsigned)i;\n    printf("%d! = %llu\\n", n, result);'), input: '5', output: 'n (0 to 20): 5\n5! = 120',
    explanation: ['The product starts at one, the identity for multiplication. Each iteration multiplies by the next factor. For zero or one, the loop does not execute and the result remains one.', 'The upper bound is deliberate: 20! fits in unsigned long long, while 21! does not fit in a 64-bit value. Increasing the bound requires a different representation, not merely a longer loop.'], concepts: ['for loops', 'Accumulator', 'Integer overflow'], guide: 'basic-c-examples',
  },
  {
    slug: 'fibonacci', title: 'Fibonacci Sequence', category: 'Loops',
    description: 'Generate Fibonacci numbers by retaining only the previous two values.',
    code: program('    int count;\n    unsigned long long a = 0, b = 1;\n    printf("Terms (1 to 50): ");\n    if (scanf("%d", &count) != 1 || count < 1 || count > 50) return 1;\n    for (int i = 0; i < count; ++i) {\n        printf("%llu%s", a, i + 1 == count ? "\\n" : " ");\n        unsigned long long next = a + b;\n        a = b;\n        b = next;\n    }'), input: '8', output: 'Terms (1 to 50): 8\n0 1 1 2 3 5 8 13',
    explanation: ['Each next value is the sum of the two previous values. A temporary stores the sum before either old value is replaced. This uses constant extra space and one iteration per printed term.', 'The count limit avoids overflow and excessive output. Swapping the assignment order without preserving the old values changes the recurrence. Trace a, b, and next on paper for the first three iterations.'], concepts: ['State updates', 'Temporary variables', 'Sequences'], guide: 'basic-c-examples',
  },
  {
    slug: 'prime-number', title: 'Prime Number', category: 'Loops',
    description: 'Determine primality using trial division and a safe stopping condition.',
    code: program('    int n, prime = 1;\n    printf("Integer (up to 1000000): ");\n    if (scanf("%d", &n) != 1 || n > 1000000) return 1;\n    if (n < 2) prime = 0;\n    for (int d = 2; prime && d <= n / d; ++d) {\n        if (n % d == 0) prime = 0;\n    }\n    puts(prime ? "Prime" : "Not prime");'), input: '29', output: 'Integer (up to 1000000): 29\nPrime',
    explanation: ['A composite number has a factor no greater than its square root. Testing divisors beyond that point repeats work. The condition d <= n / d avoids multiplying d by itself, which could overflow for larger integers.', 'Numbers smaller than two are not prime. The prime flag also ends the loop after finding a divisor. Try 1, 2, 9, and 29 to exercise the special case, smallest prime, square, and ordinary prime.'], concepts: ['Trial division', 'Short-circuit conditions', 'Remainder'], guide: 'functions-in-c',
  },
  {
    slug: 'reverse-number', title: 'Reverse a Number', category: 'Loops',
    description: 'Extract decimal digits from a nonnegative integer and rebuild them in reverse order.',
    code: program('    int n, reversed = 0;\n    printf("Number (0 to 999999): ");\n    if (scanf("%d", &n) != 1 || n < 0 || n > 999999) return 1;\n    do {\n        reversed = reversed * 10 + n % 10;\n        n /= 10;\n    } while (n != 0);\n    printf("Reversed: %d\\n", reversed);'), input: '12340', output: 'Number (0 to 999999): 12340\nReversed: 4321',
    explanation: ['Remainder by ten extracts the last digit; integer division by ten removes it. Multiplying the growing result by ten makes room for the extracted digit.', 'Leading zeroes are not part of an integer value, so reversing 12340 prints 4321. Use strings when the exact sequence of characters, including zeroes, must be preserved. The input bound keeps the reconstructed result representable.'], concepts: ['do / while', 'Integer division', 'Digit extraction'], guide: 'basic-c-examples',
  },
  {
    slug: 'palindrome', title: 'Palindrome Number', category: 'Loops',
    description: 'Compare a number with its reversed digits to recognize numeric palindromes.',
    code: program('    int original, remaining, reversed = 0;\n    printf("Number (0 to 999999): ");\n    if (scanf("%d", &original) != 1 || original < 0 || original > 999999) return 1;\n    remaining = original;\n    do {\n        reversed = reversed * 10 + remaining % 10;\n        remaining /= 10;\n    } while (remaining);\n    puts(original == reversed ? "Palindrome" : "Not a palindrome");'), input: '1221', output: 'Number (0 to 999999): 1221\nPalindrome',
    explanation: ['Keep the original value because the digit-extraction loop consumes its working copy. Comparing the final reversed value with the original answers the question.', 'This definition treats input as a nonnegative number, not a text string: leading zeroes are discarded during conversion. Try 0, 121, and 120. A word palindrome needs string indexing and possibly rules for capitalization and spaces.'], concepts: ['Preserving state', 'Equality', 'Digit loops'], guide: 'basic-c-examples',
  },
  {
    slug: 'multiplication-table', title: 'Multiplication Table', category: 'Loops',
    description: 'Read three inputs in sequence and print a chosen range of multiplication facts.',
    code: program('    int number, start, end;\n    printf("Number: ");\n    if (scanf("%d", &number) != 1) return 1;\n    printf("Start: ");\n    if (scanf("%d", &start) != 1) return 1;\n    printf("End: ");\n    if (scanf("%d", &end) != 1) return 1;\n    if (number < -1000 || number > 1000 || start < 0 || end > 100 || start > end) return 1;\n    for (int i = start; i <= end; ++i)\n        printf("%d x %d = %d\\n", number, i, number * i);'), input: '5\n1\n3', output: 'Number: 5\nStart: 1\nEnd: 3\n5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15',
    explanation: ['Three separate scanf calls show real interactive input. Type each response after its prompt and press Enter. Focus remains in the terminal between requests.', 'The inclusive end condition prints the last requested row. The validation prevents a reversed range, unbounded output, or large products. To make the interval exclusive, change <= to < and compare the last row.'], concepts: ['Sequential stdin', 'Inclusive ranges', 'Formatted output'], guide: 'printf-and-scanf',
  },
  {
    slug: 'array-sum', title: 'Array Sum', category: 'Arrays',
    description: 'Walk through a fixed array and accumulate its values without stepping past its bounds.',
    code: program('    int values[] = {4, 8, -2, 10};\n    size_t count = sizeof values / sizeof values[0];\n    int sum = 0;\n    for (size_t i = 0; i < count; ++i) sum += values[i];\n    printf("Sum: %d\\n", sum);'), output: 'Sum: 20',
    explanation: ['Dividing the full array size by one element size gives the element count at the declaration site. Valid indexes run from zero through count - 1, so the comparison must be < rather than <=.', 'The sum starts at zero, the identity for addition. This sizeof technique does not recover a length from a pointer parameter; a function that receives the array must also receive its count.'], concepts: ['Array indexing', 'size_t', 'sizeof', 'Accumulator'], guide: 'arrays-in-c',
  },
  {
    slug: 'array-reverse', title: 'Reverse an Array', category: 'Arrays',
    description: 'Reverse an array in place by swapping pairs from opposite ends.',
    code: program('    int values[] = {1, 2, 3, 4, 5};\n    size_t count = sizeof values / sizeof values[0];\n    for (size_t i = 0; i < count / 2; ++i) {\n        int temporary = values[i];\n        values[i] = values[count - 1 - i];\n        values[count - 1 - i] = temporary;\n    }\n    for (size_t i = 0; i < count; ++i)\n        printf("%d%s", values[i], i + 1 == count ? "\\n" : " ");'), output: '5 4 3 2 1',
    explanation: ['Every pair needs exactly one swap. Iterating only to count / 2 prevents swapping elements back to their original positions. For an odd count, the middle element stays in place.', 'A temporary variable prevents losing the left-hand value when it is replaced. Test arrays with one, two, and four elements, then compare this algorithm with printing the original array backwards without changing it.'], concepts: ['In-place algorithms', 'Symmetric indexes', 'Swapping'], guide: 'arrays-in-c',
  },
  {
    slug: 'matrix-addition', title: 'Matrix Addition', category: 'Arrays',
    description: 'Add corresponding entries of two small matrices using nested loops.',
    code: program('    int a[2][2] = {{1, 2}, {3, 4}};\n    int b[2][2] = {{5, 6}, {7, 8}};\n    int result[2][2];\n    for (int row = 0; row < 2; ++row) {\n        for (int col = 0; col < 2; ++col) {\n            result[row][col] = a[row][col] + b[row][col];\n            printf("%d%s", result[row][col], col == 1 ? "\\n" : " ");\n        }\n    }'), output: '6 8\n10 12',
    explanation: ['Matrix addition requires the same dimensions on both sides. The outer loop selects a row; the inner loop selects each column within that row.', 'The result is another two-dimensional array. This is element-wise addition, not matrix multiplication. Change the dimensions consistently in declarations and loop bounds when experimenting; a wrong bound can access unrelated memory.'], concepts: ['Multidimensional arrays', 'Nested loops', 'Dimensions'], guide: 'arrays-in-c',
  },
  {
    slug: 'string-length', title: 'String Length', category: 'Strings',
    description: 'Count characters in a null-terminated string and distinguish length from capacity.',
    code: program('    char text[] = "Circuit";\n    size_t length = 0;\n    while (text[length] != \'\\0\') ++length;\n    printf("Length: %zu\\n", length);\n    printf("Array bytes: %zu\\n", sizeof text);'), output: 'Length: 7\nArray bytes: 8',
    explanation: ['A string ends at its first null character, which is a byte with value zero. The terminating byte takes storage but is not counted as part of the string length.', 'The compiler includes the terminator in this initialized array. For arbitrary input, ensure a terminator exists within the buffer before scanning. This byte count is not a general count of human-readable characters in UTF-8 text.'], concepts: ['Character arrays', 'Null terminator', 'Length vs capacity'], guide: 'arrays-in-c',
  },
  {
    slug: 'function', title: 'Function Example', category: 'Functions',
    description: 'Separate a reusable calculation from main using a typed function.',
    code: program('    printf("Square of 7: %d\\n", square(7));\n    printf("Square of -3: %d\\n", square(-3));', '\nint square(int value) {\n    return value * value;\n}\n'), output: 'Square of 7: 49\nSquare of -3: 9',
    explanation: ['The function definition appears before its calls, so the compiler knows its return and parameter types. Each call gives value a fresh local copy of the argument.', 'The function returns a result instead of printing it, allowing main or another function to decide what to do next. The example uses small integers; squaring a sufficiently large signed integer overflows and is undefined behavior.'], concepts: ['Parameters', 'Return values', 'Scope', 'Reuse'], guide: 'functions-in-c',
  },
  {
    slug: 'pointer', title: 'Pointer Example: Swap Two Values', category: 'Pointers',
    description: 'Use addresses to let a function update variables that belong to its caller.',
    code: program('    int a = 10, b = 20;\n    printf("Before: %d %d\\n", a, b);\n    swap(&a, &b);\n    printf("After: %d %d\\n", a, b);', '\nvoid swap(int *left, int *right) {\n    int temporary = *left;\n    *left = *right;\n    *right = temporary;\n}\n'), output: 'Before: 10 20\nAfter: 20 10',
    explanation: ['The arguments are addresses of live int objects. The parameters receive copies of those addresses, and dereferencing them accesses the caller’s objects.', 'This function assumes both pointers are valid and writable. Passing NULL or an address whose object has expired violates that contract. Compare with a function taking two plain int parameters: assigning those copies would not swap the originals.'], concepts: ['Address-of', 'Dereferencing', 'Pass by value', 'Object lifetime'], guide: 'pointers-for-beginners',
  },
  {
    slug: 'structure', title: 'Structure Example', category: 'Structures',
    description: 'Group a student name and score into one structured record.',
    code: program('    struct Student student = {"Mira", 92};\n    printf("%s scored %d\\n", student.name, student.score);\n    struct Student *record = &student;\n    record->score += 3;\n    printf("Updated score: %d\\n", student.score);', '\nstruct Student {\n    char name[32];\n    int score;\n};\n'), output: 'Mira scored 92\nUpdated score: 95',
    explanation: ['A structure groups fields with different types. Dot notation accesses a field through an object; arrow notation accesses a field through a pointer to that object.', 'The name array stores its own characters, including the null terminator. A structure may contain padding between members, so its size is not necessarily the sum of its visible field sizes. Try an array of Student records as the next exercise.'], concepts: ['struct', 'Members', 'Pointer member access', 'Initialization'], guide: 'pointers-for-beginners',
  },
  {
    slug: 'file-handling', title: 'File Handling in Memory', category: 'File Handling',
    description: 'Write and read a temporary runtime file while understanding Circuit’s filesystem boundary.',
    code: program('    FILE *file = fopen("note.txt", "w");\n    if (!file) { perror("open for writing"); return 1; }\n    if (fputs("Hello from a file\\n", file) == EOF) { fclose(file); return 1; }\n    if (fclose(file) != 0) return 1;\n    file = fopen("note.txt", "r");\n    if (!file) { perror("open for reading"); return 1; }\n    char line[64];\n    if (fgets(line, sizeof line, file)) printf("Read: %s", line);\n    int failed = ferror(file);\n    if (fclose(file) != 0) failed = 1;\n    return failed ? 1 : 0;'), output: 'Read: Hello from a file',
    explanation: ['Opening with w creates or truncates the runtime file. Closing it finishes that write before the second open reads from the beginning. Each operation can fail, so the example checks the important return values.', 'Circuit provides an in-memory WASI directory for each execution. This file does not appear on your computer, enter your saved program library, or survive another run. For persistent files and full operating-system APIs, use a local toolchain.'], concepts: ['FILE streams', 'fopen / fclose', 'Error checking', 'Ephemeral filesystem'], guide: 'online-compiler-vs-gcc',
  },
];
