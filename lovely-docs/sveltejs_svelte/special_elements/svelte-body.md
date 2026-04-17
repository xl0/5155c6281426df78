The `<svelte:body>` element allows you to attach event listeners to `document.body` and use actions on the body element. Unlike `<svelte:window>`, it captures events like `mouseenter` and `mouseleave` that don't fire on the window object.

Usage:
```svelte
<svelte:body onevent={handler} />
<svelte:body onmouseenter={handleMouseenter} onmouseleave={handleMouseleave} use:someAction />
```

Constraints: This element may only appear at the top level of your component and must never be inside a block or element.