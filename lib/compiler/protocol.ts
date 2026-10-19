export const INPUT_LIMIT = 16000;
export const CONTROL_BYTES = 32;
export const OUTPUT_LIMIT = 65536;
export const ACTIVE_LIMIT_MS = 3000;
export const IDLE_LIMIT_MS = 60000;
export const SESSION_LIMIT_MS = 300000;
export const WRITE = 0,
  READ = 1,
  STATE = 2,
  ACTIVE_MS = 3,
  STARTED_AT = 4;
export const COMPILING = 0,
  RUNNING = 1,
  WAITING = 2;
export type CompilerEvent =
  | { type: 'compiling' | 'running' | 'waiting' }
  | { type: 'stdout' | 'stderr' | 'diagnostics'; text: string }
  | {
      type: 'result';
      status: string;
      message: string;
      exitCode: number | null;
    };
