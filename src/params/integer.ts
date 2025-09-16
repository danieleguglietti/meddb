import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string): param is `${number}` =>
	/^[0-9]+$/.test(param)) satisfies ParamMatcher;
