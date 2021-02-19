import { Parser, ParserOptions, SupportOptions } from 'prettier';
import { parsers as babelParsers } from 'prettier/parser-babel';

interface SortJsonOptions extends ParserOptions<any> {
  jsonRecursiveSort?: boolean;
  jsonObjectSortAlgorithm?: string;
}

const isObject = (json: any) => json !== null && typeof json === 'object';

function sortObject(object: any, options: SortJsonOptions): any {
  const { jsonRecursiveSort: recursive, jsonObjectSortAlgorithm: objectSortPath } = options;

  if (Array.isArray(object) && recursive) {
    return object.map((entry: any) => {
      return sortObject(entry, options);
    });
  } else if (isObject(object) && !Array.isArray(object)) {
    // ESLint does not like calling dynamic require().
    /* eslint-disable import/no-dynamic-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, node/global-require */
    const objectSortFunction: (a: string, b: string) => number =
      objectSortPath ? require(objectSortPath).default : undefined;
    /* eslint-enable import/no-dynamic-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, node/global-require */

    const sortedJson: Record<string, any> = {};
    for (const key of Object.keys(object).sort(objectSortFunction)) {
      if (recursive && isObject(object[key])) {
        sortedJson[key] = sortObject(object[key], options);
      } else {
        sortedJson[key] = object[key];
      }
    }
    return sortedJson;
  }
  return object;
}

export const parsers = {
  'json': {
    ...babelParsers.json,
    preprocess(text: string, options: SortJsonOptions) {
      let preprocessedText = text;
      /* istanbul ignore next */
      if (babelParsers.json.preprocess) {
        preprocessedText = babelParsers.json.preprocess(text, options);
      }

      let json;
      try {
        json = JSON.parse(preprocessedText);
      } catch (_) {
        // skip invalid JSON; this is best handled by the regular JSON parser
        return text;
      }

      // Only objects are intended to be sorted by this plugin
      if (json === null || typeof json !== 'object' || (Array.isArray(json) && !options.jsonRecursiveSort)) {
        return text;
      }

      const sortedJson = sortObject(json, options);

      return JSON.stringify(sortedJson, null, 2);
    },
  },
} as Record<string, Parser>;

export const options: SupportOptions = {
  jsonRecursiveSort: {
    category: 'json-sort',
    default: false,
    description: 'Sort all JSON data recursively, including any nested properties',
    since: '0.0.2',
    type: 'boolean',
  },
  jsonObjectSortAlgorithm: {
    category: 'json-sort',
    default: '',
    description: 'Specify a file exporting a function to customize how object keys are sorted.',
    since: '0.0.3',
    type: 'path',
  },
};
