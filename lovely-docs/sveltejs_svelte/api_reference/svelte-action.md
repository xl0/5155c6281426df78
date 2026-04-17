## Action

Actions are functions called when an element is created. Type them with the `Action` interface:

```ts
export const myAction: Action<HTMLDivElement, { someProperty: boolean } | undefined> = (node, param = { someProperty: true }) => {
	// ...
}
```

`Action<HTMLDivElement>` and `Action<HTMLDivElement, undefined>` both mean the action accepts no parameters.

Actions can return an object with optional `update` and `destroy` methods, and can specify additional attributes/events via the `Attributes` type parameter.

## ActionReturn

Actions can return an object with two optional properties:
- `update(parameter)`: Called whenever the action's parameter changes, after Svelte updates the markup
- `destroy()`: Called after the element is unmounted

You can specify additional attributes and events the action enables:

```ts
interface Attributes {
	newprop?: string;
	'on:event': (e: CustomEvent<boolean>) => void;
}

export function myAction(node: HTMLElement, parameter: Parameter): ActionReturn<Parameter, Attributes> {
	return {
		update: (updatedParameter) => {...},
		destroy: () => {...}
	};
}
```

Note: Actions have been superseded by attachments.