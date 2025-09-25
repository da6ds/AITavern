import { 
  type User, 
  type UpsertUser,
  type InsertUser,
  type Character,
  type InsertCharacter,
  type Quest,
  type InsertQuest,
  type Item,
  type InsertItem,
  type Message,
  type InsertMessage,
  type Enemy,
  type InsertEnemy,
  type GameState,
  type InsertGameState,
  type Campaign,
  type InsertCampaign,
  users,
  characters,
  campaigns,
  quests,
  items,
  messages,
  enemies,
  gameState
} from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, desc, and } from "drizzle-orm";

// AI TTRPG Game Storage Interface
export interface IStorage {
  // User management (legacy)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Character management
  getCharacter(userId?: string): Promise<Character | undefined>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: string, updates: Partial<Character>): Promise<Character | null>;
  init(): Promise<void>;
  
  // Quest management
  getQuests(userId?: string): Promise<Quest[]>;
  getQuest(id: string): Promise<Quest | undefined>;
  createQuest(quest: InsertQuest): Promise<Quest>;
  updateQuest(id: string, updates: Partial<Quest>): Promise<Quest | null>;
  deleteQuest(id: string): Promise<boolean>;
  
  // Inventory management
  getItems(userId?: string): Promise<Item[]>;
  getItem(id: string): Promise<Item | undefined>;
  createItem(item: InsertItem): Promise<Item>;
  updateItem(id: string, updates: Partial<Item>): Promise<Item | null>;
  deleteItem(id: string): Promise<boolean>;
  
  // Enemy management
  getEnemies(combatId?: string, userId?: string): Promise<Enemy[]>;
  getEnemy(id: string): Promise<Enemy | undefined>;
  createEnemy(enemy: InsertEnemy): Promise<Enemy>;
  updateEnemy(id: string, updates: Partial<Enemy>): Promise<Enemy | null>;
  deleteEnemy(id: string): Promise<boolean>;
  
  // Message history for AI conversations
  getMessages(userId?: string): Promise<Message[]>;
  getMessagesByCampaign(campaignId: string): Promise<Message[]>;
  getRecentMessages(limit: number, userId?: string): Promise<Message[]>;
  getRecentMessagesByCampaign(campaignId: string, limit: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  clearMessages(userId?: string): Promise<void>;
  
  // Campaign management
  getCampaigns(): Promise<Campaign[]>;
  getCampaignsByUser(userId: string): Promise<Campaign[]>;
  getCampaign(id: string): Promise<Campaign | undefined>;
  getActiveCampaign(userId?: string): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | null>;
  deleteCampaign(id: string): Promise<boolean>;
  setActiveCampaign(id: string, userId?: string): Promise<Campaign | null>;
  
  // Game state management
  getGameState(userId?: string): Promise<GameState | undefined>;
  createGameState(state: InsertGameState): Promise<GameState>;
  updateGameState(updates: Partial<GameState>, userId?: string): Promise<GameState>;
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  private activeCampaignId: string | null = null;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    
    const sql = postgres(process.env.DATABASE_URL, { max: 1 });
    this.db = drizzle(sql);
  }

  async init(): Promise<void> {
    // Database is initialized through migrations
    console.log("Database storage initialized");
  }

  // User management
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(user).returning();
    return result[0];
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const result = await this.db.insert(users).values(user).onConflictDoUpdate({
      target: users.email,
      set: {
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        updatedAt: new Date().toISOString(),
      },
    }).returning();
    return result[0];
  }

  // Character management
  async getCharacter(userId?: string): Promise<Character | undefined> {
    const activeCampaign = await this.getActiveCampaign(userId);
    if (!activeCampaign) return undefined;

    const result = await this.db.select().from(characters).where(eq(characters.campaignId, activeCampaign.id)).limit(1);
    return result[0];
  }

  async createCharacter(character: InsertCharacter): Promise<Character> {
    const result = await this.db.insert(characters).values(character).returning();
    return result[0];
  }

  async updateCharacter(id: string, updates: Partial<Character>): Promise<Character | null> {
    const result = await this.db.update(characters).set(updates).where(eq(characters.id, id)).returning();
    return result[0] || null;
  }

  // Campaign management
  async getCampaigns(): Promise<Campaign[]> {
    return await this.db.select().from(campaigns).orderBy(desc(campaigns.lastPlayed));
  }

  async getCampaignsByUser(userId: string): Promise<Campaign[]> {
    return await this.db.select().from(campaigns).where(eq(campaigns.userId, userId)).orderBy(desc(campaigns.lastPlayed));
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    const result = await this.db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1);
    return result[0];
  }

  async getActiveCampaign(userId?: string): Promise<Campaign | undefined> {
    if (userId) {
      const result = await this.db.select().from(campaigns).where(
        and(eq(campaigns.isActive, true), eq(campaigns.userId, userId))
      ).limit(1);
      return result[0];
    } else {
      const result = await this.db.select().from(campaigns).where(eq(campaigns.isActive, true)).limit(1);
      return result[0];
    }
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const result = await this.db.insert(campaigns).values(campaign).returning();
    return result[0];
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | null> {
    const result = await this.db.update(campaigns).set({
      ...updates,
      lastPlayed: new Date().toISOString(),
    }).where(eq(campaigns.id, id)).returning();
    return result[0] || null;
  }

  async deleteCampaign(id: string): Promise<boolean> {
    // First delete all related data
    await this.db.delete(characters).where(eq(characters.campaignId, id));
    await this.db.delete(quests).where(eq(quests.campaignId, id));
    await this.db.delete(items).where(eq(items.campaignId, id));
    await this.db.delete(messages).where(eq(messages.campaignId, id));
    await this.db.delete(enemies).where(eq(enemies.campaignId, id));
    await this.db.delete(gameState).where(eq(gameState.campaignId, id));
    
    // Then delete the campaign
    await this.db.delete(campaigns).where(eq(campaigns.id, id));
    return true;
  }

  async setActiveCampaign(id: string, userId?: string): Promise<Campaign | null> {
    // Get the campaign to check if it exists and get userId if not provided
    const campaign = await this.getCampaign(id);
    if (!campaign) return null;
    
    const targetUserId = userId || campaign.userId;
    if (!targetUserId) return null;
    
    // Deactivate all campaigns for this user only
    await this.db.update(campaigns).set({ isActive: false }).where(eq(campaigns.userId, targetUserId));
    
    // Activate the selected campaign
    const result = await this.db.update(campaigns).set({
      isActive: true,
      lastPlayed: new Date().toISOString(),
    }).where(eq(campaigns.id, id)).returning();
    
    this.activeCampaignId = id;
    return result[0] || null;
  }

  // Quest management
  async getQuests(userId?: string): Promise<Quest[]> {
    const activeCampaign = await this.getActiveCampaign(userId);
    if (!activeCampaign) return [];

    return await this.db.select().from(quests).where(eq(quests.campaignId, activeCampaign.id));
  }

  async getQuest(id: string): Promise<Quest | undefined> {
    const result = await this.db.select().from(quests).where(eq(quests.id, id)).limit(1);
    return result[0];
  }

  async createQuest(quest: InsertQuest): Promise<Quest> {
    const result = await this.db.insert(quests).values(quest).returning();
    return result[0];
  }

  async updateQuest(id: string, updates: Partial<Quest>): Promise<Quest | null> {
    const result = await this.db.update(quests).set(updates).where(eq(quests.id, id)).returning();
    return result[0] || null;
  }

  async deleteQuest(id: string): Promise<boolean> {
    await this.db.delete(quests).where(eq(quests.id, id));
    return true;
  }

  // Item management
  async getItems(userId?: string): Promise<Item[]> {
    const activeCampaign = await this.getActiveCampaign(userId);
    if (!activeCampaign) return [];

    return await this.db.select().from(items).where(eq(items.campaignId, activeCampaign.id));
  }

  async getItem(id: string): Promise<Item | undefined> {
    const result = await this.db.select().from(items).where(eq(items.id, id)).limit(1);
    return result[0];
  }

  async createItem(item: InsertItem): Promise<Item> {
    const result = await this.db.insert(items).values(item).returning();
    return result[0];
  }

  async updateItem(id: string, updates: Partial<Item>): Promise<Item | null> {
    const result = await this.db.update(items).set(updates).where(eq(items.id, id)).returning();
    return result[0] || null;
  }

  async deleteItem(id: string): Promise<boolean> {
    await this.db.delete(items).where(eq(items.id, id));
    return true;
  }

  // Enemy management
  async getEnemies(combatId?: string, userId?: string): Promise<Enemy[]> {
    const activeCampaign = await this.getActiveCampaign(userId);
    if (!activeCampaign) return [];

    if (combatId) {
      return await this.db.select().from(enemies).where(
        and(eq(enemies.campaignId, activeCampaign.id), eq(enemies.combatId, combatId))
      );
    } else {
      return await this.db.select().from(enemies).where(eq(enemies.campaignId, activeCampaign.id));
    }
  }

  async getEnemy(id: string): Promise<Enemy | undefined> {
    const result = await this.db.select().from(enemies).where(eq(enemies.id, id)).limit(1);
    return result[0];
  }

  async createEnemy(enemy: InsertEnemy): Promise<Enemy> {
    const result = await this.db.insert(enemies).values(enemy).returning();
    return result[0];
  }

  async updateEnemy(id: string, updates: Partial<Enemy>): Promise<Enemy | null> {
    const result = await this.db.update(enemies).set(updates).where(eq(enemies.id, id)).returning();
    return result[0] || null;
  }

  async deleteEnemy(id: string): Promise<boolean> {
    await this.db.delete(enemies).where(eq(enemies.id, id));
    return true;
  }

  // Message management
  async getMessages(userId?: string): Promise<Message[]> {
    const activeCampaign = await this.getActiveCampaign(userId);
    if (!activeCampaign) return [];

    return await this.db.select().from(messages).where(eq(messages.campaignId, activeCampaign.id)).orderBy(messages.timestamp);
  }

  async getMessagesByCampaign(campaignId: string): Promise<Message[]> {
    return await this.db.select().from(messages).where(eq(messages.campaignId, campaignId)).orderBy(messages.timestamp);
  }

  async getRecentMessages(limit: number, userId?: string): Promise<Message[]> {
    const activeCampaign = await this.getActiveCampaign(userId);
    if (!activeCampaign) return [];

    return await this.db.select().from(messages)
      .where(eq(messages.campaignId, activeCampaign.id))
      .orderBy(desc(messages.timestamp))
      .limit(limit);
  }

  async getRecentMessagesByCampaign(campaignId: string, limit: number): Promise<Message[]> {
    return await this.db.select().from(messages)
      .where(eq(messages.campaignId, campaignId))
      .orderBy(desc(messages.timestamp))
      .limit(limit);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await this.db.insert(messages).values(message).returning();
    return result[0];
  }

  async clearMessages(userId?: string): Promise<void> {
    const activeCampaign = await this.getActiveCampaign(userId);
    if (activeCampaign) {
      await this.db.delete(messages).where(eq(messages.campaignId, activeCampaign.id));
    }
  }

  // Game state management
  async getGameState(userId?: string): Promise<GameState | undefined> {
    const activeCampaign = await this.getActiveCampaign(userId);
    if (!activeCampaign) return undefined;

    const result = await this.db.select().from(gameState).where(eq(gameState.campaignId, activeCampaign.id)).limit(1);
    return result[0];
  }

  async createGameState(state: InsertGameState): Promise<GameState> {
    const result = await this.db.insert(gameState).values(state).returning();
    return result[0];
  }

  async updateGameState(updates: Partial<GameState>, userId?: string): Promise<GameState> {
    const activeCampaign = await this.getActiveCampaign(userId);
    if (!activeCampaign) {
      throw new Error("No active campaign found");
    }

    // Check if game state exists for this campaign
    const existing = await this.getGameState(userId);
    if (existing) {
      const result = await this.db.update(gameState)
        .set(updates)
        .where(eq(gameState.campaignId, activeCampaign.id))
        .returning();
      return result[0];
    } else {
      // Create new game state
      const newState = {
        campaignId: activeCampaign.id,
        currentScene: "",
        inCombat: false,
        currentTurn: null,
        combatId: null,
        turnCount: 0,
        ...updates
      };
      return await this.createGameState(newState);
    }
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private character: Character | undefined;
  private quests: Map<string, Quest>;
  private items: Map<string, Item>;
  private enemies: Map<string, Enemy>;
  private messages: Message[];
  private gameState: GameState | undefined;
  private campaigns: Map<string, Campaign>;
  private activeCampaignId: string | null;

  constructor() {
    this.users = new Map();
    this.quests = new Map();
    this.items = new Map();
    this.enemies = new Map();
    this.messages = [];
    this.campaigns = new Map();
    this.activeCampaignId = null;
  }

  async init(): Promise<void> {
    await this.initializeDefaultData();
  }

  private async initializeDefaultData(): Promise<void> {
    // Create a default campaign first
    if (this.campaigns.size === 0) {
      await this.createCampaign({
        name: "Skunk Tales Adventure",
        description: "Embark on a cozy woodland adventure with magical creatures!",
        userId: null, // No user assigned yet
      });
      // Set the first campaign as active
      const firstCampaign = Array.from(this.campaigns.values())[0];
      if (firstCampaign) {
        this.activeCampaignId = firstCampaign.id;
      }
    }

    // Get the active campaign for default data creation
    const activeCampaign = await this.getActiveCampaign();
    const defaultCampaignId = activeCampaign?.id || Array.from(this.campaigns.keys())[0] || 'default-campaign';

    // Create a default character if none exists
    if (!this.character) {
      await this.createCharacter({
        name: 'Adventurer',
        class: 'Fighter',
        level: 1,
        experience: 0,
        strength: 15,
        dexterity: 14,
        constitution: 13,
        intelligence: 12,
        wisdom: 12,
        charisma: 11,
        currentHealth: 10,
        maxHealth: 10,
        currentMana: 0,
        maxMana: 0,
        campaignId: defaultCampaignId,
        templateId: null,
        portraitUrl: null,
        appearance: null,
        backstory: null,
      });
    }

    // Initialize with some starter items
    if (this.items.size === 0) {
      await this.createItem({
        name: 'Iron Sword',
        type: 'weapon',
        description: 'A sturdy iron blade.',
        quantity: 1,
        rarity: 'common',
        equipped: true,
        campaignId: defaultCampaignId,
      });
      
      await this.createItem({
        name: 'Leather Armor',
        type: 'armor',
        description: 'Basic protection.',
        quantity: 1,
        rarity: 'common',
        equipped: true,
        campaignId: defaultCampaignId,
      });
      
      await this.createItem({
        name: 'Health Potion',
        type: 'consumable',
        description: 'Restores 25 HP.',
        quantity: 2,
        rarity: 'common',
        equipped: false,
        campaignId: defaultCampaignId,
      });
    }

    // Initialize with a starter quest
    if (this.quests.size === 0) {
      await this.createQuest({
        title: 'Begin Your Adventure',
        description: 'Welcome to your journey! Explore the world and discover your destiny.',
        status: 'active',
        priority: 'normal',
        progress: 0,
        maxProgress: 1,
        reward: 'Experience and glory',
        campaignId: defaultCampaignId,
        parentQuestId: null,
        chainId: null,
        isMainStory: true,
      });
    }

    // Initialize game state
    if (!this.gameState) {
      this.gameState = {
        id: randomUUID(),
        campaignId: null, // Default campaign support
        currentScene: 'Starting Village',
        inCombat: false,
        currentTurn: null,
        combatId: null,
        turnCount: 0,
      };
    }
  }

  // User management (legacy)
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      username: insertUser.username || null,
      password: insertUser.password || null,
      email: insertUser.email || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      profileImageUrl: insertUser.profileImageUrl || null,
      createdAt: insertUser.createdAt || new Date().toISOString(),
      updatedAt: insertUser.updatedAt || new Date().toISOString(),
    };
    this.users.set(id, user);
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = userData.id ? this.users.get(userData.id) : undefined;
    
    if (existingUser) {
      // Update existing user
      const updatedUser: User = {
        ...existingUser,
        email: userData.email || existingUser.email,
        firstName: userData.firstName || existingUser.firstName,
        lastName: userData.lastName || existingUser.lastName,
        profileImageUrl: userData.profileImageUrl || existingUser.profileImageUrl,
        updatedAt: new Date().toISOString(),
      };
      this.users.set(existingUser.id, updatedUser);
      return updatedUser;
    } else {
      // Create new user
      const id = userData.id || randomUUID();
      const newUser: User = {
        id,
        username: userData.username || null,
        password: userData.password || null,
        email: userData.email || null,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        profileImageUrl: userData.profileImageUrl || null,
        createdAt: userData.createdAt || new Date().toISOString(),
        updatedAt: userData.updatedAt || new Date().toISOString(),
      };
      this.users.set(id, newUser);
      return newUser;
    }
  }

  // Character management
  async getCharacter(userId?: string): Promise<Character | undefined> {
    return this.character;
  }

  async createCharacter(character: InsertCharacter): Promise<Character> {
    const id = randomUUID();
    const newCharacter: Character = {
      id,
      campaignId: character.campaignId,
      templateId: character.templateId || null,
      name: character.name,
      class: character.class,
      level: character.level ?? 1,
      experience: character.experience ?? 0,
      strength: character.strength ?? 10,
      dexterity: character.dexterity ?? 10,
      constitution: character.constitution ?? 10,
      intelligence: character.intelligence ?? 10,
      wisdom: character.wisdom ?? 10,
      charisma: character.charisma ?? 10,
      currentHealth: character.currentHealth,
      maxHealth: character.maxHealth,
      currentMana: character.currentMana ?? 0,
      maxMana: character.maxMana ?? 0,
      portraitUrl: character.portraitUrl || null,
      appearance: character.appearance || null,
      backstory: character.backstory || null,
    };
    this.character = newCharacter;
    return this.character;
  }

  async updateCharacter(id: string, updates: Partial<Character>): Promise<Character | null> {
    if (!this.character || this.character.id !== id) {
      return null;
    }
    
    const oldCharacter = { ...this.character };
    // Apply updates with validation
    const updatedCharacter = { ...this.character, ...updates };
    
    // Check for level up if experience increased
    if (updates.experience !== undefined && updates.experience > oldCharacter.experience) {
      const newLevel = Math.floor(updatedCharacter.experience / 100) + 1; // Level up every 100 exp
      
      if (newLevel > oldCharacter.level) {
        // Level up! Increase stats and health/mana
        const levelDiff = newLevel - oldCharacter.level;
        
        updatedCharacter.level = newLevel;
        updatedCharacter.maxHealth += levelDiff * 5; // +5 HP per level
        updatedCharacter.maxMana += levelDiff * 3; // +3 Mana per level
        updatedCharacter.currentHealth = updatedCharacter.maxHealth; // Full heal on level up
        updatedCharacter.currentMana = updatedCharacter.maxMana;
        
        // Increase primary stats
        updatedCharacter.strength += levelDiff;
        updatedCharacter.constitution += levelDiff;
        
        // Bonus stats based on class
        if (updatedCharacter.class === 'Fighter') {
          updatedCharacter.strength += levelDiff;
          updatedCharacter.dexterity += Math.floor(levelDiff / 2);
        } else if (updatedCharacter.class === 'Wizard') {
          updatedCharacter.intelligence += levelDiff;
          updatedCharacter.wisdom += Math.floor(levelDiff / 2);
        } else if (updatedCharacter.class === 'Rogue') {
          updatedCharacter.dexterity += levelDiff;
          updatedCharacter.charisma += Math.floor(levelDiff / 2);
        }
      }
    }
    
    // Ensure health doesn't exceed max and isn't negative
    if (updatedCharacter.currentHealth > updatedCharacter.maxHealth) {
      updatedCharacter.currentHealth = updatedCharacter.maxHealth;
    }
    if (updatedCharacter.currentHealth < 0) {
      updatedCharacter.currentHealth = 0;
    }
    
    // Ensure mana doesn't exceed max and isn't negative
    if (updatedCharacter.currentMana > updatedCharacter.maxMana) {
      updatedCharacter.currentMana = updatedCharacter.maxMana;
    }
    if (updatedCharacter.currentMana < 0) {
      updatedCharacter.currentMana = 0;
    }
    
    this.character = updatedCharacter;
    return this.character;
  }

  // Quest management
  async getQuests(): Promise<Quest[]> {
    return Array.from(this.quests.values()).sort((a, b) => {
      // Sort by priority (urgent > high > normal > low), then by status (active first)
      const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
      const statusOrder = { active: 0, completed: 1, failed: 2 };
      
      const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
      if (priorityDiff !== 0) return priorityDiff;
      
      return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
    });
  }

  async getQuest(id: string): Promise<Quest | undefined> {
    return this.quests.get(id);
  }

  async createQuest(quest: InsertQuest): Promise<Quest> {
    const id = randomUUID();
    const newQuest: Quest = {
      id,
      campaignId: quest.campaignId,
      title: quest.title,
      description: quest.description,
      status: quest.status,
      priority: quest.priority ?? 'normal',
      progress: quest.progress ?? 0,
      maxProgress: quest.maxProgress ?? 1,
      reward: quest.reward ?? null,
      parentQuestId: quest.parentQuestId ?? null,
      chainId: quest.chainId ?? null,
      isMainStory: quest.isMainStory ?? false,
    };
    this.quests.set(id, newQuest);
    return newQuest;
  }

  async updateQuest(id: string, updates: Partial<Quest>): Promise<Quest | null> {
    const quest = this.quests.get(id);
    if (!quest) {
      return null;
    }
    
    const updatedQuest = { ...quest, ...updates };
    
    // Ensure progress doesn't exceed max and isn't negative
    if (updatedQuest.progress > updatedQuest.maxProgress) {
      updatedQuest.progress = updatedQuest.maxProgress;
    }
    if (updatedQuest.progress < 0) {
      updatedQuest.progress = 0;
    }

    // Detect quest completion - either status changed to completed OR progress reached max
    const wasJustCompleted = (quest.status !== 'completed' && updatedQuest.status === 'completed') ||
                            (quest.progress < quest.maxProgress && updatedQuest.progress >= updatedQuest.maxProgress);
    
    // Auto-complete quest when progress reaches max
    if (updatedQuest.progress >= updatedQuest.maxProgress && updatedQuest.status === 'active') {
      updatedQuest.status = 'completed';
    }
    
    this.quests.set(id, updatedQuest);
    
    // Award experience if quest was just completed
    if (wasJustCompleted && this.character) {
      let expReward = 30; // Base experience
      
      // Bonus experience based on priority
      if (updatedQuest.priority === 'urgent') expReward += 40;
      else if (updatedQuest.priority === 'high') expReward += 25;
      else if (updatedQuest.priority === 'normal') expReward += 15;
      
      // Main story quests give extra experience
      if (updatedQuest.isMainStory) expReward += 30;
      
      const newExp = this.character.experience + expReward;
      
      // Apply level up logic through updateCharacter
      await this.updateCharacter(this.character.id, { experience: newExp });
    }
    
    // Return updated quest with completion flag for follow-up generation
    return { ...updatedQuest, wasJustCompleted } as Quest & { wasJustCompleted?: boolean };
  }

  async deleteQuest(id: string): Promise<boolean> {
    return this.quests.delete(id);
  }

  // Inventory management
  async getItems(): Promise<Item[]> {
    return Array.from(this.items.values()).sort((a, b) => {
      // Sort by equipped status first, then by rarity, then by type
      if (a.equipped !== b.equipped) return a.equipped ? -1 : 1;
      
      const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
      const rarityDiff = rarityOrder[a.rarity as keyof typeof rarityOrder] - rarityOrder[b.rarity as keyof typeof rarityOrder];
      if (rarityDiff !== 0) return rarityDiff;
      
      const typeOrder = { weapon: 0, armor: 1, consumable: 2, misc: 3 };
      return typeOrder[a.type as keyof typeof typeOrder] - typeOrder[b.type as keyof typeof typeOrder];
    });
  }

  async getItem(id: string): Promise<Item | undefined> {
    return this.items.get(id);
  }

  async createItem(item: InsertItem): Promise<Item> {
    const id = randomUUID();
    const newItem: Item = {
      id,
      campaignId: item.campaignId,
      name: item.name,
      type: item.type,
      description: item.description ?? null,
      quantity: item.quantity ?? 1,
      rarity: item.rarity ?? 'common',
      equipped: item.equipped ?? false,
    };
    this.items.set(id, newItem);
    return newItem;
  }

  async updateItem(id: string, updates: Partial<Item>): Promise<Item | null> {
    const item = this.items.get(id);
    if (!item) {
      return null;
    }
    
    const updatedItem = { ...item, ...updates };
    
    // Ensure quantity isn't negative
    if (updatedItem.quantity < 0) {
      updatedItem.quantity = 0;
    }
    
    // If equipped, ensure quantity is at least 1
    if (updatedItem.equipped && updatedItem.quantity === 0) {
      updatedItem.equipped = false;
    }
    
    this.items.set(id, updatedItem);
    return updatedItem;
  }

  async deleteItem(id: string): Promise<boolean> {
    return this.items.delete(id);
  }

  // Message history for AI conversations
  async getMessages(): Promise<Message[]> {
    return [...this.messages];
  }

  async getMessagesByCampaign(campaignId: string): Promise<Message[]> {
    return this.messages.filter(message => message.campaignId === campaignId);
  }

  async getRecentMessages(limit: number): Promise<Message[]> {
    return this.messages.slice(-limit);
  }

  async getRecentMessagesByCampaign(campaignId: string, limit: number): Promise<Message[]> {
    const campaignMessages = this.messages.filter(message => message.campaignId === campaignId);
    return campaignMessages.slice(-limit);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const newMessage: Message = {
      id,
      campaignId: message.campaignId,
      content: message.content,
      sender: message.sender,
      senderName: message.senderName ?? null,
      timestamp: message.timestamp || new Date().toISOString(),
    };
    this.messages.push(newMessage);
    
    // Keep only the last 100 messages to prevent memory issues
    if (this.messages.length > 100) {
      this.messages = this.messages.slice(-100);
    }
    
    return newMessage;
  }

  async clearMessages(): Promise<void> {
    this.messages = [];
  }

  // Game state management
  async getGameState(): Promise<GameState | undefined> {
    return this.gameState;
  }

  async createGameState(state: InsertGameState): Promise<GameState> {
    const id = randomUUID();
    const newGameState: GameState = {
      id,
      campaignId: state.campaignId ?? null,
      currentScene: state.currentScene,
      inCombat: state.inCombat ?? false,
      currentTurn: state.currentTurn ?? null,
      combatId: state.combatId ?? null,
      turnCount: state.turnCount ?? 0,
    };
    this.gameState = newGameState;
    return this.gameState;
  }

  async updateGameState(updates: Partial<GameState>): Promise<GameState> {
    if (!this.gameState) {
      throw new Error('Game state not found');
    }
    this.gameState = { ...this.gameState, ...updates };
    return this.gameState;
  }

  // Enemy management
  async getEnemies(combatId?: string): Promise<Enemy[]> {
    const enemies = Array.from(this.enemies.values());
    if (combatId) {
      return enemies.filter(enemy => enemy.combatId === combatId && enemy.isActive);
    }
    return enemies.filter(enemy => enemy.isActive);
  }

  async getEnemy(id: string): Promise<Enemy | undefined> {
    return this.enemies.get(id);
  }

  async createEnemy(enemy: InsertEnemy): Promise<Enemy> {
    const id = randomUUID();
    const newEnemy: Enemy = {
      id,
      campaignId: enemy.campaignId,
      name: enemy.name,
      level: enemy.level ?? 1,
      currentHealth: enemy.currentHealth,
      maxHealth: enemy.maxHealth,
      attack: enemy.attack ?? 10,
      defense: enemy.defense ?? 10,
      speed: enemy.speed ?? 10,
      combatId: enemy.combatId ?? null,
      isActive: enemy.isActive ?? true,
      abilities: enemy.abilities ? enemy.abilities : null,
    };
    this.enemies.set(id, newEnemy);
    return newEnemy;
  }

  async updateEnemy(id: string, updates: Partial<Enemy>): Promise<Enemy | null> {
    const enemy = this.enemies.get(id);
    if (!enemy) {
      return null;
    }
    
    const updatedEnemy = { ...enemy, ...updates };
    
    // Ensure health doesn't exceed max and isn't negative
    if (updatedEnemy.currentHealth > updatedEnemy.maxHealth) {
      updatedEnemy.currentHealth = updatedEnemy.maxHealth;
    }
    if (updatedEnemy.currentHealth < 0) {
      updatedEnemy.currentHealth = 0;
    }

    // Mark enemy as inactive if health reaches 0
    if (updatedEnemy.currentHealth <= 0 && updatedEnemy.isActive) {
      updatedEnemy.isActive = false;
    }
    
    this.enemies.set(id, updatedEnemy);
    return updatedEnemy;
  }

  async deleteEnemy(id: string): Promise<boolean> {
    return this.enemies.delete(id);
  }

  // Campaign management
  async getCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async getCampaignsByUser(userId: string): Promise<Campaign[]> {
    return Array.from(this.campaigns.values()).filter(campaign => campaign.userId === userId);
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async getActiveCampaign(): Promise<Campaign | undefined> {
    if (!this.activeCampaignId) return undefined;
    return this.campaigns.get(this.activeCampaignId);
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const id = randomUUID();
    const newCampaign: Campaign = { 
      id,
      name: campaign.name,
      description: campaign.description || '',
      userId: campaign.userId || null,
      createdAt: new Date().toISOString(),
      lastPlayed: new Date().toISOString(),
      isActive: false
    };
    this.campaigns.set(id, newCampaign);
    return newCampaign;
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | null> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return null;
    
    const updatedCampaign = { ...campaign, ...updates };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }

  async deleteCampaign(id: string): Promise<boolean> {
    if (this.activeCampaignId === id) {
      this.activeCampaignId = null;
    }
    return this.campaigns.delete(id);
  }

  async setActiveCampaign(id: string): Promise<Campaign | null> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return null;
    
    // Deactivate all campaigns
    Array.from(this.campaigns.entries()).forEach(([campaignId, camp]) => {
      this.campaigns.set(campaignId, { ...camp, isActive: false });
    });
    
    // Activate the selected campaign
    const updatedCampaign = { 
      ...campaign, 
      isActive: true, 
      lastPlayed: new Date().toISOString() 
    };
    this.campaigns.set(id, updatedCampaign);
    this.activeCampaignId = id;
    
    return updatedCampaign;
  }
}

export const storage = new DatabaseStorage();

// Initialize storage
storage.init();
