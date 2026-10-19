/** @typedef {'succeeded'|'compile_error'|'runtime_error'|'timed_out'|'output_limit'|'resource_limit'|'service_unavailable'|'invalid_request'|'busy'|'cancelled'} ExecutionStatus */
/** @typedef {{ status: ExecutionStatus, success: boolean, stdout: string, stderr: string, diagnostics: string, exitCode: number|null, signal: string|null, durationMs: number, compileMs: number, runMs: number, timedOut: boolean, truncated: boolean, message: string }} ExecutionResult */
export const statuses = [
  'succeeded',
  'compile_error',
  'runtime_error',
  'timed_out',
  'output_limit',
  'resource_limit',
  'service_unavailable',
  'invalid_request',
  'busy',
  'cancelled',
];
/** @param {ExecutionStatus} status @param {string} message @param {Partial<ExecutionResult>} [details] @returns {ExecutionResult} */
export function failure(status, message, details = {}) {
  return {
    status,
    success: status === 'succeeded',
    stdout: '',
    stderr: '',
    diagnostics: '',
    exitCode: null,
    signal: null,
    durationMs: 0,
    compileMs: 0,
    runMs: 0,
    timedOut: status === 'timed_out',
    truncated: false,
    message,
    ...details,
  };
}
/** Validates an untrusted transport response before the editor renders it. @param {unknown} value @returns {ExecutionResult} */
export function executionResult(value) {
  const p = /** @type {ExecutionResult} */ (value);
  if (
    !p ||
    !statuses.includes(p.status) ||
    typeof p.success !== 'boolean' ||
    !['stdout', 'stderr', 'diagnostics', 'message'].every(
      (k) => typeof p[k] === 'string',
    ) ||
    !['durationMs', 'compileMs', 'runMs'].every(
      (k) => typeof p[k] === 'number' && Number.isFinite(p[k]) && p[k] >= 0,
    ) ||
    !(p.exitCode === null || Number.isInteger(p.exitCode)) ||
    !(p.signal === null || typeof p.signal === 'string') ||
    typeof p.timedOut !== 'boolean' ||
    typeof p.truncated !== 'boolean' ||
    p.success !== (p.status === 'succeeded')
  )
    throw new Error('Invalid execution response.');
  return p;
}
export const statusLabels = {
  succeeded: 'Succeeded',
  compile_error: 'Compile error',
  runtime_error: 'Runtime error',
  timed_out: 'Timed out',
  output_limit: 'Output limit',
  resource_limit: 'Resource limit',
  service_unavailable: 'Service unavailable',
  invalid_request: 'Invalid request',
  busy: 'Compiler busy',
  cancelled: 'Cancelled',
};
export function consoleText(result) {
  return [result.stdout, result.stderr, result.diagnostics]
    .filter(Boolean)
    .join('\n');
}
