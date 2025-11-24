const { VortexEngine } = require("../index");
const fs = require("fs");

const engine = new VortexEngine();
const INDEX_FILE = "test_index.json";

console.log("--- Adding Documents ---");
// Doc 1: Title has "Apple"
engine.addDocument("doc1", "Apple", "A red fruit that keeps the doctor away.");
// Doc 2: Content has "Apple"
engine.addDocument("doc2", "Banana", "A yellow fruit. Apple is also a fruit.");
engine.addDocument("doc3", "Finance Advice", "Save money and invest wisely.");
engine.addDocument("doc4", "Computer Repair", "How to fix your broken pc.");

console.log("\n--- Test 1: Fuzzy Search (Typos) ---");
// "fiannce" -> "finance" -> "Financial Advice"
const results1 = engine.search("fiannce");
console.log(
  "Query: 'fiannce'",
  results1.length > 0 ? "✅ Found" : "❌ Not Found"
);
if (results1.length > 0) console.log(`   Matched: ${results1[0].title}`);

// "cmoputer" -> "computer" -> "Computer Repair"
const results2 = engine.search("cmoputer");
console.log(
  "Query: 'cmoputer'",
  results2.length > 0 ? "✅ Found" : "❌ Not Found"
);
if (results2.length > 0) console.log(`   Matched: ${results2[0].title}`);

console.log("\n--- Test 2: Title Boosting ---");
const results3 = engine.search("apple");
console.log("Query: 'apple'");
results3.forEach((r) =>
  console.log(`   ${r.id} (${r.title}): Score ${r.score}`)
);
// Expect doc1 (Title="Apple") to have significantly higher score than doc2

console.log("\n--- Test 3: Persistence (Save & Load) ---");
engine.save(INDEX_FILE);

console.log("   Creating new engine instance...");
const newEngine = new VortexEngine();
newEngine.load(INDEX_FILE);

const results4 = newEngine.search("finance");
console.log(
  "Query: 'finance' on NEW engine",
  results4.length > 0 ? "✅ Found" : "❌ Not Found"
);

// Cleanup
if (fs.existsSync(INDEX_FILE)) {
  fs.unlinkSync(INDEX_FILE);
  console.log("\n🧹 Cleaned up test index file.");
}
