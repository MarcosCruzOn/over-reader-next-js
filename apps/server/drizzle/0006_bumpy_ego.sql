ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'ATIVO';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" varchar(255) NOT NULL;