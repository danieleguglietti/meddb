import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { objective } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ url }) => {
	const id = url.searchParams.get('objective');

	if (!id) return { objective: null };

	if (Number.isNaN(id)) error(400, { message: 'Objective must be an integer ID.' });

	const obj = await db
		.select()
		.from(objective)
		.where(eq(objective.id, Number.parseInt(id)));

	if (obj.length === 0) error(404, { message: 'No objective found with ID ' + id });

	return { objective: obj[0] };
};
