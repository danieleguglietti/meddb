import { sqliteTable as table, int, text } from 'drizzle-orm/sqlite-core';

import { question } from './question';

const answer = table('answer', {
	id: int('id').primaryKey({ autoIncrement: true }),
	text: text('text').notNull(),
	questionId: int('question_id')
		.references(() => question.id)
		.notNull()
});

export type IAnswer = typeof answer.$inferSelect;

export { answer };
