The `{@debug ...}` tag logs variable values whenever they change and pauses execution when devtools are open, serving as an alternative to `console.log()`.

**Usage:**
```svelte
<script>
	let user = {
		firstname: 'Ada',
		lastname: 'Lovelace'
	};
</script>

{@debug user}
{@debug user1, user2, user3}
```

**Syntax rules:**
- Accepts comma-separated variable names only (not expressions)
- Valid: `{@debug user}`, `{@debug user1, user2, user3}`
- Invalid: `{@debug user.firstname}`, `{@debug myArray[0]}`, `{@debug !isReady}`, `{@debug typeof user === 'object'}`

**Parameterless form:**
`{@debug}` without arguments inserts a `debugger` statement triggered on any state change, rather than specific variables.