// Disabled to allow strange property names in test fixtures
/* eslint-disable @typescript-eslint/naming-convention */

import test from 'ava';
import { format } from 'prettier';

import * as SortJsonPlugin from '.';

const complexSort = {
  first: null,
  '/^0\\d+/': 'reverseNumeric',
  '/^1\\d+/': 'caseInsensitiveNumeric',
  '/^2\\d+/': 'caseInsensitiveReverseNumeric',
  '/^\\d+/': 'numeric',
  '/^a/': 'reverseLexical',
  '/^b/': 'lexical',
  '/^c/i': 'caseInsensitiveLexical',
  '/^d/i': 'caseInsensitiveReverseLexical',
  '/^e/': null,
  last: null,
};

const validJsonExamples = [
  'null',
  'true',
  'false',
  '10',
  '-10',
  '10.101',
  '1e10',
  '10.1e10',
  '-10.1e10',
  '""',
  '{}',
  '[]',
  '[1, 2, 3]',
];

const unconventionalKeys = [
  '',
  `"`,
  "'",
  '0x10',
  '0X10',
  'true',
  'false',
  'null',
  '-10',
  '10.101',
  '1e10',
  '10.1e10',
  '-10.1e10',
  '1E10',
  '{}',
  '[]',
  '[1,2,3]',
  '[',
  '{',
  // eslint-disable-next-line no-useless-escape
  '"',
  // eslint-disable-next-line no-useless-escape
  '/',
  '\\',
  '\b',
  '\f',
  '\n',
  '\r',
  '\t',
  '\u0000',
  '\uffff',
  '\uFFFF',
  '\u0020',
];

test('should return an empty string unchanged', async (t) => {
  const output = await format('', {
    filepath: 'foo.json',
    parser: 'json',
    plugins: [SortJsonPlugin],
  });

  t.is(output, '');
});

test('should return an empty string when given a newline', async (t) => {
  const output = await format('\n', {
    filepath: 'foo.json',
    parser: 'json',
    plugins: [SortJsonPlugin],
  });

  t.is(output, '');
});

test('should throw Syntax Error in parser for invalid JSON', async (t) => {
  await t.throwsAsync(
    async () =>
      format('{', {
        filepath: 'foo.json',
        parser: 'json',
        plugins: [SortJsonPlugin],
      }),
    { message: /^Unexpected token \(1:2\)/u },
  );
});

test('should throw if custom sort is invalid JSON', async (t) => {
  await t.throwsAsync(
    async () =>
      format('{}', {
        filepath: 'foo.json',
        parser: 'json',
        plugins: [SortJsonPlugin],
        ...{
          jsonSortOrder: '{',
        },
      }),
    { message: /^Failed to parse sort order option as JSON/u },
  );
});

test('should throw if custom sort is an array', async (t) => {
  await t.throwsAsync(
    async () =>
      format('{}', {
        filepath: 'foo.json',
        parser: 'json',
        plugins: [SortJsonPlugin],
        ...{
          jsonSortOrder: '[]',
        },
      }),
    { message: /^Invalid custom sort order/u },
  );
});

test('should throw if custom sort has invalid category sort values', async (t) => {
  await t.throwsAsync(
    async () =>
      format('{}', {
        filepath: 'foo.json',
        parser: 'json',
        plugins: [SortJsonPlugin],
        ...{
          jsonSortOrder: JSON.stringify({ first: 'imaginarySort' }),
        },
      }),
    { message: /^Invalid custom sort entry/u },
  );
});

for (const validJson of validJsonExamples) {
  test(`should return '${validJson}' unchanged`, async (t) => {
    const output = await format(validJson, {
      filepath: 'foo.json',
      parser: 'json',
      plugins: [SortJsonPlugin],
    });

    t.is(output, validJson);
  });
}

test('should validate a sorted JSON object', async (t) => {
  const fixture = {
    0: null,
    $: null,
    a: null,
    b: null,
    exampleNestedObject: {
      z: null,
      exampleArray: ['z', 'b', 'a'],
      examplePrimitive: 1,
      a: null,
    },
    z: null,
  };

  const input = JSON.stringify(fixture, null, 2);
  const output = await format(input, {
    filepath: 'foo.json',
    parser: 'json',
    plugins: [SortJsonPlugin],
  });

  t.snapshot(output);
});

test('should sort an unsorted JSON object', async (t) => {
  const fixture = {
    z: null,
    a: null,
    $: null,
    b: null,
    0: null,
    exampleNestedObject: {
      z: null,
      exampleArray: ['z', 'b', 'a'],
      examplePrimitive: 1,
      a: null,
    },
  };

  const input = JSON.stringify(fixture, null, 2);
  const output = await format(input, {
    filepath: 'foo.json',
    parser: 'json',
    plugins: [SortJsonPlugin],
  });

  t.snapshot(output);
});

test('should validate a sorted JSON object recursively', async (t) => {
  const fixture = {
    0: null,
    a: null,
    b: null,
    exampleNestedObject: {
      a: null,
      exampleArray: ['z', 'b', 'a'],
      examplePrimitive: 1,
      z: null,
    },
    z: null,
  };

  const input = JSON.stringify(fixture, null, 2);
  const output = await format(input, {
    filepath: 'foo.json',
    parser: 'json',
    plugins: [SortJsonPlugin],
    ...{
      jsonRecursiveSort: true,
    },
  });

  t.snapshot(output);
});

test('should sort an unsorted JSON object recursively', async (t) => {
  const fixture = {
    z: null,
    a: null,
    b: null,
    0: null,
    exampleNestedObject: {
      z: null,
      a: null,
      exampleArray: ['z', 'b', 'a'],
      examplePrimitive: 1,
    },
  };

  const input = JSON.stringify(fixture, null, 2);
  const output = await format(input, {
    filepath: 'foo.json',
    parser: 'json',
    plugins: [SortJsonPlugin],
    ...{
      jsonRecursiveSort: true,
    },
  });

  t.snapshot(output);
});

test('should validate a sorted JSON object within an array recursively', async (t) => {
  const fixture = [
    1,
    4,
    {
      0: null,
      a: null,
      b: null,
      exampleNestedObject: {
        a: null,
        exampleArray: ['z', 'b', 'a'],
        examplePrimitive: 1,
        z: null,
      },
      z: null,
    },
    2,
  ];

  const input = JSON.stringify(fixture, null, 2);
  const output = await format(input, {
    filepath: 'foo.json',
    parser: 'json',
    plugins: [SortJsonPlugin],
    ...{
      jsonRecursiveSort: true,
    },
  });

  t.snapshot(output);
});

test('should sort an unsorted JSON object within an array recursively', async (t) => {
  const fixture = [
    1,
    4,
    {
      z: null,
      a: null,
      b: null,
      0: null,
      exampleNestedObject: {
        z: null,
        a: null,
        exampleArray: ['z', 'b', 'a'],
        examplePrimitive: 1,
      },
    },
    2,
  ];

  const input = JSON.stringify(fixture, null, 2);
  const output = await format(input, {
    filepath: 'foo.json',
    parser: 'json',
    plugins: [SortJsonPlugin],
    ...{
      jsonRecursiveSort: true,
    },
  });

  t.snapshot(output);
});

test('should validate a deeply nested sorted JSON object recursively', async (t) => {
  const fixture = {
    0: null,
    a: null,
    b: null,
    exampleNestedObject: {
      a: null,
      anotherObject: {
        exampleArray: ['z', 'b', 'a'],
        examplePrimitive: 1,
        yetAnother: {
          andAnother: {
            a: null,
            b: null,
            z: null,
          },
        },
      },
      z: null,
    },
    z: null,
  };

  const input = JSON.stringify(fixture, null, 2);
  const output = await format(input, {
    filepath: 'foo.json',
    parser: 'json',
    plugins: [SortJsonPlugin],
    ...{
      jsonRecursiveSort: true,
    },
  });

  t.snapshot(output);
});

test('should sort an unsorted deeply nested JSON object recursively', async (t) => {
  const fixture = {
    z: null,
    a: null,
    b: null,
    0: null,
    exampleNestedObject: {
      z: null,
      a: null,
      anotherObject: {
        yetAnother: {
          andAnother: {
            z: null,
            b: null,
            a: null,
          },
        },
        exampleArray: ['z', 'b', 'a'],
        examplePrimitive: 1,
      },
    },
  };

  const input = JSON.stringify(fixture, null, 2);
  const output = await format(input, {
    filepath: 'foo.json',
    parser: 'json',
    plugins: [SortJsonPlugin],
    ...{
      jsonRecursiveSort: true,
    },
  });

  t.snapshot(output);
});

test('should validate a sorted JSON object with unconventional keys', async (t) => {
  const fixture = unconventionalKeys.sort().reduce((agg, key) => {
    return { ...agg, [key]: null };
  }, {});

  const input = JSON.stringify(fixture, null, 2);
  const output = await format(input, {
    filepath: 'foo.json',
    parser: 'json',
    plugins: [SortJsonPlugin],
  });

  t.snapshot(output);
});

test('should sort a JSON object with unconventional keys', async (t) => {
  const fixture = unconventionalKeys
    .sort()
    .reverse()
    .reduce((agg, key) => {
      return { ...agg, [key]: null };
    }, {});

  const input = JSON.stringify(fixture, null, 2);
  const output = await format(input, {
    filepath: 'foo.json',
    parser: 'json',
    plugins: [SortJsonPlugin],
  });

  t.snapshot(output);
});

test('should sort JSON objects recursively within a nested array', async (t) => {
  const fixture = {
    test: [null, { foo: 'bar', baz: 3 }, { foo: 'bag', brz: 2 }],
    z: null,
    a: null,
    b: null,
    0: null,
    exampleNestedObject: {
      z: null,
      a: null,
      exampleArray: ['z', 'b', 'a'],
      examplePrimitive: 1,
    },
  };

  const input = JSON.stringify(fixture, null, 2);
  const output = await format(input, {
    filepath: 'foo.json',
    parser: 'json',
    plugins: [SortJsonPlugin],
    ...{
      jsonRecursiveSort: true,
    },
  });

  t.snapshot(output);
});

test('should validate JSON objects recursively within a nested array', async (t) => {
  const fixture = {
    0: null,
    a: null,
    b: null,
    exampleNestedObject: {
      z: null,
      a: null,
      exampleArray: ['z', 'b', 'a'],
      examplePrimitive: 1,
    },
    test: [null, { baz: 3, foo: 'bar' }, { brz: 2, foo: 'bag' }],
    z: null,
  };

  const input = JSON.stringify(fixture, null, 2);
  const output = await format(input, {
    filepath: 'foo.json',
    parser: 'json',
    plugins: [SortJsonPlugin],
    ...{
      jsonRecursiveSort: true,
    },
  });

  t.snapshot(output);
});

test('should validate a sorted JSON object with a simple custom sort', async (t) => {
  const fixture = {
    first: 'first',
    0: null,
    a: null,
    b: null,
    exampleNestedObject: {
      z: null,
      exampleArray: ['z', 'b', 'a'],
      examplePrimitive: 1,
      a: null,
    },
    z: null,
  };

  const input = JSON.stringify(fixture, null, 2);
  const output = await format(input, {
    filepath: 'foo.json',
    parser: 'json',
    plugins: [SortJsonPlugin],
    ...{
      jsonSortOrder: JSON.stringify({ first: null }),
    },
  });

  t.snapshot(output);
});

test('should sort an unsorted JSON object with a simple custom sort', async (t) => {
  const fixture = {
    z: null,
    a: null,
    b: null,
    0: null,
    first: 'first',
    exampleNestedObject: {
      z: null,
      exampleArray: ['z', 'b', 'a'],
      examplePrimitive: 1,
      a: null,
    },
  };

  const input = JSON.stringify(fixture, null, 2);
  const output = await format(input, {
    filepath: 'foo.json',
    parser: 'json',
    plugins: [SortJsonPlugin],
    ...{
      jsonSortOrder: JSON.stringify({ first: null }),
    },
  });

  t.snapshot(output);
});

test('should validate a sorted JSON object with a numeric custom sort', async (t) => {
  const fixture = {
    first: 'first',
    0: null,
    3: null,
    20: null,
    100: null,
    a: null,
    b: null,
    exampleNestedObject: {
      3: null,
      20: null,
      100: null,
      z: null,
      exampleArray: ['z', 'b', 'a'],
      examplePrimitive: 1,
      a: null,
    },
    z: null,
  };

  const input = JSON.stringify(fixture, null, 2);
  const output = await format(input, {
    filepath: 'foo.json',
    parser: 'json',
    plugins: [SortJsonPlugin],
    ...{
      jsonSortOrder: JSON.stringify({ '/.+/u': 'numeric' }),
    },
  });

  t.snapshot(output);
});

test('should sort an unsorted JSON object with a numeric custom sort', async (t) => {
  const fixture = {
    z: null,
    a: null,
    b: null,
    0: null,
    100: null,
    first: 'first',
    20: null,
    3: null,
    exampleNestedObject: {
      z: null,
      exampleArray: ['z', 'b', 'a'],
      100: null,
      examplePrimitive: 1,
      3: null,
      a: null,
      20: null,
    },
  };

  const input = JSON.stringify(fixture, null, 2);
  const output = await format(input, {
    filepath: 'foo.json',
    parser: 'json',
    plugins: [SortJsonPlugin],
    ...{
      jsonSortOrder: JSON.stringify({ '/.+/u': 'numeric' }),
    },
  });

  t.snapshot(output);
});

test('should validate a sorted JSON object with a complex custom sort', async (t) => {
  const fixture = {
    first: 'first',
    '050': null,
    '021': null,
    '001': null,
    '10a': null,
    '10B': null,
    '10c': null,
    '20c': null,
    '20B': null,
    '20a': null,
    0: null,
    3: null,
    20: null,
    100: null,
    a2: null,
    a1: null,
    b1: null,
    b2: null,
    b3: null,
    c1: null,
    C2: null,
    c3: null,
    d3: null,
    D2: null,
    d1: null,
    e1: null,
    e2: null,
    exampleNestedObject: {
      '050': null,
      '021': null,
      '001': null,
      3: null,
      20: null,
      100: null,
      z: null,
      exampleArray: ['z', 'b', 'a'],
      examplePrimitive: 1,
      a: null,
    },
    z: null,
  };

  const input = JSON.stringify(fixture, null, 2);
  const output = await format(input, {
    filepath: 'foo.json',
    parser: 'json',
    plugins: [SortJsonPlugin],
    ...{
      jsonSortOrder: JSON.stringify(complexSort),
    },
  });

  t.snapshot(output);
});

test('should sort an unsorted JSON object with a complex custom sort', async (t) => {
  const fixture = {
    z: null,
    b2: null,
    '10B': null,
    a1: null,
    '001': null,
    b1: null,
    '021': null,
    c3: null,
    '20B': null,
    100: null,
    first: 'first',
    20: null,
    C2: null,
    '050': null,
    3: null,
    '10c': null,
    '10a': null,
    c1: null,
    d1: null,
    d3: null,
    '20c': null,
    a2: null,
    e1: null,
    e2: null,
    exampleNestedObject: {
      z: null,
      exampleArray: ['z', 'b', 'a'],
      100: null,
      '001': null,
      examplePrimitive: 1,
      3: null,
      '021': null,
      a: null,
      '050': null,
      20: null,
    },
    '20a': null,
    D2: null,
  };

  const input = JSON.stringify(fixture, null, 2);
  const output = await format(input, {
    filepath: 'foo.json',
    parser: 'json',
    plugins: [SortJsonPlugin],
    ...{
      jsonSortOrder: JSON.stringify(complexSort),
    },
  });

  t.snapshot(output);
});
