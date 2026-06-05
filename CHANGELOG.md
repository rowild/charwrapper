# Changelog

## 2.0.2 - 2026-06-05

### Added

- Added this changelog.
- Documented the `fin-patch` workflow and changelog convention in `AGENTS.md`.

### Changed

- Bumped package and bundle metadata to `2.0.2`.

## 2.0.1 - 2026-06-05

### Added

- Added the root-set API: `wrap()` returns a `RootSet` with `chars`, `words`, `groups`, `attributeSets`, and `customSets`.
- Added `CharWrapper.wrapAll('[data-root-set]')` for page-level root-set batching.
- Added modern data attributes: `data-root-set`, `data-root-order`, `data-set-name`, `data-set-order`, `data-set-char-class`, and `data-set-word-class`.
- Added root-set classes/enumeration and attribute-set classes/enumeration.
- Added JS-defined custom sets under each root set.
- Added root-level and attribute-set-level groups.
- Added jsdom coverage for root sets, attribute sets, ordering, classes, groups, custom sets, and batch wrapping.
- Added GSAP examples for root/attribute sets, custom sets, and batch root sets.
- Added Live/Code tabs with local syntax highlighting for the new examples.
- Added `.claude/restore-data-attribute-sets-plan.md` documenting the implementation plan and decisions.

### Changed

- Replaced the old public `subSet*` direction with root-set and attribute-set naming.
- Updated README configuration and data-attribute documentation.
- Updated the examples index to link to the new GSAP examples.
- Updated the package test command to run the root-set test suite.

### Removed

- No legacy `saveToObject`, `_wrappedLetters`, `_subSets`, or `data-sub-set-*` compatibility API was added.
