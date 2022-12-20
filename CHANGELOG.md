# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0]
### Uncategorized
- Update ESLint config to v11.1.0 ([#130](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/130))
- Change `jsonSortOrder` option to a JSON string ([#118](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/118))
- Update dependency typescript to ~4.9.0 ([#129](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/129))
- Bump qs from 6.5.2 to 6.5.3 ([#128](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/128))
- Update Minor ([#125](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/125))
- Update dependency @metamask/auto-changelog to v3 ([#126](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/126))
- Add Dependabot config ([#127](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/127))
- Update Jest to v29 (major) ([#122](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/122))
- Update GitHub actions workflows ([#124](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/124))
- Update to v11 ESlint config ([#123](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/123))
- Update dependency typescript to ~4.8.0 ([#112](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/112))
- Update Jest to v28.1.8 ([#121](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/121))
- Update Minor ([#110](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/110))
- Update Renovate config ([#120](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/120))
- Update dependency @types/prettier to v2.6.4 ([#109](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/109))
- Update ESLint config to v10 (major) ([#108](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/108))
- Update Yarn to v3.2.2 ([#107](https://github.com/Gudahtt/prettier-plugin-sort-json/pull/107))

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

[Unreleased]: https://github.com/Gudahtt/prettier-plugin-sort-json/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Gudahtt/prettier-plugin-sort-json/compare/v0.0.3...v1.0.0
[0.0.3]: https://github.com/Gudahtt/prettier-plugin-sort-json/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/Gudahtt/prettier-plugin-sort-json/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/Gudahtt/prettier-plugin-sort-json/releases/tag/v0.0.1
