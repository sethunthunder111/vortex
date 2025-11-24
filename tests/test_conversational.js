const { VortexEngine } = require("../index");

const engine = new VortexEngine();

console.log("--- Adding Documents ---");
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
engine.addDocument(
  "doc3",
  "Fixing Things",
  "How to repair and mend broken items."
);
engine.addDocument(
  "doc4",
  "Financial Advice",
  "Save money and invest in the economy."
);
engine.addDocument("doc5", "Shopping", "Buy a new phone and get a good deal.");

console.log("\n--- Test 1: Conversational Fillers ---");
// Should ignore "Hey", "Laybon", "please" and find "Fast Cars" or "Speedy Computers"
const results1 = engine.search("Hey Laybon please find fast cars");
console.log(results1);

console.log("\n--- Test 2: Question Handling (Synonyms) ---");
// "fix" should expand to "repair", matching doc3
const results2 = engine.search("How do I fix a computer?");
console.log(results2);

console.log("\n--- Test 3: Natural Language Statements ---");
// "buy" -> "purchase", "phone" -> "mobile" (if in synonyms), matching doc5
const results3 = engine.search("I want to buy a new phone");
console.log(results3);

console.log("\n--- Test 4: Finance Domain ---");
// "finance" -> "financial", "money", matching doc4
const results4 = engine.search("Tell me about finance");
console.log(results4);
