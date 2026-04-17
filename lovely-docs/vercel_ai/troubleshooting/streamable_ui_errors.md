## Streamable UI Component Errors

When working with streamable UIs in server actions, you may encounter errors such as:
- Variable Not Found
- Cannot find `div`
- `Component` refers to a value, but is being used as a type

**Solution:** These errors typically occur because the file has a `.ts` extension instead of `.tsx`. Streamable UI components require JSX support, which is only enabled in `.tsx` files. Rename your file to use the `.tsx` extension to resolve these issues.