/**
 * =========================================================
 * PROJECT: VORTEX SEARCH ENGINE (CORE v2 - NLP ENHANCED)
 * AUTHOR: SETHUN THUNDER
 * DATE: 2025-11-24
 * DESCRIPTION: A Vector-Space Search Engine with NLP capabilities,
 *              BM25 ranking, Bigram support, and Synonym expansion.
 * =========================================================
 */

// --- 1. THE KNOWLEDGE BASE (CONSTANTS) ---
const { STOP_WORDS } = require("./knowledgeBase/STOP_WORDS");
const { SYNONYMS } = require("./knowledgeBase/SYNONYM_DICTIONARY");
const fs = require('fs');
const chalk = require('chalk');

// Styling Constants
const STYLES = {
  search: chalk.bold.cyan,
  info: chalk.blue,
  success: chalk.bold.green,
  warning: chalk.bold.yellow,
  error: chalk.bold.red,
  highlight: chalk.magenta,
  dim: chalk.gray
};

const LOG_PREFIX = {
  SEARCH: STYLES.search('[VORTEX | Search]'),
  SYSTEM: STYLES.info('[VORTEX | System]'),
  IO: STYLES.info('[VORTEX | IO]'),
  WARN: STYLES.warning('[VORTEX | Warning]'),
  ERROR: STYLES.error('[VORTEX | Error]')
};

// --- 2. NLP PROCESSOR CLASS ---
// This class handles the cleaning, stemming, tokenization, and n-grams.
class NLPProcessor {
  constructor() {
    // A very basic rule-based stemmer (simulating Porter Stemmer logic)
    this.suffixes = {
      ational: "ate",
      tional: "tion",
      enci: "ence",
      anci: "ance",
      izer: "ize",
      bli: "ble",
      alli: "al",
      entli: "ent",
      eli: "e",
      ousli: "ous",
      ization: "ize",
      ation: "ate",
      ator: "ate",
      alism: "al",
      iveness: "ive",
      fulness: "ful",
      ousness: "ous",
      aliti: "al",
      iviti: "ive",
      biliti: "ble",
      logi: "log",
      ing: "",
      ed: "",
      es: "",
      s: "",
      ly: "",
    };
  }

  /**
   * Cleans text: lowercases, handles punctuation, collapses spaces.
   */
  clean(text) {
    return text
      .toLowerCase()
      .replace(/[-_]/g, " ") // Replace dashes/underscores with space
      .replace(/[^a-z0-9\s]/g, "") // Remove special chars
      .replace(/\s+/g, " ") // Collapse multiple spaces
      .trim();
  }

  /**
   * The "Smart" Stemmer. Reduces words to their root.
   */
  stem(word) {
    if (word.length < 3) return word;

    for (const [suffix, replacement] of Object.entries(this.suffixes)) {
      if (word.endsWith(suffix)) {
        return word.slice(0, -suffix.length) + replacement;
      }
    }
    return word;
  }

  /**
   * Generate N-grams (phrases of N words)
   */
  generateNgrams(tokens, n) {
    if (tokens.length < n) return [];
    const ngrams = [];
    for (let i = 0; i <= tokens.length - n; i++) {
      ngrams.push(tokens.slice(i, i + n).join(" "));
    }
    return ngrams;
  }

  /**
   * Converts a sentence into a clean list of meaningful tokens (words + bigrams).
   */
  tokenize(text) {
    const cleanText = this.clean(text);
    const rawTokens = cleanText.split(" ");

    const filteredTokens = rawTokens
      .filter((t) => t && !STOP_WORDS.has(t)) // Remove garbage & stop words
      .map((t) => this.stem(t)); // Stem the words

    // Generate Bigrams (2-word phrases)
    const bigrams = this.generateNgrams(filteredTokens, 2);

    // Return combined list
    return [...filteredTokens, ...bigrams];
  }

  /**
   * Expands query tokens with synonyms.
   */
  expandQuery(tokens) {
    const expanded = new Set(tokens);
    tokens.forEach((token) => {
      if (SYNONYMS[token]) {
        SYNONYMS[token].forEach((syn) => expanded.add(this.stem(syn)));
      }
    });
    return Array.from(expanded);
  }

  /**
   * Calculates Levenshtein Distance between two strings.
   * (Edit distance: insertions, deletions, substitutions)
   */
  levenshtein(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) == a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            Math.min(
              matrix[i][j - 1] + 1, // insertion
              matrix[i - 1][j] + 1 // deletion
            )
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Finds the closest word in the vocabulary to the given word.
   */
  findClosestWord(word, vocab) {
    let bestMatch = null;
    let minDistance = Infinity;

    vocab.forEach((vocabWord) => {
      const distance = this.levenshtein(word, vocabWord);
      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = vocabWord;
      }
    });

    // Only return if it's a reasonably close match (e.g., distance <= 2)
    if (minDistance <= 2) {
      return bestMatch;
    }
    return null;
  }
}

// --- 3. BM25 RANKING MODEL (THE STATE-OF-THE-ART BRAIN) ---
// Improved probabilistic model over TF-IDF.
class BM25Model {
  constructor(k1 = 1.5, b = 0.75) {
    this.k1 = k1; // Term saturation parameter
    this.b = b; // Length normalization parameter
    this.docFreqs = new Map(); // How many docs contain word X
    this.docLengths = new Map(); // Length of each doc
    this.totalDocs = 0;
    this.totalDocLen = 0;
    this.avgDocLen = 0;
    this.vocab = new Set();
  }

  /**
   * Learn from a document. Updates global stats.
   */
  train(docId, tokens) {
    const uniqueTokens = new Set(tokens);
    this.totalDocs++;
    this.docLengths.set(docId, tokens.length);
    this.totalDocLen += tokens.length;
    this.avgDocLen = this.totalDocLen / this.totalDocs;

    uniqueTokens.forEach((token) => {
      this.vocab.add(token);
      this.docFreqs.set(token, (this.docFreqs.get(token) || 0) + 1);
    });
  }

  /**
   * Calculate Inverse Document Frequency (IDF) for BM25
   */
  computeIDF(term) {
    const nq = this.docFreqs.get(term) || 0;
    // Standard BM25 IDF formula
    return Math.log((this.totalDocs - nq + 0.5) / (nq + 0.5) + 1);
  }

  /**
   * Score a document against a query term using BM25 formula
   */
  score(term, docId, docTokens) {
    const tf = docTokens.filter((t) => t === term).length;
    if (tf === 0) return 0;

    const docLen = this.docLengths.get(docId);
    const idf = this.computeIDF(term);

    const numerator = tf * (this.k1 + 1);
    const denominator =
      tf + this.k1 * (1 - this.b + this.b * (docLen / this.avgDocLen));

    return idf * (numerator / denominator);
  }
}

// --- 4. THE ENGINE CORE (INDEXER & RANKER) ---
class VortexEngine {
  constructor(options = { logging: true }) {
    this.nlp = new NLPProcessor();
    this.model = new BM25Model();
    this.documents = []; // Stores raw content + tokens
    this.index = new Map(); // Inverted Index
    this.logging = options.logging !== undefined ? options.logging : true;
  }

  /**
   * Add a page/document to the engine.
   */
  addDocument(id, title, content) {
    // Title Boosting: Repeat title 3 times to increase term frequency
    const fullText = `${title} ${title} ${title} ${content}`;
    const tokens = this.nlp.tokenize(fullText);

    // Store doc
    this.documents.push({ id, title, content, tokens });

    // Update Math Model
    this.model.train(id, tokens);

    // Update Inverted Index
    const uniqueTokens = new Set(tokens);
    uniqueTokens.forEach((token) => {
      if (!this.index.has(token)) {
        this.index.set(token, []);
      }
      this.index.get(token).push(this.documents.length - 1); // Store index
    });
  }

  /**
   * THE SEARCH FUNCTION
   */
  search(query) {
    if (this.logging) console.log(`\n${LOG_PREFIX.SEARCH} Processing Query: "${chalk.bold.white(query)}"`);
    let queryTokens = this.nlp.tokenize(query);

    // Fuzzy Search: Check for typos
    queryTokens = queryTokens.map((token) => {
      if (this.index.has(token)) return token; // Known token

      // Unknown token, try to find a close match
      const closest = this.nlp.findClosestWord(token, this.model.vocab);
      if (closest) {
        if (this.logging) console.log(`   ${STYLES.highlight('💡 Did you mean:')} "${chalk.bold(closest)}"? ${STYLES.dim(`(Auto-corrected from "${token}")`)}`);
        return closest;
      }
      return token;
    });

    if (queryTokens.length === 0) {
      return `${LOG_PREFIX.WARN} Please enter a valid search term.`;
    }

    // Expand query with synonyms
    const originalLength = queryTokens.length;
    queryTokens = this.nlp.expandQuery(queryTokens);
    if (queryTokens.length > originalLength) {
      if (this.logging) console.log(`   ${STYLES.success('✨ Expanded Query:')} [${queryTokens.map(t => chalk.italic(t)).join(", ")}]`);
    }

    // Score documents
    const scores = new Map();

    // Optimization: Only check documents that contain at least one query term
    const relevantDocIndices = new Set();
    queryTokens.forEach((term) => {
      const indices = this.index.get(term) || [];
      indices.forEach((idx) => relevantDocIndices.add(idx));
    });

    relevantDocIndices.forEach((docIdx) => {
      const doc = this.documents[docIdx];
      let score = 0;
      queryTokens.forEach((term) => {
        score += this.model.score(term, doc.id, doc.tokens);
      });
      scores.set(docIdx, score);
    });

    // Sort by score (Highest first) & Filter
    const finalResults = Array.from(scores.entries())
      .map(([docIdx, score]) => ({ ...this.documents[docIdx], score }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);

    return finalResults;
  }

  /**
   * Save the engine state to a JSON file.
   */
  save(filepath) {
    const data = {
      documents: this.documents,
      index: Array.from(this.index.entries()), // Map to Array
      model: {
        k1: this.model.k1,
        b: this.model.b,
        docFreqs: Array.from(this.model.docFreqs.entries()), // Map to Array
        docLengths: Array.from(this.model.docLengths.entries()), // Map to Array
        totalDocs: this.model.totalDocs,
        totalDocLen: this.model.totalDocLen,
        avgDocLen: this.model.avgDocLen,
        vocab: Array.from(this.model.vocab), // Set to Array
      },
    };
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    if (this.logging) console.log(`\n${LOG_PREFIX.IO} Engine saved to ${chalk.underline(filepath)}`);
  }

  /**
   * Load the engine state from a JSON file.
   */
  load(filepath) {
    if (!fs.existsSync(filepath)) {
      if (this.logging) console.log(`\n${LOG_PREFIX.WARN} No saved index found at ${chalk.underline(filepath)}`);
      return;
    }

    const data = JSON.parse(fs.readFileSync(filepath, "utf-8"));

    this.documents = data.documents;
    this.index = new Map(data.index); // Array to Map

    // Restore BM25 Model
    this.model.k1 = data.model.k1;
    this.model.b = data.model.b;
    this.model.docFreqs = new Map(data.model.docFreqs); // Array to Map
    this.model.docLengths = new Map(data.model.docLengths); // Array to Map
    this.model.totalDocs = data.model.totalDocs;
    this.model.totalDocLen = data.model.totalDocLen;
    this.model.avgDocLen = data.model.avgDocLen;
    this.model.vocab = new Set(data.model.vocab); // Array to Set

    if (this.logging) console.log(`\n${LOG_PREFIX.IO} Engine loaded from ${chalk.underline(filepath)}`);
  }
}

// Export for usage
if (typeof module !== "undefined") {
  module.exports = { VortexEngine, NLPProcessor, BM25Model };
}
