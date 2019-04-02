[![Build Status](https://travis-ci.org/unchartedcode/ember-promise-tools.svg)](https://travis-ci.org/unchartedcode/ember-promise-tools)
[![npm version](https://badge.fury.io/js/ember-promise-tools.svg)](http://badge.fury.io/js/ember-promise-tools)
[![Code Climate](https://codeclimate.com/github/unchartedcode/ember-promise-tools/badges/gpa.svg)](https://codeclimate.com/github/unchartedcode/ember-promise-tools)
[![Test Coverage](https://codeclimate.com/github/unchartedcode/ember-promise-tools/badges/coverage.svg)](https://codeclimate.com/github/unchartedcode/ember-promise-tools/coverage)
[![Dependency Status](https://david-dm.org/unchartedcode/ember-promise-tools.svg)](https://david-dm.org/unchartedcode/ember-promise-tools)

# ember-promise-tools

This is a collection of tools we built to help deal with and unwrap promises when you know they are already fulfilled.

While you can always use the standard promise resolve mechanisms, if you preload a lot of ember data so that all your relationships are already resolved,

or you are dealing with promises you know were previously resolved and just want access to the fulfilled content, this is a collection of tools to help to do that.

# Installation

```
ember install ember-promise-tools
```

## Documenation

### Mixins

#### Promise Resolver (ember-promise-tools/mixins/promise-resolver)

A Mixin that you can include in any object to give you a promise resolving workflow.

The method signature is:

```
resolvePromise(maybePromise, immediateResolve, delayedResolve, catchResolve)
```

maybePromise is the value that may or may not be a promise.

If the value is a promise and is already resolved, or the value isn't a promise, immediateResolve is called.

If it is a promise and needs to wait, then the delayedResolve is called. If you don't pass this method in, immediateResolve will be called in its place.

If it gets an error, the catchResolve is called.

This method is meant to be used as last object in wins. If you pass multiple promises in, only the last one passed in calls callbacks on resolve.

### Utils

#### Is Promise (ember-promise-tools/utils/is-promise)

```
function(maybePromise)
```

A simple function where you pass in a value, and it returns true or false if its a promise.

#### Is Fulfilled (ember-promise-tools/utils/is-fulfilled)

```
function(maybePromise)
```

A simple function where you pass in a value, and it returns true or false if the promise is fulfilled.

It is expected that if you call this method, you know its a promise or previously called is-promise util.

This detects fulfilled state only from objects using Ember.PromiseProxyMixin and Ember.RSVP.Promise.

#### Get Promise Content (ember-promise-tools/utils/get-promise-content)

```
function(maybePromise)
```

A simple function where you pass in a value, and it returns the content of a fulfilled promise.

It is expected that if you call this method, you know its a promise and previously fulfilled.

This only returns content from objects using Ember.PromiseProxyMixin and Ember.RSVP.Promise.

#### Smart Resolve (ember-promise-tools/utils/smart-resolve)

```
function(maybePromise)
```

This is a method combining the previously three utilities to try and return the most appropriate value.

If its not a promise, it returns the value.

If it is a promise and the promise is fulfilled, it returns the content.

If it is a promise and the promise isn't fulfilled, it returns the promise.