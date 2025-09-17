<script lang="ts">
	import { ArrowLeftIcon } from '@lucide/svelte';
	
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	import AddButton from '$lib/client/components/buttons/AddButton.svelte';
	import RemoveButton from '$lib/client/components/buttons/RemoveButton.svelte';

	const { data, form }: PageProps = $props();

	type FormKey = 'text' | 'answers';
	const check = (key: FormKey) => form?.missing && form[key] !== undefined;

	let type = $state();
	let count = $state(2);
</script>

<svelte:head>
	<title>Aggiungi | MedDB</title>
</svelte:head>

<div class="flex h-screen w-screen flex-col items-center justify-center gap-10 p-5">
	<div class="flex flex-col items-center justify-center">
		<h1 class="h2">AGGIUNGI DOMANDE</h1>
		<p>In questa pagina potrai aggiungere delle domande per i test.</p>
	</div>

	<form method="POST" class="flex h-2/3 w-full flex-col gap-4 lg:w-2/5" use:enhance>
		<div class="flex h-full flex-col gap-2 overflow-auto card preset-outlined-surface-500 p-4">
			<a href="/" class="preset-filled-outlined-500 ml-2 btn self-start">
				<ArrowLeftIcon size={18} />
				<span>Indietro</span>
			</a>

			<div class="flex w-full justify-between gap-1">
				<label class="label w-1/2">
					<span class="label-text">Tipologia</span>
					<select class="select" bind:value={type} name="type">
						{#each data.types as t}
							<option value={t.id}>{t.name}</option>
						{/each}
					</select>
				</label>

				<label class="label w-1/2">
					<span class="label-text">Materia</span>
					<select class="select" name="objective">
						{#each data.objectives as o}
							<option value={o.id}>{o.name}</option>
						{/each}
					</select>
				</label>
			</div>

			<label class="label">
				<span class="label-text">Domanda</span>
				<input
					class="input {check('text') ? 'preset-input-error' : ''}"
					type="text"
					placeholder="Inserisci la domanda."
					name="question"
				/>
			</label>

			{#if type === 1}
				<div class="mt-2 flex h-full flex-col gap-1 overflow-auto">
					{#each new Array(count).fill(1).map((v, i) => i + 1) as i}
						<input class="input {check('answers') ? 'preset-input-error' : ''}" type="text" placeholder={`Risposta ${i}`} name={`answer.${i}`} />
					{/each}
				</div>

				<div class="mt-2 flex justify-between">
					<AddButton onclick={() => count++}>Aggiungi Risposta</AddButton>
					{#if count > 2}
						<RemoveButton onclick={() => count--}>Rimuovi</RemoveButton>
					{/if}
				</div>
			{/if}
		</div>
		<button type="submit" class="btn preset-filled-primary-500 btn-base">Invia</button>
	</form>
</div>

<style>
  .preset-input-error {
    background-color: var(--color-error-100);
    color: var(--color-error-500);
  }
</style>
