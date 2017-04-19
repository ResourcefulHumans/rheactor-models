# rheactor-models

[![Build Status](https://travis-ci.org/ResourcefulHumans/rheactor-models.svg?branch=master)](https://travis-ci.org/ResourcefulHumans/rheactor-models)
[![monitored by greenkeeper.io](https://img.shields.io/badge/greenkeeper.io-monitored-brightgreen.svg)](http://greenkeeper.io/) 
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![semantic-release](https://img.shields.io/badge/semver-semantic%20release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Test Coverage](https://codeclimate.com/github/ResourcefulHumans/rheactor-models/badges/coverage.svg)](https://codeclimate.com/github/ResourcefulHumans/rheactor-models/coverage)
[![Code Climate](https://codeclimate.com/github/ResourcefulHumans/rheactor-models/badges/gpa.svg)](https://codeclimate.com/github/ResourcefulHumans/rheactor-models)

[![NPM](https://nodei.co/npm/rheactor-models.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/rheactor-models/)

A collection of models.

## JSON-LD

> :information_source: See also: [RESTful API in `rheactor-server`](https://github.com/ResourcefulHumans/rheactor-server/blob/master/README.md#restful-api)

### `$context`

When creating an object instance from a JSON representation, the `fromJSON()` method expects the presence of the correct `$context` value. When serializing and unserializing using these models, this is done automatically.

This makes it impossible to use the data for one entity as another.

### `$contextVersion`

The `$contextVersion` was added to enable clients that cache entities, e.g. in localStorage, to check if their application code is compatibel with the cached data.
