import { BrowserSession } from '../../lib/compiler/browser-session';
import type { CompilerEvent } from '../../lib/compiler/protocol';
import { examples } from '../../lib/content/examples';

const cases = [
  ...examples.map((example) => ({
    name: `published example: ${example.slug}`,
    code: example.code,
    inputs: example.input ? [example.input + '\n'] : undefined,
    // The published transcript includes terminal echo, while stdout does not.
    out: example.output.replace(/\r/g, '').split('\n').map((line) => {
      const response = example.input?.split('\n').find((value) => line.endsWith(': ' + value));
      return response === undefined ? line + '\n' : line.slice(0, -response.length);
    }).join(''),
  })),
  { name: 'abandoned stdin idle timeout', code: '#include <stdio.h>\nint main(){int n;printf("Waiting: ");scanf("%d",&n);}', status: 'timed_out' },
  { name: 'multiple values in a single stdin line', code: '#include <stdio.h>\nint main(){int a,b,c;scanf("%d%d%d",&a,&b,&c);printf("%d",a+b+c);}', inputs: ['10 20 30\n'], out: '60' },
  {
    name: 'printf',
    code: '#include <stdio.h>\nint main(){printf("Hello, world!\\n");}',
    out: 'Hello, world!\n',
  },
  {
    name: 'one scanf',
    code: '#include <stdio.h>\nint main(){int n;printf("Value: ");scanf("%d",&n);printf("%d",n*2);}',
    inputs: ['21\n'],
    out: 'Value: 42',
  },
  {
    name: 'three sequential scanf',
    code: '#include <stdio.h>\nint main(){int a,b,c;printf("A: ");scanf("%d",&a);printf("B: ");scanf("%d",&b);printf("C: ");scanf("%d",&c);printf("%d",a*b*c);}',
    inputs: ['3\n', '4\n', '5\n'],
    out: 'A: B: C: 60',
  },
  {
    name: 'delayed human input (6 seconds)',
    code: '#include <stdio.h>\nint main(){int n;printf("Wait: ");scanf("%d",&n);printf("%d",n);}',
    inputs: ['77\n'],
    delay: 6000,
    out: 'Wait: 77',
  },
  {
    name: 'getchar and UTF-8 streams',
    code: '#include <stdio.h>\nint main(){printf("Character: ");int c=getchar();printf("%c café ✓",c);fprintf(stderr,"é stderr");}',
    inputs: ['Z\n'],
    out: 'Character: Z café ✓',
    err: 'é stderr',
  },
  {
    name: 'loops and arrays',
    code: '#include <stdio.h>\nint main(){int a[]={1,2,3,4},sum=0;for(int i=0;i<4;i++)sum+=a[i];int n=3;while(n--)sum++;printf("%d",sum);}',
    out: '13',
  },
  {
    name: 'functions and recursion',
    code: '#include <stdio.h>\nint fact(int n){return n<2?1:n*fact(n-1);}int main(){printf("%d",fact(6));}',
    out: '720',
  },
  {
    name: 'pointers and structures',
    code: '#include <stdio.h>\nstruct Pair{int x,y;};int main(){struct Pair p={4,7};struct Pair *q=&p;int *x=&q->x;*x+=2;printf("%d",q->x*q->y);}',
    out: '42',
  },
  {
    name: 'malloc and free',
    code: '#include <stdio.h>\n#include <stdlib.h>\nint main(){int *p=malloc(4*sizeof(int));if(!p)return 1;for(int i=0;i<4;i++)p[i]=i;printf("%d",p[3]);free(p);}',
    out: '3',
  },
  {
    name: 'libm',
    code: '#include <stdio.h>\n#include <math.h>\nint main(){volatile double x=81;printf("%.0f",sqrt(x));}',
    out: '9',
  },
  {
    name: 'compile error',
    code: 'int main(){bad syntax}',
    status: 'compile_error',
    diagnostic: 'error:',
  },
  {
    name: 'nonfatal warnings still run',
    code: '#include <stdio.h>\nint main(){int unused;printf("ok");}',
    out: 'ok',
    diagnostic: 'warning:',
  },
  {
    name: 'nonzero exit',
    code: 'int main(){return 7;}',
    status: 'runtime_error',
    exitCode: 7,
  },
  {
    name: 'detectable WASM runtime trap',
    code: 'int main(){__builtin_trap();}',
    status: 'runtime_error',
  },
  {
    name: 'infinite loop timeout and responsive UI',
    code: 'int main(){volatile unsigned n=0;for(;;)n++;}',
    status: 'timed_out',
    heartbeat: true,
  },
  {
    name: 'infinite loop Stop and responsive UI',
    code: 'int main(){volatile unsigned n=0;for(;;)n++;}',
    status: 'cancelled',
    stop: true,
    heartbeat: true,
  },
  {
    name: 'Stop while blocked in scanf',
    code: '#include <stdio.h>\nint main(){int n;scanf("%d",&n);}',
    status: 'cancelled',
    stopWaiting: true,
  },
  {
    name: 'stdout output limit',
    code: '#include <stdio.h>\nint main(){for(;;)putchar(65);}',
    status: 'output_limit',
  },
  {
    name: 'fresh worker after Stop/failure',
    code: '#include <stdio.h>\nint main(){printf("recovered");}',
    out: 'recovered',
  },
] satisfies Array<{
  name: string;
  code: string;
  out?: string;
  err?: string;
  inputs?: string[];
  delay?: number;
  status?: string;
  diagnostic?: string;
  exitCode?: number;
  stop?: boolean;
  stopWaiting?: boolean;
  heartbeat?: boolean;
}>;

const results = document.querySelector<HTMLPreElement>('#results')!;
document.querySelector<HTMLButtonElement>('#run')!.onclick = async () => {
  const button = document.querySelector<HTMLButtonElement>('#run')!;
  button.disabled = true;
  results.textContent = '';
  let passed = 0;
  for (const test of cases) {
    results.textContent += `RUN ${test.name}\n`;
    try {
      const result = await new Promise<{
        stdout: string;
        stderr: string;
        diagnostics: string;
        event: Extract<CompilerEvent, { type: 'result' }>;
        beats: number;
      }>((resolve, reject) => {
        let stdout = '',
          stderr = '',
          diagnostics = '',
          index = 0,
          beats = 0;
        const heartbeat = setInterval(() => beats++, 25);
        const session = new BrowserSession(test.code, (event) => {
          if (event.type === 'stdout') stdout += event.text;
          if (event.type === 'stderr') stderr += event.text;
          if (event.type === 'diagnostics') diagnostics += event.text;
          if (event.type === 'running' && 'stop' in test && test.stop)
            setTimeout(() => session.stop(), 150);
          if (event.type === 'waiting') {
            if ('stopWaiting' in test && test.stopWaiting) session.stop();
            else if (
              'inputs' in test &&
              test.inputs &&
              index < test.inputs.length
            ) {
              const text = test.inputs[index++];
              setTimeout(
                () => session.input(text),
                'delay' in test ? test.delay : 30,
              );
            }
          }
          if (event.type === 'result') {
            clearInterval(heartbeat);
            resolve({ stdout, stderr, diagnostics, event, beats });
          }
        });
      });
      const expected = 'status' in test ? test.status : 'succeeded';
      if (result.event.status !== expected)
        throw new Error(
          `expected ${expected}, got ${result.event.status}: ${result.event.message}\n${result.diagnostics}`,
        );
      if ('out' in test && result.stdout !== test.out)
        throw new Error(`stdout ${JSON.stringify(result.stdout)}`);
      if ('err' in test && result.stderr !== test.err)
        throw new Error(`stderr ${JSON.stringify(result.stderr)}`);
      if (
        'diagnostic' in test &&
        !result.diagnostics.includes(test.diagnostic!)
      )
        throw new Error('Missing diagnostic');
      if ('exitCode' in test && result.event.exitCode !== test.exitCode)
        throw new Error('Wrong exit code');
      if ('heartbeat' in test && result.beats < 3)
        throw new Error('UI heartbeat stalled');
      results.textContent += `PASS ${test.name}\n`;
      passed++;
    } catch (error) {
      results.textContent += `FAIL ${test.name}: ${error instanceof Error ? error.message : String(error)}\n`;
    }
  }
  results.textContent += `DONE ${passed}/${cases.length} passed\n`;
  button.disabled = false;
};
