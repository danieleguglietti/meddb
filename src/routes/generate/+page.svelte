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
	<div class="flex w-full md:w-4/6 flex-col items-center justify-center gap-5 p-5">
		<h1 class="h2">
			{#if src === undefined}
				IL QUIZ È IN GENERAZIONE.
			{:else}
				IL QUIZ DI <span class="text-primary-400"
					>{data.objective?.name.toUpperCase() ?? 'MATERIE MISTE'}</span
				> È STATO GENERATO.
			{/if}
		</h1>
		<div class="md:h-5/6 w-full rounded-lg flex flex-col gap-5">
			{#if src === undefined}
				<div class="h-full placeholder w-full animate-pulse"></div>
			{:else}
				<object data={src} type="application/pdf" class="hidden h-full w-full rounded-lg md:flex justify-center items-center" title="pdf">
				</object>
				<a href={src} download="quiz.pdf" class="md:hidden btn preset-filled-primary-500 w-full">Download</a>
			{/if}
		</div>
		<a href="/" class="md:ml-2 btn self-start preset-outlined-primary-500">
			<ArrowLeftIcon size={18} />
			<span>Indietro</span>
		</a>
	</div>
</div>
