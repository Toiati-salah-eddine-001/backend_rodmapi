import { pgTable, serial, text, timestamp, integer, uuid, varchar, jsonb } from "drizzle-orm/pg-core";

// ---------- Users (for storage / profile) ----------
export const users = pgTable("users", {
  id: uuid("id").primaryKey(), // will be set from Supabase Auth user id, no default
  full_name: text("full_name"),
  avatar_url: text("avatar_url"),
  preferences: jsonb("preferences"), // remove .nullable(), handle nullability in TypeScript or insertion
  created_at: timestamp("created_at").defaultNow(),
});

// ---------- Roadmaps ----------
export const roadmaps = pgTable("roadmaps", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull(), // assign manually from current Supabase Auth session
  title: text("title").notNull(),
  description: text("description"),
  domain: text("domain").notNull(),
  estimated_duration: text("estimated_duration"),
  created_at: timestamp("created_at").defaultNow(),
});

// ---------- Sections ----------
export const sections = pgTable("sections", {
  id: uuid("id").primaryKey().defaultRandom(),
  roadmap_id: uuid("roadmap_id").notNull().references(() => roadmaps.id),
  title: text("title").notNull(),
  summary: text("summary"),
  order: integer("order").notNull(),
});

// ---------- Steps ----------
export const steps = pgTable("steps", {
  id: uuid("id").primaryKey().defaultRandom(),
  section_id: uuid("section_id").notNull().references(() => sections.id),
  title: text("title").notNull(),
  description: text("description"),
  duration: text("duration"),
});

// ---------- Resources ----------
export const resources = pgTable("resources", {
  id: uuid("id").primaryKey().defaultRandom(),
  step_id: uuid("step_id").notNull().references(() => steps.id),
  type: varchar("type", { length: 20 }).notNull(), // article / video / course
  title: text("title").notNull(),
  url: text("url").notNull(),
});

/*
  Note: The `preferences` field can now be left null in your TypeScript code when inserting.
  Handle nullability in insertion logic or TypeScript types instead of using .nullable() here.
*/
