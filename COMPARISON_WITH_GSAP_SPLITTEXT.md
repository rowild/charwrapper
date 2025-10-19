# CharWrapper vs GSAP SplitText - Detailed Comparison

## 📊 Executive Summary

**GSAP SplitText** is the professional, feature-rich industry standard with 14+ advanced features.
**CharWrapper 2.0** is a lighter, independent alternative focused on character/word wrapping basics.

---

## ✅ Similarities

### Core Functionality
Both libraries provide:

| Feature | CharWrapper 2.0 | GSAP SplitText |
|---------|----------------|----------------|
| **Character splitting** | ✅ `wrap: { chars: true }` | ✅ `type: "chars"` |
| **Word splitting** | ✅ `wrap: { words: true }` | ✅ `type: "words"` |
| **Nested wrapping** | ✅ Words contain chars | ✅ Words contain chars |
| **Custom CSS classes** | ✅ `classes: { char: 'x' }` | ✅ `charsClass: 'x'` |
| **Class enumeration** | ✅ `enumerate: { chars: true }` | ✅ `charsClass: 'char++'` |
| **Custom HTML tags** | ✅ `tags: { char: 'span' }` | ✅ `tag: 'span'` |
| **Destroy/cleanup** | ✅ `wrapper.destroy()` | ✅ `splitText.revert()` |
| **Re-wrapping** | ✅ `wrapper.rewrap()` | ✅ `splitText.split(newVars)` |

### Design Patterns
- Both use ES6 classes
- Both return element arrays for GSAP animation
- Both support method chaining
- Both designed specifically for GSAP integration

---

## 🔴 Key Differences

### 1. **Line Splitting** ⭐ MAJOR

| Feature | CharWrapper 2.0 | GSAP SplitText |
|---------|----------------|----------------|
| **Split by lines** | ❌ **NOT SUPPORTED** | ✅ `type: "lines"` |
| **Line detection** | ❌ N/A | ✅ Intelligent algorithm |
| **Line reflow handling** | ❌ N/A | ✅ `autoSplit: true` |
| **Deep slicing** | ❌ N/A | ✅ Handles nested elements across lines |

**Impact:** This is the **biggest missing feature** in CharWrapper. Line splitting is crucial for many professional text animations.

---

### 2. **Accessibility** ⭐ MAJOR

| Feature | CharWrapper 2.0 | GSAP SplitText |
|---------|----------------|----------------|
| **aria-label** | ❌ Not implemented | ✅ Auto-added to parent |
| **aria-hidden** | ❌ Not implemented | ✅ Auto-added to split elements |
| **Accessibility modes** | ❌ None | ✅ `aria: "auto"\|"hidden"\|"none"` |
| **Screen reader friendly** | ❌ No | ✅ Yes |

**Impact:** CharWrapper is **not accessible** for screen readers. This is a critical issue for production websites.

---

### 3. **Advanced Features** ⭐ MAJOR

#### Mask/Reveal Effects
| Feature | CharWrapper 2.0 | GSAP SplitText |
|---------|----------------|----------------|
| **Mask property** | ❌ Not supported | ✅ `mask: "lines"\|"words"\|"chars"` |
| **Automatic masking** | ❌ Manual CSS needed | ✅ Creates wrapper with `overflow: hidden` |
| **Reveal animations** | ⚠️ Possible but manual | ✅ Built-in, easy |

#### Auto-Split & Responsiveness
| Feature | CharWrapper 2.0 | GSAP SplitText |
|---------|----------------|----------------|
| **Font loading detection** | ❌ Not supported | ✅ `autoSplit: true` + font observer |
| **Resize observer** | ❌ Not supported | ✅ Auto re-splits on resize |
| **Debounced re-splitting** | ❌ N/A | ✅ 200ms debounce |
| **Responsive text** | ⚠️ Manual rewrap() | ✅ Automatic |

#### Text Processing
| Feature | CharWrapper 2.0 | GSAP SplitText |
|---------|----------------|----------------|
| **White space reduction** | ✅ `trimWhitespace: true` | ✅ `reduceWhiteSpace: true` |
| **Preserve `<pre>` formatting** | ❌ No | ✅ Honors extra spaces + auto `<br>` |
| **Custom word delimiter** | ❌ Only space | ✅ `wordDelimiter: /regex/` or custom |
| **Ignore elements** | ⚠️ Via `_exclude_` data attr | ✅ `ignore: ".keep-whole"` |
| **Smart wrap** | ❌ No | ✅ Prevents odd breaks |
| **Deep slice** | ❌ No | ✅ Subdivides nested `<strong>` across lines |

---

### 4. **Performance & Optimization**

| Feature | CharWrapper 2.0 | GSAP SplitText |
|---------|----------------|----------------|
| **File size** | ~28KB (6 modules) | ~14KB (50% smaller after rewrite!) |
| **TypeScript** | ❌ JSDoc only | ✅ Written in TypeScript |
| **Bundle optimization** | ⚠️ Manual imports | ✅ Tree-shakeable |
| **Performance monitoring** | ❌ No | ✅ Internal optimizations |

---

### 5. **API Design**

#### Configuration Syntax
```javascript
// CharWrapper 2.0 - Grouped options
new CharWrapper('.text', {
  wrap: { chars: true, words: true },
  enumerate: { chars: true, includeSpaces: true },
  classes: { char: 'c', word: 'w' },
  tags: { char: 'span' }
});

// GSAP SplitText - Flat options
new SplitText('.text', {
  type: 'chars,words',
  charsClass: 'c++',
  wordsClass: 'w++',
  tag: 'span'
});
```

**Winner:** SplitText is more concise. CharWrapper's grouped approach is more organized but verbose.

#### Class Enumeration
```javascript
// CharWrapper 2.0 - Separate config
enumerate: { chars: true }
// Result: .char .char-001 .char-002

// GSAP SplitText - In class name
charsClass: 'char++'
// Result: .char .char1 .char2
```

**Winner:** SplitText's `++` syntax is more elegant.

---

### 6. **Special Features**

| Feature | CharWrapper 2.0 | GSAP SplitText |
|---------|----------------|----------------|
| **CSS variable indices** | ❌ No | ✅ `propIndex: true` → `--char: 3` |
| **Custom text preparation** | ❌ No | ✅ `prepareText: fn` callback |
| **onSplit callback** | ❌ No | ✅ `onSplit: fn` with auto-timing |
| **onRevert callback** | ❌ No | ✅ `onRevert: fn` |
| **Special char handling** | ⚠️ Basic regex | ✅ `specialChars: /regex/` or array |
| **Mask arrays** | ❌ No | ✅ Separate `masks` property |

---

## 🚨 What CharWrapper is MISSING (Critical Features)

### 🔴 1. **LINE SPLITTING** - The Biggest Gap

**Why it matters:** Line splitting is essential for:
- Title reveals that animate line-by-line
- Paragraph entrance animations
- Staggered line effects
- Responsive text that reflows properly

**Example use case:**
```javascript
// SplitText can do this:
const split = new SplitText('.title', { type: 'lines' });
gsap.from(split.lines, {
  y: 100,
  opacity: 0,
  stagger: 0.2
});

// CharWrapper cannot! ❌
```

**Impact Level:** 🔴 **CRITICAL** - This is the #1 feature professionals expect.

---

### 🔴 2. **ACCESSIBILITY (ARIA)** - Legal/Compliance Issue

**Why it matters:**
- Screen readers can't read split text without aria-label
- Legal requirement in many countries (ADA, WCAG 2.1)
- CharWrapper breaks accessibility

**Current state:**
```html
<!-- CharWrapper output (NOT accessible) -->
<div class="text">
  <span class="char">H</span>
  <span class="char">i</span>
</div>
<!-- Screen reader reads: "H. i." (each letter separately) ❌ -->

<!-- SplitText output (accessible) -->
<div class="text" aria-label="Hi">
  <span class="char" aria-hidden="true">H</span>
  <span class="char" aria-hidden="true">i</span>
</div>
<!-- Screen reader reads: "Hi" (correct) ✅ -->
```

**Impact Level:** 🔴 **CRITICAL** - Cannot use in production without fixing.

---

### 🟡 3. **MASKING/REVEAL EFFECTS** - Professional Feature

**Why it matters:**
- Clean text reveals without clipping issues
- Professional-looking line-by-line animations
- Proper overflow handling

**Example:**
```javascript
// SplitText
const split = new SplitText('.text', {
  type: 'lines',
  mask: 'lines'  // ✅ Auto-creates masks
});
gsap.from(split.masks, { scaleY: 0, transformOrigin: 'top' });

// CharWrapper
// ❌ Must manually create wrapper elements and CSS
```

**Impact Level:** 🟡 **HIGH** - Very common in professional work.

---

### 🟡 4. **AUTO-SPLIT (Responsive)** - Quality of Life

**Why it matters:**
- Fonts loading late breaks layout
- Window resizing breaks line splits
- Manual rewrapping is tedious

**SplitText solution:**
```javascript
const split = new SplitText('.text', {
  type: 'lines',
  autoSplit: true  // ✅ Auto re-splits on font load & resize
});
```

**CharWrapper workaround:**
```javascript
// ❌ Must manually detect and rewrap
window.addEventListener('resize', debounce(() => {
  wrapper.rewrap();
}, 200));

document.fonts.ready.then(() => {
  wrapper.rewrap();
});
```

**Impact Level:** 🟡 **HIGH** - Essential for responsive sites.

---

### 🟠 5. **SMART WRAP** - Edge Case Handling

**Why it matters:**
- Prevents awkward character-level line breaks
- Better typography control

**Example issue:**
```html
<!-- Without smart wrap -->
<span class="char">H</span>
<span class="char">e</span>  <!-- Line break here! -->
<span class="char">l</span>
<span class="char">l</span>
<span class="char">o</span>
<!-- "He" on one line, "llo" on next - ugly! -->

<!-- With smart wrap (SplitText) -->
<span style="white-space: nowrap;">
  <span class="char">H</span>
  <span class="char">e</span>
  <span class="char">l</span>
  <span class="char">l</span>
  <span class="char">o</span>
</span>
<!-- Word stays together! ✅ -->
```

**Impact Level:** 🟠 **MEDIUM** - Annoying edge case.

---

### 🟠 6. **DEEP SLICE** - Nested Element Handling

**Why it matters:**
- Handles `<strong>`, `<em>`, `<a>` spanning multiple lines
- Prevents vertical expansion of lines

**Example:**
```html
<!-- Input -->
<p>This is <strong>important bold text</strong> here.</p>

<!-- If "bold text" wraps across 2 lines, SplitText subdivides it -->
<!-- CharWrapper strips it or breaks it ❌ -->
```

**Impact Level:** 🟠 **MEDIUM** - Common in CMS content.

---

### 🟠 7. **CSS VARIABLE INDICES** - Modern CSS Integration

**Why it matters:**
- Clean CSS-based animations
- No JS animation needed for simple effects

**SplitText:**
```javascript
new SplitText('.text', { propIndex: true });
```
```css
.char {
  animation-delay: calc(var(--char) * 0.05s);
}
```

**CharWrapper:**
```javascript
// ❌ Not supported, must use GSAP or manual styling
```

**Impact Level:** 🟠 **MEDIUM** - Nice-to-have for CSS animations.

---

### 🟢 8. **CUSTOM WORD DELIMITER** - Edge Case

**Why it matters:**
- Split by custom characters (e.g., `-` or `|`)
- Internationalization needs

**Impact Level:** 🟢 **LOW** - Rare use case.

---

### 🟢 9. **IGNORE SELECTOR** - Convenience

**Why it matters:**
- Skip certain elements (e.g., `<sup>`, `<sub>`)

**Impact Level:** 🟢 **LOW** - Can work around with data attributes.

---

## 📊 Feature Comparison Table

| Feature Category | CharWrapper 2.0 | GSAP SplitText | Winner |
|------------------|----------------|----------------|--------|
| **Basic char/word split** | ✅ Good | ✅ Excellent | Tie |
| **Line splitting** | ❌ None | ✅ Excellent | SplitText |
| **Accessibility** | ❌ None | ✅ Excellent | SplitText |
| **Performance** | ✅ Good | ✅ Excellent | SplitText |
| **File size** | 28KB | 14KB | SplitText |
| **TypeScript** | JSDoc only | Native TS | SplitText |
| **Auto-responsiveness** | ❌ Manual | ✅ Auto | SplitText |
| **Masking** | ❌ Manual | ✅ Built-in | SplitText |
| **API simplicity** | Good | Excellent | SplitText |
| **Documentation** | Excellent | Excellent | Tie |
| **Examples** | 17 demos | Many | Tie |
| **Price** | Free | Free (since v3.13) | Tie |
| **Dependencies** | None | GSAP core | CharWrapper |
| **Custom config** | More verbose | Concise | SplitText |

---

## 💡 When to Use Each

### Use **GSAP SplitText** when:
- ✅ You need **line splitting** (most professional work)
- ✅ **Accessibility** is required (it always should be!)
- ✅ Building **responsive** sites with web fonts
- ✅ Need **mask/reveal** effects
- ✅ Want **auto-resplit** on viewport changes
- ✅ Working on **client projects** (proven, supported)
- ✅ Need **TypeScript** definitions
- ✅ Want smallest file size
- ✅ Need advanced features (deep slice, custom delimiters, etc.)

### Use **CharWrapper 2.0** when:
- ✅ You **only need chars/words** (no lines)
- ✅ Learning/educational purposes
- ✅ Want full control of implementation
- ✅ Building a custom solution
- ✅ Don't need GSAP core loaded
- ⚠️ Accessibility not required (rare!)

---

## 🎯 Recommendations for CharWrapper Improvement

To make CharWrapper competitive with SplitText, add these features **in priority order:**

### Priority 1: CRITICAL (Must-Have)
1. **Line splitting algorithm** - Core feature gap
2. **Accessibility (ARIA)** - Legal/ethical requirement
3. **autoSplit** - Essential for modern web

### Priority 2: HIGH (Should-Have)
4. **Masking support** - Professional animations
5. **Reduce file size** - Tree-shaking, minification
6. **TypeScript rewrite** - Modern standard

### Priority 3: MEDIUM (Nice-to-Have)
7. **Smart wrap** - Better typography
8. **Deep slice** - Nested element handling
9. **CSS variable indices** - Modern CSS integration
10. **Callbacks** (onSplit, onRevert)

### Priority 4: LOW (Optional)
11. **Custom word delimiters**
12. **Ignore selectors**
13. **Special char handling**

---

## 🏆 Verdict

**GSAP SplitText is the clear winner** for professional production use. It's:
- 🔴 50% smaller file size
- 🔴 More feature-complete (14+ advanced features)
- 🔴 Accessible (critical!)
- 🔴 Has line splitting (essential!)
- 🔴 Auto-responsive
- 🔴 Written in TypeScript
- 🔴 Industry standard

**CharWrapper 2.0 is excellent for:**
- 📚 Learning how text splitting works internally
- 🎨 Simple char/word-only animations
- 🔧 Custom implementations where you need full control
- 📖 Educational purposes

---

## 💭 Final Thoughts

CharWrapper 2.0 was an **excellent learning exercise** and demonstrates solid ES6+ coding practices, but **GSAP SplitText is professionally engineered** over years with edge cases, accessibility, and real-world production needs solved.

**If building for production: Use SplitText.**
**If learning/experimenting: CharWrapper is great!**

The most valuable features CharWrapper lacks:
1. 🔴 **Line splitting** (dealbreaker for most pros)
2. 🔴 **Accessibility** (dealbreaker for compliance)
3. 🟡 **Auto-split responsiveness** (quality of life)

---

**Bottom line:** CharWrapper is a great educational implementation, but SplitText is the production-ready tool. The GSAP team has solved problems you don't even know exist yet! 🚀
