/**
 * parseFieldVoiceValue.js
 * Isolated utility functions for Mode 1 per-field voice input.
 * This is completely independent from Mode 2's parser.
 */

// Extended word-to-number dictionary for English, Hindi, and Marathi
const WORD_TO_NUMBER = {
  'zero': 0, 'shunya': 0,
  'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
  'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
  'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
  'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
  'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50, 'sixty': 60,
  'seventy': 70, 'eighty': 80, 'ninety': 90, 'hundred': 100,
  // Hindi / Marathi numbers
  'ek': 1, 'don': 2, 'do': 2, 'teen': 3, 'tin': 3, 'char': 4, 'chaar': 4,
  'pach': 5, 'paanch': 5, 'saha': 6, 'che': 6, 'chah': 6, 'sat': 7, 'saat': 7,
  'aath': 8, 'aat': 8, 'nau': 9, 'nav': 9, 'daha': 10, 'das': 10,
  'gyarah': 11, 'barah': 12, 'terah': 13, 'chaudah': 14, 'pandrah': 15,
  'solah': 16, 'satrah': 17, 'atharah': 18, 'unnis': 19,
  'bees': 20, 'vis': 20, 'tees': 30, 'tis': 30, 'chalis': 40,
  'pachas': 50, 'pachaas': 50, 'pannaas': 50,
  'saath': 60, 'sath': 60, 'sattar': 70, 'assi': 80, 'aishi': 80,
  'nabbe': 90, 'nauve': 90, 'navvad': 90,
  'sau': 100, 'ek sau': 100, 'shambhar': 100,
  'hazar': 1000, 'hajaar': 1000, 'thousand': 1000,
  'lakh': 100000, 'lac': 100000, 'crore': 10000000
};

// Comprehensive agricultural commodity and regional aliases
export const AGRICULTURAL_ALIASES = {
  // Pulses
  'arhar': ['tur', 'arhar', 'toor', 'tuar', 'tuver', 'red gram', 'तुअर', 'अरहर'],
  'urad': ['urad', 'udad', 'black gram', 'kaali dal', 'black matpe', 'उड़द', 'उडद'],
  'moong': ['moong', 'mung', 'green gram', 'hari dal', 'mug', 'मूंग'],
  'chana': ['chana', 'gram', 'harbhara', 'chole', 'bengal gram', 'चना', 'हरभरा'],
  // Cereals & Grains
  'wheat': ['wheat', 'gehu', 'gahu', 'sharbati', 'lokwan', 'गेहूं', 'गहू'],
  'paddy': ['paddy', 'rice', 'dhan', 'chawal', 'bhat', 'धान', 'चावल'],
  'maize': ['maize', 'makka', 'corn', 'bhutta', 'maka', 'मक्का', 'मका'],
  'bajra': ['bajra', 'pearl millet', 'bajri', 'बाजरा'],
  'jowar': ['jowar', 'sorghum', 'jwari', 'ज्वार'],
  // Oilseeds & Cash Crops
  'soybean': ['soybean', 'soya', 'soyabean', 'yellow gold', 'सोयाबीन'],
  'cotton': ['cotton', 'kapas', 'kapus', 'rui', 'कपास'],
  'mustard': ['mustard', 'sarson', 'rai', 'सरसों'],
  // Vegetables
  'onion': ['onion', 'pyaaz', 'kanda', 'pyaj', 'dungri', 'प्याज', 'कांदा'],
  'potato': ['potato', 'aloo', 'alu', 'batata', 'आलू'],
  'tomato': ['tomato', 'tamatar', 'टमाटर'],
  'garlic': ['garlic', 'lahsun', 'lasun', 'लहसुन'],
  // Key States
  'maharashtra': ['maharashtra', 'mh', 'महाराष्ट्र'],
  'madhya pradesh': ['mp', 'madhya pradesh', 'मध्य प्रदेश'],
  'uttar pradesh': ['up', 'uttar pradesh', 'उत्तर प्रदेश'],
  'rajasthan': ['rajasthan', 'rj', 'राजस्थान'],
  'gujarat': ['gujarat', 'gj', 'गुजरात'],
  'punjab': ['punjab', 'pb', 'पंजाब'],
  'haryana': ['haryana', 'hr', 'हरियाणा'],
  'bihar': ['bihar', 'br', 'बिहार'],
  'karnataka': ['karnataka', 'ka', 'कर्नाटक'],
  'tamil nadu': ['tamil nadu', 'tn', 'तमिलनाडु'],
  'telangana': ['telangana', 'ts', 'तेलंगाना'],
  'andhra pradesh': ['andhra pradesh', 'ap', 'आंध्र प्रदेश'],
  'west bengal': ['west bengal', 'wb', 'पश्चिम बंगाल']
};

/**
 * Extracts the first valid number from a spoken phrase.
 * E.g., "teen quintal" -> 3, "I want 50" -> 50, "pachas" -> 50
 * If no number is found, returns null.
 */
export function parseNumeric(text) {
  if (!text) return null;
  const lower = text.toLowerCase().trim();
  
  // 1. Try to find actual digits first
  const digitMatch = lower.match(/\d+(\.\d+)?/);
  if (digitMatch) {
    return parseFloat(digitMatch[0]);
  }

  // 2. Try word to number fallback
  const words = lower.split(/[\s,]+/);
  let multiplier = 1;
  let baseVal = 0;
  let foundNumber = false;

  for (const word of words) {
    if (WORD_TO_NUMBER[word] !== undefined) {
      const val = WORD_TO_NUMBER[word];
      if (val >= 100) {
        multiplier = val;
      } else {
        baseVal += val;
        foundNumber = true;
      }
    }
  }

  if (foundNumber || multiplier > 1) {
    const finalVal = (baseVal === 0 && multiplier > 1) ? multiplier : (baseVal * multiplier);
    return finalVal;
  }

  return null;
}

/**
 * Cleans up standard text input (trims, capitalizes first letter).
 */
export function parseText(text) {
  if (!text) return '';
  const trimmed = text.trim();
  if (trimmed.length === 0) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * Fuzzy matches transcribed text against a known list of string options.
 */
export function parseFuzzy(text, optionsList) {
  if (!text || !optionsList || optionsList.length === 0) return text;
  
  const lowerText = text.toLowerCase().trim();

  // 1. Exact or contains match
  for (const option of optionsList) {
    const optStr = typeof option === 'string' ? option : (option.label || option.name || option.text || '');
    const lowerOpt = optStr.toLowerCase();
    
    if (lowerOpt === lowerText || lowerText.includes(lowerOpt) || lowerOpt.includes(lowerText)) {
      return option;
    }
  }

  // 2. Alias match
  for (const option of optionsList) {
    const optStr = typeof option === 'string' ? option : (option.label || option.name || option.text || '');
    const lowerOpt = optStr.toLowerCase();

    for (const [standard, aliases] of Object.entries(AGRICULTURAL_ALIASES)) {
      if (lowerOpt.includes(standard)) {
        if (aliases.some(alias => lowerText.includes(alias))) {
          return option;
        }
      }
    }
  }

  return text;
}

/**
 * Finds the best matching option for a HTML <select> dropdown from spoken text.
 * Accepts options as an array of { value, text } objects.
 */
export function findBestSelectOption(spokenText, selectOptions = []) {
  if (!spokenText || !selectOptions.length) return null;
  const lowerText = spokenText.toLowerCase().trim();

  // 1. Exact text or value match
  for (const opt of selectOptions) {
    const optText = opt.text.toLowerCase().trim();
    const optVal = String(opt.value).toLowerCase().trim();
    if (optText === lowerText || optVal === lowerText) {
      return opt;
    }
  }

  // 2. Substring match (e.g. user says "Nashik", option is "Nashik APMC")
  for (const opt of selectOptions) {
    const optText = opt.text.toLowerCase().trim();
    const optVal = String(opt.value).toLowerCase().trim();
    if (optText.includes(lowerText) || lowerText.includes(optText)) {
      return opt;
    }
    if (optVal && (optVal.includes(lowerText) || lowerText.includes(optVal))) {
      return opt;
    }
  }

  // 3. Multi-word token match (e.g. user says "tur dal", option is "Arhar / Tur (तुअर / अरहर)")
  const tokens = lowerText.split(/\s+/).filter(t => t.length > 2);
  for (const opt of selectOptions) {
    const optText = opt.text.toLowerCase();
    if (tokens.some(tok => optText.includes(tok))) {
      return opt;
    }
  }

  // 4. Agricultural and geographical alias match
  for (const [key, aliases] of Object.entries(AGRICULTURAL_ALIASES)) {
    const isSpokenMatched = aliases.some(alias => lowerText.includes(alias));
    if (isSpokenMatched) {
      for (const opt of selectOptions) {
        const optText = opt.text.toLowerCase();
        const optVal = String(opt.value).toLowerCase();
        if (optText.includes(key) || optVal.includes(key) || aliases.some(a => optText.includes(a))) {
          return opt;
        }
      }
    }
  }

  return null;
}
