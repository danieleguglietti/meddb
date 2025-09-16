<script lang="ts">
	import { Trash } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	type IPageProps = { onclick: MouseEventHandler<HTMLButtonElement>; children: Snippet<[]> };

	const { onclick, children }: IPageProps = $props();
</script>

<button type="button" class="btn preset-outlined-error-500 btn-sm" {onclick}>
	<Trash size={16} class="text-error-500" />
	<span>{@render children()}</span>
</button>
