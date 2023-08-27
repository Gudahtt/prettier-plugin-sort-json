import type {
  ArrayExpression,
  Expression,
  ObjectExpression,
  ObjectProperty,
  NullLiteral,
  SpreadElement,
  StringLiteral,
} from '@babel/types';
import type { Parser } from 'prettier';
import { parsers as babelParsers } from 'prettier/plugins/babel';

/**
 * Lexical sort function for strings, meant to be used as the sort
 * function for `Array.prototype.sort`.
 *
 * @param a - First element to compare.
 * @param b - Second element to compare.
 * @returns A number indicating which element should come first.
 */
function lexicalSort(a: string, b: string) {
  return a > b ? 1 : -1;
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
function numericSort(a: string, b: string) {
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
function reverseSort(sortFunction: (a: string, b: string) => number) {
  return (a: string, b: string) => {
    return -1 * sortFunction(a, b);
  };
}

/**
 * Make a sort function case-insensitive.. This is meant to wrap
 * functions meant to be used as the sort function for
 * `Array.prototype.sort`.
 *
 * @param sortFunction - The sort function to make case-insensitive.
 * @returns A case-insensitive sort function.
 */
function caseInsensitiveSort(sortFunction: (a: string, b: string) => number) {
  return (a: string, b: string) => {
    return sortFunction(a.toLowerCase(), b.toLowerCase());
  };
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

export const parsers = {
  json: {
    ...babelParsers.json,
    async parse(text, options: any) {
      const jsonRootAst = await babelParsers.json.parse(text, options);

      // The Prettier JSON parser wraps the AST in a 'JsonRoot' node
      // This ast variable is the real document root
      const ast = jsonRootAst.node;

      const { jsonRecursiveSort, jsonSortOrder } = options;

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
        let parsedCustomSort;
        try {
          parsedCustomSort = JSON.parse(jsonSortOrder);
        } catch (error) {
          // @ts-expect-error Error cause property not yet supported by '@types/node' (see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/61827)
          throw new Error(`Failed to parse sort order option as JSON`, {
            cause: error,
          });
        }

        if (
          Array.isArray(parsedCustomSort) ||
          typeof parsedCustomSort !== 'object'
        ) {
          throw new Error(`Invalid custom sort order; must be an object`);
        }

        for (const categorySort of Object.values(parsedCustomSort)) {
          if (!allowedCategorySortValues.includes(categorySort as any)) {
            throw new Error(
              `Invalid custom sort entry: value must be one of '${String(
                allowedCategorySortValues,
              )}', got '${String(categorySort)}'`,
            );
          }
        }
        const customSort = parsedCustomSort as Record<
          string,
          null | CategorySort
        >;

        const evaluateSortEntry = (value: string, entry: string) => {
          const regexRegex = /^\/(.+)\/([imsu]*)$/u;
          if (entry.match(regexRegex)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const [, regexSpec, flags]: string[] = entry.match(regexRegex)!;
            // "regexSpec" guaranteed to be defined because of capture group. False positive for unnecessary type assertion.
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            const regex = new RegExp(regexSpec as string, flags);
            return value.match(regex);
          }
          return value === entry;
        };

        const sortEntries = Object.keys(customSort);

        sortCompareFunction = (a: string, b: string) => {
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
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            const categorySort = customSort[sortEntry] as null | CategorySort;
            const categorySortFunction =
              categorySort === null
                ? lexicalSort
                : categorySortFunctions[categorySort];
            return categorySortFunction(a, b);
          }
          return aIndex - bIndex;
        };
      }
      const sortedAst = sortAst(ast, jsonRecursiveSort, sortCompareFunction);

      return {
        ...jsonRootAst,
        node: sortedAst,
      };
    },
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
