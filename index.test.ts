import { format } from 'prettier';
import * as SortJsonPlugin from '.';

describe('Sort JSON', () => {
  it('should validate sorted JSON', () => {
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

  it('should sort unsorted JSON', () => {
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
});
