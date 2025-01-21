# prettier-plugin-sort-json

A plugin for [Prettier](https://prettier.io) that sorts JSON files by property name.

## Description

This plugin adds a JSON preprocessor that will sort JSON files alphanumerically by key.

By default, top-level object entries are sorted by key lexically using [`Array.sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort), according to each character's Unicode code point value. It can be [configured](#configuration) to sort recursively, and with a custom sort order.

### Example

Before:

```json
{
  "z": null,
  "a": null,
  "0": null,
  "exampleNestedObject": {
    "z": null,
    "a": null
  }
}
```

After:

```json
{
  "0": null,
  "a": null,
  "exampleNestedObject": {
    "z": null,
    "a": null
  },
  "z": null
}
```

### Exceptions

- Non-objects

  This is meant to sort objects. JSON files with a top-level value that is not an object are skipped.

- JSON files with dedicated Prettier parsers

  This will not sort `package.json`, `package-lock.json`, or `composer.json`. This plugin only affects the `json` parser used by Prettier. Prettier uses an alternate parser (`json-stringify`) for those three specific files ([See here for details](https://github.com/prettier/prettier/blob/9a8b579d368db99394ab9da114cc37ba772fc887/src/language-js/index.js#L80)).

- JSON embedded in other files

  This will not sort JSON objects within other types of files, such as JavaScript or TypeScript files. This is just for sorting JSON files.

## Requirements

This module requires an [LTS](https://github.com/nodejs/Release) Node version (v16.0.0+), and `prettier` v3+.

We are maintaining support for Prettier v2 on version 2 of this plugin. See [the main-v2 branch](https://github.com/Gudahtt/prettier-plugin-sort-json/tree/main-v2) for instructions on using v2 of this plugin.

## Install

Using `npm`:

```console
npm install --save-dev prettier-plugin-sort-json
```

Using `pnpm`:

```console
pnpm add --save-dev prettier-plugin-sort-json
```

Using `yarn`:

```console
yarn add --dev prettier-plugin-sort-json
```

Then [follow these instructions](https://prettier.io/docs/en/plugins#using-plugins) to load the plugin.

There are some additional configuration options available ([described below](#configuration)), but they are all optional.

### Example Prettier configuration

```json
{
  "plugins": ["prettier-plugin-sort-json"]
}
```

## Configuration

These configuration options are all optional. Each option can be set as a CLI flag, or as an entry in your Prettier configuraton (e.g. in your `.prettierrc` file).

Here is an example `.prettierrc` file with all default options set:

```json
{
  "plugins": ["prettier-plugin-sort-json"],
  "jsonRecursiveSort": false,
  "jsonSortOrder": "{\"*\": \"lexical\"}"
}
```

### JSON Recursive Sort

Sort JSON objects recursively, including all nested objects. This also sorts objects within JSON arrays.

| Default | CLI                     | Configuration               |
| ------- | ----------------------- | --------------------------- |
| `false` | `--json-recursive-sort` | `jsonRecursiveSort: <bool>` |

### JSON Sort Order

Use a custom sort order. This is specified as a JSON string that maps exact strings or regular expressions to sorting algorithms.

| Default | CLI                            | Configuration             |
| ------- | ------------------------------ | ------------------------- |
| `""`    | `--json-sort-order '<string>'` | `jsonSortOrder: <string>` |

Here is an example JSON sort order string:

```
'{ "placeThisFirst": null, "/^[^\\d+]/": "lexical", "/^\\d+/": "numeric" }'
```

This sorts the key "placeThisFirst" ahead of all others. After that, the set of all keys that _don't_ start with a number are sorted lexically. Lastly, the set of keys that start with a number are sorted numerically.

Each `jsonSortOrder` key represents a literal key value or a _category_ of keys, represented by a regular expression. Regular expressions are identified by leading and trailing forward slashes, along with some number of paths optionally following the trailing slash (supported flags are `i`, `m`, `s`, and `u`).

Each `jsonSortOrder` value represents the sorting algorithm to use _within_ that category. If the value is `null`, the default sorting algorithm `lexical` is used. Here are the supported sorting algorithms:

| Sorting Algorithm               | Description                                                                                                 |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `lexical`                       | Sort lexically (i.e. lexicographically). This is the default.                                               |
| `numeric`                       | For keys that are prefixed with a number, sort by that number in ascending order. Otherwise sort lexically. |
| `reverseLexical`                | Reverse-order lexical sort.                                                                                 |
| `reverseNumeric`                | Reverse-order numeric sort.                                                                                 |
| `caseInsensitiveLexical`        | Case-insensitive lexical sort.                                                                              |
| `caseInsensitiveNumeric`        | Case-insensitive numeric sort.                                                                              |
| `caseInsensitiveReverseLexical` | Case-insensitive reverse-order lexical sort.                                                                |
| `caseInsensitiveReverseNumeric` | Case-insensitive reverse-order numeric sort.                                                                |
| `none`                          | Do not sort.                                                                                                |

The order of the `jsonSortOrder` configuration determines how the keys in each category are sorted in relation to each other. Keys that do not match any defined category are treated as being in an implied last category, with `lexical` sorting.

> Note: Escaping can be tricky, especially if you are using regular expression sort keys. These regular expressions are configured as strings, so any backslashes require an additional escape (e.g. notice the double-backslash here: `"/^\\d+/"`).
>
> If this key is configured as part of a JSON Prettier configuration file (`prettierrc.json`), all double-quotes and backslashes need to be escaped _again_. For example, the example JSON sort order string would would be `"{ \"placeThisFirst\": null, \"/^[^\\\\d+]/\": \"lexical\", \"/^\\\\d+/\": \"numeric\" }`.

## Ignoring files

This plugin can be used on specific files using [Prettier configuration overrides](https://prettier.io/docs/en/configuration#configuration-overrides). By configuring this plugin in an override, you can control which files it is applied to. Overrides can also allow using different configuration for different files (e.g. different sort order)

For example, lets say you had the following requirements:

- No sorting of JSON by default
- Shallow (non-recursive) sort JSON in the `json/` directory
- Do not sort the file `json/unsorted.json`
- Recursively sort `recursively-sorted.json`

You could do that with this `.prettierrc.json` file:

```json
{
  "overrides": [
    {
      "excludedFiles": ["./json/unsorted.json"],
      "files": ["./json/**"],
      "options": {
        "plugins": ["prettier-plugin-sort-json"]
      }
    },
    {
      "files": ["./json/recursive-sorted.json"],
      "options": {
        "jsonRecursiveSort": true
      }
    }
  ]
}
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)
