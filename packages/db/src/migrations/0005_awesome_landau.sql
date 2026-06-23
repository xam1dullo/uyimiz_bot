ALTER TABLE "child_activities" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "children" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "diet_plans" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "first_aid_items" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "health_records" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "important_tasks" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "medications" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "child_activities" CASCADE;--> statement-breakpoint
DROP TABLE "children" CASCADE;--> statement-breakpoint
DROP TABLE "diet_plans" CASCADE;--> statement-breakpoint
DROP TABLE "first_aid_items" CASCADE;--> statement-breakpoint
DROP TABLE "health_records" CASCADE;--> statement-breakpoint
DROP TABLE "important_tasks" CASCADE;--> statement-breakpoint
DROP TABLE "medications" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'MEMBER';--> statement-breakpoint
ALTER TABLE "public"."users" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."user_role";--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('OWNER', 'MEMBER', 'CHILD');--> statement-breakpoint
ALTER TABLE "public"."users" ALTER COLUMN "role" SET DATA TYPE "public"."user_role" USING "role"::"public"."user_role";--> statement-breakpoint
DROP TYPE "public"."health_record_type";