/**
 * CharWrapper
 *
 * A class that wraps letters from a specified node (and it sub-nodes) into a pre-defined
 * tag (e.g. span) using the browser's DOM parser. Make sure to check the caveats in
 * the class description!!
 *
 * Requirements: lodash
 * Rules: Text must not contain HTML tags! TODO: can this be changed via stripHtml()?
 *
 * if(el.nodeType === 3) { console.log("A Text Node, which is, what this class needs.")}
 * Node Types: https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
 * https://www.digitalocean.com/community/tutorials/how-to-make-changes-to-the-dom
 *
 * NOTE: Add array to existing array:
 * @see https://stackoverflow.com/questions/1374126/how-to-extend-an-existing-javascript-array-with-another-array-without-creating
 *   this.generatedWraps._wrappedLetters.concat(lettersOnlyArr)
 */
import _orderBy from 'lodash/orderBy'

/**
 * Class CharWrapper
 *
 * Provide a domElement that contains text to be wrapped:
 *
 * E.g.:
 * let rootText = new CharWrapper({
 *   rootSetIdentifier: '.root',
 *   [...]
 * })
 * rootText.initializeWrap()
 *
 * CAVEATS:
 *
 * Order of texts:
 *   Be aware that the order of the text is defined by
 *   the position of the elements in the DOM.
 *
 * Forbidden letters:
 *   Since we are dealing with html, the text must not contain > and < (at the moment).
 *   Also, do not use break statments inside the text that shall be wrapped, because
 *   everything from the br onwards is deleted. (TODO: find out, why!9)
 *
 * Non-English characters
 *   Currently, the text must not contain umlaute or any other diacritical characters
 *   (like French or Spanish letters with accents).
 */
class CharWrapper {
  /**
   * Creates an instance of CharWrapper.
   *
   * @param {*} options
   * @memberof CharWrapper
   */
  constructor (options) {
    /** ----------------------------------------------------
     * The object to which all wrapped text is saved to.
     * ----------------------------------------------------
     * @since 2019-12-16
     *
     * @description
     * If the results (the wrapped letters and words) shall be saved to an JS "configuration"
     * object, use a structure like this:
     *
     * - Choose a name for the "root" key of the object (can be nested within another object)
     * - The keys "_wrappedLetters", "_wrappedWords", "subSets" and "_customSets" must be pre-defined.
     *
     * This way it is easier to access the wrapped characters/letters and words again to
     * create an animation (with GSAP, e.g.). If the generated wrapped letters shall be
     * saved on the object instance, use `_self`.
     *
     * Note: If defining options with a fallback settings via the double pipe, and the
     * value that needs to be defined is of type boolean, the fallback value must be false,
     * otherwise the option will always be recognized as true!!!
     *
     * @example
     * // Prepare the required "sub keys" of the object
     * const requiredAddOns = {
     *   _wrappedLetters: [],
     *   _wrappedWords: [],
     *   _subSets: [
     *     // the 'key' is named using the data-subSet-name property from HTML
     *   ],
     *   _customSets: [
     *     // the 'key' is defined on the CharWrapper object instance
     *   ]
     * }
     * // Attach the "sub keys" to the configurtaion object of your choice, here it is
     * // an object with the name "Settings" with a key "wrappedTexts":
     * Settings.wrappedTexts = requiredAddOns
     * // ... or if the object is created within a loop:
     * Settings.wrappedTexts[i] = requiredAddOns
     * // Now configure the instantiated object:
     * let example_txt = new CharWrapper({
     *    saveToObject = Settings.wrappedTexts[i]
     * }
     */
    this.generatedWraps = options.saveToObject || false

    /**
     * The Root Set.
     *
     * This is the class name of id of the DOM element, whichs text shall be wrapped.
     * It is unique for each objct instance and therefore can be calculated/defined right away.
     */
    this._rootSet = document.querySelector(options.rootSetIdentifier)

    /** ----------------------------------------
     * Data Sets Configuration
     * ----------------------------------------
     * @since 2019-12-16
     *
     * @description
     * In order to make use of data-sets, the HTML structure needs to follow this scheme:
     * (The example uses "div" as a tag, and so does the description below; but it can be
     * any tag.)
     *
     * 1. There must be a div that wraps all subset divs.
     * 2. "data" attrbutes are only used on the nested divs.
     * 3. There must be at least to "data" attributes defined:
     *      "data-sub-set-name" and
     *      "data-sub-set-chars-class".
     * 4. The "data-custom-order" attribute will only work, when the configuration option
     *      "customOrder" is defined on the object instance.
     * 5. If the rootset contains elements that shall not be indexed (meaing: they will
     *      not be used in a text animation eventually) use "_exlude_" as name for the
     *      "data-sub-set-name".
     *
     * @example
     * <div class="class-name-of-the-root-set-identifier">
     *    <div class="...whatever-you-like-or-need..."
     *      data-sub-set-name="name-of-the-sub-set"
     *      data-sub-set-chars-class="class-name-specific-to-this-textcontent"
     *      data-custom-order="...a-number-that-defines-the-order-in-which-subsets-are-read">
     *        Here is your text without html tags. (TODO: remove html tags before processing text)
     *    </div>
     *    [...any other DOM element with the same data-attributes configuration...]
     * </div>
     *
     * @see
     * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
     * - lowercase in HTML
     * - camelCase for use in JS
     * - must be on same dom element as rootSetIdentifier
     *
     * @removed
     * rootSetDataNameAttr: 'setName'
     */
    this.datasetAttrForSubSetName = options.datasetAttrForSubSetName
    this.datasetAttrForSubSetCharsClass = options.datasetAttrForSubSetCharsClass
    this.datasetAttrForCustomOrder = options.datasetAttrForCustomOrder

    /** ----------------------------------------
     * Turn things on/off
     * ----------------------------------------
     * @since 2019-12-16
     *
     * @description
     * Switchs with nested booleans.
     * "true" requires an object like this:
     *
     * @example
     * enumerateRootSet: {
     *   includeSpaces: true,
     *   includeSpecialChars: true
     * },
     */

    this.wrapRootSet = options.wrapRootSet || false
    // See comment above for proper configuration
    this.enumerateRootSet = options.enumerateRootSet || false

    // Currently only used, when working with data-sets
    // This is not a "level" thing, but just anther class that will be added to the wrapping element
    // with a different naming and, if configured, its own numbering (this.enumberateSubSet)
    this.wrapSubSet = options.wrapSubSet || false
    // See comment above for proper configuration
    this.enumerateSubSet = options.enumerateSubSet || false

    this.wrapChars = options.wrapChars || false
    this.wrapWords = options.wrapWords || false
    // See comment above for proper configuration
    this.enumerateWords = options.enumerateWords || false

    this.saveWrappedWords = options.saveWrappedWords || false
    this.saveWrappedLetters = options.saveWrappedLetters || false

    // "normal" chars (no special characters, no empty spaces...) -> needed?
    // yes, so we can exclude empty spaces in the animation by just reading the
    // regularCharacterWrapClasses
    this.wrapRegularChars = options.wrapRegularChars || false
    // wrap special characters like ?, |, :, >, <,...; see also specialsChars comment!
    this.wrapSpecialChars = options.wrapSpecialChars || false
    this.wrapSpaceChar = options.wrapSpaceChar || false

    // Should an empty space be replaced or not?
    // HINT: A character replacement would guarantee a proper textflow; using a class might
    // create too much or too less empty space between words.
    this.replaceSpaceChar = options.replaceSpaceChar || false

    // If an empty space shall be replaced, it makes only sense with a unicode character
    // Unicode UTF-16: \u00AO (causes errors), UTF-8: \xa0
    this.replaceSpaceCharWith = options.replaceSpaceCharWith || '\xa0'

    // The tag a letter is wrapped with (make sure to check the "display" rule).
    this.characterWrapTag = options.tag || 'span'
    // Note: A CSS style decalarion of "display: inline-block" is needed to emulate a
    // natural text-wrapping again.
    this.wordWrapTag = options.tag || 'span'

    // CSS classes:

    // These classes are all wrapped around one character and semantically describe,
    // where they belong to or what kind of "letter type" we are dealing with.
    this.rootSetClass = options.rootSetClass || 'is-root-set'
    this.specialCharsClass = options.specialCharsClass || 'is-special-char'
    this.spaceCharClass = options.spaceCharClass || 'is-space-char'
    this.regularCharsClass = options.regularCharsClass || 'is-regular-char'
    this.subSetCharsClass = options.subSetCharsClass || 'is-sub-set'

    // These classes are added to the element that wraps a whole word:
    this.wordWrapClass = options.wordClass || 'is-word-wrap'

    // TODO: Check the naming of this one... is it a class? Then add "class" to the key... subSetNameClass
    this.subSetName = options.subSetName || 'is-sub-set'

    // Replace & save
    this.replaceDomSource = options.replaceDomSource || true
    this.saveAsRootSet = options.saveAsRootSet || false // Save all letters found n the page to ONE global set.

    // For use with "data-sub-set" attributes:
    this.saveAsSubSet = options.saveAsSubSet || false
    this.customOrder = options.customOrder || false
    this.saveAsCustomSet = options.saveAsCustomSet || false
    this.customSetName = options.customSetName || false // saveAsCustomSet must be true in order to use this

    // Disable eslint because of regex:
    /* eslint-disable no-useless-escape */

    // Include spaceChar, but not specialChars
    this.includeSpacesPattern = options.includeSpacesPattern || /[\w+-\s]/

    // Only regular chars ('.is-regular')
    this.regularCharsPattern = options.regularCharsPattern || /[\w+-äüöß\u2026\u00AB\u00BB]/

    // Only specialChars ('.is-special-char')
    // (ellipsis unicode = \u2026, angle quotes Unicode = \u00AB and \u00BB)
    this.specialCharsPattern = options.specialCharsPattern || /[<>?!:;,$%\u2026\u00AB\u00BB\|]/
    // Hint: If specialChars, spaceChar and regularChar are required, no regex math is necessary;
    // instead, just add the class

    // Add special chars in subSets.
    // The cnfiguration must be done in the object instatiation:
    //
    // @example
    // wrapSubSet: {
    //   includeSpaces: false,
    //   includeSpecialChars: true
    // },
    // enumerateSubSet: {
    //   includeSpaces: false,
    //   includeSpecialChars: true
    // },
    // TODO:
    // include specialChars, but not spaceChar
    // (ellipsis unicode = \u2026, angle quotes Unicode = \u00AB and \u00BB)
    this.includeSpecialCharsPattern = options.includeSpecialCharsPattern || /[\w+-\<>?!:;,$%\u2026\u00AB\u00BB\ßäöüÄÖÜéèúùóòáàíìÉÈúÙíÌóÒáÀçÇ|]/

    // Enable eslint again
    /* eslint-enable no-useless-escape */

    // -------------------------------------------------------
    // STATIC / PRIVATE CONFIGURATIONS
    // -------------------------------------------------------

    /**
     * Required "sub keys" of the "save-to object", when using "_self".
     *
     * If saved locally, these keys will be used (_self):
     * This seems to be a kind of "interim save-to place" in order to be reused later on
     * for the various saving methods
     */
    this._wrappedLetters = []
    this._wrappedWords = []
    this._subSets = []
    // this._customSets = [] // not needed
    // Needed, when working with data-sets TODO rename
    // this._allWrappedLetters = []
    // this._allWrappedWords = []

    // Global counter to add incemental numbering (on a class) over ALL _subSets
    this._rootSetCounter = 0

    // Global counter for _subsets, needs to be reset in _wrapSubSetChar
    this._subSetCounter = 0

    // TODO: imlement word counter
    // Global counter for _words, needs to be reset in ???
    this._wordCounter = 0
  }

  /* ------------------------------
   * Main Methods
   * ----------------------------- */

  /**
   * Wrap each letter, the main function that is called from the instantiated object.
   * depending on how many child nodes the given / user-assigned node has, this
   * function is called multiple times
   *
   * @param {Object} node The `node` param is needed for the recursive calls.
   */
  initializeWrap (node = '') {
    // TODO: what do we do, when the text contains nodes within like br or i or em?
    //       If that is the case, the complete text will not be recognized...
    //       ... and the following does not work... ???
    // if (node.nodeName === 'I' || node.nodeName === 'BR') {
    //   return false
    // }
    let sets = null
    // let processedCharacters = null // currently only used in orderedSets...?

    // We check against customOrder, which is only relevant, when we deal with data-sets.
    if (!this.customOrder) {
      // Check, if we deal with a node at all, since on the first run no node was
      // given as parameter to this method (`node = ''`).
      if (!node) {
        // The first call is NOT done on the childNodes, but uses the
        // _rootSet param, that was created using the rootSetIdentifier
        // class provided in the class construction
        sets = this._rootSet.childNodes
      }
      else {
        sets = node.childNodes
      }

      for (let i = 0; i < sets.length; i++) {
        let result = null

        // Check, if the node is of type 3 ("TEXTNODE")...
        if (sets[i].nodeType === 3) {
          result = this._processSet(sets[i])
          // processedCharacters.push(result)

          if (this.replaceDomSource) {
            this._replaceDom(sets[i].parentNode, result)
          }

          // Insert a break, otherwise the function will call itself again, as
          // soon as the wrapped letters are inserted in the dom element and cause
          // "deep-wrapping" (multiple wrapped chars).
          // TODO: Check, if this works with nested data-sets!!!
          break
        }
        else {
          // .. otherwise call this function recursively, until there is a node of type 3
          // console.log('call recursively on sets[i] =', sets[i])
          this.initializeWrap(sets[i])
        }
      }
    }
    else {
      // Ordered Sets: Found by dataset, NodeType = 1, not 3!
      const foundSets = this._rootSet.querySelectorAll('[data-custom-order]')

      // Use lodash to order the data-sets
      // @source https://stackoverflow.com/questions/41077260/lodash-orderby-with-child-attributes
      const orderedSets = _orderBy(
        foundSets,
        data => {
          // Attribute by which to order
          return [data.dataset.customOrder]
        },
        ['asc']
      )

      for (let j = 0; j < orderedSets.length; j++) {
        console.warn('ORDEREED SETS DISABLED!')
        // if (orderedSets[j].childNodes[0].nodeType === 3) {
        //   const result = this._processSet(orderedSets[j].childNodes[0])
        //   processedCharacters.push(result)

        //   // console.log('processedCharaceters =', processedCharaceters)

        //   if (this.replaceDomSource) {
        //     this._replaceDom(orderedSets[j], result)
        //   }
        // }
      }
    }

    // SAVE METHODS

    // 1. Enable `_customSet` on current set
    if (this.saveAsCustomSet && this.generatedWraps._customSets[this.customSetName] === undefined) {
      this.generatedWraps._customSets[this.customSetName] = {}
    }

    // When `wrapWords == true`, we can expect, that the returned array from `_wrap`
    // consists of wrappedWords and wrappedLetters (maybe even the combined version?).
    // Therefor we can invoke different saving methods.
    // If not, we only need to save letters.

    if (this.wrapChars) {
      if (this.saveWrappedLetters) {
        // First save to custom sets
        if (this.saveAsCustomSet) {
          this.generatedWraps._customSets[this.customSetName]._wrappedLetters = this._wrappedLetters
        }

        // If the _wrappedLetters object key is still empty, assign the current array to it.
        if (this.generatedWraps._wrappedLetters.length < 1) {
          this.generatedWraps._wrappedLetters = this._wrappedLetters
        }
        else {
          // ...else append the current array to the exisiting entries
          // TODO: this does not seem to be a nice implementation (newArray is iverwriting old array again... but split op is not working on the first iteration of the loop)
          // Do not use spread operator, seems to not clear contents form before, at least not on first CharWrapper instance!
          const newArray = this.generatedWraps._wrappedLetters.concat(this._wrappedLetters)
          this.generatedWraps._wrappedLetters = newArray
        }
      }
    }

    if (this.wrapWords) {
      if (this.saveWrappedWords) {
        // save to custom sets
        if (this.saveAsCustomSet) {
          this.generatedWraps._customSets[this.customSetName]._wrappedWords = this._wrappedWords
        }

        // If the _wrappedWords object key is still empty, assign the current array to it.
        if (this.generatedWraps._wrappedWords.length < 1) {
          this.generatedWraps._wrappedWords = this._wrappedWords
        }
        else {
          // ...else append the current array to the exisiting entries. See above!
          const newArray = this.generatedWraps._wrappedWords.concat(this._wrappedWords)
          this.generatedWraps._wrappedWords = newArray
        }
      }
    }
  }

  /* -------------------------------
   * Private functions
   * ----------------------------- */

  /**
    * @name _trimText
    * @description Trim white-space, linebreaks, tabs etc from the textContent of a text node
    * @param {node} node – Must be of ndeType 3 (TEXTNODE)
    */
  _trimText (node) {
    // if (node.nodeType === 3) {
    try {
      // Remove any potential line breaks...
      const txt = node.textContent
      const trimmedTxt = txt.replace(/[\r\n\t]+/g, ' ')
      // ...and white-space
      return trimmedTxt.trim()
    }
    catch {
      console.warn('A wrong nodeTypoe was given to _trimText. Should be 3, but is ' + node.nodeType)
    }
  }

  /**
   * Process a text.
   *
   * Text can be provided via a regular DOM element process or via using `data-set`s, which will
   * also enable the use _subSets of the data-set. If a sub data-set should not be included in the
   * wrapping process, use `_exclude_` as dataset name.
   *
   * @param {string} set - The textcontent of a node.
   * @return {Object} subSet - Return the textContent, where each letter is wrapped in a DOM element.
   */
  _processSet (set) {
    // console.log('%c   ...working on set ', 'background: yellow; padding: 2px; border-radiuis: 3px; color: black;', set)
    const _subSetCharsClass = set.parentNode.dataset[this.datasetAttrForSubSetCharsClass] || this.subSetCharsClass
    const _subSetName = set.parentNode.dataset[this.datasetAttrForSubSetName] || this.subSetName
    let _subSet = null

    // If the rootset contains elements that shall not be indexed use "_exlude_" as dataset name
    if (_subSetName !== '_exclude_') {
      _subSet = this._wrap(set, _subSetCharsClass)

      if (this.saveAsSubSet) {
        this.generatedWraps._subSets[_subSetName] = _subSet
      }
    }

    return _subSet
  }

  /**
   * @name _wrap()
   *
   * @description
   * The Core function of this class: Wrap characters of one subSet.
   * Pay attention to the order of functions, if a readable structure in the `class`attribute is desired.
   *
   * @param {Object} node The node which contains the text whose letters shall be wrapped.
   */
  _wrap (node, subSetCharsClass = null) {
    // Remove any potential line breaks...
    // const txt = node.textContent
    // let trimmedTxt = txt.replace(/[\r\n\t]+/g, ' ')
    // ...and white-space
    const trimmedTxt = this._trimText(node)

    // Wrap letters only...
    if (this.wrapWords === false) {
      if (this.wrapChars) {
        const charsArr = trimmedTxt.split('')
        // const charsArr = node.textContent.split('')

        const newCharsArr = charsArr.map(char => {
          return this._createCharNode(char, subSetCharsClass)
        })

        // Interim save wrapped letters
        this._wrappedLetters = newCharsArr

        // Return array for further actions like replace DOM
        return newCharsArr
      }
    }

    // ...or words and letters:
    else {
      // The goal is to have each word wrapped in its own element, but also each letter
      // wrapped in its own element. The return value should be a "flat" node that is
      // in the same way immediately usable (replacing its original DOM element) as the
      // letters are. To achieve this, each letter must be appended to the "word" element,
      // which itself must first be "cleaned" from the textnode (the original, unwrapped text).
      //
      // Steps to achieve the premiss:
      //
      // 1. For words, split text by white-space
      // 2. Create "word node", including the element's class name, to which the letters will be appended
      // 3. Add white-space character after each word (except last) again,
      // 4. If `wrapChars == true`, wrap each letter of each word, remove first (textContent) node
      //    of the word node, and append all the letters to the word node

      // QUESTION: Save the wrapped letters and words to this instantiated object?

      // 1. Split text by white-space
      // console.log('node.textContent =', node.textContent)
      // const wordsArr = node.textContent.split(' ')
      const wordsArr = trimmedTxt.split(' ')

      // 2. Create the new dom element, which wraps each word
      this._wordCounter = 0

      const processedWordsArr = wordsArr.map((word) => {
        const newElem = document.createElement(this.wordWrapTag)
        const newTxtNode = document.createTextNode(word)
        newElem.appendChild(newTxtNode)

        return newElem
      })

      // 3. We need to add the spaces between the words again, so add
      //    create a new array that holds the old values, each followed by
      //    an emty space - extept the last word.
      const processedWordsWithSpacesArr = []

      for (let i = 0; i < processedWordsArr.length; i++) {
        // Add the original word
        processedWordsWithSpacesArr.push(processedWordsArr[i])

        // Add an empty space as long as it is not the last word of the array
        if (i !== (processedWordsArr.length - 1)) {
          processedWordsWithSpacesArr.push(this._addWhiteSpaceBetweenWords())
        }
      }

      // Generate class name for word wrap element
      for (let i = 0; i < processedWordsWithSpacesArr.length; i++) {
        let cls = this.wordWrapClass
        if (this.enumerateWords) {
          cls += this._getClassForWord(processedWordsWithSpacesArr[i], this.enumerateWords, this.wordWrapClass, '_wordCounter')
        }
        processedWordsWithSpacesArr[i].setAttribute('class', cls)
      }

      // Save to configuration
      this._wrappedWords = processedWordsWithSpacesArr

      const completeWordsWithNestedWrappedLettersArr = []
      const lettersOnlyArr = []

      // 4. Now manage each letter of each word
      if (this.wrapChars === true) {
        processedWordsWithSpacesArr.forEach(word => {
          const charsArr = word.textContent.split('')

          // Remove the textContent node before the wrapped letters are added.
          // Otherwise text will be doubled.
          word.removeChild(word.firstChild)

          // Loop over each letter in the word and append all of them to the `is-word-wrap` container
          charsArr.forEach(char => {
            const wrappedChar = this._createCharNode(char)
            lettersOnlyArr.push(wrappedChar)
            word.appendChild(wrappedChar)
          })

          completeWordsWithNestedWrappedLettersArr.push(word)
        })

        // Save wrapped letters only
        this._wrappedLetters = lettersOnlyArr
      }

      // Return array for further actions like `_replaceDom`
      return (typeof completeWordsWithNestedWrappedLettersArr) !== 'undefined'
        ? completeWordsWithNestedWrappedLettersArr
        : processedWordsWithSpacesArr
    }
  }

  /**
   * Create Character Node
   *
   * Returns one letter as a node - wrapped in the defined DOM element, including the class attributes.
   *
   * @param {string} char One single character.
   * @param {string} subSetCharClass The class name that will be assigned to the wrapping element.
   * @returns {object} Returns the "newElem" of type "node 1".
   */
  _createCharNode (char, subSetCharsClass) {
    // Prepare individual character class name:
    // - Use individual class for the wrap of the text node characters
    // - Get from parentNode: dataset-subclass, dataset-subSetname (for saveToSubSet)
    // - Split innerText

    // Base-wrap class that all chars receive;
    // "cls" = the "class" attribute on the "div" element;
    // Later on prepend a space, since the root class is already attached
    let cls = this.rootSetClass

    // - Reset _subSetCounter and _wordCounter here (used for the enumerated variant of the subSetCharsClass)
    this._subSetCounter = 0

    // Create the class attributes for each wrapped letter
    // (depending on the configurations from above)
    if (this.enumerateRootSet) {
      cls += this._getClassForChar(char, this.enumerateRootSet, this.rootSetClass, '_rootSetCounter')
    }

    if (this.wrapSubSet) {
      cls += this._getClassForChar(char, this.wrapSubSet, subSetCharsClass || this.subSetCharsClass, false)
    }

    if (this.enumerateSubSet) {
      cls += this._getClassForChar(char, this.enumerateSubSet, subSetCharsClass || this.subSetCharsClass, '_subSetCounter')
    }

    if (this.wrapSpaceChar) {
      if (char.match(/\s/)) {
        cls += ' ' + this.spaceCharClass
      }
    }

    if (this.wrapSpecialChars) {
      // if (['|', '?', ';', '!', ',', '<', '>', '$', '§','…'].includes(letter)) {
      if (char.match(this.specialCharsPattern)) {
        // console.log('Special char found:', char);
        cls += ' ' + this.specialCharsClass
      }
    }

    if (this.wrapRegularChars) {
      if (char.match(this.regularCharsPattern)) {
        cls += ' ' + this.regularCharsClass
      }
    }

    // Create the new dom element, which wraps each letter, and
    // assign it the class attributes
    const newElem = document.createElement(this.characterWrapTag)
    let newTxtNode = null

    if (char !== ' ') {
      newTxtNode = document.createTextNode(char)
    }
    else {
      if (this.replaceSpaceChar) {
        newTxtNode = document.createTextNode(this.replaceSpaceCharWith)
      }
      else {
        // In any case create a text node with an empty space, because
        // it most likely will be wrapped with a special .is-space-char class.
        newTxtNode = document.createTextNode(char)
      }
    }
    newElem.appendChild(newTxtNode)
    newElem.setAttribute('class', cls)

    return newElem

    // This does NOT return a Node, but only a String. Not useable!
    // return `<div class="${cls}">${char}</div>`
  }

  /**
   * Build the classes that shall be attached to a letter's or word's wrapping element
   */
  _getClassForChar (letter, options, className, counter) {
    let cls = ''

    if (counter === '_rootSetCounter') {
      className += '-' + this._addZerosToInteger(this._rootSetCounter++)
    }
    else if (counter === '_subSetCounter') {
      className += '-' + this._addZerosToInteger(this._subSetCounter++)
    }

    if (options.includeSpaces && options.includeSpecialChars) {
      cls = ' ' + className
    }
    // Special Chars only
    else if (options.includeSpaces && !options.includeSpecialChars) {
      if (letter.match(this.includeSpacesPattern)) {
        cls = ' ' + className
      }
    }
    else if (!options.includeSpaces && options.includeSpecialChars) {
      if (letter.match(this.includeSpecialCharsPattern)) {
        cls = ' ' + className
      }
    }

    return cls
  }

  _getClassForWord (letter, options, className, counter) {
    let cls = ''

    if (counter === '_wordCounter') {
      className += '-' + this._addZerosToInteger(this._wordCounter++)
    }

    // For Word wrapping only: the letter is actually a sequence of letters wrapped in an element
    // So get the childNodes[0] and compare it to an empty space
    if (letter.innerText === String.fromCharCode(160)) {
      if (options.includeWordSpaces) {
        cls += ' ' + className
      }
      else {
        // Set back the word counter by 1 again, because the parent function keeps
        // counting up, even though the empty space word is not required.
        this._wordCounter--
      }
    }
    else {
      cls += ' ' + className
    }

    return cls
  }

  /**
   * Replace DOM content.
   *
   * Replace the original text content (= textnode [node type 3]) with the
   * wrapped text in the given DOM element. The DOM element needs to be cleared
   * out first of any possible textcontent using `[el].innerText = ''` and
   * `[el].textContent = ''`.
   *
   * @param {Object} domEl - An object of type "node 1"
   * @param {array} result - Array of wrapped words or letters
   *
   * @return void
   */
  _replaceDom (domEl, result) {
    domEl.innerText = ''
    domEl.innerHTML = ''
    domEl.textContent = ''

    for (const i in result) {
      domEl.appendChild(result[i])
    }
  }

  /**
   * Add a white-space character. Used by word splits, which use white-space to split up a
   * sentence into its words and therefore must attach a white-space after each word again.
   *
   * @return {Object} Returns a "newElem", which is an empty character wrapped as a "word wrap" element.
   */
  _addWhiteSpaceBetweenWords () {
    const newElem = document.createElement(this.wordWrapTag)
    const newTxtNode = document.createTextNode(this.replaceSpaceCharWith)
    newElem.appendChild(newTxtNode)
    // newElem.setAttribute('class', this.wordWrapClass)
    return newElem
  }

  /**
   * Add Zeros to numbers that have less then 3 digits.
   * Needed for classes that enumerate.
   *
   * TODO: Is the ternary operation correct? It seems this should only return the int, since
   *       everything between 0 and 99 is already covered...
   *       `: int`
   *
   * @param {int} int The integer that is checked, whether it has 3 or less digits.
   * @returns {int}
   */
  _addZerosToInteger (int) {
    return int < 100 && int > 9
      ? '0' + int
      : int < 10
        ? '00' + int
        : '0' + int
  }
}

export default CharWrapper
/* eslint-enable no-unused-vars */


/*
 * Save all letters from all words in one general place.
 *
 * @question
 * Why is this not callable from an instantiated object?
 */
// saveAsRootSet() {
//   console.log('saveAsRootSetFunction invoked');
//   let _wrappedLetters = '',
//     _wrappedWords = '',
//     counter = 0,
//     len = Object.keys(this.generatedWraps._subSets).length

//   for (let item in this.generatedWraps._subSets) {
//     counter++
//     // _wrappedLetters.concat(Array.from(this.generatedWraps._subSets[item]))
//     _wrappedLetters += this.generatedWraps._subSets[item]

//     // Add a comma as long as lng as there are more strings to be attached
//     if (counter !== len) {
//       _wrappedLetters += ','
//     }
//   }

//   this.generatedWraps._wrappedLetters = _wrappedLetters.split(',')
// }

// @removed
// Flatten the array.
// Needed especially for wrappedWordsWithNestedWrappedLettersArray.
//
// When we deal with a lettersOnly array, this method won't change anything.
// But when we deal with a wrappedWordsWithNestedWrappedLetters array, then
// this operation flattens out the multi-dimensional array (needed to append the
// element to the DOM separately) to a single dimensional one, which we need for
// easier access with GSAP (e.g.).

// processedCharacters = processedCharacters.reduce((a, b) => a.concat(b))
