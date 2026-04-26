CREATE TABLE "mangas" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"author" varchar(255) NOT NULL,
	"genres" varchar(255) NOT NULL,
	"synopsis" text NOT NULL,
	"cover_url" varchar(500),
	"status" varchar(50) NOT NULL,
	"release_year" integer,
	"publisher" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
