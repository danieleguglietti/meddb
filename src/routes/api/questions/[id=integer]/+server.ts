import { eq } from 'drizzle-orm';
import { error, json, type RequestHandler } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { res } from '$lib/server/response';
import { answer, question, type IAnswer, type IQuestion } from '$lib/server/db/schema';

type ResultType = (IQuestion & { answers: Array<IAnswer> }) | undefined;

export const GET: RequestHandler = async ({ params }) => {
	const id = Number.parseInt(params.id!);

	const rows = await db
		.select()
		.from(question)
		.where(eq(question.id, id))
		.innerJoin(answer, eq(question.id, answer.questionId))
		.all();

	if (rows.length == 0) {
		return error(404, res.error('No question found with id ' + id));
	}

	const result = rows.reduce<ResultType>((acc, row) => {
		const q = row.question;
		const a = row.answer;

		if (!acc) {
			acc = { ...q, answers: [] };
		}

		acc.answers.push(a);

		return acc;
	}, undefined);

	return json(res.success(result));
};
