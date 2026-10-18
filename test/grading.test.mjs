import test from 'node:test';
import assert from 'node:assert/strict';
import { grade, normalize, tasks } from '../src/grading.mjs';
test('normalization and zero score', () => {
  assert.equal(normalize('  POST  '), 'post');
  assert.equal(grade({ q1: '', q2: '', q3: '' }).scoreGiven, 0);
});
test('maximum and partial result', () => {
  const answers = Object.fromEntries(tasks.map(t => [t.id, t.answer]));
  assert.equal(grade(answers).scoreGiven, 10);
  assert.equal(grade(answers).scoreMaximum, 10);
  answers.q2 = '__wrong__';
  assert.equal(grade(answers).scoreGiven, 7);
});
test('invalid answers cannot become grades', () => {
  assert.throws(() => grade({ q1: 'post', q2: 'object' }));
  assert.throws(() => grade({ q1: [], q2: 'object', q3: 'ags' }));
  assert.throws(() => grade({ q1: 'x'.repeat(201), q2: 'object', q3: 'ags' }));
});
// Собственный тест: регистр и пробелы в ответах по теме веб-технологий не должны влиять на оценку.
test('case and whitespace insensitive answers for own questions', () => {
  const answers = { q1: '  H1  ', q2: 'COLOR', q3: 'Justify-Content' };
  const result = grade(answers);
  assert.equal(result.scoreGiven, 10);
  assert.equal(result.scoreMaximum, 10);
  assert.ok(result.items.every(item => item.correct));
});
