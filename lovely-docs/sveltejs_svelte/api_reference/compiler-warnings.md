## Compiler Warnings Reference

Svelte warns at compile time about potential mistakes like inaccessible markup. Warnings can be disabled with `<!-- svelte-ignore <code> -->` comments.

```svelte
<!-- svelte-ignore a11y_autofocus -->
<input autofocus />

<!-- Multiple rules, with note -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (because of reasons) -->
<div onclick>...</div>
```

### Accessibility Warnings (a11y_*)

**a11y_accesskey**: Avoid `accesskey` attribute - creates inconsistencies with screen readers.
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
<!-- Better: use <button> or <a> -->
```

**a11y_consider_explicit_label**: Buttons and links need text or `aria-label`/`aria-labelledby`/`title`.

**a11y_distracting_elements**: Avoid `<marquee>` and `<blink>`.

**a11y_figcaption_index/parent**: `<figcaption>` must be first/last child and immediate child of `<figure>`.
```svelte
<div><figcaption>Caption</figcaption></div> <!-- warning -->
```

**a11y_hidden**: Certain elements (`h1-h6`, etc.) should not be hidden with `aria-hidden="true"`.
```svelte
<h2 aria-hidden="true">invisible header</h2> <!-- warning -->
```

**a11y_img_redundant_alt**: `<img>` alt text should not contain "image", "picture", or "photo" (screen readers already announce it).
```svelte
<img src="foo" alt="Photo of foo" /> <!-- warning -->
<img src="foo" alt="Foo eating" /> <!-- OK -->
```

**a11y_incorrect_aria_attribute_type**: ARIA attributes must have correct types (boolean, string, ID, ID list, integer, token, token list, tristate).
```svelte
<div aria-hidden="yes"></div> <!-- warning: must be true/false -->
```

**a11y_interactive_supports_focus**: Interactive roles must have `tabindex`.
```svelte
<div role="button" onkeypress={() => {}} /> <!-- warning -->
```

**a11y_invalid_attribute**: Attributes like `href` must have valid values (not empty, `#`, or `javascript:`).
```svelte
<a href="">invalid</a> <!-- warning -->
```

**a11y_label_has_associated_control**: `<label>` must be associated with control via wrapping or `for` attribute.
```svelte
<label>A</label> <!-- warning -->
<label for="id">B</label> <!-- OK -->
<label>C <input type="text" /></label> <!-- OK -->
```

**a11y_media_has_caption**: `<video>` must have `<track kind="captions">` (not needed if `muted`).
```svelte
<video></video> <!-- warning -->
<video><track kind="captions" /></video> <!-- OK -->
<audio muted></audio> <!-- OK -->
```

**a11y_misplaced_role**: Reserved elements should not have `role` attribute.
```svelte
<meta role="tooltip" /> <!-- warning -->
```

**a11y_misplaced_scope**: `scope` attribute only for `<th>` elements.
```svelte
<div scope="row" /> <!-- warning -->
```

**a11y_missing_attribute**: Required attributes: `<a>` needs `href`, `<area>` needs `alt`/`aria-label`/`aria-labelledby`, `<html>` needs `lang`, `<iframe>` needs `title`, `<img>` needs `alt`, `<object>` needs `title`/`aria-label`/`aria-labelledby`, `<input type="image">` needs `alt`/`aria-label`/`aria-labelledby`.
```svelte
<input type="image" /> <!-- warning -->
<html></html> <!-- warning -->
<a>text</a> <!-- warning -->
```

**a11y_missing_content**: Headings and anchors must have accessible content.
```svelte
<a href="/foo"></a> <!-- warning -->
<h1></h1> <!-- warning -->
```

**a11y_mouse_events_have_key_events**: `onmouseover` needs `onfocus`, `onmouseout` needs `onblur`.
```svelte
<div onmouseover={handleMouseover} /> <!-- warning -->
<div onmouseout={handleMouseout} /> <!-- warning -->
```

**a11y_no_abstract_role**: Abstract ARIA roles forbidden.

**a11y_no_interactive_element_to_noninteractive_role**: Interactive elements cannot have non-interactive roles (`article`, `banner`, `complementary`, `img`, `listitem`, `main`, `region`, `tooltip`).
```svelte
<textarea role="listitem"></textarea> <!-- warning -->
```

**a11y_no_noninteractive_element_interactions**: Non-interactive elements (`main`, `area`, `h1-h6`, `p`, `img`, `li`, `ul`, `ol`, or with non-interactive roles) should not have mouse/keyboard handlers.
```svelte
<li onclick={() => {}}></li> <!-- warning -->
<div role="listitem" onclick={() => {}}></div> <!-- warning -->
```

**a11y_no_noninteractive_element_to_interactive_role**: Non-interactive elements cannot have interactive roles (`button`, `link`, `checkbox`, `menuitem`, `menuitemcheckbox`, `menuitemradio`, `option`, `radio`, `searchbox`, `switch`, `textbox`).
```svelte
<h3 role="searchbox">Button</h3> <!-- warning -->
```

**a11y_no_noninteractive_tabindex**: Non-interactive elements cannot have non-negative `tabindex`.
```svelte
<div tabindex="0"></div> <!-- warning -->
```

**a11y_no_redundant_roles**: Don't repeat default ARIA roles.
```svelte
<button role="button">...</button> <!-- warning -->
<img role="img" src="foo.jpg" /> <!-- warning -->
```

**a11y_no_static_element_interactions**: Elements with interactive handlers must have ARIA role.
```svelte
<div onclick={() => ''}></div> <!-- warning -->
```

**a11y_positive_tabindex**: Avoid `tabindex` > 0 (breaks tab order).
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
<li aria-required></li> <!-- warning -->
```

**a11y_unknown_aria_attribute**: Only valid ARIA attributes allowed (with suggestions).
```svelte
<input type="image" aria-labeledby="foo" /> <!-- warning: did you mean aria-labelledby? -->
```

**a11y_unknown_role**: Only valid, non-abstract ARIA roles allowed (with suggestions).
```svelte
<div role="toooltip"></div> <!-- warning: did you mean tooltip? -->
```

### Attribute Warnings

**attribute_avoid_is**: `is` attribute not cross-browser compatible.

**attribute_global_event_reference**: Referencing `globalThis.%name%` without declaration.

**attribute_illegal_colon**: Attributes should not contain `:` (ambiguous with directives).

**attribute_invalid_property_name**: Invalid HTML attribute (with suggestions).

**attribute_quoted**: Quoted attributes on components will be stringified in future versions.

### Other Warnings

**bidirectional_control_characters**: Bidirectional control characters detected (can alter code direction/behavior).

**bind_invalid_each_rest**: Rest operator in binding creates new object, breaking binding with original.

**block_empty**: Empty block detected.

**component_name_lowercase**: Components must start with capital letter.
```svelte
<mycomponent /> <!-- treated as HTML element -->
```

**css_unused_selector**: CSS selector not used in template. Use `:global()` to preserve:
```svelte
<div class="post">{@html content}</div>
<style>
  .post :global(p) { ... }
</style>
```

**custom_element_props_identifier**: Using rest element or non-destructured `$props()` prevents custom element prop inference.

**element_implicitly_closed**: HTML elements implicitly closed by another element. Add explicit closing tag.
```svelte
<p><p>hello</p> <!-- first <p> implicitly closed -->
```

**element_invalid_self_closing_tag**: Self-closing tags for non-void elements are ambiguous. Use explicit closing tags.
```svelte
<span class="icon" /> some text <!-- parsed as <span>some text</span> -->
<span class="icon"></span> some text <!-- correct -->
```

**event_directive_deprecated**: `on:%name%` deprecated, use `on%name%` attribute instead.

**export_let_unused**: Unused export property (use `export const` for external reference only).

**legacy_code**: Old syntax no longer valid (with suggestions).

**legacy_component_creation**: Svelte 5 components not classes; use `mount` or `hydrate` from 'svelte'.

**node_invalid_placement_ssr**: HTML structure violation causing browser repair, breaking hydration. Examples: `<p>` cannot contain block elements, `<option>` cannot contain `<div>`, `<table>` auto-inserts `<tbody>`.

**non_reactive_update**: Variable updated but not declared with `$state()`, won't trigger updates.
```svelte
<script>
  let stale = 'stale'; // warning
  let reactive = $state('reactive'); // OK
</script>
<button onclick={() => { stale = 'updated'; reactive = 'updated'; }}>
```

**options_deprecated_accessors/immutable**: Options deprecated in runes mode.

**options_missing_custom_element**: `customElement` option used but `customElement: true` not set.

**options_removed_***: Removed options: `enableSourcemap`, `hydratable`, `loopGuardTimeout`.

**options_renamed_ssr_dom**: `generate: "dom"/"ssr"` renamed to `"client"/"server"`.

**perf_avoid_inline_class/nested_class**: Declare classes at top level, not inline or nested.

**reactive_declaration_invalid_placement**: Reactive declarations only at top level of instance script.

**reactive_declaration_module_script_dependency**: Module-level reassignments don't trigger reactive statements.

**script_context_deprecated**: `context="module"` deprecated, use `module` attribute.
```svelte
<script module>
  let foo = 'bar';
</script>
```

**script_unknown_attribute**: Unrecognized script attribute (should be `generics`, `lang`, or `module`).

**slot_element_deprecated**: `<slot>` deprecated, use `{@render ...}` instead.

**state_referenced_locally**: Reactive variable referenced in same scope after reassignment breaks reactivity. Wrap in function for lazy evaluation.
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
<p>The count is {count()}</p> <!-- call function -->
```

**store_rune_conflict**: Local binding conflicts with `$%name%` store rune. Rename to avoid ambiguity.

**svelte_component_deprecated**: `<svelte:component>` deprecated in runes mode (components dynamic by default). Use `@const` or derived values:
```svelte
{#each items as item}
  {@const Component = item.condition ? Y : Z}
  <Component />
{/each}
```

**svelte_element_invalid_this**: `<svelte:element this={expression}>` should use expression, not string.

**svelte_self_deprecated**: `<svelte:self>` deprecated, use self-imports instead.

**unknown_code**: Unrecognized warning code (with suggestions).