<script lang="ts">
	import { Plus } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	type IPageProps = { onclick: MouseEventHandler<HTMLButtonElement>; children: Snippet<[]> };

	const { onclick, children }: IPageProps = $props();
</script>

<button type="button" class="btn preset-outlined-primary-500 btn-sm" {onclick}>
	<Plus size={16} class="text-primary-500" />
	<span>{@render children()}</span>
</button>
