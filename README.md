# smcms

A small CMS for Node.js apps.

---

The goal of smcms is to be a CMS that can be plugged into an
existing Node.js app in a matter of minutes.

smcms is made to be pluggable in order to support multiple
backends.

The main concept behind smcms is little more than a key-value store. The notable exception here is that keys are namespaced
so that you can request things like `my.namespace.*` to retrieve
all keys within the `my.namespace` namespace.

## Backends
A backend is used to store the data, and must support certain
operations:
* read a

## API Adapters
API adapters are developed to make integrating smcms easy.
For example, [Express](https://expressjs.com) middleware to expose an API.

Another example would be a [graphql-js](https://github.com/graphql/graphql-js) integration.
