CREATE TABLE `waitlist` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`manage_token` text NOT NULL,
	`interest` text,
	`consent_version` text NOT NULL,
	`created_at` integer NOT NULL,
	`interest_updated_at` integer,
	`unsubscribed_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `waitlist_email_unique` ON `waitlist` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `waitlist_manage_token_unique` ON `waitlist` (`manage_token`);