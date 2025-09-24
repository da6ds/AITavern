import assert from "node:assert/strict";
import { makeEngine } from "../shared/rules/index.ts";

const systems = ["dnd5e","pbta"] as const;

for (const sys of systems) {
  const eng = makeEngine(sys as any);
  eng.initSession(42);

  const chk = eng.abilityCheck({ actorId: "pc1", skill: "athletics", difficulty: 12, tags: ["test"] });
  assert.equal(typeof chk.success, "boolean");
  assert.equal(typeof chk.rollTotal, "number");
  assert.equal(typeof chk.detail, "string");

  const dmg = eng.damageRoll("2d6+1");
  assert.equal(typeof dmg.total, "number");
  assert.ok(Array.isArray(dmg.breakdown));

  const order = eng.turnOrder(["a","b","c"]);
  assert.equal(order.length, 3);

  console.log(`OK: ${sys}`);
}
console.log("Contract: all engines passed");
