[![Build Status](https://travis-ci.org/justinmahar/articulate-nlg.svg?branch=master)](https://travis-ci.org/justinmahar/articulate-nlg) [![codecov](https://codecov.io/gh/justinmahar/articulate-nlg/branch/master/graph/badge.svg)](https://codecov.io/gh/justinmahar/articulate-nlg)

# Articulate NLG

A natural language generator (NLG) that articulates concepts as words, phrases, and sentences.

This [TypeScript](https://www.typescriptlang.org/) project is [available in JavaScript via npm](https://www.npmjs.com/package/articulate-nlg) as a CommonJS import.

## Installation

[Via npm](https://www.npmjs.com/package/articulate-nlg) (requires [Node.js](https://nodejs.org/)):

```bash
$ npm i articulate-nlg
```

CommonJS import:

```js
const Persona = require("articulate-nlg").default;
```

## Usage

A persona requires a vocabulary, which defines the text that can be generated.

Vocabularies for a persona are defined as key value string pairs in a JS object. The underlying templating engine is [mustache.js](https://github.com/janl/mustache.js/), and all keys are Mustache partials. They can be cross-referenced, just make sure you avoid circular references, which will cause an infinite loop.

One you construct a `Persona`, call `articulate(template, params)` on the persona to generate text!

See the example below:

```js
const Persona = require("articulate-nlg").default;

let dogVocab = {
  greet: "{{#choose}}woof|bark|sniff sniff|wag tail{{/choose}}",
  master:
  "{{#params.name}}{{#capitalize}}{{params.name}}{{/capitalize}}{{/params.name}}{{^params.name}}bringer of food{{/params.name}}",
  emoji: "{{#choose}}👅|🐶|🐾|💩|🐩|🐕‍{{/choose}}",
  "welcome-home":
  "{{#capitalize}}{{>greet}}{{/capitalize}}! Welcome home, {{>master}}! {{>emoji}}"
};

let max = new Persona(dogVocab);

console.log(max.articulate("welcome-home"));
// Will generate text like following:
// Sniff sniff! Welcome home, bringer of food! 🐾
// Woof! Welcome home, bringer of food! 👅
// Wag tail! Welcome home, bringer of food! 🐕‍
// Etc.

// This will find the "greet" partial and render it.
console.log(max.articulate("greet"));
// "woof", "bark", "sniff sniff", "wag tail"

// The above is equivalent to using a partial, like so:
console.log(max.articulate("{{>greet}}"));
// "woof", "bark", "sniff sniff", "wag tail"

// However, if you don't explicitly use a partial and it's not found, you'll see the text you provided:
console.log(max.articulate("missing"));
// "missing"

// Whereas if you use a partial that's not found, you'll just get an empty string back:
console.log(max.articulate("{{>missing}}"));
// ""

// You can pass parameters, too. These are referenced using: {{params.keyName}}
console.log(max.articulate("master", { "name": "justin" }));
// "Justin"
console.log(max.articulate("{{>master}}", { "name": "justin" }));
// "Justin"

// You can use your own mustache, too. Note no name was found here, so it used the default defined in the vocabulary.
console.log(max.articulate("{{#capitalize}}{{>master}}{{/capitalize}}"));
// "Bringer of food"
```

## Function Wrappers

As shown in the example above, there are a few function wrappers available for your vocabulary:

- `capitalize`: Capitalizes the first letter of the contents after rendering it.
  - `{{#capitalize}}hello{{/capitalize}}` -> `Hello`
- `choose`: Chooses one of the items at random.
  - `{{#choose}}apple|orange|starfruit{{/choose}}` -> Randomly selects `apple`, `orange`, `starfruit`.
  - Items are separated by `|` pipes.
  - Each item is rendered, meaning you can nest additional partials `{{> partialName }}`.
    - `{{#choose}}apple|orange|{{>meat}}{{/choose}}` -> Randomly selects `apple`, `orange`, or whatever `meat` renders as.
  - You can specify weights using `=weight` where `weight` is the value.
    - For example, `greet: "{{#choose}}woof=5|bark=95{{/choose}}"` would mean a 5% chance of `woof` and a 95% chance of `bark`.

## TypeScript Support

This is a TypeScript project, so type definitions are available in: `dist/index.d.ts`.

## ISC License

Copyright 2019 Justin Mahar

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
