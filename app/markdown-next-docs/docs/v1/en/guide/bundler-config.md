# Bundler Configuration

When using `vue-markdown-next` with a bundler like Vite, you might need to apply specific configurations, especially when using Web Workers for parsing.

## Vite

A common problem when using `vue-markdown-next` within a Web Worker is an error message like `document is not defined`.

### The Problem

This error usually happens because a dependency is trying to use browser-only APIs (like `document`) inside the worker where they are not available.

Many packages in the `remark` and `rehype` ecosystem are "isomorphic", meaning they can run in both Node.js and the browser. To do this, they might have a `browser` field in their `package.json` file, which points to a version of the code intended for browsers. This browser version may use `document` for performance optimizations (e.g., `parse-entities`).

Web workers, however, do not have access to the `document` object.

A configuration that can trigger this issue in Vite is setting `resolve.conditions`:

```js
// vite.config.js
export default {
  // ...
  resolve: {
    conditions: ['worker'],
  },
};
```

This tells Vite to prefer the `worker` export condition when resolving packages. Some packages, like `decode-named-character-reference`, provide a worker-specific export. However, for packages that don't have a `worker` export but do have a `browser` export, Vite might fall back to using the `browser` version, leading to the error.

### The Solution

To prevent this, you need to configure Vite's resolver to avoid using `browser` builds for your worker. A better approach for `resolve.conditions` is to use the default conditions but remove `browser`.

```js
// vite.config.js
export default {
  // ...
  resolve: {
    // You might need to apply this conditionally for your worker builds
    conditions: ['import', 'module', 'default'],
  },
};
```

By removing the `browser` condition, you instruct Vite to pick a more generic version of the dependencies that does not rely on browser-specific APIs, which is generally compatible with Web Workers.

_This is a simplified example. Depending on your project's structure, you might need a more advanced configuration to apply these resolver conditions only to the worker bundle._
