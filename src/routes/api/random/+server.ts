import { db } from '$lib/server/db';
import { answer, question, type IAnswer, type IQuestion } from '$lib/server/db/schema';
import { res } from '$lib/server/response';
import { json, type RequestHandler } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';

type ResultType = IQuestion & { answers: Array<IAnswer> };

export const GET: RequestHandler = async ({}) => {
	const random = db
		.select()
		.from(question)
		.orderBy(sql`RANDOM()`)
		.limit(30)
		.as('question');

	const rows = await db
		.select()
		.from(random)
		.leftJoin(answer, eq(question.id, answer.questionId))
		.all();

	const result = rows.reduce<Record<number, ResultType>>((acc, row) => {
		const q = row.question;
		const a = row.answer;

		if (!acc[q.id]) {
			acc[q.id] = { ...q, answers: [] };
		}

		if (a) {
			acc[q.id].answers.push(a);
		}
		return acc;
	}, {});

	return json(res.success(result, 'Selected 30 random questions.'));
};
