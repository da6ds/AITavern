import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: text("sess").notNull(),
    expire: text("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Legacy columns for migration compatibility
  username: text("username"),
  password: text("password"),
  // Replit Auth columns
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Saved Character Templates (reusable across adventures)
export const characterTemplates = pgTable("character_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  class: text("class").notNull(),
  
  // Core D&D Stats
  strength: integer("strength").default(10).notNull(),
  dexterity: integer("dexterity").default(10).notNull(),
  constitution: integer("constitution").default(10).notNull(),
  intelligence: integer("intelligence").default(10).notNull(),
  wisdom: integer("wisdom").default(10).notNull(),
  charisma: integer("charisma").default(10).notNull(),
  
  // Character Details
  portraitUrl: text("portrait_url"),
  appearance: text("appearance"),
  backstory: text("backstory"),
  
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Campaign/Adventure Schema (now user-owned)
export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"), // Owner of the adventure - nullable for migration
  name: text("name").notNull(),
  description: text("description").default("").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  lastPlayed: text("last_played").default(sql`CURRENT_TIMESTAMP`).notNull(),
  isActive: boolean("is_active").default(false).notNull(), // Only one active campaign per user
});

// Active Character Schema (per adventure)
export const characters = pgTable("characters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id").notNull(), // Links character to specific adventure
  templateId: varchar("template_id"), // Links to character template if created from one
  
  name: text("name").notNull(),
  class: text("class").notNull(),
  level: integer("level").default(1).notNull(),
  experience: integer("experience").default(0).notNull(),
  
  // Core D&D Stats
  strength: integer("strength").default(10).notNull(),
  dexterity: integer("dexterity").default(10).notNull(),
  constitution: integer("constitution").default(10).notNull(),
  intelligence: integer("intelligence").default(10).notNull(),
  wisdom: integer("wisdom").default(10).notNull(),
  charisma: integer("charisma").default(10).notNull(),
  
  // Health and Resources
  currentHealth: integer("current_health").notNull(),
  maxHealth: integer("max_health").notNull(),
  currentMana: integer("current_mana").default(0).notNull(),
  maxMana: integer("max_mana").default(0).notNull(),
  
  // Character Appearance
  portraitUrl: text("portrait_url"),
  appearance: text("appearance"),
  backstory: text("backstory"),
});

// Quest Schema (per campaign)
export const quests = pgTable("quests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id").notNull(), // Links quest to specific adventure
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(), // active, completed, failed
  priority: text("priority").default("normal").notNull(), // low, normal, high, urgent
  progress: integer("progress").default(0).notNull(),
  maxProgress: integer("max_progress").default(1).notNull(),
  reward: text("reward"),
  parentQuestId: varchar("parent_quest_id"), // For quest chains
  chainId: varchar("chain_id"), // Groups related quests
  isMainStory: boolean("is_main_story").default(false).notNull(), // Main story vs side quest
});

// Inventory Item Schema (per campaign)
export const items = pgTable("items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id").notNull(), // Links item to specific adventure
  name: text("name").notNull(),
  type: text("type").notNull(), // weapon, armor, consumable, misc
  description: text("description"),
  quantity: integer("quantity").default(1).notNull(),
  rarity: text("rarity").default("common").notNull(), // common, uncommon, rare, epic, legendary
  equipped: boolean("equipped").default(false).notNull(),
});

// Chat Message Schema for AI DM (per campaign)
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id").notNull(), // Links message to specific adventure
  content: text("content").notNull(),
  sender: text("sender").notNull(), // player, dm, npc
  senderName: text("sender_name"),
  timestamp: text("timestamp").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Enemy Schema for Combat (per campaign)
export const enemies = pgTable("enemies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id").notNull(), // Links enemy to specific adventure
  name: text("name").notNull(),
  level: integer("level").default(1).notNull(),
  currentHealth: integer("current_health").notNull(),
  maxHealth: integer("max_health").notNull(),
  attack: integer("attack").default(10).notNull(),
  defense: integer("defense").default(10).notNull(),
  speed: integer("speed").default(10).notNull(),
  combatId: varchar("combat_id"), // Groups enemies in same encounter
  isActive: boolean("is_active").default(true).notNull(), // Can be targeted
  abilities: text("abilities").array(), // Special abilities
});

// Game State Schema (now linked to campaigns)
export const gameState = pgTable("game_state", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id"),
  currentScene: text("current_scene").notNull(),
  inCombat: boolean("in_combat").default(false).notNull(),
  currentTurn: text("current_turn"),
  combatId: varchar("combat_id"), // Current combat encounter
  turnCount: integer("turn_count").default(0).notNull(),
});

// Create schemas
export const insertUserSchema = createInsertSchema(users);
export const insertCharacterTemplateSchema = createInsertSchema(characterTemplates);
export const insertCampaignSchema = createInsertSchema(campaigns);
export const insertCharacterSchema = createInsertSchema(characters);
export const insertQuestSchema = createInsertSchema(quests);
export const insertItemSchema = createInsertSchema(items);
export const insertMessageSchema = createInsertSchema(messages);
export const insertEnemySchema = createInsertSchema(enemies);
export const insertGameStateSchema = createInsertSchema(gameState);

// Update schemas for partial updates
export const updateUserSchema = insertUserSchema.partial();
export const updateCharacterTemplateSchema = insertCharacterTemplateSchema.partial();
export const updateCampaignSchema = insertCampaignSchema.partial();
export const updateCharacterSchema = insertCharacterSchema.omit({ class: true }).partial();
export const updateQuestSchema = insertQuestSchema.partial();
export const updateItemSchema = insertItemSchema.partial();
export const updateEnemySchema = insertEnemySchema.partial();
export const updateGameStateSchema = insertGameStateSchema.partial();

// Types
export type Character = typeof characters.$inferSelect;
export type CharacterTemplate = typeof characterTemplates.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type Quest = typeof quests.$inferSelect;
export type Item = typeof items.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Enemy = typeof enemies.$inferSelect;
export type GameState = typeof gameState.$inferSelect;

export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type InsertCharacterTemplate = z.infer<typeof insertCharacterTemplateSchema>;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type InsertQuest = z.infer<typeof insertQuestSchema>;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertEnemy = z.infer<typeof insertEnemySchema>;
export type InsertGameState = z.infer<typeof insertGameStateSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;