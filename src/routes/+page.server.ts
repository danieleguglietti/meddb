import type { PageServerLoad } from './$types';

import { db } from '$lib/server/db';
import { objective } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({}) => {
	const data = await db.select().from(objective).all();

	return { objectives: data };
};
