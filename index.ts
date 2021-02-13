import { Parser } from 'prettier';
import { parsers as babelParsers } from 'prettier/parser-babel';

const isObject = (json: any) => json !== null && typeof json === 'object';

function sortObject(object: any, recursive: boolean): any {
  if (Array.isArray(object) && recursive) {
    return object.map((entry: any) => {
      return sortObject(entry, recursive);
    });
  } else if (object !== null && typeof object === 'object' && !Array.isArray(object)) {
    const sortedJson: Record<string, any> = {};
    for (const key of Object.keys(object).sort()) {
      if (recursive && isObject(object[key])) {
        sortedJson[key] = sortObject(object[key], recursive);
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
    preprocess(text, options: any) {
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

      const recursive = options.jsonRecursiveSort;

      // Only objects are intended to be sorted by this plugin
      if (json === null || typeof json !== 'object' || (Array.isArray(json) && !recursive)) {
        return text;
      }

      const sortedJson = sortObject(json, recursive);

      return JSON.stringify(sortedJson, null, 2);
    },
  },
} as Record<string, Parser>;

// I get a TypeScript error if I just set the type to 'boolean'
// This fixes the error. I don't know why.
const type: 'boolean' | 'path' | 'int' | 'choice' = 'boolean';

export const options = {
  jsonRecursiveSort: {
    category: 'json-sort',
    default: false,
    description: 'Sort JSON files recursively, including any nested properties',
    since: '0.0.2',
    type,
  },
};
