<script lang="ts">
	import type { IObjective, IQuestionType } from '$lib/server/db/schema';
	import { ArrowLeftIcon } from '@lucide/svelte';

	import AddButton from './buttons/AddButton.svelte';
	import RemoveButton from './buttons/RemoveButton.svelte';

	type IPropsType = { types: IQuestionType[]; objectives: IObjective[] };

	let type = $state();
	let count = $state(2);

	const { types, objectives }: IPropsType = $props();
</script>

<div class="flex h-full flex-col gap-2 overflow-auto card preset-outlined-surface-500 p-4">
	<a href="/" class="ml-2 btn self-start preset-filled-outlined-500">
			<ArrowLeftIcon size={18} />
			<span>Indietro</span>
		</a>
		
	<div class="flex w-full justify-between gap-1">
		<label class="label w-1/2">
			<span class="label-text">Tipologia</span>
			<select class="select" bind:value={type} name="type">
				{#each types as t}
					<option value={t.id}>{t.name}</option>
				{/each}
			</select>
		</label>

		<label class="label w-1/2">
			<span class="label-text">Materia</span>
			<select class="select" name="objective">
				{#each objectives as o}
					<option value={o.id}>{o.name}</option>
				{/each}
			</select>
		</label>
	</div>

	<label class="label">
		<span class="label-text">Domanda</span>
		<input class="input" type="text" placeholder="Inserisci la domanda." name="question" />
	</label>

	{#if type === 1}
		<div class="mt-2 flex h-full flex-col gap-1 overflow-auto">
			{#each new Array(count).fill(1).map((v, i) => i + 1) as i}
				<input class="input" type="text" placeholder={`Risposta ${i}`} name={`answer.${i}`} />
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
