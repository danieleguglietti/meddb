import { z } from 'zod';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { db } from '$lib/server/db';
import {
	objective,
	questionType,
	type IObjective,
	type IQuestionType
} from '$lib/server/db/schema';
import type { IErrorResponse, ISuccessResponse } from '$lib/server/response';
import { getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({}) => {
	const types: IQuestionType[] = await db.select().from(questionType).all();

	const objectives: IObjective[] = await db.select().from(objective).all();

	const user = requireLogin();

	return { types, objectives };
};

const QuestionSchema = z.discriminatedUnion('type', [
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
]);

type Question = z.infer<typeof QuestionSchema>;

export const actions = {
	default: async ({ fetch, request }) => {
		const params = await request.formData();

		let question: Question;

		const type = params.get('type');
		if (!type) return fail(400, { type, missing: true });

		const text = params.get('question');
		if (!text) return fail(400, { text, missing: true });

		const objective = params.get('objective');
		if (!objective) return fail(400, { objective, missing: true });

		if (type === '1') {
			const q: Question = {
				type: 1 as const,
				text: text as string,
				objective: Number.parseInt(objective as string),
				answers: []
			};

			params
				.entries()
				.filter(([k, _]) => k.startsWith('answer'))
				.forEach(([_, v]) => q.answers.push(v as string));

			question = q;
		}

		if (type === '2') {
			question = {
				type: 2,
				text: text as string,
				objective: Number.parseInt(objective as string)
			};
		}

		if (type === '3') {
			question = {
				type: 3,
				text: text as string,
				objective: Number.parseInt(objective as string)
			};
		}

		try {
			const res = await fetch('/api/questions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify([question!])
			});

			if (res.ok) {
				const data: ISuccessResponse<null> = await res.json();
				console.log(data.result);

				return { success: true };
			}

			const data: IErrorResponse = await res.json();
			console.log(data.message);

			return { success: true };
		} catch (err) {
			console.error(err);

			return fail(500);
		}
	}
} satisfies Actions;

function requireLogin() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return redirect(302, '/login');
	}

	return locals.user;
}
