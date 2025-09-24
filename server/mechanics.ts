// server/mechanics.ts
import { engine } from "./engine.ts";

export function abilityCheck(opts: {
  actorId: string;
  skill?: string;
  difficulty?: number;
  tags?: string[];
}) {
  const r = engine.abilityCheck(opts);
  return {
    success: r.success,
    result: r.rollTotal,
    detail: r.detail,
    margin: r.margin,
  };
}

export function damageRoll(expr: string): number {
  return engine.damageRoll(expr).total;
}

export function turnOrder(ids: string[]) {
  return engine.turnOrder(ids);
}
