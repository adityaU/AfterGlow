[![Build Status](https://travis-ci.org/pzuraq/ember-legacy-class-shim.svg?branch=master)](https://travis-ci.org/pzuraq/ember-legacy-class-shim)

# ember-legacy-class-shim

This addon adds a shim which reopens `EmberObject` and redefines `.extend`. This allows
older versions of Ember to use ES Classes with some restrictions.

## Why is this needed?

The reason legacy versions of Ember need this transform lies, at its core, in the
[double extend](https://github.com/emberjs/rfcs/blob/master/text/0150-factory-for.md)
which was used for the longest time to inject services and other things. This double
extend ends up creating a new class altogether which, due to the way classes are handled
internally in Ember, _never_ calls `super`.

This means that when we define a class using `class` it's constructor never gets run.
A side-effect of this is that class fields, which are assigned _in_ the constructor, do
not get assigned. This substantially reduces the usefulness of class syntax and decorators
since they rely on class fields working as expected.

## What does it fix?

This fixes the double extend problem only. Actually fixing `.extend` requires changes to
CoreObject directly and won't be fixed until later versions of Ember. Once you start using
native class syntax, you can't go back.

## Installation

* `git clone <repository-url>` this repository
* `cd ember-legacy-class-shim`
* `npm install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
