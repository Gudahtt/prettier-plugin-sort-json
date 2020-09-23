import { format } from 'prettier';
import * as SortJsonPlugin from '.';

const validNonObjectJsonExamples = [
  '{}',
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

  for (const validNonObjectJson of validNonObjectJsonExamples) {
    it(`should return '${validNonObjectJson}' unchanged`, () => {
      const validNonObjectJsonWithNewline = `${validNonObjectJson}\n`;
      const output = format(validNonObjectJsonWithNewline, {
        filepath: 'foo.json',
        parser: 'json',
        plugins: [SortJsonPlugin],
      });

      expect(output).toBe(validNonObjectJsonWithNewline);
    });
  }

  it('should validate a sorted JSON object', () => {
    const fixture = {
      0: '0',
      a: 'a',
      b: 'b',
      c: 'c',
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
      0: '0',
      b: 'b',
      a: 'a',
      c: 'c',
    };

    const input = JSON.stringify(fixture, null, 2);
    const output = format(input, {
      filepath: 'foo.json',
      parser: 'json',
      plugins: [SortJsonPlugin],
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
