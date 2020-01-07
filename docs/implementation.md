# Implementation

ISREN currently supports GitLab only, but adding new implementation can be done
using the following steps:

- Create a new file in `src/implementation/MyService.js`
- Extend the common interface for your implementation and implement the required
  functions:

```js
module.exports = class MyService extends Implementation {
  constructor(url, cmd) {
    super('MyService', url, cmd);
  }

  getIssues() {}

  authenticate() {}
};
```

> Note: Each implementation should remain in sync and support as many shared
> features as possible.
