When using AI SDK RSC with Jest for testing RSC components, you may encounter the error "Cannot find module '@ai-sdk/rsc'". This occurs because Jest cannot resolve the module path correctly.

To fix this, configure Jest's module resolution in your jest.config.js file by adding a moduleNameMapper entry that maps the '@ai-sdk/rsc' module to its actual distribution path:

```json
"moduleNameMapper": {
  "^@ai-sdk/rsc$": "<rootDir>/node_modules/@ai-sdk/rsc/dist"
}
```

This tells Jest where to find the '@ai-sdk/rsc' module when running tests.