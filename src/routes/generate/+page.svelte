<script lang="ts">
	import type { PageProps } from './$types';
	import { ArrowLeftIcon } from '@lucide/svelte';

	import { generate } from '$lib/client/pdf';
	import type { ISuccessResponse } from '$lib/server/response';
	import type { IAnswer, IQuestion } from '$lib/server/db/schema';

	let { data }: PageProps = $props();

	let src = $state<string>();

	type ResultType = IQuestion & { answers: Array<IAnswer> };
	$effect(() => {
		const ENDPOINT = `/api/random/${data.objective?.id ?? ''}`;

		fetch(ENDPOINT)
			.then((res) => res.json())
			.then((res: ISuccessResponse<ResultType[]>) => {
				generate(data.objective, res.data).then((blob) => {
					src = URL.createObjectURL(blob);
				});
			});
	});
</script>

<svelte:head>
	<title>Genera | MedDB</title>
</svelte:head>

<div class="flex h-screen w-screen justify-center">
	<div class="flex w-2/3 flex-col items-center justify-center gap-5">
		<h1 class="h2">
			{#if src === undefined}
				IL QUIZ È IN GENERAZIONE.
			{:else}
				IL QUIZ DI <span class="text-primary-400"
					>{data.objective?.name.toUpperCase() ?? 'MATERIE MISTE'}</span
				> È STATO GENERATO.
			{/if}
		</h1>
		<div class="h-4/6 w-full rounded-lg">
			{#if src === undefined}
				<div class="placeholder animate-pulse h-full w-full"></div>
			{:else}
				<iframe {src} title="PDF" class="h-full w-full rounded-lg"> </iframe>
			{/if}
		</div>
		<a href="/" class="ml-2 btn self-start preset-filled-primary-500">
			<ArrowLeftIcon size={18} />
			<span>Indietro</span>
		</a>
	</div>
</div>
