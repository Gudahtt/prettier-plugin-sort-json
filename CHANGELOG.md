# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [4.1.0]
### Uncategorized
- feat: Export `SortJsonOptions` and convert `CategorySort` to TS Union ([#256](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/256))
- chore(deps): update minor ([#254](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/254))
- chore(deps): update dependency prettier to v3.4.2 ([#257](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/257))
- fix: Fix option parsing and types ([#258](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/258))
- chore: Refactor tests to specify format ([#253](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/253))
- chore: Update test descriptions to remove "should" ([#252](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/252))
- chore: Add test coverage ([#251](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/251))
- refactor: Eliminate TypeScript casts ([#250](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/250))
- refactor: Refactor how parser is constructed ([#249](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/249))
- docs: Improve contributor docs ([#248](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/248))
- docs: Add default configuration ([#247](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/247))
- docs: Clarify non-object exception ([#246](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/246))
- docs: Reorganize README ([#245](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/245))
- docs: Move contributor docs to dedicated file ([#244](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/244))
- docs: Add section on ignoring files ([#243](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/243))
- chore(deps): update dependency @metamask/auto-changelog to v4 ([#235](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/235))
- chore(deps): update dependency typescript to ~5.6.0 ([#238](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/238))
- chore(deps): update eslint related (major) ([#239](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/239))
- chore(config): migrate renovate config ([#240](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/240))
- chore: Add missing entries from Renovate ESLint group ([#241](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/241))
- chore: Improve Renovate grouping ([#237](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/237))
- chore(deps): update minor ([#222](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/222))
- chore(deps): update dependency prettier to v3.3.3 ([#223](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/223))
- Revert "chore: Set Renovate username (#231)" ([#231](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/231))
- chore: Set Renovate username ([#231](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/231))
- chore(deps): update yarn to v4.3.1 ([#221](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/221))
- chore: Cleanup renovate repository configuration ([#220](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/220))
- chore: Simplify Renovate configuration ([#219](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/219))
- chore: Update Renovate action ([#218](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/218))
- Refresh lockfile ([#217](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/217))
- Reduce renovate frequency to once per day ([#216](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/216))
- chore(deps): update minor ([#211](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/211))
- chore(deps): update dependency @ava/typescript to v5 ([#214](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/214))
- chore(deps): update yarn to v4.1.1 ([#210](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/210))
- chore(deps): update dependency @metamask/eslint-config to v12.2.0 ([#186](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/186))
- chore(deps): update dependency prettier to v3.2.5 ([#201](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/201))
- Lint JSON5 files ([#209](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/209))
- Split Renovate project config from action config ([#208](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/208))
- Update all GitHub actions from v3 to v4 ([#207](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/207))
- Clarify sort order instructions ([#206](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/206))

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

[Unreleased]: https://github.com/Gudahtt/prettier-plugin-sort-json/compare/v4.1.0...HEAD
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
