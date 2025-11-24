const { VortexEngine } = require("../index");

const engine = new VortexEngine();

engine.addDocument(
  "doc1",
  "Fast Cars",
  "The quick brown fox jumps over the lazy dog."
);
engine.addDocument(
  "doc2",
  "Speedy Computers",
  "My laptop is very fast and rapid."
);

const results = engine.search("fast");
console.log(JSON.stringify(results, null, 2));
