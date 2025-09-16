import { sqliteTable as table, int, text } from 'drizzle-orm/sqlite-core';

const objective = table('objective', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull()
});

export type IObjective = typeof objective.$inferSelect;

export { objective };
