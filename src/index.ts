import type {
  ArrayExpression,
  Expression,
  ObjectExpression,
  ObjectProperty,
  NullLiteral,
  SpreadElement,
  StringLiteral,
} from '@babel/types';
import type { Parser, ParserOptions } from 'prettier';
import { parsers as babelParsers } from 'prettier/plugins/babel';

/**
 * Lexical sort function for strings, meant to be used as the sort
 * function for `Array.prototype.sort`.
 *
 * @param a - First element to compare.
 * @param b - Second element to compare.
 * @returns A number indicating which element should come first.
 */
function lexicalSort(a: string, b: string): number {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
}

const integerPrefixRegex = /^(\d+)/u;

/**
 * Numeric sort function for strings, meant to be used as the sort
 * function for `Array.prototype.sort`.
 *
 * The number prefixing each string (if any) is sorted numerically.
 * Otherwise the string is sorted Lexically.
 *
 * @param a - First element to compare.
 * @param b - Second element to compare.
 * @returns A number indicating which element should come first.
 */
function numericSort(a: string, b: string): number {
  const aPrefixResult = a.match(integerPrefixRegex);
  const bPrefixResult = b.match(integerPrefixRegex);
  if (aPrefixResult !== null && bPrefixResult !== null) {
    // Guaranteed to be non-null because we checked for `null`, and because there is a capture
    // group in the regex
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const rawAPrefix = aPrefixResult[1]!;
    const rawBPrefix = bPrefixResult[1]!;
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
    const aPrefix = parseInt(rawAPrefix, 10);
    const bPrefix = parseInt(rawBPrefix, 10);
    const difference = aPrefix - bPrefix;
    if (difference !== 0) {
      return difference;
    }
  }
  return String(a) > String(b) ? 1 : -1;
}

/**
 * Reverse a sort function. This is meant to wrap functions meant to be
 * used as the sort function for `Array.prototype.sort`.
 *
 * @param sortFunction - The sort function to reverse.
 * @returns A reversed sort function.
 */
function reverseSort(
  sortFunction: (a: string, b: string) => number,
): (a: string, b: string) => number {
  return (a: string, b: string) => {
    return -1 * sortFunction(a, b);
  };
}

/**
 * Make a sort function case-insensitive. This is meant to wrap
 * functions meant to be used as the sort function for
 * `Array.prototype.sort`.
 *
 * @param sortFunction - The sort function to make case-insensitive.
 * @returns A case-insensitive sort function.
 */
function caseInsensitiveSort(
  sortFunction: (a: string, b: string) => number,
): (a: string, b: string) => number {
  return (a: string, b: string) => {
    return sortFunction(a.toLowerCase(), b.toLowerCase()) || sortFunction(a, b);
  };
}

/**
 * Skip sort function, meant to be used as the sort
 * function for `Array.prototype.sort`.
 *
 * @param _a - First element to compare.
 * @param _b - Second element to compare.
 * @returns A number indicating which element should come first.
 */
function noneSort(_a: string, _b: string): number {
  return 0;
}

/**
 * Sorting algorithms for categories in a custom sort order definition.
 */
enum CategorySort {
  CaseInsensitiveLexical = 'caseInsensitiveLexical',
  CaseInsensitiveNumeric = 'caseInsensitiveNumeric',
  CaseInsensitiveReverseLexical = 'caseInsensitiveReverseLexical',
  CaseInsensitiveReverseNumeric = 'caseInsensitiveReverseNumeric',
  Lexical = 'lexical',
  Numeric = 'numeric',
  ReverseLexical = 'reverseLexical',
  ReverseNumeric = 'reverseNumeric',
  None = 'none',
}

/**
 * A mapping of category sort algorithms to sort functions.
 */
const categorySortFunctions = {
  [CategorySort.CaseInsensitiveLexical]: caseInsensitiveSort(lexicalSort),
  [CategorySort.CaseInsensitiveNumeric]: caseInsensitiveSort(numericSort),
  [CategorySort.CaseInsensitiveReverseLexical]: caseInsensitiveSort(
    reverseSort(lexicalSort),
  ),
  [CategorySort.CaseInsensitiveReverseNumeric]: caseInsensitiveSort(
    reverseSort(numericSort),
  ),
  [CategorySort.Lexical]: lexicalSort,
  [CategorySort.Numeric]: numericSort,
  [CategorySort.ReverseLexical]: reverseSort(lexicalSort),
  [CategorySort.ReverseNumeric]: reverseSort(numericSort),
  [CategorySort.None]: noneSort,
};

/**
 * A list of all allowed category sort values.
 */
const allowedCategorySortValues = [null, ...Object.keys(categorySortFunctions)];

/**
 * Sort properties of JavaScript objects within an AST.
 *
 * @param ast - The AST to sort.
 * @param recursive - Whether to sort the object recursively or not.
 * @param sortCompareFunction - A custom sort function.
 * @returns The sorted object.
 */
function sortAst(
  ast: Expression,
  recursive: boolean,
  sortCompareFunction: (a: string, b: string) => number,
): Expression {
  if (ast.type === 'ArrayExpression' && recursive) {
    ast.elements = ast.elements.map(
      (element: null | NullLiteral | Expression | SpreadElement) => {
        if (element === null || element.type === 'NullLiteral') {
          return element;
        }
        // SpreadElement is not possible in a JSON file
        return sortAst(element as Expression, recursive, sortCompareFunction);
      },
    );
  } else if (ast.type === 'ObjectExpression') {
    ast.properties = (ast.properties as ObjectProperty[]).sort(
      (propertyA: ObjectProperty, propertyB: ObjectProperty) => {
        return sortCompareFunction(
          (propertyA.key as StringLiteral).value,
          (propertyB.key as StringLiteral).value,
        );
      },
    );

    if (recursive) {
      ast.properties = (ast.properties as ObjectProperty[]).map(
        (property: ObjectProperty) => {
          if (
            ['ObjectExpression', 'ArrayExpression'].includes(
              property.value.type,
            )
          ) {
            property.value = sortAst(
              property.value as ArrayExpression | ObjectExpression,
              recursive,
              sortCompareFunction,
            );
          }
          return property;
        },
      );
    }
  }
  return ast;
}

/**
 * JSON sorting options. See README for details.
 */
type SortJsonOptions = {
  jsonRecursiveSort: boolean;
  jsonSortOrder: Record<string, CategorySort | null>;
};

/**
 * Parse JSON sort options from Prettier options.
 *
 * @param prettierOptions - Prettier options.
 * @returns JSON sort options.
 */
function parseOptions(prettierOptions: ParserOptions): SortJsonOptions {
  const jsonRecursiveSort = prettierOptions.jsonRecursiveSort ?? false;

  if (typeof jsonRecursiveSort !== 'boolean') {
    throw new Error(
      `Invalid 'jsonRecursiveSort' option; expected boolean, got '${typeof prettierOptions.jsonRecursiveSort}'`,
    );
  }

  const rawJsonSortOrder = prettierOptions.jsonSortOrder ?? null;
  if (rawJsonSortOrder !== null && typeof rawJsonSortOrder !== 'string') {
    throw new Error(
      `Invalid 'jsonSortOrder' option; expected string, got '${typeof prettierOptions.rawJsonSortOrder}'`,
    );
  }

  let jsonSortOrder = null;
  if (rawJsonSortOrder !== null) {
    try {
      jsonSortOrder = JSON.parse(rawJsonSortOrder);
    } catch (error) {
      // @ts-expect-error Error cause property not yet supported by '@types/node' (see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/61827)
      throw new Error(`Failed to parse sort order option as JSON`, {
        cause: error,
      });
    }

    if (Array.isArray(jsonSortOrder) || typeof jsonSortOrder !== 'object') {
      throw new Error(`Invalid custom sort order; must be an object`);
    }

    for (const categorySort of Object.values(jsonSortOrder)) {
      if (!allowedCategorySortValues.includes(categorySort as any)) {
        throw new Error(
          `Invalid custom sort entry: value must be one of '${String(
            allowedCategorySortValues,
          )}', got '${String(categorySort)}'`,
        );
      }
    }
  }

  return { jsonRecursiveSort, jsonSortOrder };
}

/**
 * Create sort compare function from a custom JSON sort order configuration.
 *
 * @param jsonSortOrder - JSON sort order configuration.
 * @returns A sorting function for comparing Object keys.
 */
function createSortCompareFunction(
  jsonSortOrder: Record<string, CategorySort | null>,
): (a: string, b: string) => number {
  const evaluateSortEntry = (value: string, entry: string): boolean => {
    const regexRegex = /^\/(.+)\/([imsu]*)$/u;
    if (entry.match(regexRegex)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [, regexSpec, flags]: string[] = entry.match(regexRegex)!;
      // "regexSpec" guaranteed to be defined because of capture group. False positive for unnecessary type assertion.
      const regex = new RegExp(regexSpec as string, flags);
      return Boolean(value.match(regex));
    }
    return value === entry;
  };

  const sortEntries = Object.keys(jsonSortOrder);

  return (a: string, b: string): number => {
    const aIndex = sortEntries.findIndex(evaluateSortEntry.bind(null, a));
    const bIndex = sortEntries.findIndex(evaluateSortEntry.bind(null, b));

    if (aIndex === -1 && bIndex === -1) {
      return lexicalSort(a, b);
    } else if (bIndex === -1) {
      return -1;
    } else if (aIndex === -1) {
      return 1;
    } else if (aIndex === bIndex) {
      // Sort entry guaranteed to be non-null because index was found
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const sortEntry = sortEntries[aIndex]!;
      // Guaranteed to be defined because `sortEntry` is derived from `Object.keys`
      const categorySort = jsonSortOrder[sortEntry] as null | CategorySort;
      const categorySortFunction =
        categorySort === null
          ? lexicalSort
          : categorySortFunctions[categorySort];
      return categorySortFunction(a, b);
    }
    return aIndex - bIndex;
  };
}

/**
 * Prettier JSON parsers.
 */
type JsonParser = 'json';

/**
 * Create a JSON sorting parser based upon the specified Prettier parser.
 *
 * @param parser - The Prettier JSON parser to base the sorting on.
 * @returns The JSON sorting parser.
 */
function createParser(
  parser: JsonParser,
): (text: string, options: ParserOptions) => Promise<any> {
  return async (text: string, prettierOptions: ParserOptions): Promise<any> => {
    const { jsonRecursiveSort, jsonSortOrder } = parseOptions(prettierOptions);

    const jsonRootAst = await babelParsers[parser].parse(text, prettierOptions);

    // The Prettier JSON parser wraps the AST in a 'JsonRoot' node
    // This ast variable is the real document root
    const ast = jsonRootAst.node;

    // Only objects are intended to be sorted by this plugin
    // Arrays are considered only in recursive mode, so that we
    // can get to nested objected.
    if (
      !(
        ast.type === 'ObjectExpression' ||
        (ast.type === 'ArrayExpression' && jsonRecursiveSort)
      )
    ) {
      return jsonRootAst;
    }

    let sortCompareFunction: (a: string, b: string) => number = lexicalSort;
    if (jsonSortOrder) {
      sortCompareFunction = createSortCompareFunction(jsonSortOrder);
    }
    const sortedAst = sortAst(ast, jsonRecursiveSort, sortCompareFunction);

    return {
      ...jsonRootAst,
      node: sortedAst,
    };
  };
}

export const parsers = {
  json: {
    ...babelParsers.json,
    parse: createParser('json'),
  },
} as Record<string, Parser>;

export const options = {
  jsonRecursiveSort: {
    category: 'json-sort',
    default: false,
    description: 'Sort JSON files recursively, including any nested properties',
    since: '0.0.2',
    type: 'boolean' as const,
  },
  jsonSortOrder: {
    category: 'json-sort',
    description: 'A JSON string specifying a custom sort order',
    since: '0.0.4',
    type: 'string' as const,
  },
};
