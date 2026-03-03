#!/usr/bin/env node

import { intro, outro, text, select, spinner } from "@clack/prompts";
import pc from "picocolors";
import fs from "fs/promises";
import path from "path";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  pgTable,
  serial,
  varchar,
  text as textCol,
  timestamp,
} from "drizzle-orm/pg-core";

// Define the schema inline so this script is 100% standalone
const agentSkills = pgTable("agent_skills", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }),
  description: textCol("description"),
  content: textCol("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

async function main() {
  console.clear();
  intro(pc.bgCyan(pc.black(" Agent Skills Exporter ")));

  let dbUrl = process.env.DATABASE_URL;

  // Ask for connection string if it doesn't exist
  if (!dbUrl) {
    const userInput = await text({
      message: "Please enter your Postgres DATABASE_URL:",
      placeholder: "postgresql://user:password@host:port/dbname",
      validate: (value) => {
        if (!value) return "Please enter a Database URL";
        if (
          !value.startsWith("postgres://") &&
          !value.startsWith("postgresql://")
        ) {
          return "Must be a valid Postgres/Supabase URL";
        }
      },
    });

    if (typeof userInput !== "string") {
      outro(pc.yellow("Cancelled."));
      process.exit(0);
    }
    dbUrl = userInput;
  }

  const exportDir = await text({
    message: "Where should the skills be exported? (path)",
    placeholder: "./exported-skills",
    defaultValue: "./exported-skills",
  });

  if (typeof exportDir !== "string" || !exportDir) {
    outro(pc.yellow("Export cancelled."));
    process.exit(0);
  }

  const s = spinner();
  s.start("Connecting to database 📡");

  const pool = new Pool({
    connectionString: dbUrl,
  });

  const db = drizzle(pool);

  try {
    const skills = await db.select().from(agentSkills);
    s.stop(`Found ${pc.cyan(skills.length)} skills in the database.`);

    if (skills.length === 0) {
      outro(pc.yellow("No skills found to export."));
      process.exit(0);
    }

    const outPath = path.resolve(process.cwd(), exportDir);
    s.start(`Creating directory ${outPath}`);
    await fs.mkdir(outPath, { recursive: true });
    s.stop("Directory ready.");

    s.start("Exporting skills to Markdown...");

    let exportedCount = 0;
    for (const skill of skills) {
      const filePath = path.join(outPath, `${skill.slug}.md`);

      let frontmatter = "---\n";
      if (skill.title) frontmatter += `title: ${skill.title}\n`;
      if (skill.description)
        frontmatter += `description: ${skill.description}\n`;
      frontmatter += "---\n\n";

      const fileContent = frontmatter + skill.content;

      await fs.writeFile(filePath, fileContent, "utf-8");
      exportedCount++;
    }

    s.stop(`Successfully exported ${exportedCount} skills.`);
    outro(pc.green(`All done! Skills saved in ${exportDir}/`));
  } catch (err) {
    s.stop("Failed to export skills");
    console.error(err);
    outro(
      pc.red(
        "Export failed due to a database error. Please verify your connection string.",
      ),
    );
  } finally {
    await pool.end();
  }
}

main().catch(() => {
  outro(pc.red("An unexpected error occurred."));
  process.exit(1);
});
