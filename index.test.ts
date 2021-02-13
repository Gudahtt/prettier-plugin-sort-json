import { format } from 'prettier';
import * as SortJsonPlugin from '.';

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
  '\'',
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
  '\"',
  // eslint-disable-next-line no-useless-escape
  '\/',
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
    const fixture = unconventionalKeys
      .sort()
      .reduce(
        (agg, key) => {
          return { ...agg, [key]: null };
        },
        {}
      );

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
      .reduce(
        (agg, key) => {
          return { ...agg, [key]: null };
        },
        {}
      );

    const input = JSON.stringify(fixture, null, 2);
    const output = format(input, {
      filepath: 'foo.json',
      parser: 'json',
      plugins: [SortJsonPlugin],
    });

    expect(output).toMatchSnapshot();
  });
});
