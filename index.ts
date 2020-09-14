import { Parser } from 'prettier';
import { parsers as babelParsers } from 'prettier/parser-babel';

export const parsers = {
  'json': {
    ...babelParsers.json,
    preprocess (text: any, options: any) {
      let preprocessedText = text;
      /* istanbul ignore next */
      if (babelParsers.json.preprocess) {
        preprocessedText = babelParsers.json.preprocess(text, options);
      }

      const json = JSON.parse(preprocessedText);

      const sortedJson: Record<string, any> = {};
      for (const key of Object.keys(json).sort()) {
        sortedJson[key] = json[key];
      }

      return JSON.stringify(sortedJson, null, 2);
    },
  },
} as Record<string, Parser>;
