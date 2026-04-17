## Accessibility Warnings (a11y_*)

**a11y_accesskey**: Avoid `accesskey` attribute - creates keyboard shortcut conflicts with screen readers.
```svelte
<div accesskey="z"></div> <!-- warning -->
```

**a11y_aria_activedescendant_has_tabindex**: Elements with `aria-activedescendant` must have `tabindex`.
```svelte
<div aria-activedescendant="some-id"></div> <!-- warning -->
```

**a11y_aria_attributes**: Reserved elements (`meta`, `html`, `script`, `style`) should not have `aria-*` attributes.
```svelte
<meta aria-hidden="false" /> <!-- warning -->
```

**a11y_autofocus**: Avoid `autofocus` - causes usability issues.
```svelte
<input autofocus /> <!-- warning -->
```

**a11y_click_events_have_key_events**: Non-interactive elements with `onclick` need keyboard handlers (`onkeyup`/`onkeydown`) and `tabindex`.
```svelte
<div onclick={() => {}}></div> <!-- warning -->
```

**a11y_consider_explicit_label**: Buttons and links need text or `aria-label`/`aria-labelledby`/`title`.

**a11y_distracting_elements**: Avoid `<marquee>` and `<blink>`.

**a11y_figcaption_index**: `<figcaption>` must be first or last child of `<figure>`.

**a11y_figcaption_parent**: `<figcaption>` must be immediate child of `<figure>`.
```svelte
<div><figcaption>Caption</figcaption></div> <!-- warning -->
```

**a11y_hidden**: Certain elements (`h1-h6`, etc.) should not be hidden with `aria-hidden="true"`.
```svelte
<h2 aria-hidden="true">invisible header</h2> <!-- warning -->
```

**a11y_img_redundant_alt**: `alt` text should not contain "image", "picture", or "photo" (screen readers already announce it).
```svelte
<img src="foo" alt="Photo of foo" /> <!-- warning -->
```

**a11y_incorrect_aria_attribute_type**: ARIA attributes must have correct types:
- `aria-hidden`: boolean (`true`/`false`)
- `aria-activedescendant`: DOM element ID
- `aria-labelledby`: space-separated ID list
- `aria-level`: integer
- `aria-sort`: token (`ascending`/`descending`/`none`/`other`)
- `aria-pressed`: tristate (`true`/`false`/`mixed`)
```svelte
<div aria-hidden="yes"></div> <!-- warning: must be true/false -->
```

**a11y_interactive_supports_focus**: Interactive roles (`button`, `link`, etc.) need `tabindex`.
```svelte
<div role="button" onkeypress={() => {}} /> <!-- warning -->
```

**a11y_invalid_attribute**: `href` should not be empty, `#`, or `javascript:`.
```svelte
<a href="">invalid</a> <!-- warning -->
```

**a11y_label_has_associated_control**: Labels must be associated via wrapping or `for` attribute.
```svelte
<label>A</label> <!-- warning: no control -->
<label for="id">B</label> <!-- ok -->
<label>C <input type="text" /></label> <!-- ok -->
```

**a11y_media_has_caption**: `<video>` must have `<track kind="captions">` (unless `muted`).
```svelte
<video></video> <!-- warning -->
<video><track kind="captions" /></video> <!-- ok -->
<audio muted></audio> <!-- ok -->
```

**a11y_misplaced_role**: Reserved elements should not have `role` attribute.
```svelte
<meta role="tooltip" /> <!-- warning -->
```

**a11y_misplaced_scope**: `scope` attribute only for `<th>`.
```svelte
<div scope="row" /> <!-- warning -->
```

**a11y_missing_attribute**: Required attributes:
- `<a>`: `href` (unless fragment-defining)
- `<area>`: `alt`, `aria-label`, or `aria-labelledby`
- `<html>`: `lang`
- `<iframe>`: `title`
- `<img>`: `alt`
- `<object>`: `title`, `aria-label`, or `aria-labelledby`
- `<input type="image">`: `alt`, `aria-label`, or `aria-labelledby`
```svelte
<input type="image" /> <!-- warning -->
<html></html> <!-- warning -->
<a>text</a> <!-- warning -->
```

**a11y_missing_content**: Headings and anchors need text content.
```svelte
<a href="/foo"></a> <!-- warning -->
<h1></h1> <!-- warning -->
```

**a11y_mouse_events_have_key_events**: `onmouseover` needs `onfocus`, `onmouseout` needs `onblur`.
```svelte
<div onmouseover={handler} /> <!-- warning -->
<div onmouseout={handler} /> <!-- warning -->
```

**a11y_no_abstract_role**: Abstract ARIA roles forbidden.

**a11y_no_interactive_element_to_noninteractive_role**: Can't use non-interactive roles (`article`, `banner`, `complementary`, `img`, `listitem`, `main`, `region`, `tooltip`) on interactive elements.
```svelte
<textarea role="listitem"></textarea> <!-- warning -->
```

**a11y_no_noninteractive_element_interactions**: Non-interactive elements (`main`, `area`, `h1-h6`, `p`, `img`, `li`, `ul`, `ol`) shouldn't have event listeners.
```svelte
<li onclick={() => {}}></li> <!-- warning -->
<div role="listitem" onclick={() => {}}></div> <!-- warning -->
```

**a11y_no_noninteractive_element_to_interactive_role**: Can't use interactive roles (`button`, `link`, `checkbox`, `menuitem`, `menuitemcheckbox`, `menuitemradio`, `option`, `radio`, `searchbox`, `switch`, `textbox`) on non-interactive elements.
```svelte
<h3 role="searchbox">Button</h3> <!-- warning -->
```

**a11y_no_noninteractive_tabindex**: Non-interactive elements shouldn't have non-negative `tabindex`.
```svelte
<div tabindex="0"></div> <!-- warning -->
```

**a11y_no_redundant_roles**: Don't repeat implicit roles.
```svelte
<button role="button">...</button> <!-- warning -->
<img role="img" src="foo.jpg" /> <!-- warning -->
```

**a11y_no_static_element_interactions**: Elements with event handlers need ARIA role.
```svelte
<div onclick={() => ''}></div> <!-- warning -->
```

**a11y_positive_tabindex**: Avoid `tabindex > 0` - breaks tab order.
```svelte
<div tabindex="1"></div> <!-- warning -->
```

**a11y_role_has_required_aria_props**: ARIA roles require specific attributes.
```svelte
<span role="checkbox" aria-labelledby="foo" tabindex="0"></span> <!-- warning: needs aria-checked -->
```

**a11y_role_supports_aria_props**: Only use ARIA attributes supported by the role.
```svelte
<div role="link" aria-multiline></div> <!-- warning -->
<li aria-required></li> <!-- warning: not supported by implicit listitem role -->
```

**a11y_unknown_aria_attribute**: Only valid ARIA attributes (per WAI-ARIA spec).
```svelte
<input type="image" aria-labeledby="foo" /> <!-- warning: did you mean aria-labelledby? -->
```

**a11y_unknown_role**: Only valid, non-abstract ARIA roles.
```svelte
<div role="toooltip"></div> <!-- warning: did you mean tooltip? -->
```

## Attribute Warnings

**attribute_avoid_is**: `is` attribute not cross-browser compatible.

**attribute_global_event_reference**: Referencing `globalThis.%name%` without declaration.

**attribute_illegal_colon**: Attributes shouldn't contain `:` (conflicts with directives).

**attribute_invalid_property_name**: Invalid HTML attribute name.
```svelte
<!-- Did you mean 'aria-label' instead of 'aria-lable'? -->
```

**attribute_quoted**: Quoted attributes on components will stringify in future versions.

## Code Quality Warnings

**bidirectional_control_characters**: Bidirectional control characters detected - can alter code behavior (see trojansource.codes).

**bind_invalid_each_rest**: Rest operator in `{#each}` creates new object, breaking bindings.

**block_empty**: Empty block detected.

**component_name_lowercase**: Components must start with capital letter.
```svelte
<myComponent /> <!-- warning: treated as HTML -->
```

**css_unused_selector**: Unused CSS selectors removed. Use `:global()` for selectors targeting `{@html}` or child components.
```svelte
<div class="post">{@html content}</div>
<style>
  .post :global(p) { /* ... */ }
</style>
```

**custom_element_props_identifier**: Using rest element or non-destructured `$props()` prevents custom element prop inference. Destructure or specify `customElement.props`.

**element_implicitly_closed**: Some HTML elements auto-close (e.g., `<p>` inside `<p>`). Add explicit closing tags.

**element_invalid_self_closing_tag**: HTML has no self-closing tags. Use `<div></div>` not `<div />`.
```svelte
<span class="icon" /> some text <!-- parses as: <span>some text</span> -->
```

**event_directive_deprecated**: Use `on%name%` attribute instead of `on:%name%` directive.

**export_let_unused**: Unused export property. Use `export const` for external-only references.

**legacy_code**: Outdated syntax - use suggested replacement.

**legacy_component_creation**: Svelte 5 components aren't classes. Use `mount()` or `hydrate()` from 'svelte'.

**node_invalid_placement_ssr**: HTML structure violation causes browser repair, breaking hydration. Examples:
- `<p><div></div></p>` → `<p></p><div></div><p></p>`
- `<option><div></div></option>` → `<option></option>`
- `<table><tr><td></td></tr></table>` → `<table><tbody><tr><td></td></tr></tbody></table>`

**non_reactive_update**: Variable reassigned but not declared with `$state()` - won't trigger updates.
```svelte
<script>
  let stale = 'value'; // warning
  let reactive = $state('value'); // ok
</script>
<p>{stale}</p>
<button onclick={() => stale = 'updated'}>update</button> <!-- doesn't update -->
```

**options_deprecated_accessors**: `accessors` option deprecated in runes mode.

**options_deprecated_immutable**: `immutable` option deprecated in runes mode.

**options_missing_custom_element**: Using custom element features without `customElement: true` option.

**options_removed_enable_sourcemap**: `enableSourcemap` removed - source maps always generated.

**options_removed_hydratable**: `hydratable` removed - components always hydratable.

**options_removed_loop_guard_timeout**: `loopGuardTimeout` removed.

**options_renamed_ssr_dom**: `generate: "dom"` → `"client"`, `generate: "ssr"` → `"server"`.

**perf_avoid_inline_class**: Declare classes at top level, not inline.

**perf_avoid_nested_class**: Don't declare classes in nested scopes.

**reactive_declaration_invalid_placement**: Reactive declarations only at top level of instance script.

**reactive_declaration_module_script_dependency**: Module-level reassignments don't trigger reactive statements.

**script_context_deprecated**: Use `module` attribute instead of `context="module"`.
```svelte
<script module>
  let foo = 'bar';
</script>
```

**script_unknown_attribute**: Only `generics`, `lang`, `module` allowed on `<script>`.

**slot_element_deprecated**: Use `{@render}` instead of `<slot>`.

**state_referenced_locally**: Reactive variable referenced after reassignment loses reactivity. Wrap in function for lazy evaluation.
```svelte
<!-- Parent.svelte -->
<script>
  let count = $state(0);
  setContext('count', () => count); // wrap in function
</script>

<!-- Child.svelte -->
<script>
  const count = getContext('count');
</script>
<p>{count()}</p> <!-- call function -->
```

**store_rune_conflict**: Local binding conflicts with `$%name%` store rune. Rename to avoid ambiguity.

**svelte_component_deprecated**: `<svelte:component>` deprecated - components dynamic by default. Use `{@const Component = ...}` or derived values.
```svelte
<!-- Old -->
<svelte:component this={condition ? Y : Z} />

<!-- New -->
{@const Component = condition ? Y : Z}
<Component />
```

**svelte_element_invalid_this**: `<svelte:element this={...}>` should use expression, not string.

**svelte_self_deprecated**: Use self-imports instead of `<svelte:self>`.

**unknown_code**: Unrecognized warning code (possibly typo).
