<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex h-screen w-screen items-center justify-center border">
	<div
		class="flex h-1/2 w-1/5 flex-col items-center justify-evenly gap-2 card preset-outlined-surface-500 px-5 py-2"
	>
		<h1 class="h4">Login</h1>
		<form method="post" action="?/login" use:enhance class="flex flex-col gap-2 w-full">
			<label class="label w-full">
				<span class="label-text">Username</span>
				<input
					name="username"
					class="w-full mt-1 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none"
				/>
			</label>
			<label class="label">
				<span class="label-text">Password</span>
				<input
					type="password"
					name="password"
					class="w-full mt-1 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none"
				/>
			</label>
			<button class="rounded-md bg-primary-600 px-4 py-2 text-white transition hover:bg-primary-700"
				>Login</button
			>
		</form>
		<p style="color: red">{form?.message ?? ''}</p>
	</div>
</div>
