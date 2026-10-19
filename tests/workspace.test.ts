import { test } from 'node:test';
import assert from 'node:assert/strict';
import { restoreWorkspace } from '../lib/workspace';
test('workspace restores order, selection and positions while rejecting stale tabs', () => {
  const position = { anchor: 3, head: 5, top: 140, left: 22 };
  assert.deepEqual(
    restoreWorkspace(
      {
        tabs: ['b', 'missing', 'a', 'b'],
        active: 'b',
        height: 320,
        positions: { b: position },
      },
      ['a', 'b'],
    ),
    { tabs: ['b', 'a'], active: 'b', height: 320, positions: { b: position } },
  );
  assert.equal(
    restoreWorkspace({ tabs: [], height: Infinity }, ['a']).active,
    '',
  );
  assert.deepEqual(restoreWorkspace(undefined, ['a']).tabs, ['a']);
});
