import { Parser } from 'prettier';
import { parsers as babelParsers } from 'prettier/parser-babel';
import type {
  ArrayExpression,
  Expression,
  ObjectExpression,
  ObjectProperty,
  NullLiteral,
  SpreadElement,
  StringLiteral,
} from '@babel/types';

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

/**
 * Sort properties of JavaScript objects within an AST.
 *
 * @param ast - The AST to sort.
 * @param recursive - Whether to sort the object recursively or not.
 * @returns The sorted object.
 */
function sortAst(ast: Expression, recursive: boolean): Expression {
  if (ast.type === 'ArrayExpression' && recursive) {
    ast.elements = ast.elements.map(
      (element: null | NullLiteral | Expression | SpreadElement) => {
        if (element === null || element.type === 'NullLiteral') {
          return element;
        }
        // SpreadElement is not possible in a JSON file
        return sortAst(element as Expression, recursive);
      },
    );
  } else if (ast.type === 'ObjectExpression') {
    ast.properties = (ast.properties as ObjectProperty[]).sort(
      (propertyA: ObjectProperty, propertyB: ObjectProperty) => {
        return lexicalSort(
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
    parse(text, _parsers, options: any) {
      const ast: Expression = babelParsers.json.parse(text, _parsers, options);

      const { jsonRecursiveSort } = options;

      // Only objects are intended to be sorted by this plugin
      // Arrays are considered only in recursive mode, so that we
      // can get to nested objected.
      if (
        !(
          ast.type === 'ObjectExpression' ||
          (ast.type === 'ArrayExpression' && jsonRecursiveSort)
        )
      ) {
        return ast;
      }

      return sortAst(ast, jsonRecursiveSort);
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
};
