import { sqliteTable as table, int, text } from 'drizzle-orm/sqlite-core';
import { objective } from './objective';

const questionType = table('question_type', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull()
});

const question = table('question', {
	id: int('id').primaryKey({ autoIncrement: true }),
	text: text('text').notNull(),
	typeId: int('type_id')
		.references(() => questionType.id)
		.notNull(),
	objectiveId: int('objective_id')
		.references(() => objective.id)
		.notNull()
});

export type IQuestionType = typeof questionType.$inferSelect;

export type IQuestion = typeof question.$inferSelect;

export { questionType, question };
