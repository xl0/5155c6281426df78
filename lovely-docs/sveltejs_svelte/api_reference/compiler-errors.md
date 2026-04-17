## Compiler Errors Reference

Complete list of Svelte compiler error codes with descriptions and explanations.

### Animation Errors
- `animation_duplicate`: Element can only have one `animate:` directive
- `animation_invalid_placement`: Element using `animate:` must be only child of keyed `{#each}` block
- `animation_missing_key`: Element using `animate:` must be in keyed `{#each}` block (forgot key?)

### Attribute Errors
- `attribute_contenteditable_dynamic`: `contenteditable` cannot be dynamic with two-way binding
- `attribute_contenteditable_missing`: `contenteditable` required for textContent/innerHTML/innerText bindings
- `attribute_duplicate`: Attributes must be unique
- `attribute_empty_shorthand`: Attribute shorthand cannot be empty
- `attribute_invalid_event_handler`: Event attribute must be JavaScript expression, not string
- `attribute_invalid_multiple`: `multiple` attribute must be static if select uses two-way binding
- `attribute_invalid_name`: Invalid attribute name
- `attribute_invalid_sequence_expression`: Sequence expressions not allowed as attribute/directive values in runes mode unless wrapped in parentheses
- `attribute_invalid_type`: `type` attribute must be static text if input uses two-way binding
- `attribute_unquoted_sequence`: Attribute values with `{...}` must be quoted unless value only contains expression

### Binding Errors
- `bind_group_invalid_expression`: `bind:group` can only bind to Identifier or MemberExpression
- `bind_group_invalid_snippet_parameter`: Cannot `bind:group` to snippet parameter
- `bind_invalid_expression`: Can only bind to Identifier, MemberExpression, or `{get, set}` pair
- `bind_invalid_name`: Invalid binding name
- `bind_invalid_parens`: `bind:%name%={get, set}` must not have surrounding parentheses
- `bind_invalid_target`: `bind:%name%` only valid with specific elements
- `bind_invalid_value`: Can only bind to state or props

### Block Errors
- `block_duplicate_clause`: Block clause cannot appear more than once
- `block_invalid_continuation_placement`: `{:...}` block invalid at position (unclosed element/block?)
- `block_invalid_elseif`: Use `else if` not `elseif`
- `block_invalid_placement`: `{#%name%}` block cannot be at this location
- `block_unclosed`: Block left open
- `block_unexpected_character`: Expected specific character after opening bracket
- `block_unexpected_close`: Unexpected block closing tag

### Component Errors
- `component_invalid_directive`: Directive type not valid on components
- `svelte_component_invalid_this`: Invalid component definition (must be expression)
- `svelte_component_missing_this`: `<svelte:component>` must have `this` attribute

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
The top-level code becomes part of implicit `children` snippet, so `foo` is scoped there. Same applies to components with explicit snippet props.

### Assignment/Binding Errors
- `constant_assignment`: Cannot assign to constant
- `constant_binding`: Cannot bind to constant
- `each_item_invalid_assignment`: Cannot reassign/bind to each block argument in runes mode; use array/index instead

Example (runes mode):
```svelte
<!-- Invalid -->
{#each array as entry}
  <button onclick={() => entry = 4}>change</button>
{/each}

<!-- Valid -->
{#each array as entry, i}
  <button onclick={() => array[i] = 4}>change</button>
{/each}
```

### CSS Errors
- `css_empty_declaration`: Declaration cannot be empty
- `css_expected_identifier`: Expected valid CSS identifier
- `css_global_block_invalid_combinator`: `:global` selector cannot follow combinator
- `css_global_block_invalid_declaration`: Top-level `:global {...}` can only contain rules, not declarations
- `css_global_block_invalid_list`: `:global` cannot be in selector list with non-`:global` entries

Example:
```css
/* Invalid */
:global, x {
    y { color: red; }
}

/* Valid */
:global { y { color: red; } }
x y { color: red; }
```

- `css_global_block_invalid_modifier`: `:global` selector cannot modify existing selector
- `css_global_block_invalid_modifier_start`: `:global` can only be modified if descendant of other selectors
- `css_global_block_invalid_placement`: `:global` cannot be inside pseudoclass
- `css_global_invalid_placement`: `:global(...)` only at start/end of selector sequence, not middle
- `css_global_invalid_selector`: `:global(...)` must contain exactly one selector
- `css_global_invalid_selector_list`: `:global(...)` must not contain type/universal selectors in compound selector
- `css_nesting_selector_invalid_placement`: Nesting selectors only in rule or first selector in lone `:global(...)`
- `css_selector_invalid`: Invalid selector
- `css_type_selector_invalid_placement`: `:global(...)` must not be followed by type selector

### Debug/Inspection Errors
- `debug_tag_invalid_arguments`: `{@debug}` arguments must be identifiers, not expressions
- `inspect_trace_generator`: `$inspect.trace(...)` cannot be in generator function
- `inspect_trace_invalid_placement`: `$inspect.trace(...)` must be first statement of function body

### Declaration Errors
- `declaration_duplicate`: Variable already declared
- `declaration_duplicate_module_import`: Cannot declare variable with same name as import in `<script module>`
- `duplicate_class_field`: Class field already declared

### Derived/Export Errors
- `derived_invalid_export`: Cannot export derived state from module; export function returning value instead
- `state_invalid_export`: Cannot export state from module if reassigned; export function or only mutate properties

### Directive Errors
- `directive_invalid_value`: Directive value must be JavaScript expression in curly braces
- `directive_missing_name`: Directive name cannot be empty
- `let_directive_invalid_placement`: `let:` directive at invalid position
- `style_directive_invalid_modifier`: `style:` directive can only use `important` modifier

### Dollar/Reserved Name Errors
- `dollar_binding_invalid`: `$` name reserved, cannot use for variables/imports
- `dollar_prefix_invalid`: `$` prefix reserved, cannot use for variables/imports
- `global_reference_invalid`: Illegal variable name; use `globalThis.%name%` for globals

### Each Block Errors
- `each_key_without_as`: `{#each}` block without `as` clause cannot have key

### Effect Errors
- `effect_invalid_placement`: `$effect()` can only be expression statement

### Element Errors
- `element_invalid_closing_tag`: Closing tag attempted to close unopened element
- `element_invalid_closing_tag_autoclosed`: Closing tag for element already auto-closed by another element
- `element_unclosed`: Element left open
- `illegal_element_attribute`: Element does not support non-event attributes or spread attributes
- `node_invalid_placement`: Element placement violates HTML restrictions; browser will repair HTML breaking Svelte assumptions

Examples of browser HTML repair:
- `<p>hello <div>world</div></p>` → `<p>hello </p><div>world</div><p></p>` (div closes p)
- `<option><div>option a</div></option>` → `<option>option a</option>` (div removed)
- `<table><tr><td>cell</td></tr></table>` → `<table><tbody><tr><td>cell</td></tr></tbody></table>` (tbody inserted)

- `textarea_invalid_content`: `<textarea>` can have value attribute OR child content, not both
- `void_element_invalid_content`: Void elements cannot have children or closing tags

### Event Handler Errors
- `event_handler_invalid_component_modifier`: Event modifiers other than `once` only on DOM elements
- `event_handler_invalid_modifier`: Invalid event modifier
- `event_handler_invalid_modifier_combination`: Certain modifier combinations incompatible
- `mixed_event_handler_syntaxes`: Cannot mix `on:%name%` and `on%name%` syntaxes

### Export/Import Errors
- `export_undefined`: Variable not defined before export
- `module_illegal_default_export`: Component cannot have default export
- `import_svelte_internal_forbidden`: Cannot import from `svelte/internal/*` (private runtime code)
- `runes_mode_invalid_import`: Certain imports cannot be used in runes mode

### Host/Custom Element Errors
- `host_invalid_placement`: `$host()` only inside custom element component instances
- `svelte_element_missing_this`: `<svelte:element>` must have `this` attribute with value

### Options/Configuration Errors
- `options_invalid_value`: Invalid compiler option
- `options_removed`: Compiler option removed
- `options_unrecognised`: Unrecognized compiler option

### Props Errors
- `bindable_invalid_location`: `$bindable()` only in `$props()` declaration
- `props_duplicate`: Cannot use `%rune%()` more than once
- `props_id_invalid_placement`: `$props.id()` only at top level as variable declaration initializer
- `props_illegal_name`: Props starting with `$$` reserved for Svelte internals
- `props_invalid_identifier`: `$props()` only with object destructuring pattern
- `props_invalid_pattern`: `$props()` assignment cannot have nested properties or computed keys
- `props_invalid_placement`: `$props()` only at top level as variable declaration initializer

### Reactive/Cycle Errors
- `reactive_declaration_cycle`: Cyclical dependency in reactive declaration
- `const_tag_cycle`: Cyclical dependency in `{@const}`

### Render Tag Errors
- `render_tag_invalid_call_expression`: Cannot call snippet using apply/bind/call
- `render_tag_invalid_expression`: `{@render}` can only contain call expressions
- `render_tag_invalid_spread_argument`: Cannot use spread arguments in `{@render}`

### Rune Errors
- `rune_invalid_arguments`: Rune cannot be called with arguments
- `rune_invalid_arguments_length`: Rune must be called with specific number of arguments
- `rune_invalid_computed_property`: Cannot access computed property of rune
- `rune_invalid_name`: Not a valid rune
- `rune_invalid_spread`: Rune cannot be called with spread argument
- `rune_invalid_usage`: Cannot use rune in non-runes mode
- `rune_missing_parentheses`: Rune must have parentheses
- `rune_removed`: Rune has been removed
- `rune_renamed`: Rune renamed to different name

### Script Errors
- `script_duplicate`: Component can have single `<script>` and/or single `<script module>`
- `script_invalid_attribute_value`: Script attribute must be boolean if supplied
- `script_invalid_context`: Context attribute must be "module" if supplied
- `script_reserved_attribute`: Attribute reserved and cannot be used

### Slot Errors
- `slot_attribute_duplicate`: Duplicate slot name in component
- `slot_attribute_invalid`: Slot attribute must be static value
- `slot_attribute_invalid_placement`: Element with `slot=` must be child of component or descendant of custom element
- `slot_default_duplicate`: Default slot content alongside explicit `slot="default"`
- `slot_element_invalid_attribute`: `<slot>` can only receive attributes and let directives
- `slot_element_invalid_name`: Slot attribute must be static value
- `slot_element_invalid_name_default`: `default` reserved word, cannot use as slot name
- `slot_snippet_conflict`: Cannot use `<slot>` and `{@render}` in same component

### Snippet Errors
- `snippet_conflict`: Cannot use explicit children snippet with implicit children content
- `snippet_invalid_export`: Exported snippet only reference things in `<script module>` or other exportable snippets

Example:
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
- `state_field_invalid_assignment`: Cannot assign to state field before declaration
- `state_invalid_placement`: State rune only as variable declaration initializer, class field, or first assignment in constructor

Example:
```js
class Counter {
  count = $state(0);  // valid
}

class Counter {
  constructor() {
    this.count = $state(0);  // valid
  }
}
```

### Store Errors
- `store_invalid_scoped_subscription`: Cannot subscribe to stores not declared at top level
- `store_invalid_subscription`: Cannot reference store value in `<script module>`
- `store_invalid_subscription_module`: Cannot reference store value outside `.svelte` file

Store `$` prefix only works in `.svelte` files where Svelte auto-manages subscriptions. Consider migrating to runes.

### Svelte Meta Tag Errors
- `svelte_body_illegal_attribute`: `<svelte:body>` doesn't support non-event attributes or spread
- `svelte_boundary_invalid_attribute`: Valid attributes: `onerror`, `failed`
- `svelte:boundary_invalid_attribute_value`: Attribute value must be non-string expression
- `svelte_fragment_invalid_attribute`: `<svelte:fragment>` only has slot attribute and optional let: directive
- `svelte_fragment_invalid_placement`: `<svelte:fragment>` must be direct child of component
- `svelte_head_illegal_attribute`: `<svelte:head>` cannot have attributes/directives
- `svelte_meta_duplicate`: Component can only have one `<%name%>` element
- `svelte_meta_invalid_content`: `<%name%>` cannot have children
- `svelte_meta_invalid_placement`: `<%name%>` tags cannot be inside elements/blocks
- `svelte_meta_invalid_tag`: Invalid `<svelte:...>` tag name
- `svelte_options_deprecated_tag`: "tag" option deprecated; use "customElement" instead
- `svelte_options_invalid_attribute`: `<svelte:options>` only receives static attributes
- `svelte_options_invalid_attribute_value`: Value must be from specific list
- `svelte_options_invalid_customelement`: "customElement" must be string literal or object with tag/shadow/props
- `svelte_options_invalid_customelement_props`: "props" must be static object literal with attribute/reflect/type
- `svelte_options_invalid_customelement_shadow`: "shadow" must be "open" or "none"
- `svelte_options_invalid_tagname`: Tag name must be lowercase and hyphenated
- `svelte_options_reserved_tagname`: Tag name reserved
- `svelte_options_unknown_attribute`: Unknown `<svelte:options>` attribute
- `svelte_self_invalid_placement`: `<svelte:self>` only in `{#if}`, `{#each}`, `{#snippet}` blocks or component slots
- `title_illegal_attribute`: `<title>` cannot have attributes/directives
- `title_invalid_content`: `<title>` only contains text and `{tags}`

### Tag/Syntax Errors
- `tag_invalid_name`: Invalid element/component name (components need valid variable name or dot notation)
- `tag_invalid_placement`: `{@%name%}` tag cannot be at this location
- `expected_attribute_value`: Expected attribute value
- `expected_block_type`: Expected 'if', 'each', 'await', 'key', or 'snippet'
- `expected_identifier`: Expected identifier
- `expected_pattern`: Expected identifier or destructure pattern
- `expected_token`: Expected specific token
- `expected_whitespace`: Expected whitespace
- `unexpected_eof`: Unexpected end of input
- `unexpected_reserved_word`: Reserved word cannot be used here
- `unterminated_string_constant`: String not terminated

### Transition Errors
- `transition_conflict`: Cannot use `%type%:` with existing `%existing%:` directive
- `transition_duplicate`: Cannot use multiple `%type%:` directives on element

### TypeScript Errors
- `typescript_invalid_feature`: TypeScript feature not natively supported; use preprocessor in `<script>` tags

### Async/Legacy Errors
- `experimental_async`: Cannot use `await` in deriveds/template expressions/top-level unless `experimental.async` enabled
- `legacy_await_invalid`: Cannot use `await` in deriveds/template expressions/top-level unless in runes mode
- `legacy_export_invalid`: Cannot use `export let` in runes mode; use `$props()` instead
- `legacy_props_invalid`: Cannot use `$$props` in runes mode
- `legacy_reactive_statement_invalid`: `$:` not allowed in runes mode; use `$derived` or `$effect`
- `legacy_rest_props_invalid`: Cannot use `$$restProps` in runes mode

### Miscellaneous Errors
- `invalid_arguments_usage`: `arguments` keyword cannot be used in template or top-level component
- `js_parse_error`: JavaScript parse error with message
- `style_duplicate`: Component can have single top-level `<style>` element