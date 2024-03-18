# prettier-plugin-sort-json

A plugin for [Prettier](https://prettier.io) that sorts JSON files by property name.

> [!IMPORTANT]
> This plugin supports Prettier v3 as of version 3.0.0 of this plugin. The latest release will no longer work with Prettier v2.
>
> We are maintaining support for Prettier v2 on version 2 of this plugin. See [the main-v2 branch](https://github.com/Gudahtt/prettier-plugin-sort-json/tree/main-v2) for instructions on using v2 of this plugin.

## Requirements

This module requires an [LTS](https://github.com/nodejs/Release) Node version (v16.0.0+), and `prettier` v3+.

## Install

Using `npm`:

```console
npm install --save-dev prettier-plugin-sort-json
```

Using `yarn`:

```console
yarn add --dev prettier-plugin-sort-json
```

Then [follow these instructions](https://prettier.io/docs/en/plugins#using-plugins) to load the plugin.

There are some additional configuration options available ([described below](#configuration)), but they are all optional.

## Description

This plugin adds a JSON preprocessor that will sort JSON files alphanumerically by key. By default, only top-level JSON objects are sorted. JSON files containing Arrays or other non-Object values are skipped.

Object entries are sorted by key lexically using [`Array.sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort), according to each character's Unicode code point value.

Note that this will not sort `package.json`, `package-lock.json`, or `composer.json`. This plugin only affects the `json` parser used by Prettier. Prettier uses an alternate parser (`json-stringify`) for those three specific files ([See here for details](https://github.com/prettier/prettier/blob/9a8b579d368db99394ab9da114cc37ba772fc887/src/language-js/index.js#L80)).

This also will not sort JSON objects within other types of files, such as JavaScript or TypeScript files. This is just for sorting JSON files.

## Examples

Before:

```json
{
  "z": null,
  "a": null,
  "b": null,
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
  "b": null,
  "exampleNestedObject": {
    "z": null,
    "a": null
  },
  "z": null
}
```

## Configuration

These configuration options are all optional. Each option can be set as a CLI flag, or as an entry in your Prettier configuraton (e.g. in your `.prettierrc` file).

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

Each key represents a literal key value or a _category_ of keys, represented by a regular expression. Regular expressions are identified by leading and trailing forward slashes, along with some number of paths optionally following the trailing slash (supported flags are `i`, `m`, `s`, and `u`).

Each category is ordered in relation to other categories. Each value represents the sorting algorithm to use _within_ that category. If the value is `null`, the default sorting algorithm `lexical` is used. Here are the supported sorting algorithms:

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

Keys that do not match any defined category are treated as being in an implied last category, with `lexical` sorting.

> Note: Escaping can be tricky, especially if you are using regular expression sort keys. These regular expressions are configured as strings, so any backslashes require an additional escape (e.g. notice the double-backslash here: `"/^\\d+/"`).
>
> If this key is configured as part of a JSON Prettier configuration file (`prettierrc.json`), all double-quotes and backslashes need to be escaped _again_. For example, the example JSON sort order string would would be `"{ \"placeThisFirst\": null, \"/^[^\\\\d+]/\": \"lexical\", \"/^\\\\d+/\": \"numeric\" }`.

## Contributing

### Setup

- Install the current LTS version of [Node.js](https://nodejs.org)
  - If you are using [nvm](https://github.com/creationix/nvm#installation) (recommended) running `nvm use` will automatically choose the right node version for you.
- Install [Yarn v3](https://yarnpkg.com/getting-started/install)
- Run `yarn install` to install dependencies and run any requried post-install scripts

### Testing and Linting

Run `yarn test` to run the tests.

Run `yarn lint` to run the linter, or run `yarn lint:fix` to run the linter and fix any automatically fixable issues.

### Release & Publishing

The project follows the same release process as the other libraries in the MetaMask organization. The GitHub Actions [`action-create-release-pr`](https://github.com/MetaMask/action-create-release-pr) and [`action-publish-release`](https://github.com/MetaMask/action-publish-release) are used to automate the release process; see those repositories for more information about how they work.

1. Choose a release version.

   - The release version should be chosen according to SemVer. Analyze the changes to see whether they include any breaking changes, new features, or deprecations, then choose the appropriate SemVer version. See [the SemVer specification](https://semver.org/) for more information.

2. If this release is backporting changes onto a previous release, then ensure there is a major version branch for that version (e.g. `1.x` for a `v1` backport release).

   - The major version branch should be set to the most recent release with that major version. For example, when backporting a `v1.0.2` release, you'd want to ensure there was a `1.x` branch that was set to the `v1.0.1` tag.

3. Trigger the [`workflow_dispatch`](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#workflow_dispatch) event [manually](https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow) for the `Create Release Pull Request` action to create the release PR.

   - For a backport release, the base branch should be the major version branch that you ensured existed in step 2. For a normal release, the base branch should be the main branch for that repository (which should be the default value).
   - This should trigger the [`action-create-release-pr`](https://github.com/MetaMask/action-create-release-pr) workflow to create the release PR.

4. Update the changelog to move each change entry into the appropriate change category ([See here](https://keepachangelog.com/en/1.0.0/#types) for the full list of change categories, and the correct ordering), and edit them to be more easily understood by users of the package.

   - Generally any changes that don't affect consumers of the package (e.g. lockfile changes or development environment changes) are omitted. Exceptions may be made for changes that might be of interest despite not having an effect upon the published package (e.g. major test improvements, security improvements, improved documentation, etc.).
   - Try to explain each change in terms that users of the package would understand (e.g. avoid referencing internal variables/concepts).
   - Consolidate related changes into one change entry if it makes it easier to explain.
   - Run `yarn auto-changelog validate --rc` to check that the changelog is correctly formatted.

5. Review and QA the release.

   - If changes are made to the base branch, the release branch will need to be updated with these changes and review/QA will need to restart again. As such, it's probably best to avoid merging other PRs into the base branch while review is underway.

6. Squash & Merge the release.

   - This should trigger the [`action-publish-release`](https://github.com/MetaMask/action-publish-release) workflow to tag the final release commit and publish the release on GitHub.

7. Publish the release on npm.

   - Be very careful to use a clean local environment to publish the release, and follow exactly the same steps used during CI.
   - Use `npm publish --dry-run` to examine the release contents to ensure the correct files are included. Compare to previous releases if necessary (e.g. using `https://unpkg.com/browse/[package name]@[package version]/`).
   - Once you are confident the release contents are correct, publish the release using `npm publish`.
