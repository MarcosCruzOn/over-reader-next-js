CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'USER',
	"status" varchar(50) DEFAULT 'ativo',
	"created_at" timestamp DEFAULT now(),
	"last_access" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
