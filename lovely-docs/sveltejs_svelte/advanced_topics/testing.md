## Unit and Component Tests with Vitest

Install Vitest and configure `vite.config.js`:
```js
import { defineConfig } from 'vitest/config';
export default defineConfig({
	resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined
});
```

Write unit tests for `.js/.ts` files:
```js
import { expect, test } from 'vitest';
import { multiplier } from './multiplier.svelte.js';

test('Multiplier', () => {
	let double = multiplier(0, 2);
	expect(double.value).toEqual(0);
	double.set(5);
	expect(double.value).toEqual(10);
});
```

### Using Runes in Tests

Test files with `.svelte` in the filename can use runes:
```js
test('Multiplier', () => {
	let count = $state(0);
	let double = multiplier(() => count, 2);
	expect(double.value).toEqual(0);
	count = 5;
	expect(double.value).toEqual(10);
});
```

For tests using effects, wrap in `$effect.root` and use `flushSync()` to execute effects synchronously:
```js
test('Effect', () => {
	const cleanup = $effect.root(() => {
		let count = $state(0);
		let log = logger(() => count);
		flushSync();
		expect(log).toEqual([0]);
		count = 1;
		flushSync();
		expect(log).toEqual([0, 1]);
	});
	cleanup();
});
```

### Component Testing

Install jsdom and configure `vite.config.js`:
```js
export default defineConfig({
	test: { environment: 'jsdom' },
	resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined
});
```

Test components using `mount` and `unmount`:
```js
import { flushSync, mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import Component from './Component.svelte';

test('Component', () => {
	const component = mount(Component, {
		target: document.body,
		props: { initial: 0 }
	});
	expect(document.body.innerHTML).toBe('<button>0</button>');
	document.body.querySelector('button').click();
	flushSync();
	expect(document.body.innerHTML).toBe('<button>1</button>');
	unmount(component);
});
```

Use `@testing-library/svelte` for higher-level testing:
```js
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import Component from './Component.svelte';

test('Component', async () => {
	const user = userEvent.setup();
	render(Component);
	const button = screen.getByRole('button');
	expect(button).toHaveTextContent(0);
	await user.click(button);
	expect(button).toHaveTextContent(1);
});
```

For tests with two-way bindings, context, or snippet props, create a wrapper component.

## Component Tests with Storybook

Install Storybook via `npx sv add storybook`. Create stories and test interactions with the play function:
```svelte
<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn } from 'storybook/test';
	import LoginForm from './LoginForm.svelte';

	const { Story } = defineMeta({
		component: LoginForm,
		args: { onSubmit: fn() }
	});
</script>

<Story name="Empty Form" />

<Story
	name="Filled Form"
	play={async ({ args, canvas, userEvent }) => {
		await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');
		await userEvent.type(canvas.getByTestId('password'), 'a-random-password');
		await userEvent.click(canvas.getByRole('button'));
		await expect(args.onSubmit).toHaveBeenCalledTimes(1);
		await expect(canvas.getByText('You're in!')).toBeInTheDocument();
	}}
/>
```

## End-to-End Tests with Playwright

Setup Playwright via Svelte CLI or `npm init playwright`. Configure `playwright.config.js`:
```js
const config = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
};
export default config;
```

Write E2E tests:
```js
import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});
```