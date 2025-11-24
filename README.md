# 🌪️ Vortex Search Engine

> A powerful, lightweight, persistent vector-space search engine with NLP capabilities.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Vortex** is a pure JavaScript search engine designed for speed and flexibility. It features BM25 ranking, fuzzy search (typo tolerance), synonym expansion, and persistence.

## Features 🚀

-   **BM25 Ranking**: State-of-the-art probabilistic ranking (better than TF-IDF).
-   **Fuzzy Search**: Auto-corrects typos (e.g., "cmoputer" -> "computer").
-   **Conversational NLP**: Ignores filler words ("hey", "please") and handles natural language questions.
-   **Synonym Expansion**: Automatically expands terms (e.g., "fix" -> "repair").
-   **Persistence**: Save and load your search index to JSON.
-   **Zero Dependencies**: Pure Node.js.

## Installation 📦

```bash
npm install vortex-search-engine
```

Or use the browser bundle via CDN (or download from `dist/`):

```html
<script src="dist/vortex.browser.js"></script>
```

## Usage 🛠️

### Node.js

```javascript
const { VortexEngine } = require("vortex-search-engine");
const engine = new VortexEngine();
```

### Browser

```html
<script src="dist/vortex.browser.js"></script>
<script>
    const engine = new VortexEngine();
</script>
```

### Advanced Features

#### Fuzzy Search & Typos
Vortex automatically detects and corrects typos.

```javascript
// User types "fiannce" -> Matches "Finance"
const results = engine.search("fiannce");
```

#### Persistence (Save/Load)
Save your index to disk so you don't have to re-index every time.

```javascript
// Save
engine.save("search_index.json");

// Load
const newEngine = new VortexEngine();
newEngine.load("search_index.json");
```

## API Reference 📚

### `addDocument(id, title, content)`
Adds a document to the index.
-   `id`: Unique identifier for the document.
-   `title`: Document title (boosted in search).
-   `content`: The main text content.

### `search(query)`
Searches for the query string. Returns an array of results sorted by relevance score.

### `save(filepath)`
Saves the current engine state (index, documents, model) to a JSON file.

### `load(filepath)`
Loads the engine state from a JSON file.

## License 📄

MIT © [Sethun Thunder](https://github.com/SethunThunder)
