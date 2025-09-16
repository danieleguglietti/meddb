import { eq } from 'drizzle-orm';
import { error, json, type RequestHandler } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { res } from '$lib/server/response';
import { objective, question, type IObjective, type IQuestion } from '$lib/server/db/schema';

type ResultType = (IObjective & { questions: Array<IQuestion> }) | undefined;

export const GET: RequestHandler = async ({ params }) => {
	const id = Number.parseInt(params.id!);

	const rows = await db
		.select()
		.from(objective)
		.where(eq(objective.id, id))
		.innerJoin(question, eq(objective.id, question.objectiveId))
		.all();

	if (rows.length == 0) {
		return error(404, res.error('No questions found for objective with id ' + id));
	}

	const result = rows.reduce<ResultType>((acc, row) => {
		const obj = row.objective;
		const q = row.question;

		if (!acc) {
			acc = { ...obj, questions: [] };
		}

		acc.questions.push(q);

		return acc;
	}, undefined);

	return json(res.success(result));
};
