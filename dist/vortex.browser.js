/**
 * =========================================================
 * PROJECT: VORTEX SEARCH ENGINE (BROWSER VERSION)
 * AUTHOR: SETHUN THUNDER
 * DATE: 2025-11-24
 * DESCRIPTION: A Vector-Space Search Engine with NLP capabilities.
 *              Bundled for browser usage.
 * =========================================================
 */

(function(global) {

// --- 1. THE KNOWLEDGE BASE (CONSTANTS) ---
const STOP_WORDS = new Set([
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at",
    "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could",
    "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for",
    "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's",
    "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm",
    "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't",
    "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours",
    "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't",
    "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there",
    "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too",
    "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't",
    "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's",
    "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself",
    "yourselves",
    // Conversational Fillers
    "hey", "hello", "hi", "please", "tell", "say", "ask", "kindly", "ok", "okay", "alright", "thanks", "thank", "greetings"
]);

const SYNONYMS = {
    "fast": ["quick", "rapid", "speedy", "swift", "hasty", "expeditious", "brisk"],
    "quick": ["fast", "rapid", "speedy", "swift", "hasty", "prompt", "immediate"],
    "search": ["find", "lookup", "query", "seek", "explore", "investigate", "scan"],
    "find": ["search", "locate", "discover", "detect", "uncover", "spot", "identify"],
    "computer": ["pc", "laptop", "machine", "device", "workstation", "desktop", "mainframe"],
    "phone": ["mobile", "cellphone", "smartphone", "handset", "telephone", "cellular", "dialer"],
    "buy": ["purchase", "order", "get", "acquire", "procure", "obtain", "shop"],
    "best": ["top", "greatest", "finest", "supreme", "ultimate", "optimal", "prime"],
    "happy": ["joyful", "cheerful", "delighted", "content", "glad", "ecstatic", "elated"],
    "sad": ["unhappy", "sorrowful", "depressed", "gloomy", "miserable", "dejected", "downcast"],
    "big": ["large", "huge", "massive", "giant", "enormous", "immense", "colossal"],
    "small": ["tiny", "little", "miniature", "slight", "compact", "minute", "petite"],
    "good": ["excellent", "great", "fine", "wonderful", "superb", "splendid", "marvelous"],
    "bad": ["poor", "terrible", "awful", "horrible", "dreadful", "nasty", "inferior"],
    "smart": ["intelligent", "clever", "bright", "sharp", "brainy", "genius", "wise"],
    "dumb": ["stupid", "foolish", "silly", "dense", "ignorant", "slow", "unwise"],
    "hard": ["difficult", "tough", "challenging", "strenuous", "arduous", "solid", "firm"],
    "easy": ["simple", "effortless", "smooth", "basic", "clear", "manageable", "light"],
    "love": ["adore", "cherish", "treasure", "admire", "fancy", "idolize", "worship"],
    "hate": ["dislike", "detest", "loathe", "despise", "abhor", "scorn", "reject"],
    "run": ["sprint", "jog", "dash", "race", "rush", "hurry", "bolt"],
    "walk": ["stroll", "march", "hike", "trek", "wander", "roam", "step"],
    "eat": ["consume", "devour", "ingest", "swallow", "munch", "chew", "dine"],
    "drink": ["sip", "gulp", "swallow", "imbibe", "quaff", "chug", "slurp"],
    "sleep": ["rest", "doze", "nap", "snooze", "slumber", "dream", "hibernate"],
    "wake": ["arise", "awaken", "rouse", "stir", "get up", "revive", "activate"],
    "laugh": ["chuckle", "giggle", "snicker", "cackle", "roar", "smile", "grin"],
    "cry": ["weep", "sob", "wail", "whimper", "bawl", "teary", "mourn"],
    "beautiful": ["pretty", "lovely", "gorgeous", "stunning", "attractive", "handsome", "fair"],
    "ugly": ["unattractive", "hideous", "unsightly", "repulsive", "gross", "plain", "homely"],
    "new": ["fresh", "modern", "recent", "current", "novel", "original", "latest"],
    "old": ["ancient", "aged", "antique", "vintage", "elderly", "mature", "past"],
    "rich": ["wealthy", "affluent", "prosperous", "loaded", "moneyed", "flush", "opulent"],
    "poor": ["needy", "broke", "destitute", "impoverished", "penniless", "bankrupt", "lacking"],
    "strong": ["powerful", "mighty", "robust", "sturdy", "tough", "muscular", "potent"],
    "weak": ["frail", "feeble", "fragile", "delicate", "shaky", "powerless", "faint"],
    "clean": ["wash", "scrub", "purify", "sanitize", "wipe", "clear", "tidy"],
    "dirty": ["filthy", "messy", "grimy", "muddy", "polluted", "stained", "unclean"],
    "hot": ["warm", "burning", "boiling", "scorching", "scalding", "heated", "fiery"],
    "cold": ["cool", "chilly", "freezing", "icy", "frigid", "frosty", "frozen"],
    "start": ["begin", "commence", "initiate", "launch", "open", "originate", "activate"],
    "stop": ["end", "halt", "cease", "finish", "terminate", "conclude", "pause"],
    "win": ["succeed", "triumph", "prevail", "conquer", "beat", "overcome", "master"],
    "lose": ["fail", "forfeit", "drop", "misplace", "surrender", "yield", "flop"],
    "friend": ["buddy", "pal", "mate", "companion", "ally", "partner", "comrade"],
    "enemy": ["foe", "opponent", "rival", "adversary", "antagonist", "competitor", "nemesis"],
    "help": ["assist", "aid", "support", "guide", "serve", "relieve", "benefit"],
    "hurt": ["injure", "harm", "damage", "wound", "pain", "impair", "mar"],
    "give": ["provide", "offer", "donate", "grant", "supply", "present", "hand"],
    "take": ["grab", "seize", "capture", "snatch", "accept", "receive", "remove"],
    "look": ["see", "watch", "view", "observe", "gaze", "stare", "glance"],
    "listen": ["hear", "attend", "heark", "overhear", "audit", "hark", "monitor"],
    "think": ["ponder", "consider", "contemplate", "reflect", "imagine", "reason", "believe"],
    "know": ["understand", "comprehend", "realize", "recognize", "perceive", "grasp", "learn"],
    "say": ["speak", "tell", "state", "utter", "voice", "declare", "announce"],
    "ask": ["question", "inquire", "request", "demand", "interrogate", "query", "invite"],
    "answer": ["reply", "respond", "retort", "explain", "acknowledge", "feedback", "return"],
    "work": ["labor", "toil", "job", "task", "effort", "employment", "occupation"],
    "play": ["game", "sport", "fun", "recreation", "amusement", "entertainment", "hobby"],
    "learn": ["study", "educate", "train", "master", "acquire", "research", "read"],
    "teach": ["instruct", "tutor", "coach", "educate", "train", "mentor", "guide"],
    "write": ["record", "pen", "scribble", "draft", "compose", "author", "note"],
    "read": ["peruse", "scan", "review", "study", "browse", "decipher", "comprehend"],
    "create": ["make", "build", "construct", "design", "invent", "produce", "generate"],
    "destroy": ["ruin", "demolish", "wreck", "smash", "crush", "annihilate", "devastate"],
    "move": ["go", "travel", "proceed", "advance", "shift", "transport", "relocate"],
    "stay": ["remain", "wait", "linger", "dwell", "reside", "stick", "abide"],
    "change": ["alter", "modify", "transform", "adjust", "convert", "vary", "switch"],
    "keep": ["hold", "retain", "save", "preserve", "maintain", "store", "possess"],
    "show": ["display", "exhibit", "reveal", "demonstrate", "present", "expose", "unveil"],
    "hide": ["conceal", "cover", "mask", "cloak", "bury", "screen", "shroud"],
    "open": ["unlock", "unwrap", "uncover", "expand", "reveal", "access", "expose"],
    "close": ["shut", "seal", "lock", "block", "end", "finish", "secure"],
    "true": ["correct", "accurate", "right", "real", "actual", "genuine", "factual"],
    "false": ["wrong", "incorrect", "fake", "untrue", "bogus", "invalid", "erroneous"],
    "same": ["identical", "equal", "equivalent", "matching", "similar", "duplicate", "uniform"],
    "different": ["distinct", "diverse", "unlike", "varied", "separate", "unique", "contrasting"],
    "important": ["significant", "crucial", "essential", "vital", "key", "major", "critical"],
    "trivial": ["minor", "unimportant", "insignificant", "petty", "slight", "small", "worthless"],
    "safe": ["secure", "protected", "guarded", "harmless", "sheltered", "risk-free", "sound"],
    "dangerous": ["risky", "unsafe", "hazardous", "perilous", "threatening", "harmful", "deadly"],
    "quiet": ["silent", "calm", "peaceful", "still", "hushed", "mute", "soundless"],
    "loud": ["noisy", "deafening", "boisterous", "thunderous", "roaring", "blaring", "shouting"],
    "money": ["cash", "currency", "funds", "capital", "wealth", "assets", "dough"],
    "time": ["moment", "period", "duration", "epoch", "era", "interval", "span"],
    "place": ["location", "spot", "area", "region", "site", "zone", "venue"],
    "idea": ["concept", "thought", "notion", "plan", "opinion", "belief", "view"],
    "problem": ["issue", "difficulty", "trouble", "challenge", "dilemma", "conflict", "snag"],
    "solution": ["answer", "resolution", "fix", "remedy", "result", "outcome", "key"],
    "story": ["tale", "narrative", "account", "yarn", "chronicle", "legend", "report"],
    "book": ["novel", "text", "volume", "publication", "tome", "manual", "guide"],
    "music": ["song", "melody", "tune", "track", "rhythm", "harmony", "sound"],
    "art": ["creation", "design", "drawing", "painting", "sculpture", "craft", "work"],
    "game": ["match", "contest", "competition", "sport", "event", "tournament", "play"],
    "team": ["group", "squad", "crew", "unit", "club", "party", "gang"],
    "family": ["relatives", "kin", "clan", "household", "tribe", "lineage", "ancestors"],
    "house": ["home", "dwelling", "residence", "abode", "shelter", "building", "quarters"],
    "school": ["academy", "college", "institute", "university", "class", "seminary", "campus"],
    "city": ["town", "metropolis", "urban", "municipality", "capital", "burgh", "village"],
    "country": ["nation", "state", "land", "realm", "kingdom", "territory", "region"],
    "world": ["earth", "globe", "planet", "universe", "cosmos", "nature", "creation"],
    "animal": ["creature", "beast", "critter", "fauna", "pet", "wildlife", "organism"],
    "plant": ["herb", "flora", "vegetation", "shrub", "weed", "flower", "seedling"],
    "fire": ["flame", "blaze", "inferno", "spark", "heat", "combustion", "burn"],
    "water": ["liquid", "fluid", "h2o", "aqua", "rain", "stream", "ocean"],
    "air": ["oxygen", "atmosphere", "breeze", "wind", "gas", "sky", "breath"],
    "earth": ["soil", "dirt", "ground", "land", "mud", "terrain", "dust"],
    "space": ["cosmos", "void", "universe", "galaxy", "expanse", "room", "gap"],
    "light": ["bright", "shine", "glow", "beam", "ray", "illumination", "radiance"],
    "dark": ["shadow", "gloom", "dim", "black", "night", "shade", "obscure"],
    "color": ["hue", "tint", "shade", "tone", "pigment", "dye", "paint"],
    "red": ["crimson", "scarlet", "ruby", "cherry", "rose", "brick", "maroon"],
    "blue": ["azure", "cobalt", "navy", "indigo", "sapphire", "sky", "teal"],
    "green": ["emerald", "lime", "olive", "jade", "forest", "mint", "verdant"],
    "yellow": ["amber", "gold", "lemon", "citron", "cream", "blonde", "sun"],
    "black": ["ebony", "jet", "ink", "coal", "obsidian", "dark", "sable"],
    "white": ["snow", "ivory", "pearl", "chalk", "milk", "pale", "pure"],
    "shape": ["form", "figure", "outline", "structure", "profile", "mold", "pattern"],
    "circle": ["round", "ring", "loop", "sphere", "orb", "disk", "halo"],
    "square": ["box", "cube", "block", "quad", "rect", "tile", "grid"],
    "line": ["stripe", "bar", "row", "dash", "stroke", "rule", "path"],
    "point": ["dot", "spot", "mark", "speck", "tip", "end", "goal"],
    "number": ["digit", "figure", "integer", "count", "amount", "value", "sum"],
    "math": ["calc", "algebra", "logic", "sums", "arithmetic", "figures", "counting"],
    "science": ["study", "research", "biology", "physics", "chem", "tech", "knowledge"],
    "history": ["past", "events", "record", "story", "heritage", "roots", "legacy"],
    "future": ["tomorrow", "fate", "destiny", "prospect", "outlook", "later", "coming"],
    "present": ["now", "current", "today", "gift", "here", "moment", "instant"],
    "body": ["frame", "form", "figure", "physique", "anatomy", "build", "flesh"],
    "head": ["mind", "skull", "brain", "top", "chief", "leader", "boss"],
    "hand": ["palm", "fist", "grip", "paw", "mitt", "help", "aid"],
    "foot": ["paw", "hoof", "step", "base", "bottom", "walk", "tread"],
    "eye": ["optic", "peeper", "sight", "vision", "look", "watch", "view"],
    "ear": ["hearing", "lobe", "sound", "listen", "audit", "heark", "sense"],
    "mouth": ["lips", "jaw", "voice", "speech", "talk", "taste", "grin"],
    "nose": ["snout", "beak", "smell", "scent", "sniff", "whiff", "proboscis"],
    "hair": ["locks", "mane", "strands", "fur", "tress", "curls", "wigs"],
    "clothes": ["gear", "attire", "dress", "outfit", "garb", "wear", "suit"],
    "shoe": ["boot", "sneaker", "footwear", "sandal", "kick", "pump", "heel"],
    "hat": ["cap", "lid", "bonnet", "helm", "crown", "hood", "beanie"],
    "bag": ["sack", "pack", "tote", "pouch", "case", "luggage", "purse"],
    "tool": ["gadget", "device", "gear", "kit", "rig", "utensil", "implement"],
    "car": ["auto", "vehicle", "ride", "motor", "wheels", "sedan", "truck"],
    "bus": ["coach", "shuttle", "transport", "transit", "van", "carrier", "liner"],
    "train": ["rail", "metro", "subway", "tram", "loco", "tube", "express"],
    "plane": ["jet", "flight", "aircraft", "craft", "air", "flyer", "glider"],
    "ship": ["boat", "vessel", "ferry", "yacht", "liner", "craft", "barge"],
    "road": ["street", "way", "path", "route", "lane", "highway", "track"],
    "map": ["chart", "plan", "guide", "plot", "atlas", "sketch", "grid"],
    "flag": ["banner", "ensign", "standard", "colors", "pennant", "sign", "signal"],
    "sign": ["mark", "token", "symbol", "clue", "hint", "signal", "omen"],
    "name": ["label", "title", "tag", "term", "handle", "call", "brand"],
    "word": ["term", "text", "phrase", "note", "chat", "voice", "speech"],
    "letter": ["mail", "note", "char", "symbol", "sign", "memo", "message"],
    "paper": ["sheet", "page", "doc", "file", "scroll", "card", "print"],
    "pen": ["biro", "marker", "quill", "stylus", "writer", "ink", "stick"],
    "desk": ["table", "bench", "counter", "stand", "bureau", "worktop", "station"],
    "chair": ["seat", "stool", "bench", "throne", "sofa", "perch", "recliner"],
    "room": ["space", "hall", "chamber", "area", "spot", "den", "zone"],
    "door": ["gate", "entry", "exit", "portal", "way", "hatch", "opening"],
    "window": ["glass", "pane", "opening", "view", "screen", "sight", "outlook"],
    "wall": ["barrier", "fence", "side", "partition", "block", "brick", "panel"],
    "floor": ["ground", "deck", "level", "base", "bottom", "stage", "mat"],
    "roof": ["top", "cover", "canopy", "ceiling", "dome", "shelter", "peak"],
    "garden": ["yard", "lawn", "park", "patch", "plot", "field", "green"],
    "park": ["garden", "green", "ground", "field", "lot", "reserve", "common"],
    "shop": ["store", "mart", "market", "stall", "outlet", "boutique", "stand"],
    "market": ["bazaar", "mart", "f fair", "trade", "exchange", "shop", "sale"],
    "bank": ["vault", "fund", "reserve", "store", "treasury", "safe", "coffer"],
    "hospital": ["clinic", "ward", "infirmary", "center", "er", "care", "med"],
    "doctor": ["medic", "physician", "doc", "surgeon", "healer", "vet", "specialist"],
    "nurse": ["medic", "aide", "carer", "attendant", "helper", "sister", "matron"],
    "police": ["cops", "law", "force", "guard", "officer", "patrol", "badge"],
    "fireman": ["fighter", "saver", "hero", "crew", "rescue", "chief", "brigade"],
    "teacher": ["tutor", "coach", "guide", "mentor", "prof", "master", "trainer"],
    "student": ["pupil", "learner", "scholar", "trainee", "novice", "kid", "junior"],
    "parent": ["guardian", "father", "mother", "folks", "kin", "elder", "ancestor"],
    "child": ["kid", "youth", "tot", "baby", "junior", "minor", "offspring"],
    "baby": ["infant", "tot", "newborn", "babe", "child", "tiny", "little"],
    "man": ["guy", "male", "gent", "fellow", "chap", "dude", "bloke"],
    "woman": ["lady", "female", "girl", "dame", "miss", "madam", "gal"],
    "boy": ["lad", "youth", "kid", "son", "junior", "chap", "youngster"],
    "girl": ["lass", "miss", "maid", "daughter", "lady", "femme", "sis"],
    "king": ["ruler", "monarch", "lord", "chief", "crown", "royal", "sire"],
    "queen": ["ruler", "royal", "lady", "monarch", "crown", "sovereign", "matriarch"],
    "prince": ["royal", "heir", "son", "noble", "lord", "youth", "lad"],
    "princess": ["royal", "lady", "heir", "noble", "girl", "daughter", "dame"],
    "castle": ["fort", "palace", "keep", "tower", "citadel", "hall", "manor"],
    "magic": ["spell", "charm", "trick", "witchery", "power", "wizardry", "mystic"],
    "ghost": ["spirit", "soul", "spook", "shade", "phantom", "wraith", "specter"],
    "monster": ["beast", "fiend", "creature", "brute", "demon", "freak", "giant"],
    "alien": ["stranger", "foreigner", "martian", "visitor", "outsider", "unknown", "being"],
    "robot": ["bot", "machine", "android", "cyborg", "mech", "automaton", "drone"],
    "hero": ["champ", "star", "idol", "saver", "legend", "victor", "leader"],
    "villain": ["bad guy", "fiend", "criminal", "foe", "enemy", "crook", "rogue"],
    "war": ["fight", "battle", "conflict", "combat", "strife", "clash", "attack"],
    "peace": ["calm", "quiet", "rest", "truce", "harmony", "order", "silence"],
    "freedom": ["liberty", "rights", "release", "relief", "choice", "free", "power"],
    "justice": ["law", "right", "fairness", "truth", "honor", "equity", "rule"],
    "hope": ["wish", "dream", "faith", "trust", "desire", "goal", "belief"],
    // Conversational & Action Verbs
    "fix": ["repair", "mend", "solve", "restore", "patch", "correct"],
    "make": ["create", "build", "construct", "produce", "generate", "form"],
    "get": ["acquire", "obtain", "fetch", "buy", "receive", "gain"],
    "show": ["display", "reveal", "present", "demonstrate", "exhibit", "uncover"],
    // Finance Domain
    "finance": ["financial", "economy", "money", "fiscal", "monetary", "capital", "investment"]
};

// --- STYLING HELPERS ---
const STYLES = {
    search: "color: #00bcd4; font-weight: bold;",
    info: "color: #2196f3;",
    success: "color: #4caf50; font-weight: bold;",
    warning: "color: #ff9800; font-weight: bold;",
    error: "color: #f44336; font-weight: bold;",
    highlight: "color: #e91e63;",
    dim: "color: #9e9e9e;"
};

// --- 2. NLP PROCESSOR CLASS ---
class NLPProcessor {
  constructor() {
    this.suffixes = {
      ational: "ate", tional: "tion", enci: "ence", anci: "ance", izer: "ize", bli: "ble", alli: "al",
      entli: "ent", eli: "e", ousli: "ous", ization: "ize", ation: "ate", ator: "ate", alism: "al",
      iveness: "ive", fulness: "ful", ousness: "ous", aliti: "al", iviti: "ive", biliti: "ble", logi: "log",
      ing: "", ed: "", es: "", s: "", ly: "",
    };
  }

  clean(text) {
    return text.toLowerCase()
      .replace(/[-_]/g, " ")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  stem(word) {
    if (word.length < 3) return word;
    for (const [suffix, replacement] of Object.entries(this.suffixes)) {
      if (word.endsWith(suffix)) {
        return word.slice(0, -suffix.length) + replacement;
      }
    }
    return word;
  }

  generateNgrams(tokens, n) {
    if (tokens.length < n) return [];
    const ngrams = [];
    for (let i = 0; i <= tokens.length - n; i++) {
      ngrams.push(tokens.slice(i, i + n).join(" "));
    }
    return ngrams;
  }

  tokenize(text) {
    const cleanText = this.clean(text);
    const rawTokens = cleanText.split(" ");
    const filteredTokens = rawTokens
      .filter((t) => t && !STOP_WORDS.has(t))
      .map((t) => this.stem(t));
    const bigrams = this.generateNgrams(filteredTokens, 2);
    return [...filteredTokens, ...bigrams];
  }

  expandQuery(tokens) {
    const expanded = new Set(tokens);
    tokens.forEach((token) => {
      if (SYNONYMS[token]) {
        SYNONYMS[token].forEach((syn) => expanded.add(this.stem(syn)));
      }
    });
    return Array.from(expanded);
  }

  levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
    for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) == a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
        }
      }
    }
    return matrix[b.length][a.length];
  }

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
    if (minDistance <= 2) return bestMatch;
    return null;
  }
}

// --- 3. BM25 RANKING MODEL ---
class BM25Model {
  constructor(k1 = 1.5, b = 0.75) {
    this.k1 = k1;
    this.b = b;
    this.docFreqs = new Map();
    this.docLengths = new Map();
    this.totalDocs = 0;
    this.totalDocLen = 0;
    this.avgDocLen = 0;
    this.vocab = new Set();
  }

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

  computeIDF(term) {
    const nq = this.docFreqs.get(term) || 0;
    return Math.log((this.totalDocs - nq + 0.5) / (nq + 0.5) + 1);
  }

  score(term, docId, docTokens) {
    const tf = docTokens.filter((t) => t === term).length;
    if (tf === 0) return 0;
    const docLen = this.docLengths.get(docId);
    const idf = this.computeIDF(term);
    const numerator = tf * (this.k1 + 1);
    const denominator = tf + this.k1 * (1 - this.b + this.b * (docLen / this.avgDocLen));
    return idf * (numerator / denominator);
  }
}

// --- 4. THE ENGINE CORE ---
class VortexEngine {
  constructor(options = { logging: true }) {
    this.nlp = new NLPProcessor();
    this.model = new BM25Model();
    this.documents = [];
    this.index = new Map();
    this.logging = options.logging !== undefined ? options.logging : true;
  }

  addDocument(id, title, content) {
    const fullText = `${title} ${title} ${title} ${content}`;
    const tokens = this.nlp.tokenize(fullText);
    this.documents.push({ id, title, content, tokens });
    this.model.train(id, tokens);
    const uniqueTokens = new Set(tokens);
    uniqueTokens.forEach((token) => {
      if (!this.index.has(token)) {
        this.index.set(token, []);
      }
      this.index.get(token).push(this.documents.length - 1);
    });
  }

  search(query) {
    if (this.logging) console.log(`%c[VORTEX | Search] %cProcessing Query: "${query}"`, STYLES.search, "color: inherit");
    let queryTokens = this.nlp.tokenize(query);
    queryTokens = queryTokens.map((token) => {
      if (this.index.has(token)) return token;
      const closest = this.nlp.findClosestWord(token, this.model.vocab);
      if (closest) {
          if (this.logging) console.log(`%c[VORTEX | Auto-Correct] %cDid you mean: "${closest}"?`, STYLES.highlight, "color: inherit");
      }
      return closest || token;
    });

    if (queryTokens.length === 0) return [];

    const originalLength = queryTokens.length;
    queryTokens = this.nlp.expandQuery(queryTokens);
    
    if (queryTokens.length > originalLength) {
        if (this.logging) console.log(`%c[VORTEX | Expansion] %cExpanded Query: [${queryTokens.join(", ")}]`, STYLES.success, "color: inherit");
    }

    const scores = new Map();
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

    return Array.from(scores.entries())
      .map(([docIdx, score]) => ({ ...this.documents[docIdx], score }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  // Persistence removed for browser version (requires FS)
  save(filepath) { if (this.logging) console.warn("%c[VORTEX | Warning] %cSave not supported in browser version.", STYLES.warning, "color: inherit"); }
  load(filepath) { if (this.logging) console.warn("%c[VORTEX | Warning] %cLoad not supported in browser version.", STYLES.warning, "color: inherit"); }
}

// Expose to window
global.VortexEngine = VortexEngine;

})(window);
