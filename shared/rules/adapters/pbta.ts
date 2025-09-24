import { RulesEngine, CheckInput, CheckResult } from "../RulesEngine";

// 2d6 roller
function roll2d6(): { total: number; parts: number[] } {
  const a = 1 + Math.floor(Math.random() * 6);
  const b = 1 + Math.floor(Math.random() * 6);
  return { total: a + b, parts: [a, b] };
}

export class PbtaEngine implements RulesEngine {
  name() { return "pbta"; }
  initSession(_seed?: number) {}

  abilityCheck({ tags }: CheckInput): CheckResult {
    // TODO: pull real stat mod from actor; default 0 for now
    const mod = 0;
    const r = roll2d6();
    const rollTotal = r.total + mod;

    // PbtA tiers: miss (<=6), partial (7-9), full (>=10)
    const success = rollTotal >= 7;
    const tier = rollTotal >= 10 ? "full" : success ? "partial" : "miss";
    const margin = tier === "full" ? rollTotal - 10 : tier === "partial" ? rollTotal - 7 : rollTotal - 6;

    return {
      success,
      rollTotal,
      detail: `2d6(${r.parts[0]}+${r.parts[1]}) + ${mod} => ${tier}${tags?.length ? " ["+tags.join(", ")+"]" : ""}`,
      margin
    };
  }

  damageRoll(expr: string) {
    // PbtA usually uses harm/clocks, but keep NdM support for parity
    const m = expr.replace(/\s+/g, "").match(/^(\d+)d(\d+)([+-]\d+)?$/i);
    if (!m) return { total: 0, breakdown: [] };
    const n = Number(m[1]), d = Number(m[2]), k = m[3] ? Number(m[3]) : 0;
    const parts = Array.from({ length: n }, () => 1 + Math.floor(Math.random() * d));
    const total = parts.reduce((a, b) => a + b, 0) + k;
    return { total, breakdown: parts };
  }

  turnOrder(ids: string[]) { return ids.slice(); }
  applyOutcome(res: CheckResult, state: any) { return state; }
}
