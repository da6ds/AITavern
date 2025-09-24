import { makeEngine } from "../shared/rules/index.ts";
for (const name of ["dnd5e","pbta"] as const) {
  const eng = makeEngine(name);
  eng.initSession(42);
  console.time(`${name} abilityCheck x10000`);
  for (let i=0;i<10000;i++) eng.abilityCheck({ actorId: "pc1", skill: "athletics", difficulty: 12 });
  console.timeEnd(`${name} abilityCheck x10000`);
}
