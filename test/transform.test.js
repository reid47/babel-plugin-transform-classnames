import { transformSync } from '@babel/core';
import plugin from '../src/index';

const transform = input => {
  return transformSync(input, {plugins: [plugin]}).code;
}

test('string literals', () => {
  const input = `
    import cn from 'classnames.macro';

    cn('wow', 'cool', 'strings');
  `;

  expect(transform(input)).toMatchSnapshot();
});

test('string literals with variable at end', () => {
  const input = `
    import cn from 'classnames.macro';

    cn('wow', 'cool', 'strings', something);
  `;

  expect(transform(input)).toMatchSnapshot();
});

test('string literals with variable at beginning', () => {
  const input = `
    import cn from 'classnames.macro';

    cn(something, 'wow', 'cool', 'strings');
  `;

  expect(transform(input)).toMatchSnapshot();
});

test('string literals with variable in the middle', () => {
  const input = `
    import cn from 'classnames.macro';

    cn('wow', something, 'cool', 'strings');
  `;

  expect(transform(input)).toMatchSnapshot();
});

test('all variables', () => {
  const input = `
    import cn from 'classnames.macro';

    cn(some, things, here);
  `;

  expect(transform(input)).toMatchSnapshot();
});

test('object literal', () => {
  const input = `
    import cn from 'classnames.macro';

    cn({key: maybe});
  `;

  expect(transform(input)).toMatchSnapshot();
});

test('object literal + strings', () => {
  const input = `
    import cn from 'classnames.macro';

    cn('hey', {key: maybe}, 'nice', 'wow');
  `;

  expect(transform(input)).toMatchSnapshot();
});

test('object literal with multiple keys', () => {
  const input = `
    import cn from 'classnames.macro';

    cn({key: maybe, hello: world});
  `;

  expect(transform(input)).toMatchSnapshot();
});

test('object literal with boolean keys', () => {
  const input = `
    import cn from 'classnames.macro';

    cn({always: true, never: false});
  `;

  expect(transform(input)).toMatchSnapshot();
});

test('multiple object literals', () => {
  const input = `
    import cn from 'classnames.macro';

    cn({always: true, never: false}, "string", {hello: world}, {another: obj});
  `;

  expect(transform(input)).toMatchSnapshot();
});