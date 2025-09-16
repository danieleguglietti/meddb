import { eq } from 'drizzle-orm';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { res } from '$lib/server/response';
import { objective } from '$lib/server/db/schema';

export const GET: RequestHandler = async ({ params }) => {
	const id = Number.parseInt(params.id!);

	const result = await db.select().from(objective).where(eq(objective.id, id)).all();

	if (result.length == 0) {
		return error(404, res.error('No objective found with id ' + id));
	}

	return json(res.success(result));
};
