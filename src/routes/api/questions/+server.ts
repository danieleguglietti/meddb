import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { res } from '$lib/server/response';
import { answer, question, type IAnswer, type IQuestion } from '$lib/server/db/schema';

type ResultType = IQuestion & { answers: Array<IAnswer> };

export const GET: RequestHandler = async ({}) => {
	const rows = await db
		.select()
		.from(question)
		.innerJoin(answer, eq(question.id, answer.questionId))
		.all();

	const result = rows.reduce<Record<number, ResultType>>((acc, row) => {
		const q = row.question;
		const a = row.answer;

		if (!acc[q.id]) {
			acc[q.id] = { ...q, answers: [] };
		}

		acc[q.id].answers.push(a);

		return acc;
	}, {});

	return json(res.success(result));
};

const QuestionSchema = z.array(
	z.discriminatedUnion('type', [
		z.object({
			type: z.literal(1),
			text: z.string(),
			objective: z.int(),
			answers: z.string().array()
		}),
		z.object({
			type: z.literal(2),
			text: z.string(),
			objective: z.int()
		}),
		z.object({
			type: z.literal(3),
			text: z.string(),
			objective: z.int()
		})
	])
);

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();

	try {
		const questions = QuestionSchema.parse(data);

		for (const q of questions) {
			const [{ id }] = await db
				.insert(question)
				.values({ text: q.text, typeId: q.type, objectiveId: q.objective })
				.returning({ id: question.id });

			if (q.type == 1)
				for (const a of q.answers) {
					await db.insert(answer).values({ text: a, questionId: id });
				}
		}

		return json(res.success(null, 'Question(s) successfully registered.'));
	} catch (err) {
		if (err instanceof z.ZodError) return error(400, res.error('Malformed body.', err.issues));
		else return error(500, res.error('An error occoured while saving data. Try again.', err));
	}
};
