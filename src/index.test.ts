// Disabled to allow strange property names in test fixtures
/* eslint-disable @typescript-eslint/naming-convention */

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

describe('Sort JSON', () => {
  it('should return an empty string unchanged', () => {
    const output = format('', {
      filepath: 'foo.json',
      parser: 'json',
      plugins: [SortJsonPlugin],
    });

    expect(output).toBe('');
  });

  it('should return an empty string when given a newline', () => {
    const output = format('\n', {
      filepath: 'foo.json',
      parser: 'json',
      plugins: [SortJsonPlugin],
    });

    expect(output).toBe('');
  });

  it('should throw Syntax Error in parser for invalid JSON', () => {
    expect(() => {
      format('{', {
        filepath: 'foo.json',
        parser: 'json',
        plugins: [SortJsonPlugin],
      });
    }).toThrow(/^Unexpected token \(1:2\)/u);
  });

  it('should throw if custom sort is invalid JSON', () => {
    expect(() => {
      format('{}', {
        filepath: 'foo.json',
        parser: 'json',
        plugins: [SortJsonPlugin],
        ...{
          jsonSortOrder: '{',
        },
      });
    }).toThrow(/^Failed to parse sort order option as JSON/u);
  });

  it('should throw if custom sort is an array', () => {
    expect(() => {
      format('{}', {
        filepath: 'foo.json',
        parser: 'json',
        plugins: [SortJsonPlugin],
        ...{
          jsonSortOrder: '[]',
        },
      });
    }).toThrow(/^Invalid custom sort order/u);
  });

  it('should throw if custom sort has invalid category sort values', () => {
    expect(() => {
      format('{}', {
        filepath: 'foo.json',
        parser: 'json',
        plugins: [SortJsonPlugin],
        ...{
          jsonSortOrder: JSON.stringify({ first: 'imaginarySort' }),
        },
      });
    }).toThrow(/^Invalid custom sort entry/u);
  });

  for (const validJson of validJsonExamples) {
    it(`should return '${validJson}' unchanged`, () => {
      const validJsonWithNewline = `${validJson}\n`;
      const output = format(validJsonWithNewline, {
        filepath: 'foo.json',
        parser: 'json',
        plugins: [SortJsonPlugin],
      });

      expect(output).toBe(validJsonWithNewline);
    });
  }

  it('should validate a sorted JSON object', () => {
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
    const output = format(input, {
      filepath: 'foo.json',
      parser: 'json',
      plugins: [SortJsonPlugin],
    });

    expect(output).toMatchSnapshot();
  });

  it('should sort an unsorted JSON object', () => {
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
    const output = format(input, {
      filepath: 'foo.json',
      parser: 'json',
      plugins: [SortJsonPlugin],
    });

    expect(output).toMatchSnapshot();
  });

  it('should validate a sorted JSON object recursively', () => {
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
    const output = format(input, {
      filepath: 'foo.json',
      parser: 'json',
      plugins: [SortJsonPlugin],
      ...{
        jsonRecursiveSort: true,
      },
    });

    expect(output).toMatchSnapshot();
  });

  it('should sort an unsorted JSON object recursively', () => {
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
    const output = format(input, {
      filepath: 'foo.json',
      parser: 'json',
      plugins: [SortJsonPlugin],
      ...{
        jsonRecursiveSort: true,
      },
    });

    expect(output).toMatchSnapshot();
  });

  it('should validate a sorted JSON object within an array recursively', () => {
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
    const output = format(input, {
      filepath: 'foo.json',
      parser: 'json',
      plugins: [SortJsonPlugin],
      ...{
        jsonRecursiveSort: true,
      },
    });

    expect(output).toMatchSnapshot();
  });

  it('should sort an unsorted JSON object within an array recursively', () => {
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
    const output = format(input, {
      filepath: 'foo.json',
      parser: 'json',
      plugins: [SortJsonPlugin],
      ...{
        jsonRecursiveSort: true,
      },
    });

    expect(output).toMatchSnapshot();
  });

  it('should validate a deeply nested sorted JSON object recursively', () => {
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
    const output = format(input, {
      filepath: 'foo.json',
      parser: 'json',
      plugins: [SortJsonPlugin],
      ...{
        jsonRecursiveSort: true,
      },
    });

    expect(output).toMatchSnapshot();
  });

  it('should sort an unsorted deeply nested JSON object recursively', () => {
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
    const output = format(input, {
      filepath: 'foo.json',
      parser: 'json',
      plugins: [SortJsonPlugin],
      ...{
        jsonRecursiveSort: true,
      },
    });

    expect(output).toMatchSnapshot();
  });

  it('should validate a sorted JSON object with unconventional keys', () => {
    const fixture = unconventionalKeys.sort().reduce((agg, key) => {
      return { ...agg, [key]: null };
    }, {});

    const input = JSON.stringify(fixture, null, 2);
    const output = format(input, {
      filepath: 'foo.json',
      parser: 'json',
      plugins: [SortJsonPlugin],
    });

    expect(output).toMatchSnapshot();
  });

  it('should sort a JSON object with unconventional keys', () => {
    const fixture = unconventionalKeys
      .sort()
      .reverse()
      .reduce((agg, key) => {
        return { ...agg, [key]: null };
      }, {});

    const input = JSON.stringify(fixture, null, 2);
    const output = format(input, {
      filepath: 'foo.json',
      parser: 'json',
      plugins: [SortJsonPlugin],
    });

    expect(output).toMatchSnapshot();
  });

  it('should sort JSON objects recursively within a nested array', () => {
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
    const output = format(input, {
      filepath: 'foo.json',
      parser: 'json',
      plugins: [SortJsonPlugin],
      ...{
        jsonRecursiveSort: true,
      },
    });

    expect(output).toMatchSnapshot();
  });

  it('should validate JSON objects recursively within a nested array', () => {
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
    const output = format(input, {
      filepath: 'foo.json',
      parser: 'json',
      plugins: [SortJsonPlugin],
      ...{
        jsonRecursiveSort: true,
      },
    });

    expect(output).toMatchSnapshot();
  });

  describe('simple custom sort', () => {
    it('should validate a sorted JSON object', () => {
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
      const output = format(input, {
        filepath: 'foo.json',
        parser: 'json',
        plugins: [SortJsonPlugin],
        ...{
          jsonSortOrder: JSON.stringify({ first: null }),
        },
      });

      expect(output).toMatchSnapshot();
    });

    it('should sort an unsorted JSON object', () => {
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
      const output = format(input, {
        filepath: 'foo.json',
        parser: 'json',
        plugins: [SortJsonPlugin],
        ...{
          jsonSortOrder: JSON.stringify({ first: null }),
        },
      });

      expect(output).toMatchSnapshot();
    });
  });

  describe('numeric custom sort', () => {
    it('should validate a sorted JSON object', () => {
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
      const output = format(input, {
        filepath: 'foo.json',
        parser: 'json',
        plugins: [SortJsonPlugin],
        ...{
          jsonSortOrder: JSON.stringify({ '/.+/u': 'numeric' }),
        },
      });

      expect(output).toMatchSnapshot();
    });

    it('should sort an unsorted JSON object', () => {
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
      const output = format(input, {
        filepath: 'foo.json',
        parser: 'json',
        plugins: [SortJsonPlugin],
        ...{
          jsonSortOrder: JSON.stringify({ '/.+/u': 'numeric' }),
        },
      });

      expect(output).toMatchSnapshot();
    });
  });

  describe('complex custom sort', () => {
    it('should validate a sorted JSON object', () => {
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
      const output = format(input, {
        filepath: 'foo.json',
        parser: 'json',
        plugins: [SortJsonPlugin],
        ...{
          jsonSortOrder: JSON.stringify(complexSort),
        },
      });

      expect(output).toMatchSnapshot();
    });

    it('should sort an unsorted JSON object', () => {
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
      const output = format(input, {
        filepath: 'foo.json',
        parser: 'json',
        plugins: [SortJsonPlugin],
        ...{
          jsonSortOrder: JSON.stringify(complexSort),
        },
      });

      expect(output).toMatchSnapshot();
    });
  });
});
