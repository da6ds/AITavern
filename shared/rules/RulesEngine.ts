export type CheckInput = {
  actorId: string;
  skill?: string;           // e.g., "athletics" (D&D) or system-specific
  difficulty?: number;      // target number if the system uses DC/TN
  tags?: string[];          // narrative hints like "desperate/controlled"
};

export type CheckResult = {
  success: boolean;
  rollTotal: number;
  detail: string;           // human-readable math, e.g., "1d20(13)+2"
  margin?: number;          // degrees of success/failure where it makes sense
};

export interface RulesEngine {
  name(): string;
  initSession(seed?: number): void;

  abilityCheck(input: CheckInput): CheckResult;
  damageRoll(expr: string): { total: number; breakdown: number[] };
  turnOrder(actorIds: string[]): string[];

  // let each system apply outcomes to your game state shape
  applyOutcome(result: CheckResult, state: any): any;
}
