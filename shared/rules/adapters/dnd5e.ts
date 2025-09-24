import { RulesEngine, CheckInput, CheckResult } from "../RulesEngine";

// Simple dice roller (supports "NdM+K", e.g., 2d6+3). Swap to your RNG util later.
function rollExpr(expr: string): { total: number; parts: number[] } {
  const m = expr.replace(/\s+/g, "").match(/^(\d+)d(\d+)([+-]\d+)?$/i);
  if (!m) return { total: 0, parts: [] };
  const n = Number(m[1]), d = Number(m[2]), k = m[3] ? Number(m[3]) : 0;
  const parts = Array.from({ length: n }, () => 1 + Math.floor(Math.random() * d));
  const total = parts.reduce((a, b) => a + b, 0) + k;
  return { total, parts };
}

export class DnD5eEngine implements RulesEngine {
  name() { return "dnd5e"; }
  initSession(_seed?: number) { /* TODO: seed RNG if you want reproducibility */ }

  abilityCheck({ actorId, skill, difficulty = 10 }: CheckInput): CheckResult {
    // TODO: pull a real modifier from your actor sheet in state
    const mod = 0;
    const r = rollExpr("1d20");
    const rollTotal = r.total + mod;
    return {
      success: rollTotal >= difficulty,
      rollTotal,
      detail: `1d20(${r.parts[0]}) + ${mod} vs DC ${difficulty}`,
      margin: rollTotal - difficulty,
    };
  }

  damageRoll(expr: string) {
    const r = rollExpr(expr);
    return { total: r.total, breakdown: r.parts };
  }

  turnOrder(actorIds: string[]) {
    // TODO: real initiative: 1d20 + DEX per actor
    return actorIds.slice();
  }

  applyOutcome(result: CheckResult, state: any) {
    // TODO: mutate/return state (e.g., apply conditions/hp changes)
    return state;
  }
}
