import type { Fragment } from '$lib/types';

export function reconstructMessage(fragments: Fragment[]) {
	return [...fragments]
		.sort((left, right) => left.timestamp - right.timestamp)
		.map((fragment) => fragment.word)
		.join(' ')
		.trim();
}
