CREATE TABLE `objective` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_answer` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`text` text NOT NULL,
	`question_id` integer NOT NULL,
	FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_answer`("id", "text", "question_id") SELECT "id", "text", "question_id" FROM `answer`;--> statement-breakpoint
DROP TABLE `answer`;--> statement-breakpoint
ALTER TABLE `__new_answer` RENAME TO `answer`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `question` ADD `objective_id` integer NOT NULL REFERENCES objective(id);