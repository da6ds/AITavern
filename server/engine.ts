// server/engine.ts
import { makeEngine } from "../shared/rules/index.ts";

export const engine = makeEngine((process.env.GAME_SYSTEM as any) || "dnd5e");
