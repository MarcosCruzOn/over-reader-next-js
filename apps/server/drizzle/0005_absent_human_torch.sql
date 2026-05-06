ALTER TABLE "mangas" ALTER COLUMN "release_year" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "mangas" ADD COLUMN "banner_url" varchar(500);--> statement-breakpoint
ALTER TABLE "volumes" ADD COLUMN "cover_url" varchar(500);