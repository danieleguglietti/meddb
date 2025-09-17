<script lang="ts">
	import QuestionCard from '$lib/client/components/QuestionCard.svelte';

	import type { PageProps } from './$types';

	const { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Aggiungi | MedDB</title>
</svelte:head>

<div class="flex h-screen w-screen flex-col items-center justify-center gap-10 p-5">
	<div class="flex flex-col items-center justify-center">
		<h1 class="h2">AGGIUNGI DOMANDE</h1>
		<p>In questa pagina potrai aggiungere delle domande per i test.</p>
	</div>

	<form method="POST" class="flex h-2/3 lg:w-2/5 w-full flex-col gap-4">
		<QuestionCard types={data.types} objectives={data.objectives} />
		<button type="submit" class="btn preset-filled-primary-500 btn-base">Invia</button>
	</form>
</div>
