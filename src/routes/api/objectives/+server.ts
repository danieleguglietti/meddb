import { z } from 'zod';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { res } from '$lib/server/response';
import { objective } from '$lib/server/db/schema';

export const GET: RequestHandler = async ({}) => {
	const result = await db.select().from(objective);

	return json(res.success(result));
};

const ObjectiveSchema = z.array(
	z.object({
		name: z.string()
	})
);

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();

	try {
		const objs = ObjectiveSchema.parse(data);

		const result = await db
			.insert(objective)
			.values(objs.map((obj) => ({ name: obj.name })))
			.returning();

		return json(res.success(result, 'Objective(s) successfully registered.'));
	} catch (err) {
		if (err instanceof z.ZodError) return error(400, res.error('Malformed body.', err.issues));
		else return error(500, res.error('An error occoured while saving data. Try again.', err));
	}
};
