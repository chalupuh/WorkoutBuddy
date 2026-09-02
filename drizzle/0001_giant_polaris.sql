CREATE TABLE `app_state` (
	`key` text PRIMARY KEY NOT NULL,
	`data_json` text NOT NULL,
	`revision` text NOT NULL,
	`updated_at` text NOT NULL,
	`updated_by` text NOT NULL
);
