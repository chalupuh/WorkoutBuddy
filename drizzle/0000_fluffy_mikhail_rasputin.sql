CREATE TABLE `generated_workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`email` text NOT NULL,
	`visibility` text NOT NULL,
	`title` text NOT NULL,
	`data_json` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_generated_workouts_user_created` ON `generated_workouts` (`user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_generated_workouts_visibility_created` ON `generated_workouts` (`visibility`,`created_at`);