# smcms

A small CMS for Node.js apps.

[![CircleCI](https://circleci.com/gh/Truebill/smcms.svg?style=svg)](https://circleci.com/gh/Truebill/smcms)
[![npm](https://img.shields.io/npm/v/smcms.svg)](https://www.npmjs.com/package/smcms)

---

The goal of smcms is to be a CMS that can be plugged into an
existing Node.js app in a matter of minutes.

smcms is made to be pluggable in order to support multiple
stores.

The main concept behind smcms is little more than a key-value store. The notable exception here is that keys are namespaced
so that you can request things like `my.namespace.*` to retrieve
all keys within the `my.namespace` namespace.

## Stores
A backend is used to store the data, and must support certain
operations:
* retrieve a value from a key
* retrieve all keys and values under a namespace

## API Adapters
API adapters are developed to make integrating smcms easy.
For example, [Express](https://expressjs.com) middleware to expose an API.

Another example would be a [graphql-js](https://github.com/graphql/graphql-js) integration.
