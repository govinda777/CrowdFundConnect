import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  walletAddress: text("wallet_address"),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  goal: integer("goal").notNull(), // in cents
  raised: integer("raised").default(0), // in cents
  backers: integer("backers").default(0),
  deadline: timestamp("deadline").notNull(),
  tokenSymbol: text("token_symbol").notNull(),
  contractAddress: text("contract_address"),
  networkName: text("network_name"),
  imageColor: text("image_color").default("from-primary to-secondary"),
  isActive: boolean("is_active").default(true),
  createdBy: integer("created_by").references(() => users.id),
});

export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  amount: integer("amount").notNull(), // in cents
  tokenAmount: integer("token_amount").default(0),
  claimed: integer("claimed").default(0),
  limit: integer("limit").notNull(),
  contractId: text("contract_id"),
  isDynamic: boolean("is_dynamic").default(false),
});

export const contributions = pgTable("contributions", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  userId: integer("user_id").references(() => users.id),
  rewardId: integer("reward_id").references(() => rewards.id),
  amount: integer("amount").notNull(), // in cents
  name: text("name"),
  email: text("email"),
  walletAddress: text("wallet_address"),
  note: text("note"),
  isAnonymous: boolean("is_anonymous").default(false),
  transactionHash: text("transaction_hash"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  walletAddress: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  description: true,
  goal: true,
  deadline: true,
  tokenSymbol: true,
  contractAddress: true,
  networkName: true,
  imageColor: true,
  createdBy: true,
});

export const insertRewardSchema = createInsertSchema(rewards).pick({
  projectId: true,
  title: true,
  description: true,
  amount: true,
  tokenAmount: true,
  limit: true,
  contractId: true,
  isDynamic: true,
});

export const insertContributionSchema = createInsertSchema(contributions).pick({
  projectId: true,
  userId: true,
  rewardId: true,
  amount: true,
  name: true,
  email: true,
  walletAddress: true,
  note: true,
  isAnonymous: true,
  transactionHash: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertReward = z.infer<typeof insertRewardSchema>;
export type Reward = typeof rewards.$inferSelect;

export type InsertContribution = z.infer<typeof insertContributionSchema>;
export type Contribution = typeof contributions.$inferSelect;
