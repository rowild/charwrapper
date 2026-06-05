#!/usr/bin/env node

import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

console.info = () => {};

function setupDom(html) {
  const dom = new JSDOM(html);
  global.window = dom.window;
  global.document = dom.window.document;
  global.Element = dom.window.Element;
  global.HTMLElement = dom.window.HTMLElement;
  global.Node = dom.window.Node;
  global.Text = dom.window.Text;
}

async function loadCharWrapper() {
  const mod = await import('../dist/esm/CharWrapper.js');
  return mod.default || mod.CharWrapper;
}

function text(elements) {
  return elements.map(el => el.textContent).join('');
}

async function testSingleRootSet() {
  setupDom(`
    <section data-root-set="profile">
      <h1 data-set-name="first_name">Robert</h1>
      <h1 data-set-name="last_name">Wildling</h1>
    </section>
  `);

  const CharWrapper = await loadCharWrapper();
  const rootSet = new CharWrapper('[data-root-set="profile"]', {
    wrap: { chars: true, words: true },
  }).wrap();

  assert.equal(rootSet.name, 'profile');
  assert.ok(rootSet.chars.length > 0);
  assert.ok(rootSet.words.length > 0);
  assert.equal(text(rootSet.attributeSets.first_name.chars), 'Robert');
  assert.equal(text(rootSet.attributeSets.last_name.chars), 'Wildling');
  assert.equal(text(rootSet.attributeSets.first_name.words), 'Robert');
}

async function testWrapAllRootOrder() {
  setupDom(`
    <main>
      <section data-root-set="professions" data-root-order="2">Developer</section>
      <section data-root-set="profile" data-root-order="1">Robert</section>
    </main>
  `);

  const CharWrapper = await loadCharWrapper();
  const rootSets = CharWrapper.wrapAll('[data-root-set]', {
    wrap: { chars: true },
    processing: { ordered: true },
  });

  assert.equal(rootSets.length, 2);
  assert.equal(rootSets[0].name, 'profile');
  assert.equal(rootSets[1].name, 'professions');
  assert.equal(CharWrapper.getRootSet(rootSets, 'profile'), rootSets[0]);
}

async function testSetOrderAndClasses() {
  setupDom(`
    <section data-root-set="profile">
      <span data-set-name="last_name" data-set-order="2" data-set-char-class="last-char">B</span>
      <span data-set-name="first_name" data-set-order="1" data-set-char-class="first-char">A</span>
    </section>
  `);

  const CharWrapper = await loadCharWrapper();
  const rootSet = new CharWrapper('[data-root-set="profile"]', {
    wrap: { chars: true },
    processing: { ordered: true },
    enumerate: { rootSet: true, chars: true, attributeSets: true },
  }).wrap();

  assert.equal(text(rootSet.chars), 'AB');
  assert.equal(text(rootSet.attributeSets.first_name.chars), 'A');
  assert.equal(text(rootSet.attributeSets.last_name.chars), 'B');
  assert.ok(rootSet.chars[0].classList.contains('belongs-to-root-set'));
  assert.ok(rootSet.chars[0].classList.contains('belongs-to-root-set-000'));
  assert.ok(rootSet.chars[0].classList.contains('char-000'));
  assert.ok(rootSet.chars[0].classList.contains('first-char'));
  assert.ok(rootSet.chars[0].classList.contains('first-char-000'));
}

async function testNearestOwnerAndExclude() {
  setupDom(`
    <section data-root-set="profile">
      <p data-set-name="card">Hello <strong data-set-name="name">Robert</strong></p>
      <p data-set-name="_exclude_">Hidden</p>
    </section>
  `);

  const CharWrapper = await loadCharWrapper();
  const rootSet = new CharWrapper('[data-root-set="profile"]', {
    wrap: { chars: true },
  }).wrap();

  assert.equal(text(rootSet.attributeSets.card.chars), 'Hello\u00a0');
  assert.equal(text(rootSet.attributeSets.name.chars), 'Robert');
  assert.equal(rootSet.attributeSets._exclude_, undefined);
  assert.equal(document.querySelector('[data-set-name="_exclude_"]').textContent.trim(), 'Hidden');
}

async function testGroupsAndCustomSets() {
  setupDom(`
    <section data-root-set="profile">
      <span data-set-name="first_name">Ada</span>
      <span data-set-name="last_name">Lovelace</span>
    </section>
  `);

  const CharWrapper = await loadCharWrapper();
  const rootSet = new CharWrapper('[data-root-set="profile"]', {
    wrap: { chars: true },
    groups: {
      vowels: /[aeiouAEIOU]/,
    },
    rootSet: {
      customSets: {
        fullName: ['first_name', 'last_name'],
        firstWords: { attributeSet: 'first_name', target: 'chars' },
        computed: root => root.attributeSets.last_name.chars,
      },
    },
  }).wrap();

  assert.equal(text(rootSet.groups.vowels), 'Aaoeae');
  assert.equal(text(rootSet.attributeSets.first_name.groups.vowels), 'Aa');
  assert.equal(text(rootSet.customSets.fullName), 'AdaLovelace');
  assert.equal(text(rootSet.customSets.firstWords), 'Ada');
  assert.equal(text(rootSet.customSets.computed), 'Lovelace');
}

async function run() {
  await testSingleRootSet();
  await testWrapAllRootOrder();
  await testSetOrderAndClasses();
  await testNearestOwnerAndExclude();
  await testGroupsAndCustomSets();
  console.log('Root set tests passed');
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
