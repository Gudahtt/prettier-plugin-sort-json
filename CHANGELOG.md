# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0]
### Uncategorized
- Ignore lint errors in build output ([#165](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/165))
- Update minimum supported Node.js version to v16 ([#164](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/164))
- Migrate tests from Jest to AVA ([#163](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/163))
- Update ESLint config to v12.1.0 ([#162](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/162))
- Update Minor ([#157](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/157))
- Bump semver from 6.3.0 to 6.3.1 ([#153](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/153))
- Update ESLint config ([#154](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/154))
- Update CI to test with Node.js v20 ([#152](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/152))
- Update dependency typescript to v4.9.5 ([#141](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/141))
- Update Jest to v29.5.2 ([#138](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/138))
- Update Minor ([#137](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/137))
- Bump json5 from 1.0.1 to 1.0.2 ([#139](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/139))
- Add note to README about escaping ([#136](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/136))

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

[Unreleased]: https://github.com/Gudahtt/prettier-plugin-sort-json/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/Gudahtt/prettier-plugin-sort-json/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/Gudahtt/prettier-plugin-sort-json/compare/v0.0.3...v1.0.0
[0.0.3]: https://github.com/Gudahtt/prettier-plugin-sort-json/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/Gudahtt/prettier-plugin-sort-json/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/Gudahtt/prettier-plugin-sort-json/releases/tag/v0.0.1
