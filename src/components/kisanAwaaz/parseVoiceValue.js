/**
 * parseVoiceValue.js
 * ------------------
 * Isolated utility functions that convert raw spoken transcript text into
 * structured field values for the Kisan Awaaz voice form assistant.
 *
 * Rules:
 *  - Pure functions only. No React. No imports. No side-effects.
 *  - If confidence is low, functions return null so the overlay can show
 *    the raw transcript and ask for user confirmation (never silent guessing).
 *  - Each function receives (text: string, lang?: 'en'|'hi'|'mr') and returns
 *    a typed result or null.
 */

/* ─── Number word maps ─── */
const HINDI_WORDS = {
  ek: 1, do: 2, teen: 3, char: 4, chaar: 4, paanch: 5, paach: 5,
  chhe: 6, chha: 6, saat: 7, sat: 7, aath: 8, nau: 9, nav: 9,
  das: 10, daha: 10, gyarah: 11, barah: 12, bara: 12,
  tera: 13, terh: 13, chaudah: 14, chaudha: 14, pandrah: 15, pandhra: 15,
  solah: 16, sola: 16, satrah: 17, satara: 17, atharah: 18, athara: 18,
  unnis: 19, ekunnis: 19, bees: 20, vis: 20,
  tees: 30, tis: 30, chalees: 40, chalis: 40, chalish: 40,
  pachaas: 50, pennas: 50, saath: 60, sathth: 60,
  sattar: 70, settar: 70, assi: 80, aasi: 80,
  nabbe: 90, navad: 90, navvad: 90,
  sau: 100, sava: 125, dhai: 250,
  hazaar: 1000, hajar: 1000, lakh: 100000,
};

/* Marathi overlaps heavily with Hindi; add Marathi-specific spellings */
const MARATHI_WORDS = {
  ...HINDI_WORDS,
  ek: 1, don: 2, tin: 3, char: 4, panch: 5,
  saha: 6, saat: 7, aath: 8, nava: 9, daha: 10,
  akra: 11, bara: 12, tera: 13, chaudha: 14, pandhra: 15,
  sola: 16, satara: 17, athara: 18, ekunnis: 19, vees: 20, vis: 20,
  tis: 30, chalees: 40, pannas: 50, saath: 60,
  sattar: 70, ashi: 80, navvad: 90, shahar: 100, hazar: 1000,
};

/* ─── Unit synonyms ─── */
const UNIT_MAP = {
  quintal: ['quintal', 'quintals', 'kuintal', 'kuntal', 'क्विंटल', 'kvinthal', 'kvinthal'],
  kg: ['kg', 'kilo', 'kilograms', 'kilogram', 'किलो', 'kilo gram'],
  ton: ['ton', 'tonne', 'tonnes', 'tons', 'टन', 'metric ton'],
  bag: ['bag', 'bags', 'bora', 'boras', 'बोरा', 'bori'],
};

/* ─── Crop name aliases ─── */
// For CreateLotModal — values must match existing <option> values exactly
export const LOT_CROP_ALIASES = {
  'Onion (कांदा / Red Onion)':  ['onion', 'pyaaz', 'pyaz', 'kanda', 'kaanda', 'पियाज', 'कांदा'],
  'Soybean (सोयाबीन)':          ['soybean', 'soya', 'soyabin', 'soyabean', 'सोयाबीन', 'soybeen'],
  'Cotton (कापूस / कपास)':      ['cotton', 'kapas', 'kapoos', 'kaapaas', 'कपास', 'कापूस'],
  'Wheat (गहू - Sharbati)':     ['wheat', 'gehu', 'gehun', 'gahu', 'गेहूं', 'गहू', 'sharbati'],
  'Tomato (टोमॅटो)':            ['tomato', 'tamatar', 'टमाटर', 'टोमॅटो', 'tomate'],
};

// For BuyerDashboard Post Requirement — shorter values
export const REQ_CROP_ALIASES = {
  Onion:   ['onion', 'pyaaz', 'pyaz', 'kanda', 'kaanda', 'कांदा', 'प्याज'],
  Soybean: ['soybean', 'soya', 'soyabin', 'सोयाबीन'],
  Wheat:   ['wheat', 'gehu', 'gehun', 'gahu', 'गेहूं', 'गहू'],
  Cotton:  ['cotton', 'kapas', 'kapoos', 'कपास', 'कापूस'],
};

/* ─── Grade aliases ─── */
const GRADE_ALIASES = {
  'Grade A (Export Quality 55mm+)': ['grade a', 'a grade', 'export', 'best', 'premium', 'ek', 'pehla', 'pahila'],
  'Grade B (FAQ / Good Domestic)':  ['grade b', 'b grade', 'good', 'domestic', 'do', 'doosra', 'dusra'],
  'Grade C (Local Processing)':     ['grade c', 'c grade', 'local', 'processing', 'teen', 'tisra', 'teesra'],
};

/* ─── Grievance category aliases ─── */
const GRIEVANCE_FARMER_ALIASES = {
  'Payment Delay':              ['payment', 'paise', 'paisa', 'payment delay', 'bhugan'],
  'Quality Grading Disagreement': ['quality', 'grading', 'grade', 'gunvatta'],
  'Weighment Discrepancy':      ['weight', 'weighment', 'tol', 'tarazu', 'wazan'],
  'Transporter No-Show':        ['transport', 'truck', 'driver', 'gaadi', 'gadi'],
};

const GRIEVANCE_BUYER_ALIASES = {
  'Quality / Moisture Variance':         ['quality', 'moisture', 'aardrta', 'nam', 'gunvatta'],
  'Weighbridge / Quantity Shortage':     ['weight', 'quantity', 'tol', 'matra', 'shortage'],
  'Delivery Delay (>48h after dispatch)':['delivery', 'late', 'vilambh', 'der', 'dispatch'],
  'Transporter Delayed / Goods Damaged': ['transport', 'damage', 'nuksan', 'truck'],
  'Escrow Refund / Cancellation Request':['refund', 'cancel', 'wapas', 'escrow'],
};

/* ═══════════════════════════════════════════════════════════════
   EXPORTED PARSING FUNCTIONS
═══════════════════════════════════════════════════════════════ */

/**
 * parseYesNo — Detects a yes or no confirmation from spoken text.
 * @returns true | false | null (null = unclear, ask again)
 */
export function parseYesNo(text, _lang = 'hi') {
  if (!text) return null;
  const t = text.toLowerCase().trim();

  const YES = ['yes', 'haan', 'han', 'ha', 'haa', 'ho', 'bilkul', 'theek hai', 'sahi hai',
               'sahi', 'okay', 'ok', 'correct', 'right', 'hoye', 'hoy', 'ji', 'ji haan',
               'haan ji', 'ek dum', 'ekdum', 'हाँ', 'हां', 'जी', 'बिल्कुल', 'हाँजी'];
  const NO  = ['no', 'nahi', 'nahin', 'na', 'naa', 'nahi', 'galat', 'galt', 'wrong',
               'incorrect', 'नहीं', 'नाही', 'नही', 'नही', 'गलत'];

  if (YES.some(w => t === w || t.startsWith(w + ' '))) return true;
  if (NO.some(w  => t === w || t.startsWith(w + ' '))) return false;
  return null;
}

/**
 * parseNumber — Converts spoken number (words or digits) to { value, raw }.
 * Handles compound numbers like "teen sau pachaas" → 350.
 * @returns { value: number, raw: string } | null
 */
export function parseNumber(text, lang = 'hi') {
  if (!text) return null;
  const t = text.toLowerCase().trim().replace(/[,₹]/g, '');

  // 1. Direct digit string (may contain decimals)
  const digitMatch = t.match(/\b\d+(\.\d+)?\b/);
  if (digitMatch) {
    const num = parseFloat(digitMatch[0]);
    if (!isNaN(num)) return { value: num, raw: digitMatch[0] };
  }

  // 2. Word numbers
  const wordMap = lang === 'mr' ? MARATHI_WORDS : HINDI_WORDS;
  const tokens = t.split(/[\s]+/);
  let total = 0;
  let current = 0;

  for (const token of tokens) {
    const n = wordMap[token];
    if (n === undefined) continue;

    if (n === 100) {
      current = (current === 0 ? 1 : current) * 100;
    } else if (n >= 1000) {
      total += (current === 0 ? 1 : current) * n;
      current = 0;
    } else {
      current += n;
    }
  }
  total += current;

  if (total > 0) return { value: total, raw: t };
  return null;
}

/**
 * parseNumberWithUnit — Parses "teen quintal" → { value: 3, unit: 'quintal', raw }.
 * Defaults unit to 'quintal' if none detected (common in agri context).
 * @returns { value: number, unit: string, raw: string } | null
 */
export function parseNumberWithUnit(text, lang = 'hi') {
  if (!text) return null;
  const t = text.toLowerCase().trim();

  let detectedUnit = 'quintal'; // Sensible default for agriculture
  for (const [unitKey, aliases] of Object.entries(UNIT_MAP)) {
    if (aliases.some(a => t.includes(a.toLowerCase()))) {
      detectedUnit = unitKey;
      break;
    }
  }

  const numResult = parseNumber(t, lang);
  if (numResult) {
    return { value: numResult.value, unit: detectedUnit, raw: text };
  }
  return null;
}

/**
 * parseCropName — Fuzzy-matches spoken text against known crop list.
 * @param aliasMap  Pass LOT_CROP_ALIASES or REQ_CROP_ALIASES
 * @returns matched crop value string | null
 */
export function parseCropName(text, aliasMap = LOT_CROP_ALIASES) {
  if (!text) return null;
  const t = text.toLowerCase().trim();

  for (const [cropValue, keywords] of Object.entries(aliasMap)) {
    if (keywords.some(k => t.includes(k.toLowerCase()))) {
      return cropValue;
    }
  }
  return null;
}

/**
 * parseGrade — Maps spoken grade description to existing <option> values.
 * @returns matched grade value string | null
 */
export function parseGrade(text) {
  if (!text) return null;
  const t = text.toLowerCase().trim();
  for (const [gradeValue, aliases] of Object.entries(GRADE_ALIASES)) {
    if (aliases.some(a => t.includes(a))) return gradeValue;
  }
  return null;
}

/**
 * parseGrievanceCategory — Maps spoken category description to existing values.
 * @param role  'farmer' | 'buyer'
 */
export function parseGrievanceCategory(text, role = 'farmer') {
  if (!text) return null;
  const t = text.toLowerCase().trim();
  const map = role === 'buyer' ? GRIEVANCE_BUYER_ALIASES : GRIEVANCE_FARMER_ALIASES;
  for (const [catValue, aliases] of Object.entries(map)) {
    if (aliases.some(a => t.includes(a))) return catValue;
  }
  return null;
}

/**
 * parseDate — Attempts to parse a spoken date into YYYY-MM-DD.
 * Returns null for unrecognized formats — the overlay then shows a date-picker fallback.
 */
export function parseDate(text, _lang = 'hi') {
  if (!text) return null;
  const t = text.trim();

  // ISO format directly
  const isoMatch = t.match(/\d{4}-\d{2}-\d{2}/);
  if (isoMatch) return isoMatch[0];

  // DD/MM/YYYY or DD-MM-YYYY
  const slashMatch = t.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/);
  if (slashMatch) {
    const day  = slashMatch[1].padStart(2, '0');
    const mon  = slashMatch[2].padStart(2, '0');
    const year = slashMatch[3].length === 2 ? '20' + slashMatch[3] : slashMatch[3];
    return `${year}-${mon}-${day}`;
  }

  // "15 September 2026" or "15 सितंबर 2026"
  const MONTHS_EN = ['january','february','march','april','may','june',
                     'july','august','september','october','november','december'];
  const MONTHS_HI = ['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून',
                     'जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'];
  const ALL_MONTHS = [...MONTHS_EN, ...MONTHS_HI];
  const lower = t.toLowerCase();
  for (let i = 0; i < MONTHS_EN.length; i++) {
    if (lower.includes(MONTHS_EN[i]) || lower.includes(MONTHS_HI[i])) {
      const dayMatch   = lower.match(/\b(\d{1,2})\b/);
      const yearMatch  = lower.match(/\b(20\d{2})\b/);
      if (dayMatch) {
        const day  = dayMatch[1].padStart(2, '0');
        const mon  = String(i + 1).padStart(2, '0');
        const year = yearMatch ? yearMatch[1] : '2026';
        return `${year}-${mon}-${day}`;
      }
    }
  }

  return null; // Unrecognized — caller shows date-picker fallback
}

/**
 * parseMoisture — Parses "11 percent" / "gyarah pratishat" → "11.0%"
 */
export function parseMoisture(text, lang = 'hi') {
  if (!text) return null;
  const t = text.toLowerCase().trim();
  const numResult = parseNumber(t, lang);
  if (numResult) return `${numResult.value}%`;
  return null;
}

/**
 * parsePhoneNumber — Extracts a valid 10-digit Indian mobile number.
 */
export function parsePhoneNumber(text) {
  if (!text) return null;
  const digits = text.replace(/\D/g, '');
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  return null;
}

/**
 * parseSkip — Checks if the user wants to skip an optional field.
 */
export function parseSkip(text) {
  if (!text) return false;
  const t = text.toLowerCase().trim();
  const SKIP_WORDS = ['skip', 'chod', 'chhod', 'chodo', 'aage', 'next', 'pass',
                      'soda', 'sodun', 'jaau', 'nahi chahiye', 'koi baat nahi',
                      'chale', 'chalein', 'हाँ छोड़ें', 'छोड़ें', 'सोडा'];
  return SKIP_WORDS.some(w => t.includes(w));
}
