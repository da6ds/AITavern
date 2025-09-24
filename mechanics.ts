// server/mechanics.ts
import { engine } from "./index.ts";
import type { CheckResult } from "../shared/rules/RulesEngine.ts";

export function abilityCheck(opts: {
  actorId: string;
  skill?: string;
  difficulty?: number;
  tags?: string[];
}): CheckResult {
  return engine.abilityCheck(opts);
}

export function damageRoll(expr: string) {
  return engine.damageRoll(expr);
}

export function turnOrder(ids: string[]) {
  return engine.turnOrder(ids);
}
