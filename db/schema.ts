import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const waitlist = sqliteTable('waitlist', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  manageToken: text('manage_token').notNull().unique(),
  interest: text('interest', {enum:['very_interested','interested_need_more','just_exploring','yes','maybe','no']}),
  consentVersion: text('consent_version').notNull(),
  createdAt: integer('created_at').notNull(),
  interestUpdatedAt: integer('interest_updated_at'),
  unsubscribedAt: integer('unsubscribed_at'),
});
