import { test } from 'node:test';
import assert from 'node:assert/strict';
import { format } from '@wasm-fmt/clang-format';
import { formatStyle } from '../lib/format/style';

test('formats C indentation without rewriting strings, macros, or include order', () => {
  const source = '#include <stdio.h>\n#include <math.h>\n#define DOUBLE(x) ((x) * 2)\nint main(){int a[3]={1,2,3};for(int i=0;i<3;i++){printf("a  { %d };\\n",DOUBLE(a[i]));}return 0;}';
  const output = format(source, 'main.c', formatStyle);
  assert.ok(output.startsWith('#include <stdio.h>\n#include <math.h>'));
  assert.ok(output.includes('#define DOUBLE(x) ((x) * 2)'));
  assert.ok(output.includes('    for (int i = 0; i < 3; i++) {\n        printf("a  { %d };\\n", DOUBLE(a[i]));\n    }'));
  assert.equal(format(output, 'main.c', formatStyle), output);
});
