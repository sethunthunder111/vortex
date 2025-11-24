// Mock window object
global.window = {};

// Load the browser script
require("../dist/vortex.browser.js");

// Check if VortexEngine is attached to window
if (typeof window.VortexEngine === "function") {
  console.log(
    "✅ VortexEngine loaded successfully in mock browser environment."
  );

  // Test instantiation
  const engine = new window.VortexEngine();
  engine.addDocument("1", "Test", "This is a test.");
  const results = engine.search("test");

  if (results.length > 0) {
    console.log("✅ Search functionality verified.");
  } else {
    console.error("❌ Search functionality failed.");
  }
} else {
  console.error("❌ VortexEngine not found on window object.");
}
