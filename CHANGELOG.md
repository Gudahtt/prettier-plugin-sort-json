# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [4.2.0]
### Uncategorized
- chore(deps): update dependency prettier to v3.7.4 ([#294](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/294))
- chore(deps): update minor ([#293](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/293))
- fix: numeric for negative numbers ([#291](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/291))
- Extend Prettier’s `Options` interface with plugin options ([#292](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/292))
- chore(deps): update dependency @babel/types to v7.28.5 ([#290](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/290))
- chore(deps): update dependency @types/node to v24.7.2 ([#289](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/289))
- chore(deps): update minor ([#288](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/288))
- chore(deps): update minor ([#287](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/287))
- chore(deps): update minor ([#286](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/286))
- chore(deps): update yarn to v4.9.3 ([#285](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/285))
- Add JavaScript example of default config ([#282](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/282))
- Fix broken README example ([#281](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/281))
- Add recommendation to avoid escaping ([#280](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/280))
- Improve documentation around `json-sort-order` option ([#279](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/279))
- chore(deps): update dependency prettier to v3.6.2 ([#273](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/273))
- chore(deps): update minor ([#272](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/272))
- chore(deps): update dependency @metamask/auto-changelog to v5 ([#274](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/274))
- chore(deps): update dependency @types/node to v24 ([#276](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/276))
- chore(deps): update minor ([#270](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/270))
- fix: ignoring files json example ([#269](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/269))
- docs: add `pnpm` installation option ([#268](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/268))
- chore(deps): update dependency @types/node to v20.17.10 ([#267](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/267))

## [4.1.1]
### Fixed
- Fix `jsonSortOrder` validation ([#263](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/263))
  - The plugin was throwing an error when `jsonSortOrder` was not set.

## [4.1.0]
### Added
- Export `SortJsonOptions` and `CategorySort` types ([#256](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/256))

### Changed
- Update TypeScript from `~5.1.0` to `~5.5.0` ([#238](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/238))

## [4.0.0]
### Changed
- **BREAKING**: Drop support for Node.js v16 ([#203](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/203))
- **BREAKING**: Update case insensitive sort to use deterministic key order ([#189](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/189))
  - Previously the "case insensitive" sorting options would leave keys in their original order when they differed only in case. They have been updated to sort identical keys in case order instead, making these sort options deterministic.
  - This change has been made because deterministic sort orders tend to be easier to work with, are more aligned with how Prettier works, and typically lead to less churn. However, if your project needs to preserve original key order, you can emulate the old behavior by defining a custom sort order that has a category for each case-insensitive character. For example, you could set this as your `prettierrc.js` file:
  ```JavaScript prettierrc.js
    {
        jsonSortOrder: JSON.stringify({
            '/^[Aa]/': 'none',
            '/^[Bb]/': 'none',
            '/^[Cc]/': 'none',
            ...
            '/^[Zz]/': 'none',
        })
    }
  ```
  This should work for small character sets. If you require case-insensitive sorting with a larger character set, please submit a feature request. We can bring back the old sorting order as an option if there is demand for it.

## [3.1.0]
### Added
- Add `none` sorting algorithm ([#177](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/177))
  - This lets you leave certain properties usorted when defining a custom sort order
  - Contributed by @hyperupcall

## [3.0.1]
### Fixed
- Fix accidental removal of trailing newline ([#170](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/170))

## [3.0.0]
### Changed
- **BREAKING**: Migrate to Prettier v3 ([#156](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/156))
  - This plugin no longer works with Prettier v2. Prettier v2 support will be maintained on v2 of this plugin however.
  - Prettier v3 will no longer automatically load plugins. [Follow these instructions](https://prettier.io/docs/en/plugins#using-plugins) to load this plugin after updating.

## [2.0.0]
### Changed
- **BREAKING**: Update minimum supported Node.js version to v16 ([#164](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/164))
- Update dependencies ([#137](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/137), [#139](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/139), [#141](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/141), [#153](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/153), [#157](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/157))

## [1.0.0]
### Changed
- **BREAKING**: Change `jsonSortOrder` option to a JSON string ([#118](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/118))
  - This configuration option used to accept a file path. Now it accepts a JSON string instead. See the README for more details.

## [0.0.3]
### Added
- Add `jsonSortOrder` option ([#92](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/92))
  - This also supports case-insensitive sorting ([#104](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/104))

### Changed
- **BREAKING**: Rewrite plugin to sort AST ([#100](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/100))
  - This ensures that symbols are sorted before numbers, as in a normal lexical sort. This is the breaking change, because the sort order may have changed in some edge cases.
  - This ensures that JSON files with mistakes like trailing commas are still sorted properly the first time.
- **BREAKING**: Update minimum Node.js version to v14 ([#40](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/40), [#61](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/61))
- **BREAKING**: Update minimum Prettier version to v2.3.2 ([#47](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/47))

## [0.0.2] - 2021-02-13
### Added
- JSON Recursive Sort option ([#23](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/23))

### Changed
- [**BREAKING**] Update minimum `prettier` version to v2.1.0 ([#21](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/21), [#24](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/24))
- [**BREAKING**] Move `prettier` from `dependencies` to `peerDependencies` ([#22](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/22))
- Fix manifest `repository` property ([#17](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/17))

### Removed
- Remove unused `@babel/types` dependency ([#20](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/20))

## [0.0.1] - 2020-09-22
### Added
- Initial release

[Unreleased]: https://github.com/Gudahtt/prettier-plugin-sort-json/compare/v4.2.0...HEAD
[4.2.0]: https://github.com/Gudahtt/prettier-plugin-sort-json/compare/v4.1.1...v4.2.0
[4.1.1]: https://github.com/Gudahtt/prettier-plugin-sort-json/compare/v4.1.0...v4.1.1
[4.1.0]: https://github.com/Gudahtt/prettier-plugin-sort-json/compare/v4.0.0...v4.1.0
[4.0.0]: https://github.com/Gudahtt/prettier-plugin-sort-json/compare/v3.1.0...v4.0.0
[3.1.0]: https://github.com/Gudahtt/prettier-plugin-sort-json/compare/v3.0.1...v3.1.0
[3.0.1]: https://github.com/Gudahtt/prettier-plugin-sort-json/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/Gudahtt/prettier-plugin-sort-json/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/Gudahtt/prettier-plugin-sort-json/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/Gudahtt/prettier-plugin-sort-json/compare/v0.0.3...v1.0.0
[0.0.3]: https://github.com/Gudahtt/prettier-plugin-sort-json/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/Gudahtt/prettier-plugin-sort-json/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/Gudahtt/prettier-plugin-sort-json/releases/tag/v0.0.1
