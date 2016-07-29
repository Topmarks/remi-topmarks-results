# Add Results Plugin

[![Build Status](https://travis-ci.org/Topmarks/remi-topmarks-results.svg?branch=master)](https://travis-ci.org/Topmarks/remi-topmarks-results) [![Code Climate](https://codeclimate.com/github/Topmarks/remi-topmarks-results/badges/gpa.svg)](https://codeclimate.com/github/Topmarks/remi-topmarks-results) [![Test Coverage](https://codeclimate.com/github/Topmarks/remi-topmarks-results/badges/coverage.svg)](https://codeclimate.com/github/Topmarks/remi-topmarks-results/coverage) [![Issue Count](https://codeclimate.com/github/Topmarks/remi-topmarks-results/badges/issue_count.svg)](https://codeclimate.com/github/Topmarks/remi-topmarks-results) [![Dependency Status](https://david-dm.org/topmarks/remi-topmarks-results.svg)](https://david-dm.org/topmarks/remi-topmarks-results) [![npm version](https://badge.fury.io/js/remi-topmarks-results.svg)](https://badge.fury.io/js/remi-topmarks-results)

A [remi](https://github.com/remijs/remi) extension that adds the addResults method to the app so it can be used by plugins. Designed to specifically make it easier to make [Topmarks](https://github.com/topmarks/topmarks) plugins.

## Installation

```sh
npm i remi-topmarks-results
```

## Usage

Register the extension in the registration app.

```js
import remi from 'remi';
import remiExpose from 'remi-topmarks-results';

const app = {};
const registrator = remi(app);
registrator.hook(addResults());

registrator.register({register: require('sample-plugin')});
```

Then plugins can use the `addResults` method:

```js
let samplePlugin = (app, options next) => {
  // do some stuff and gather the results
  app.addResults('foo'); // There's an optional parameter for a timestamp, if none is specified it will default to now.
  next();
}

samplePlugin.attributes = {
  pkg: require('../package.json')
}
```

After the plugin has added results, they are accessible on as `app.results`. It is an array that will continue to push results when they are added.

When the plugin has `url` and/or `pageId` properties, they will be included in the results.

As sample result:

```js
[ { plugin: 'plugin', timestamp: 1469770823748, report: 'foo' } ]
```
