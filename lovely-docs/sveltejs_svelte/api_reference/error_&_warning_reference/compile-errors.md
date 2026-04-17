## Compile Errors Reference

Complete list of Svelte compiler error codes with descriptions and examples.

### Animation Errors
- `animation_duplicate`: Element can only have one `animate:` directive
- `animation_invalid_placement`: Element using `animate:` must be only child of keyed `{#each}` block
- `animation_missing_key`: Element using `animate:` must be in keyed `{#each}` block (forgot key?)

### Attribute Errors
- `attribute_contenteditable_dynamic`: `contenteditable` cannot be dynamic with two-way binding
- `attribute_contenteditable_missing`: `contenteditable` required for textContent/innerHTML/innerText bindings
- `attribute_duplicate`: Attributes must be unique
- `attribute_empty_shorthand`: Attribute shorthand cannot be empty
- `attribute_invalid_event_handler`: Event attributes must be JS expressions, not strings
- `attribute_invalid_multiple`: `multiple` must be static if select uses two-way binding
- `attribute_invalid_name`: Invalid attribute name
- `attribute_invalid_sequence_expression`: Sequence expressions not allowed as attribute values in runes mode unless wrapped in parentheses
- `attribute_invalid_type`: `type` must be static if input uses two-way binding
- `attribute_unquoted_sequence`: Attribute values with `{...}` must be quoted unless value only contains expression

### Binding Errors
- `bind_group_invalid_expression`: `bind:group` only binds to Identifier or MemberExpression
- `bind_group_invalid_snippet_parameter`: Cannot `bind:group` to snippet parameter
- `bind_invalid_expression`: Can only bind to Identifier, MemberExpression, or `{get, set}` pair
- `bind_invalid_name`: Invalid binding name
- `bind_invalid_parens`: `bind:%name%={get, set}` must not have surrounding parentheses
- `bind_invalid_target`: `bind:%name%` only works with specific elements
- `bind_invalid_value`: Can only bind to state or props

### Block Errors
- `block_duplicate_clause`: Block clause cannot appear more than once
- `block_invalid_continuation_placement`: `{:...}` block invalid (unclosed element/block?)
- `block_invalid_elseif`: Use `else if` not `elseif`
- `block_invalid_placement`: `{#%name%}` block cannot be in this location
- `block_unclosed`: Block left open
- `block_unexpected_character`: Expected specific character after opening bracket
- `block_unexpected_close`: Unexpected block closing tag

### Component Errors
- `component_invalid_directive`: Directive type not valid on components

### Const Tag Errors
- `const_tag_cycle`: Cyclical dependency in `{@const}` declaration
- `const_tag_invalid_expression`: `{@const}` must be single variable declaration
- `const_tag_invalid_placement`: `{@const}` must be immediate child of `{#snippet}`, `{#if}`, `{:else if}`, `{:else}`, `{#each}`, `{:then}`, `{:catch}`, `<svelte:fragment>`, `<svelte:boundary>`, or `<Component>`
- `const_tag_invalid_reference`: Declaration not available in this snippet

Example of invalid reference:
```svelte
<svelte:boundary>
    {@const foo = 'bar'}
    {#snippet failed()}
        {foo}  <!-- error: foo not available -->
    {/snippet}
</svelte:boundary>
```
The top-level code becomes part of implicit `children` snippet, so `foo` is scoped there. Same applies to components with snippet props.

### Assignment/Binding Errors
- `constant_assignment`: Cannot assign to constant
- `constant_binding`: Cannot bind to constant

### CSS Errors
- `css_empty_declaration`: Declaration cannot be empty
- `css_expected_identifier`: Expected valid CSS identifier
- `css_global_block_invalid_combinator`: `:global` cannot follow combinator
- `css_global_block_invalid_declaration`: Top-level `:global {...}` can only contain rules, not declarations
- `css_global_block_invalid_list`: `:global` cannot mix with non-global selectors in list

Example of invalid CSS:
```css
:global, x {
    y { color: red; }
}
```
Split into:
```css
:global { y { color: red; } }
x y { color: red; }
```

- `css_global_block_invalid_modifier`: `:global` cannot modify existing selector
- `css_global_block_invalid_modifier_start`: `:global` only modifiable if descendant of other selectors
- `css_global_block_invalid_placement`: `:global` cannot be inside pseudoclass
- `css_global_invalid_placement`: `:global(...)` only at start or end of selector sequence
- `css_global_invalid_selector`: `:global(...)` must contain exactly one selector
- `css_global_invalid_selector_list`: `:global(...)` cannot contain type/universal selectors in compound selector
- `css_nesting_selector_invalid_placement`: Nesting selectors only inside rule or first in lone `:global(...)`
- `css_selector_invalid`: Invalid selector
- `css_type_selector_invalid_placement`: `:global(...)` cannot be followed by type selector

### Debug/Declaration Errors
- `debug_tag_invalid_arguments`: `{@debug}` arguments must be identifiers, not expressions
- `declaration_duplicate`: Variable already declared
- `declaration_duplicate_module_import`: Cannot declare variable with same name as import in `<script module>`

### Derived/Export Errors
- `derived_invalid_export`: Cannot export derived state; export function returning value instead
- `directive_invalid_value`: Directive value must be JS expression in curly braces
- `directive_missing_name`: Directive name cannot be empty

### Dollar Prefix Errors
- `dollar_binding_invalid`: `$` reserved, cannot use for variables/imports
- `dollar_prefix_invalid`: `$` prefix reserved, cannot use for variables/imports

### Class/Each Errors
- `duplicate_class_field`: Class field already declared
- `each_item_invalid_assignment`: Cannot reassign/bind to each block argument in runes mode; use array/index instead

Example (legacy mode allowed):
```svelte
<script>
	let array = [1, 2, 3];
</script>
{#each array as entry}
	<button on:click={() => entry = 4}>change</button>
	<input bind:value={entry}>
{/each}
```

In runes mode, use index:
```svelte
<script>
	let array = $state([1, 2, 3]);
</script>
{#each array as entry, i}
	<button onclick={() => array[i] = 4}>change</button>
	<input bind:value={array[i]}>
{/each}
```

- `each_key_without_as`: `{#each}` without `as` clause cannot have key

### Effect/Element Errors
- `effect_invalid_placement`: `$effect()` only as expression statement
- `element_invalid_closing_tag`: Closing tag for unopened element
- `element_invalid_closing_tag_autoclosed`: Closing tag for auto-closed element (nesting violation)
- `element_unclosed`: Element left open

### Event Handler Errors
- `event_handler_invalid_component_modifier`: Only `once` modifier on components; others only on DOM elements
- `event_handler_invalid_modifier`: Invalid event modifier
- `event_handler_invalid_modifier_combination`: Incompatible modifier combination

### Expected/Experimental Errors
- `expected_attribute_value`: Expected attribute value
- `expected_block_type`: Expected `if`, `each`, `await`, `key`, or `snippet`
- `expected_identifier`: Expected identifier
- `expected_pattern`: Expected identifier or destructure pattern
- `expected_token`: Expected specific token
- `expected_whitespace`: Expected whitespace
- `experimental_async`: Cannot use `await` in deriveds/template expressions/top-level unless `experimental.async` compiler option is true

### Export/Global Errors
- `export_undefined`: Variable not defined
- `global_reference_invalid`: Illegal variable name; use `globalThis.%name%` for globals

### Host/Illegal Errors
- `host_invalid_placement`: `$host()` only in custom element component instances
- `illegal_element_attribute`: Element doesn't support non-event/spread attributes

### Import/Inspect Errors
- `import_svelte_internal_forbidden`: Cannot import from `svelte/internal/*` (private, subject to change)
- `inspect_trace_generator`: `$inspect.trace()` cannot be in generator function
- `inspect_trace_invalid_placement`: `$inspect.trace()` must be first statement in function body

### Invalid/JS Parse Errors
- `invalid_arguments_usage`: `arguments` keyword not in template or top-level component
- `js_parse_error`: JavaScript parse error

### Legacy Errors
- `legacy_await_invalid`: Cannot use `await` in deriveds/template expressions/top-level unless in runes mode
- `legacy_export_invalid`: Cannot use `export let` in runes mode; use `$props()` instead
- `legacy_props_invalid`: Cannot use `$$props` in runes mode
- `legacy_reactive_statement_invalid`: `$:` not allowed in runes mode; use `$derived` or `$effect`
- `legacy_rest_props_invalid`: Cannot use `$$restProps` in runes mode

### Let/Mixed/Module Errors
- `let_directive_invalid_placement`: `let:` directive at invalid position
- `mixed_event_handler_syntaxes`: Cannot mix `on:%name%` and `on%name%` syntaxes
- `module_illegal_default_export`: Component cannot have default export

### Node/Options Errors
- `node_invalid_placement`: Element placement violates HTML restrictions; browser will repair HTML breaking Svelte assumptions

Examples:
- `<p>hello <div>world</div></p>` → `<p>hello </p><div>world</div><p></p>` (div closes p)
- `<option><div>option a</div></option>` → `<option>option a</option>` (div removed)
- `<table><tr><td>cell</td></tr></table>` → `<table><tbody><tr><td>cell</td></tr></tbody></table>` (tbody inserted)

- `options_invalid_value`: Invalid compiler option
- `options_removed`: Removed compiler option
- `options_unrecognised`: Unrecognized compiler option

### Props Errors
- `props_duplicate`: Cannot use `%rune%()` more than once
- `props_id_invalid_placement`: `$props.id()` only at top level as variable declaration initializer
- `props_illegal_name`: Cannot declare/access prop starting with `$$` (reserved)
- `props_invalid_identifier`: `$props()` only with object destructuring pattern
- `props_invalid_pattern`: `$props()` cannot contain nested properties or computed keys
- `props_invalid_placement`: `$props()` only at top level as variable declaration initializer

### Reactive/Render Errors
- `reactive_declaration_cycle`: Cyclical dependency in reactive declaration
- `render_tag_invalid_call_expression`: Cannot call snippet using apply/bind/call
- `render_tag_invalid_expression`: `{@render}` only contains call expressions
- `render_tag_invalid_spread_argument`: Cannot use spread in `{@render}` tags

### Rune Errors
- `rune_invalid_arguments`: Rune cannot be called with arguments
- `rune_invalid_arguments_length`: Rune must be called with specific number of arguments
- `rune_invalid_computed_property`: Cannot access computed property of rune
- `rune_invalid_name`: Not a valid rune
- `rune_invalid_spread`: Rune cannot be called with spread argument
- `rune_invalid_usage`: Cannot use rune in non-runes mode
- `rune_missing_parentheses`: Cannot use rune without parentheses
- `rune_removed`: Rune has been removed
- `rune_renamed`: Rune renamed to different name

### Runes Mode/Script Errors
- `runes_mode_invalid_import`: Cannot use in runes mode
- `script_duplicate`: Component can have single `<script>` and/or single `<script module>`
- `script_invalid_attribute_value`: Script attribute must be boolean
- `script_invalid_context`: Context attribute must be "module"
- `script_reserved_attribute`: Attribute is reserved
- `bindable_invalid_location`: `$bindable()` only inside `$props()` declaration

### Slot Errors
- `slot_attribute_duplicate`: Duplicate slot name in component
- `slot_attribute_invalid`: Slot attribute must be static
- `slot_attribute_invalid_placement`: Element with `slot=` must be child of component or descendant of custom element
- `slot_default_duplicate`: Default slot content alongside explicit `slot="default"`
- `slot_element_invalid_attribute`: `<slot>` only receives attributes and let directives
- `slot_element_invalid_name`: Slot attribute must be static
- `slot_element_invalid_name_default`: `default` reserved; cannot use as slot name
- `slot_snippet_conflict`: Cannot use `<slot>` and `{@render}` in same component

### Snippet Errors
- `snippet_conflict`: Cannot use explicit children snippet with implicit children content
- `snippet_invalid_export`: Exported snippet only references `<script module>` or other exportable snippets

Example of invalid export:
```svelte
<script module>
	export { greeting };
</script>
<script>
	let message = 'hello';
</script>
{#snippet greeting(name)}
	<p>{message} {name}!</p>  <!-- error: references module-level script -->
{/snippet}
```

- `snippet_invalid_rest_parameter`: Snippets don't support rest parameters; use array
- `snippet_parameter_assignment`: Cannot reassign/bind to snippet parameter
- `snippet_shadowing_prop`: Snippet shadows prop with same name

### State Errors
- `state_field_duplicate`: State field already declared on class

Example:
```js
class Counter {
	count = $state(0);  // declaration in class body
}
// or in constructor:
class Counter {
	constructor() {
		this.count = $state(0);  // only happens once
	}
}
```

- `state_field_invalid_assignment`: Cannot assign to state field before declaration
- `state_invalid_export`: Cannot export state from module if reassigned; export function or only mutate properties
- `state_invalid_placement`: `%rune%()` only as variable declaration initializer, class field declaration, or first assignment in constructor

### Store Errors
- `store_invalid_scoped_subscription`: Cannot subscribe to stores not declared at top level
- `store_invalid_subscription`: Cannot reference store value in `<script module>`
- `store_invalid_subscription_module`: Cannot reference store value outside `.svelte` file

Using `$` prefix only works in `.svelte` files where Svelte auto-subscribes on mount/unmount. Consider migrating to runes.

### Style/Svelte Errors
- `style_directive_invalid_modifier`: `style:` only uses `important` modifier
- `style_duplicate`: Component can have single `<style>` element
- `svelte_body_illegal_attribute`: `<svelte:body>` doesn't support non-event/spread attributes
- `svelte_boundary_invalid_attribute`: Valid attributes: `onerror`, `failed`
- `svelte_boundary_invalid_attribute_value`: Attribute must be non-string expression
- `svelte_component_invalid_this`: Invalid component definition; must be expression
- `svelte_component_missing_this`: `<svelte:component>` must have `this` attribute
- `svelte_element_missing_this`: `<svelte:element>` must have `this` attribute with value
- `svelte_fragment_invalid_attribute`: `<svelte:fragment>` only has slot attribute and optional let: directive
- `svelte_fragment_invalid_placement`: `<svelte:fragment>` must be direct child of component
- `svelte_head_illegal_attribute`: `<svelte:head>` cannot have attributes/directives
- `svelte_meta_duplicate`: Component can only have one `<%name%>` element
- `svelte_meta_invalid_content`: `<%name%>` cannot have children
- `svelte_meta_invalid_placement`: `<%name%>` cannot be inside elements/blocks
- `svelte_meta_invalid_tag`: Invalid `<svelte:...>` tag name
- `svelte_options_deprecated_tag`: "tag" option deprecated; use "customElement"
- `svelte_options_invalid_attribute`: `<svelte:options>` only static attributes
- `svelte_options_invalid_attribute_value`: Value must be specific list
- `svelte_options_invalid_customelement`: "customElement" must be string literal or object with `tag`, `shadow`, `props`
- `svelte_options_invalid_customelement_props`: "props" must be static object literal with `attribute`, `reflect`, `type` properties
- `svelte_options_invalid_customelement_shadow`: "shadow" must be "open" or "none"
- `svelte_options_invalid_tagname`: Tag name must be lowercase and hyphenated
- `svelte_options_reserved_tagname`: Tag name is reserved
- `svelte_options_unknown_attribute`: Unknown `<svelte:options>` attribute
- `svelte_self_invalid_placement`: `<svelte:self>` only in `{#if}`, `{#each}`, `{#snippet}` blocks or component slots

### Tag/Textarea/Title Errors
- `tag_invalid_name`: Invalid element/component name
- `tag_invalid_placement`: `{@%name%}` tag cannot be in this location
- `textarea_invalid_content`: `<textarea>` has either value attribute or child content, not both
- `title_illegal_attribute`: `<title>` cannot have attributes/directives
- `title_invalid_content`: `<title>` only text and `{tags}`

### Transition/TypeScript Errors
- `transition_conflict`: Cannot use `%type%:` with existing `%existing%:` directive
- `transition_duplicate`: Cannot use multiple `%type%:` directives on element
- `typescript_invalid_feature`: TypeScript features not natively supported; use preprocessor in `<script>` tags (e.g., `vitePreprocess({ script: true })`)

### Misc Errors
- `unexpected_eof`: Unexpected end of input
- `unexpected_reserved_word`: Reserved word cannot be used here
- `unterminated_string_constant`: Unterminated string
- `void_element_invalid_content`: Void elements cannot have children/closing tags