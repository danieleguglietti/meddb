<script lang="ts">
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Home | MedDB</title>
</svelte:head>

<div class="flex h-screen w-screen items-center justify-center">
	<div class="flex flex-col items-center justify-center gap-5">
		<div class="flex flex-col items-center">
			<h1 class="h1 text-slate-700">MedDB</h1>
			<p>La banca dati per medicina.</p>
		</div>
		<form method="GET" action="/generate" class="flex items-end gap-2">
			<label class="label w-60">
				<span class="label-text">Materia</span>
				<select class="select" name="objective">
					{#each data.objectives as obj}
						<option value={obj.id}>{obj.name}</option>
					{/each}
				</select>
			</label>
			<button class="btn preset-filled-primary-500 btn-base">Genera</button>
		</form>
		<a href="/add" class="btn w-full preset-outlined-primary-500 btn-base">Aggiungi</a>
	</div>
</div>
