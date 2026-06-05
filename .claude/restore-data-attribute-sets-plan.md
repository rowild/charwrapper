# Restore Root Sets and Attribute Sets in Modern CharWrapper

Branch: `plan/restore-data-attribute-sets`

Status: implementation started. Core source, tests, bundle, README updates, and GSAP examples have been added in this branch.

## Goal

Restore the useful original CharWrapper ideas around root sets, data-attribute-defined child sets, named animation collections, and ordered animation targets while keeping the modern TypeScript architecture.

The final model should be:

```txt
RootSet
  chars
  words
  groups
  attributeSets
    first_name
      chars
      words
      groups
    last_name
      chars
      words
      groups
  customSets
```

One `CharWrapper` instance owns exactly one `RootSet`. It must never silently own every root set on the page.

For a whole page, use an explicit batch API:

```js
const rootSets = CharWrapper.wrapAll('[data-root-set]', config);
```

That call should find every element matching `[data-root-set]`, create one `CharWrapper` per root element, wrap each root, and return one ordered array of `RootSet` objects.

## Current Findings

The old `_BU/CharWrapper.js` supported:

- `saveToObject.allLetters`: all processed character elements for the selected root.
- `saveToObject.subSets[name]`: characters grouped by old `data-sub-set-name`.
- `saveToObject[customSetName]`: one named custom set.
- Configurable dataset keys for subset name, subset character class, and custom order.
- `wrapSubSet`: add subset class to each subset character.
- `enumerateSubSet`: add reset-per-subset numbered classes.
- `customOrder`: process elements in `data-custom-order` order.
- `_exclude_`: skip a marked subset.

Important interpretation:

- The old `subSet` naming came from set theory: a root set contains child sets / subsets.
- In the modern API, use `attributeSets`, because these child sets are discovered from HTML data attributes.
- `attributeSets` are still conceptually subsets of the root set.
- Do not implement arbitrary recursive set trees initially. Support one clear hierarchy: `RootSet -> attributeSets`.

The modern code currently has pieces but not the final model:

- `src/config.ts` still has old-style `dataAttributes.subSetName`, `subSetClass`, and `customOrder`.
- `src/DOMProcessor.ts` reads a char-class-like data attribute and passes it to `WrapperFactory`.
- `src/WrapperFactory.ts` applies that class option to character elements.
- `src/SelectionStrategy.ts` has a `DataAttributeStrategy`, but `CharWrapper` collapses multi-element selection to the first element.
- `src/CharacterGrouper.ts` supports modern pattern/function based `groups`.
- `wrap()` currently returns `{ chars, words, groups }`.
- The README still documents old `data-sub-set-*` naming.

## Final API Shape

`wrap()` should return the root set directly:

```ts
interface TextSet {
  name: string;
  element: Element;
  chars: HTMLElement[];
  words: HTMLElement[];
  groups: GroupResult;
}

interface RootSet extends TextSet {
  attributeSets: Record<string, TextSet>;
  customSets: Record<string, HTMLElement[]>;
}

class CharWrapper {
  wrap(options?: ProcessOptions): RootSet;
  getRootSet(): RootSet | null;
  getAttributeSet(name: string): TextSet | undefined;
  getAttributeSetChars(name: string): HTMLElement[];
  getAttributeSetWords(name: string): HTMLElement[];
  getCustomSet(name: string): HTMLElement[];
  hasAttributeSet(name: string): boolean;
  getAttributeSetNames(): string[];

  static wrapAll(
    targets: string | Element[] | NodeListOf<Element>,
    config?: UserConfig
  ): RootSet[];

  static getRootSet(rootSets: RootSet[], name: string): RootSet | undefined;
}
```

Single-root usage:

```js
const profileRootSet = new CharWrapper('[data-root-set="profile"]', {
  wrap: { chars: true, words: true }
}).wrap();

profileRootSet.chars;
profileRootSet.words;
profileRootSet.groups;
profileRootSet.attributeSets.first_name.chars;
profileRootSet.attributeSets.first_name.words;
profileRootSet.attributeSets.first_name.groups;
profileRootSet.customSets.fullName;
```

Page-level usage:

```js
const rootSets = CharWrapper.wrapAll('[data-root-set]', {
  wrap: { chars: true, words: true },
  processing: { ordered: true }
});

const tl = gsap.timeline();

rootSets.forEach(rootSet => {
  tl.from(rootSet.chars, { opacity: 0, y: 20, stagger: 0.02 });
});

const profileRootSet = CharWrapper.getRootSet(rootSets, 'profile');
```

Why no extra `result.rootSet` wrapper:

- There is only one real result for one `CharWrapper`: the root set.
- Returning `RootSet` directly keeps the API simpler.
- Backward compatibility is still mostly preserved because `chars`, `words`, and `groups` remain top-level on the returned object.

## HTML Authoring API

Use modern data attributes:

```html
<section data-root-set="profile" data-root-order="1">
  <h1
    data-set-name="first_name"
    data-set-order="1"
    data-set-char-class="first-name-char"
    data-set-word-class="first-name-word"
  >
    Robert
  </h1>

  <h1
    data-set-name="last_name"
    data-set-order="2"
    data-set-char-class="last-name-char"
    data-set-word-class="last-name-word"
  >
    Wildling
  </h1>
</section>

<section data-root-set="professions" data-root-order="2">
  <p data-set-name="main" data-set-order="1">Developer</p>
  <p data-set-name="secondary" data-set-order="2">Composer</p>
</section>
```

Attribute meanings:

- `data-root-set`: names a root set for batch/page-level orchestration.
- `data-root-order`: orders root sets returned by `CharWrapper.wrapAll()`.
- `data-set-name`: names an attribute set inside the current root set.
- `data-set-order`: orders attribute sets/text-node records inside one root set.
- `data-set-char-class`: adds per-character classes for one attribute set.
- `data-set-word-class`: adds per-word classes for one attribute set.
- `data-set-name="_exclude_"`: skips the element and its descendants.

Why `data-root-order` and `data-set-order` instead of one `data-custom-order`:

- Root order and attribute-set order are different concepts.
- Separate attributes make examples, tests, and user intent clearer.
- The old `data-custom-order` can be mentioned as an old concept, but the modern public API should prefer explicit names.

## Configuration Additions

```ts
interface RootSetConfig {
  customSets?: CustomSetsConfig;
  exposeEmptyAttributeSets: boolean;
  autoDetectDataAttributes: boolean;
}

type CustomSetSource =
  | 'root'
  | 'rootChars'
  | 'rootWords'
  | string
  | string[]
  | { attributeSet: string; target: 'chars' | 'words' | 'both' }
  | Array<{ attributeSet: string; target: 'chars' | 'words' | 'both' }>
  | ((rootSet: RootSet) => HTMLElement[]);

interface CustomSetsConfig {
  [customSetName: string]: CustomSetSource;
}

interface DataAttributesConfig {
  rootSet: string;      // default: 'rootSet' -> data-root-set
  rootOrder: string;    // default: 'rootOrder' -> data-root-order
  setName: string;      // default: 'setName' -> data-set-name
  setOrder: string;     // default: 'setOrder' -> data-set-order
  setCharClass: string; // default: 'setCharClass' -> data-set-char-class
  setWordClass: string; // default: 'setWordClass' -> data-set-word-class
}

interface EnumerateConfig {
  rootSet: boolean | EnumerationRule;
  chars: boolean;
  words: boolean;
  attributeSets: boolean;
  includeSpaces: boolean;
  includeSpecialChars: boolean;
}

interface ClassesConfig {
  rootSet: string;
  char: string;
  word: string;
  space: string;
  special: string;
  regular: string;
}
```

Recommended config usage:

```js
const rootSets = CharWrapper.wrapAll('[data-root-set]', {
  wrap: { chars: true, words: true },
  processing: { ordered: true },
  rootSet: {
    customSets: {
      fullName: ['first_name', 'last_name'],
      intro: rootSet => [
        ...rootSet.attributeSets.first_name.chars,
        ...rootSet.attributeSets.last_name.chars
      ]
    }
  }
});
```

## Set Ownership Rules

Nearest attribute-set owner wins.

```html
<section data-set-name="card">
  Hello
  <strong data-set-name="name">Robert</strong>
</section>
```

Expected:

```txt
card -> "Hello"
name -> "Robert"
```

Not initially:

```txt
card -> "Hello" + "Robert"
name -> "Robert"
```

Rationale:

- This avoids implicit multi-membership.
- It keeps ordering and animation behavior predictable.
- Recursive/nested set trees can be considered later if a real use case appears.

## Groups

`groups` are a modern feature, not an old `_BU/CharWrapper.js` feature.

`groups` should exist on:

- the root set
- every attribute set

This allows:

```js
profileRootSet.groups.vowels;
profileRootSet.attributeSets.first_name.groups.vowels;
```

Implementation note:

- Existing `CharacterGrouper` can group root chars.
- Attribute-set groups should be computed from each attribute set's own chars/text context.
- Ordered processing can break index-based grouping if the grouper assumes original root text order. Tests must cover this.

## Custom Sets

Custom sets are JS-defined only. They are never read from data attributes.

They live under one root set:

```js
profileRootSet.customSets.fullName;
```

They are flat animation targets:

```ts
Record<string, HTMLElement[]>
```

They should not have nested `attributeSets` or nested `customSets`.

Supported sources:

- `'root'` / `'rootChars'`: root chars
- `'rootWords'`: root words
- `'first_name'`: `rootSet.attributeSets.first_name.chars`
- `['first_name', 'last_name']`: concatenate attribute-set chars
- `{ attributeSet: 'first_name', target: 'words' }`
- function receiving the final `RootSet`

## Ordering

There are two ordering levels:

1. Root-set order for `wrapAll()`: use `data-root-order`.
2. Attribute-set/text-node order inside one root: use `data-set-order`.

Rules:

- If `processing.ordered` is false, preserve DOM order.
- If `processing.ordered` is true, sort root sets by `data-root-order` in `wrapAll()`.
- If `processing.ordered` is true, sort processable text-node records inside each root by nearest `data-set-order`.
- Use DOM index as a stable tie-breaker.
- Missing order values should remain stable and predictable. Recommended: explicitly ordered records first, unordered records afterward in DOM order.
- Sorting must change returned arrays only. It must not reorder the DOM.

## Implementation Processes

### Process 0: Branch and Planning

- [x] Confirm worktree is clean.
- [x] Create `plan/restore-data-attribute-sets`.
- [x] Save this implementation plan to `.claude/restore-data-attribute-sets-plan.md`.
- [ ] Review updated final API before implementation begins.

Exit criteria:

- Plan exists.
- No source code has been changed.
- Branch is dedicated to this work.
- Root-set, attribute-set, custom-set, group, and batch API terminology is settled.

### Process 1: Define Public Types

- [x] Decide `wrap()` returns `RootSet` directly.
- [x] Decide `wrapAll()` returns `RootSet[]`.
- [x] Decide child-set naming: `attributeSets`, not `subSets`.
- [x] Decide old `saveToObject` compatibility: do not implement it.
- [ ] Decide duplicate `data-root-set` behavior.
- [ ] Decide whether `getAttributeSet(name)` returns `TextSet | undefined` or throws for missing names.
- [ ] Write TypeScript interfaces in `src/config.ts` and `src/CharWrapper.ts`.

Recommendation:

- Duplicate `data-root-set` names should warn.
- `CharWrapper.getRootSet(rootSets, name)` should return the first match.
- Users who need duplicate names can filter the array manually.

Exit criteria:

- API is documented in code types.
- Naming is consistent across config, result, methods, README, tests, and examples.

### Process 2: Add Root Set State

- [ ] Create `TextSet` and `RootSet` interfaces.
- [ ] Replace internal `WrapResult` state with `RootSet` state.
- [ ] Keep `getChars()` and `getWords()` as convenience accessors.
- [ ] Add `getRootSet()`.
- [ ] Update `unwrap()` and `destroy()` to reset root-set state.
- [ ] Update metadata with root-set name, char count, word count, attribute-set count, and custom-set count.

Exit criteria:

- `wrap()` returns a root set directly.
- Existing consumers using `const { chars, words, groups } = wrapper.wrap()` continue working.

### Process 3: Modernize Data Attribute Config

- [ ] Rename config from `subSetName` / `subSetClass` / `customOrder` to `rootSet` / `rootOrder` / `setName` / `setOrder` / `setCharClass` / `setWordClass`.
- [ ] Replace hardcoded `dataset.subSetName` in `DOMProcessor.findTextNodes()` with configured data-attribute access.
- [ ] Add a shared utility for reading data attributes from configured dataset keys.
- [ ] Add tests for default and custom data-attribute names.

Exit criteria:

- `data-root-set` names root sets.
- `data-root-order` orders root sets in `wrapAll()`.
- `data-set-name` creates attribute sets.
- `data-set-order` orders text-node records inside a root.
- `_exclude_` works with default and custom `setName`.
- `data-set-char-class` and `data-set-word-class` work.

### Process 4: Collect Attribute Sets

- [ ] Change `DOMProcessor.processElement()` to return root-set metadata.
- [ ] For every processed text node, determine nearest `data-set-name` owner bounded by the current root element.
- [ ] Ignore nodes where nearest `data-set-name` is `_exclude_`.
- [ ] Append produced chars/words to the root set.
- [ ] Append produced chars/words to the nearest attribute set when one exists.
- [ ] Compute root-set groups.
- [ ] Compute each attribute-set's groups.
- [ ] Preserve current DOM replacement behavior.

Exit criteria:

- `rootSet.attributeSets.first_name.chars` works.
- `rootSet.attributeSets.first_name.words` works.
- `rootSet.attributeSets.first_name.groups` works.
- Nested inline text belongs to the nearest attribute set.
- Text outside attribute sets appears in root-set arrays but not in `attributeSets`.

### Process 5: Implement Ordering

- [ ] Stop relying on `SelectionStrategy` for actual ordered wrapping.
- [ ] In `DOMProcessor`, collect processable text nodes as records before wrapping:

```ts
{
  textNode: Node;
  parentElement: HTMLElement;
  rootSetName?: string;
  rootOrder?: number;
  setName?: string;
  setOrder?: number;
  setCharClass?: string;
  setWordClass?: string;
  domIndex: number;
}
```

- [ ] In `wrapAll()`, sort matched root elements by configured `rootOrder` if ordered processing is enabled.
- [ ] In `processElement()`, sort text-node records by configured `setOrder` if ordered processing is enabled.
- [ ] Use DOM index as tie-breaker.
- [ ] Ensure sorting changes returned arrays only, not DOM layout.

Exit criteria:

- Root sets return in `data-root-order` order.
- Chars inside a root return in `data-set-order` order.
- Attribute-set arrays are ordered consistently.
- Actual DOM order remains unchanged.

### Process 6: Restore Root-Set Classes and Enumeration

- [ ] Add `classes.rootSet`, default `belongs-to-root-set`.
- [ ] Add `enumerate.rootSet`.
- [ ] Apply `classes.rootSet` to every wrapped character.
- [ ] If `enumerate.rootSet` is enabled, add `${classes.rootSet}-${padNumber(counter)}` according to root-set inclusion rules.
- [ ] Keep root-set enumeration separate from `enumerate.chars`.
- [ ] Reset root-set counters when `WrapperFactory.resetCounters()` is called.

Example expected output:

```html
<span class="char belongs-to-root-set belongs-to-root-set-001">J</span>
```

Exit criteria:

- Root-set class behavior is restored.
- Root-set enumeration is independent from generic char enumeration.

### Process 7: Restore Attribute-Set Classes and Enumeration

- [ ] Extend `WrapOptions` with `rootSetName`, `setName`, `setCharClass`, and `setWordClass`.
- [ ] Add `enumerate.attributeSets`.
- [ ] Add attribute-set counters keyed by attribute-set name.
- [ ] Add `${setCharClass}-${padNumber(counter)}` when attribute-set enumeration is enabled.
- [ ] Add `${setWordClass}-${padNumber(counter)}` when word wrapping and attribute-set enumeration are enabled.
- [ ] Do not auto-generate class names from arbitrary attribute-set names.

Exit criteria:

- `data-set-char-class` works.
- `data-set-word-class` works.
- Attribute-set enumeration resets per attribute set.

### Process 8: Add Custom Sets

- [ ] Add `rootSet.customSets?: CustomSetsConfig`.
- [ ] Resolve custom sets after root and attribute sets are collected.
- [ ] Support root aliases, attribute-set aliases, arrays, explicit target objects, and functions.
- [ ] Add `getCustomSet(name)`.
- [ ] Add tests and examples.

Exit criteria:

- `rootSet.customSets.fullName` works.
- Custom sets are flat `HTMLElement[]` animation targets.
- No old global storage API is introduced.

### Process 9: Add Explicit Batch Wrapping

- [ ] Add `CharWrapper.wrapAll()`.
- [ ] `wrapAll()` creates one `CharWrapper` per matched root element.
- [ ] `wrapAll()` returns `RootSet[]`.
- [ ] Add `CharWrapper.getRootSet(rootSets, name)`.
- [ ] Sort root elements by `data-root-order` when ordered processing is enabled.
- [ ] Do not introduce hidden global registration.

Exit criteria:

- `const rootSets = CharWrapper.wrapAll('[data-root-set]')` works.
- `rootSets` is an ordered array.
- One `CharWrapper` instance still owns one root set.

### Process 10: Tests

Add a real test command. Prefer `jsdom` unit tests if adding one dev dependency is acceptable.

Core test cases:

- [ ] `wrap()` returns a root set directly.
- [ ] `const { chars, words, groups } = wrapper.wrap()` still works.
- [ ] `data-root-set` names a root set.
- [ ] `wrapAll('[data-root-set]')` returns multiple root sets.
- [ ] `wrapAll()` respects `data-root-order`.
- [ ] Direct `data-set-name` creates an attribute set.
- [ ] Nested inline markup inherits nearest attribute set.
- [ ] Nested child attribute set overrides parent ownership.
- [ ] `_exclude_` skips text.
- [ ] `data-set-order` controls returned char order inside one root.
- [ ] `data-set-char-class` works.
- [ ] `data-set-word-class` works.
- [ ] `classes.rootSet` applies to every char.
- [ ] `enumerate.rootSet` works independently of `enumerate.chars`.
- [ ] `enumerate.attributeSets` resets per attribute set.
- [ ] Root groups work.
- [ ] Attribute-set groups work.
- [ ] Custom sets can alias root chars.
- [ ] Custom sets can alias one attribute set.
- [ ] Custom sets can combine multiple attribute sets.
- [ ] Custom sets can be computed from a function.
- [ ] `unwrap()` restores original HTML and clears root-set state.
- [ ] `destroy()` clears references.
- [ ] No `saveToObject`, `_wrappedLetters`, or `_subSets` API is introduced.

Regression tests:

- [ ] Accessibility attributes still apply.
- [ ] Spaces and special characters follow existing include/exclude rules.
- [ ] Diacritics still classify as regular characters.
- [ ] Existing animation presets still use returned chars.
- [ ] `transitionTo()` either rebuilds root-set state or documents that root-set collections are initial-wrap only.

### Process 11: Documentation and Examples

Update:

- [ ] README configuration section.
- [ ] README Data Attributes section.
- [ ] README API reference.
- [ ] Migration guide, especially "No More Global Save Object".
- [ ] Existing `examples/*/09-data-attributes.html`.
- [ ] Add `examples/*/10-root-and-attribute-sets.html`.
- [ ] Add `examples/*/11-custom-sets.html`.
- [ ] Add `examples/*/12-root-set-batch.html`.

Required examples:

- [ ] Single root set with no data attributes.
- [ ] Named root set with `data-root-set`.
- [ ] Direct attribute sets with `data-set-name`.
- [ ] Nested inline markup inheriting nearest attribute set.
- [ ] Nested child attribute set overriding parent ownership.
- [ ] `_exclude_`.
- [ ] `data-root-order`.
- [ ] `data-set-order`.
- [ ] `data-set-char-class`.
- [ ] `data-set-word-class`.
- [ ] `enumerate.rootSet`.
- [ ] `enumerate.attributeSets`.
- [ ] Root groups.
- [ ] Attribute-set groups.
- [ ] Custom set aliasing root chars.
- [ ] Custom set composed from multiple attribute sets.
- [ ] Custom set computed from a function.
- [ ] Batch wrapping multiple `data-root-set` roots and feeding them into one GSAP timeline.

Example doc snippet:

```js
const rootSets = CharWrapper.wrapAll('[data-root-set]', {
  wrap: { chars: true, words: true },
  processing: { ordered: true },
  rootSet: {
    customSets: {
      fullName: ['first_name', 'last_name']
    }
  }
});

const tl = gsap.timeline();

rootSets.forEach(rootSet => {
  tl.from(rootSet.chars, { opacity: 0, y: 20, stagger: 0.02 });
});

const profileRootSet = CharWrapper.getRootSet(rootSets, 'profile');

gsap.from(profileRootSet.attributeSets.first_name.chars, {
  opacity: 0,
  stagger: 0.03
});
```

### Process 12: Build and Bundle

- [ ] Run `npm run build`.
- [ ] Run `npm run bundle`.
- [ ] Confirm generated `dist` files update as expected.
- [ ] Confirm TypeScript declaration files expose new types.

### Process 13: Manual Browser Verification

- [ ] Start a local static server if needed.
- [ ] Open `examples/gsap/09-data-attributes.html`.
- [ ] Open `examples/gsap/10-root-and-attribute-sets.html`.
- [ ] Open `examples/gsap/11-custom-sets.html`.
- [ ] Open `examples/gsap/12-root-set-batch.html`.
- [ ] Repeat equivalent checks for anime.js and WAAPI if updated in the same pass.
- [ ] Verify root order.
- [ ] Verify set order.
- [ ] Verify attribute-set animations.
- [ ] Verify custom-set animations.
- [ ] Verify batch timeline chaining.
- [ ] Verify `_exclude_`.
- [ ] Verify `unwrap()` and replay flows.

## Suggested Commit Plan

1. Types and root-set return shape.
2. Data attribute naming migration.
3. Attribute-set collection and nearest-owner behavior.
4. Ordering with `data-root-order` and `data-set-order`.
5. Root-set classes and enumeration.
6. Attribute-set classes and enumeration.
7. Custom sets.
8. Batch wrapping with `wrapAll()`.
9. Tests, docs, and examples.
10. Build artifacts.

## Risks and Mitigations

Risk: Hidden global registry reintroduces old mutable-object behavior.

Mitigation: Do not add hidden global state. Return root-set arrays only from explicit `wrapAll()`.

Risk: One wrapper accidentally becomes responsible for multiple root sets.

Mitigation: Keep one `CharWrapper` instance bound to one root element.

Risk: Ordered processing mutates DOM order.

Mitigation: Sort processing records and returned arrays only. Replace each text node in its original parent location.

Risk: Group indexes drift when returned char order differs from original text order.

Mitigation: Carry original char metadata or group before ordering. Tests must cover root and attribute-set groups.

Risk: Attribute-set names may not be valid CSS class names.

Mitigation: Do not auto-create class names from attribute-set names. Use explicit `data-set-char-class` and `data-set-word-class`.

Risk: Old `data-sub-set-*` attributes disappear abruptly.

Mitigation: Decide before implementation whether to provide a temporary migration warning. Do not keep old names as the preferred docs/API.

## Acceptance Criteria

- `wrap()` returns a `RootSet` directly.
- `RootSet` has `chars`, `words`, `groups`, `attributeSets`, and `customSets`.
- Each attribute set has `chars`, `words`, and `groups`.
- `wrapAll()` returns an ordered `RootSet[]`.
- `data-root-set` names root sets.
- `data-root-order` orders root sets.
- `data-set-name` creates attribute sets.
- `data-set-order` orders returned arrays inside a root set.
- `data-set-char-class` works.
- `data-set-word-class` works.
- `classes.rootSet` applies to every wrapped char.
- `enumerate.rootSet` works independently of `enumerate.chars`.
- `enumerate.attributeSets` resets per attribute set.
- `_exclude_` works.
- Custom sets work as flat animation targets.
- DOM structure is preserved.
- `unwrap()` restores original content.
- Existing `chars`, `words`, `groups`, animation presets, and accessibility behavior continue working.
- README, migration guide, tests, and HTML examples reflect actual behavior.

## Resolved Decisions

- Missing `getAttributeSet(name)` returns `undefined`; char/word/custom-set array helpers return empty arrays.
- Old `data-sub-set-*` attributes are not supported. There are no old consumers to preserve.
- `transitionTo()` rebuilds a minimal root-set state from the transitioned DOM after completion.

## Recommended First Implementation Step

Start with tests for:

1. `wrap()` returning a root set directly.
2. `wrapAll()` returning multiple ordered root sets.
3. Direct attribute-set collection.
4. Nested nearest-owner behavior.
5. `_exclude_`.
6. `data-set-order`.
7. Root and attribute-set groups.

Then implement the smallest source changes that make those pass.
