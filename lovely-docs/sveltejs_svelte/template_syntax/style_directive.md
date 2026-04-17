The `style:` directive provides a shorthand for setting CSS styles on elements.

**Basic usage:**
```svelte
<div style:color="red">...</div>
<!-- equivalent to: <div style="color: red;">...</div> -->
```

**Dynamic values:**
```svelte
<div style:color={myColor}>...</div>
```

**Shorthand form** (uses variable with same name as property):
```svelte
<div style:color>...</div>
```

**Multiple styles:**
```svelte
<div style:color style:width="12rem" style:background-color={darkMode ? 'black' : 'white'}>...</div>
```

**Important modifier:**
```svelte
<div style:color|important="red">...</div>
```

**Precedence:** When `style:` directives are combined with `style` attributes, directives take precedence even over `!important` properties:
```svelte
<div style:color="red" style="color: blue">This will be red</div>
<div style:color="red" style="color: blue !important">This will still be red</div>
```