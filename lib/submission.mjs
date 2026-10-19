export const MAX_BODY = 160000;
export class SubmissionError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
export function validateSubmission(data) {
  if (!data || typeof data.code !== 'string' || typeof data.input !== 'string')
    throw new SubmissionError('Code and input must be strings.');
  if (!data.code.trim())
    throw new SubmissionError('Write some C code before running.');
  if (data.code.length > 100000)
    throw new SubmissionError('Code must be 100,000 characters or less.', 413);
  if (data.input.length > 16000)
    throw new SubmissionError('Input must be 16,000 characters or less.', 413);
  return { code: data.code, input: data.input };
}
export async function readLimitedJson(stream, max = MAX_BODY) {
  if (!stream) throw new SubmissionError('Request body is required.');
  const reader = stream.getReader(),
    chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > max) {
        await reader.cancel();
        throw new SubmissionError('Request is too large.', 413);
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    try {
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      throw new SubmissionError('Invalid JSON request.');
    }
  } finally {
    reader.releaseLock();
  }
}
