/**
 * KisanAwaazConfig.js
 * --------------------
 * Per-form configuration objects mapping each existing form's field keys (verified
 * against the actual source files) to spoken question templates, value types,
 * required flags, and parser identifiers.
 *
 * CRITICAL: The field `key` values must EXACTLY match the existing form's state
 * variable names (setCrop uses key 'crop', etc.) — do not rename them.
 *
 * Supported `type` values:
 *   'text'             – free-form spoken text
 *   'number'           – numeric value
 *   'number+unit'      – numeric with unit (e.g. "3 quintal")
 *   'select-from-list' – one option from a fixed list
 *   'date'             – date value (has showDatePickerFallback: true)
 *   'phone'            – 10-digit mobile number
 *   'skip-voice'       – field is intentionally skipped in voice flow (security or complexity)
 *
 * Supported `parser` values (mapped in KisanAwaazOverlay to parseVoiceValue functions):
 *   'yesNo' | 'number' | 'numberUnit' | 'cropNameLot' | 'cropNameReq' |
 *   'grade' | 'grievanceCategory' | 'date' | 'moisture' | 'phone' | 'text'
 */

/* ════════════════════════════════════════════════════
   FORM: CREATE LOT  (CreateLotModal.jsx)
   Fields: crop, variety, quantityQtl, grade,
           moisturePercent, harvestDate, location, expectedPrice
════════════════════════════════════════════════════ */
export const FORM_CREATE_LOT = {
  formId: 'create_lot',
  color: '#16a34a',   // green — matches CreateLotModal header

  intro: {
    en: "Hello! I'll help you create a new crop lot listing. I'll ask a few questions — please speak clearly after the beep.",
    hi: "नमस्ते! मैं आपकी नई फसल लॉट लिस्टिंग बनाने में मदद करूंगा। कुछ सवाल पूछूंगा — बीप के बाद साफ बोलें।",
    mr: "नमस्कार! मी तुम्हाला नवी पीक लॉट लिस्टिंग तयार करण्यास मदत करेन. काही प्रश्न विचारेन — बीप नंतर स्पष्ट बोला.",
  },

  fields: [
    {
      key: 'crop',
      type: 'select-from-list',
      required: true,
      options: [
        'Onion (कांदा / Red Onion)',
        'Soybean (सोयाबीन)',
        'Cotton (कापूस / कपास)',
        'Wheat (गहू - Sharbati)',
        'Tomato (टोमॅटो)',
      ],
      optionLabels: {
        en: ['Onion', 'Soybean', 'Cotton', 'Wheat', 'Tomato'],
        hi: ['प्याज', 'सोयाबीन', 'कपास', 'गेहूं', 'टमाटर'],
        mr: ['कांदा', 'सोयाबीन', 'कापूस', 'गहू', 'टोमॅटो'],
      },
      questions: {
        en: "What crop are you listing? Say: Onion, Soybean, Cotton, Wheat, or Tomato.",
        hi: "आपकी फसल कौन सी है? बोलें: प्याज, सोयाबीन, कपास, गेहूं, या टमाटर।",
        mr: "तुमचे पीक कोणते आहे? बोला: कांदा, सोयाबीन, कापूस, गहू किंवा टोमॅटो.",
      },
      confirmTemplate: {
        en: (v) => `Crop: ${v}`,
        hi: (v) => `फसल: ${v}`,
        mr: (v) => `पीक: ${v}`,
      },
      emoji: '🌾',
      parser: 'cropNameLot',
    },
    {
      key: 'variety',
      type: 'text',
      required: false,
      questions: {
        en: "What is the crop variety? For example, say Nashik Red or Sharbati. Say 'skip' to skip.",
        hi: "फसल की किस्म क्या है? जैसे नाशिक रेड या शरबती। 'छोड़ें' बोलकर छोड़ सकते हैं।",
        mr: "पिकाची जात कोणती आहे? उदा. नाशिक रेड किंवा शरबती. 'सोडा' म्हणून सोडता येईल.",
      },
      confirmTemplate: {
        en: (v) => `Variety: ${v}`,
        hi: (v) => `किस्म: ${v}`,
        mr: (v) => `जात: ${v}`,
      },
      emoji: '🌱',
      parser: 'text',
    },
    {
      key: 'quantityQtl',
      type: 'number',
      required: true,
      unit: 'quintals',
      questions: {
        en: "How many quintals of crop do you want to sell?",
        hi: "आप कितने क्विंटल फसल बेचना चाहते हैं?",
        mr: "तुम्हाला किती क्विंटल पीक विकायचे आहे?",
      },
      confirmTemplate: {
        en: (v) => `${v} Quintals`,
        hi: (v) => `${v} क्विंटल`,
        mr: (v) => `${v} क्विंटल`,
      },
      emoji: '⚖️',
      parser: 'number',
    },
    {
      key: 'grade',
      type: 'select-from-list',
      required: false,
      options: [
        'Grade A (Export Quality 55mm+)',
        'Grade B (FAQ / Good Domestic)',
        'Grade C (Local Processing)',
      ],
      optionLabels: {
        en: ['Grade A — Export Quality', 'Grade B — Good Domestic', 'Grade C — Local Processing'],
        hi: ['ग्रेड A — निर्यात गुणवत्ता', 'ग्रेड B — घरेलू बाजार', 'ग्रेड C — स्थानीय प्रसंस्करण'],
        mr: ['ग्रेड A — निर्यात दर्जा', 'ग्रेड B — स्थानिक बाजार', 'ग्रेड C — स्थानिक प्रक्रिया'],
      },
      questions: {
        en: "What quality grade is your crop? Grade A for export, Grade B for domestic, Grade C for local. Say 'skip' to skip.",
        hi: "फसल का ग्रेड क्या है? ग्रेड A निर्यात, ग्रेड B घरेलू, ग्रेड C स्थानीय। 'छोड़ें' बोल सकते हैं।",
        mr: "पिकाचा दर्जा काय आहे? ग्रेड A निर्यात, ग्रेड B स्थानिक, ग्रेड C प्रक्रिया. 'सोडा' म्हणता येईल.",
      },
      confirmTemplate: {
        en: (v) => `Quality: ${v}`,
        hi: (v) => `गुणवत्ता: ${v}`,
        mr: (v) => `दर्जा: ${v}`,
      },
      emoji: '🏆',
      parser: 'grade',
    },
    {
      key: 'moisturePercent',
      type: 'text',
      required: false,
      questions: {
        en: "What is the moisture percentage? For example, say: 11 percent. Say 'skip' to skip.",
        hi: "नमी का प्रतिशत क्या है? जैसे: 11 प्रतिशत। 'छोड़ें' बोल सकते हैं।",
        mr: "ओलावा टक्केवारी किती आहे? उदा. 11 टक्के. 'सोडा' म्हणता येईल.",
      },
      confirmTemplate: {
        en: (v) => `Moisture: ${v}`,
        hi: (v) => `नमी: ${v}`,
        mr: (v) => `ओलावा: ${v}`,
      },
      emoji: '💧',
      parser: 'moisture',
    },
    {
      key: 'harvestDate',
      type: 'date',
      required: false,
      showDatePickerFallback: true,
      questions: {
        en: "What was your harvest date? Say the date like: 15 September 2026. Say 'skip' to skip.",
        hi: "फसल कटाई की तारीख क्या थी? बोलें जैसे: 15 सितंबर 2026। 'छोड़ें' बोल सकते हैं।",
        mr: "काढणी कधी झाली? तारीख सांगा जसे: 15 सप्टेंबर 2026. 'सोडा' म्हणता येईल.",
      },
      confirmTemplate: {
        en: (v) => `Harvest Date: ${v}`,
        hi: (v) => `कटाई तिथि: ${v}`,
        mr: (v) => `काढणी तारीख: ${v}`,
      },
      emoji: '📅',
      parser: 'date',
    },
    {
      key: 'location',
      type: 'text',
      required: false,
      questions: {
        en: "What is your farm pickup location? For example: Dindori, Nashik, Maharashtra. Say 'skip' to skip.",
        hi: "आपके खेत का पिकअप स्थान क्या है? जैसे: डिंडोरी, नाशिक, महाराष्ट्र। 'छोड़ें' बोल सकते हैं।",
        mr: "तुमच्या शेताचे पिकअप ठिकाण काय आहे? उदा. डिंडोरी, नाशिक. 'सोडा' म्हणता येईल.",
      },
      confirmTemplate: {
        en: (v) => `Location: ${v}`,
        hi: (v) => `स्थान: ${v}`,
        mr: (v) => `ठिकाण: ${v}`,
      },
      emoji: '📍',
      parser: 'text',
    },
    {
      key: 'expectedPrice',
      type: 'number',
      required: true,
      unit: '₹/quintal',
      questions: {
        en: "What is your expected reserve price per quintal in rupees?",
        hi: "प्रति क्विंटल कितने रुपये की अपेक्षित कीमत है?",
        mr: "प्रति क्विंटल किती रुपये अपेक्षित आहे?",
      },
      confirmTemplate: {
        en: (v) => `₹${v} per Quintal`,
        hi: (v) => `₹${v} प्रति क्विंटल`,
        mr: (v) => `₹${v} प्रति क्विंटल`,
      },
      emoji: '💰',
      parser: 'number',
    },
  ],

  summary: {
    en: (v) =>
      `Let me repeat everything: Crop is ${v.crop || '—'}, quantity ${v.quantityQtl || '—'} quintals, expected price ₹${v.expectedPrice || '—'} per quintal${v.location ? `, pickup from ${v.location}` : ''}. Is everything correct?`,
    hi: (v) =>
      `सुनिए दोबारा: फसल ${v.crop || '—'}, मात्रा ${v.quantityQtl || '—'} क्विंटल, अपेक्षित कीमत ₹${v.expectedPrice || '—'} प्रति क्विंटल${v.location ? `, पिकअप ${v.location} से` : ''}। सब सही है?`,
    mr: (v) =>
      `पुन्हा ऐका: पीक ${v.crop || '—'}, मात्रा ${v.quantityQtl || '—'} क्विंटल, अपेक्षित किंमत ₹${v.expectedPrice || '—'} प्रति क्विंटल${v.location ? `, पिकअप ${v.location}` : ''}. सगळं बरोबर आहे का?`,
  },
};

/* ════════════════════════════════════════════════════
   FORM: GRIEVANCE FILING  (FarmerGrievance.jsx)
   Fields: orderId, category, description
════════════════════════════════════════════════════ */
export const FORM_GRIEVANCE_FARMER = {
  formId: 'grievance_farmer',
  color: '#dc2626',  // red — matches grievance modal header

  intro: {
    en: "I'll help you file a grievance ticket. Please answer a few questions.",
    hi: "मैं आपकी शिकायत दर्ज करने में मदद करूंगा। कुछ सवालों के जवाब दें।",
    mr: "मी तुम्हाला तक्रार नोंदवण्यास मदत करेन. काही प्रश्नांची उत्तरे द्या.",
  },

  fields: [
    {
      key: 'orderId',
      type: 'select-from-list',
      required: true,
      // Options are role-dependent and passed at runtime via context prop
      // The overlay reads `options` from props when formId is grievance
      options: [
        'ORD-9912 (Soybean 140 Qtl - Adani Wilmar)',
        'ORD-9950 (Onion 85 Qtl - Sahyadri Agro)',
        'ORD-9972 (Wheat 210 Qtl - ITC Choupal)',
      ],
      questions: {
        en: "Which order has a problem? I'll read the order IDs: First: ORD-9912 Soybean 140 quintals. Second: ORD-9950 Onion 85 quintals. Third: ORD-9972 Wheat 210 quintals. Say the order number or say first, second, or third.",
        hi: "किस ऑर्डर में समस्या है? ऑर्डर IDs: पहला: ORD-9912 सोयाबीन 140 क्विंटल। दूसरा: ORD-9950 प्याज 85 क्विंटल। तीसरा: ORD-9972 गेहूं 210 क्विंटल। ऑर्डर नंबर बोलें या पहला, दूसरा, तीसरा बोलें।",
        mr: "कोणत्या ऑर्डरमध्ये समस्या आहे? ऑर्डर IDs: पहिला: ORD-9912 सोयाबीन 140 क्विंटल. दुसरा: ORD-9950 कांदा 85 क्विंटल. तिसरा: ORD-9972 गहू 210 क्विंटल. ऑर्डर नंबर बोला किंवा पहिला, दुसरा, तिसरा म्हणा.",
      },
      confirmTemplate: {
        en: (v) => `Order: ${v}`,
        hi: (v) => `ऑर्डर: ${v}`,
        mr: (v) => `ऑर्डर: ${v}`,
      },
      emoji: '📋',
      parser: 'orderId',
    },
    {
      key: 'category',
      type: 'select-from-list',
      required: true,
      options: [
        'Payment Delay',
        'Quality Grading Disagreement',
        'Weighment Discrepancy',
        'Transporter No-Show',
      ],
      questions: {
        en: "What is the complaint reason? Say: Payment delay, Quality dispute, Weighment problem, or Transporter issue.",
        hi: "शिकायत का कारण क्या है? बोलें: पेमेंट देरी, गुणवत्ता विवाद, तौल में गड़बड़ी, या ट्रांसपोर्टर समस्या।",
        mr: "तक्रारीचे कारण काय आहे? बोला: पेमेंट उशीर, गुणवत्ता वाद, वजन गडबड, किंवा ट्रान्सपोर्टर समस्या.",
      },
      confirmTemplate: {
        en: (v) => `Reason: ${v}`,
        hi: (v) => `कारण: ${v}`,
        mr: (v) => `कारण: ${v}`,
      },
      emoji: '⚠️',
      parser: 'grievanceCategoryFarmer',
    },
    {
      key: 'description',
      type: 'text',
      required: true,
      questions: {
        en: "Please explain what happened in detail — mention the date, amounts, and any receipt numbers if you have them.",
        hi: "विस्तार से बताएं क्या हुआ — तारीख, राशि, और रसीद नंबर हो तो बोलें।",
        mr: "तपशीलवार सांगा काय झाले — तारीख, रक्कम, आणि पावती क्रमांक असल्यास सांगा.",
      },
      confirmTemplate: {
        en: (v) => `"${v}"`,
        hi: (v) => `"${v}"`,
        mr: (v) => `"${v}"`,
      },
      emoji: '📝',
      parser: 'text',
    },
  ],

  summary: {
    en: (v) => `Summary: Order ${v.orderId || '—'}, Reason: ${v.category || '—'}. Your description has been recorded. Submit this grievance?`,
    hi: (v) => `सारांश: ऑर्डर ${v.orderId || '—'}, कारण: ${v.category || '—'}। आपका विवरण दर्ज हो गया। शिकायत दर्ज करें?`,
    mr: (v) => `सारांश: ऑर्डर ${v.orderId || '—'}, कारण: ${v.category || '—'}. तुमचे वर्णन नोंदवले गेले. तक्रार दाखल करायची का?`,
  },
};

/* Buyer grievance form — same fields but different options */
export const FORM_GRIEVANCE_BUYER = {
  ...FORM_GRIEVANCE_FARMER,
  formId: 'grievance_buyer',
  fields: [
    {
      ...FORM_GRIEVANCE_FARMER.fields[0],
      options: [
        'ORD-9821 (Wheat 200 Qtl - Dnyaneshwar Patil)',
        'ORD-9740 (Onion 150 Qtl - Nashik FPO)',
        'ORD-9610 (Soybean 120 Qtl - Latur Hub)',
      ],
    },
    {
      ...FORM_GRIEVANCE_FARMER.fields[1],
      options: [
        'Quality / Moisture Variance',
        'Weighbridge / Quantity Shortage',
        'Delivery Delay (>48h after dispatch)',
        'Transporter Delayed / Goods Damaged',
        'Escrow Refund / Cancellation Request',
      ],
      parser: 'grievanceCategoryBuyer',
    },
    FORM_GRIEVANCE_FARMER.fields[2],
  ],
};

/* ════════════════════════════════════════════════════
   FORM: POST REQUIREMENT  (BuyerDashboard.jsx)
   Fields: newReqCrop, newReqQty, newReqPrice, newReqLocation
════════════════════════════════════════════════════ */
export const FORM_POST_REQUIREMENT = {
  formId: 'post_requirement',
  color: '#1d4ed8',  // blue — matches buyer modal header

  intro: {
    en: "Let's post a new procurement requirement. I'll ask a few questions.",
    hi: "नई खरीद मांग दर्ज करते हैं। कुछ सवाल पूछूंगा।",
    mr: "नवी खरेदी मागणी नोंदवूया. काही प्रश्न विचारेन.",
  },

  fields: [
    {
      key: 'newReqCrop',
      type: 'select-from-list',
      required: true,
      options: ['Onion', 'Soybean', 'Wheat', 'Cotton'],
      optionLabels: {
        en: ['Onion', 'Soybean', 'Wheat', 'Cotton'],
        hi: ['प्याज', 'सोयाबीन', 'गेहूं', 'कपास'],
        mr: ['कांदा', 'सोयाबीन', 'गहू', 'कापूस'],
      },
      questions: {
        en: "Which crop do you need? Say: Onion, Soybean, Wheat, or Cotton.",
        hi: "आपको कौन सी फसल चाहिए? बोलें: प्याज, सोयाबीन, गेहूं, या कपास।",
        mr: "तुम्हाला कोणते पीक हवे? बोला: कांदा, सोयाबीन, गहू किंवा कापूस.",
      },
      confirmTemplate: {
        en: (v) => `Crop needed: ${v}`,
        hi: (v) => `जरूरी फसल: ${v}`,
        mr: (v) => `हवे पीक: ${v}`,
      },
      emoji: '🌾',
      parser: 'cropNameReq',
    },
    {
      key: 'newReqQty',
      type: 'number',
      required: true,
      unit: 'quintals',
      questions: {
        en: "How many quintals do you need?",
        hi: "कितने क्विंटल चाहिए?",
        mr: "किती क्विंटल हवे आहे?",
      },
      confirmTemplate: {
        en: (v) => `Quantity: ${v} Quintals`,
        hi: (v) => `मात्रा: ${v} क्विंटल`,
        mr: (v) => `मात्रा: ${v} क्विंटल`,
      },
      emoji: '📦',
      parser: 'number',
    },
    {
      key: 'newReqPrice',
      type: 'number',
      required: true,
      unit: '₹/quintal',
      questions: {
        en: "What is your maximum target price per quintal in rupees?",
        hi: "प्रति क्विंटल अधिकतम कितने रुपये देंगे?",
        mr: "प्रति क्विंटल जास्तीत जास्त किती रुपये द्याल?",
      },
      confirmTemplate: {
        en: (v) => `Max Price: ₹${v}/Quintal`,
        hi: (v) => `अधिकतम कीमत: ₹${v}/क्विंटल`,
        mr: (v) => `जास्तीत जास्त किंमत: ₹${v}/क्विंटल`,
      },
      emoji: '💰',
      parser: 'number',
    },
    {
      key: 'newReqLocation',
      type: 'text',
      required: false,
      questions: {
        en: "What is the delivery destination? For example: Nashik Processing Plant. Say 'skip' to skip.",
        hi: "डिलीवरी का स्थान क्या है? जैसे: नाशिक प्रोसेसिंग प्लांट। 'छोड़ें' बोल सकते हैं।",
        mr: "डिलिव्हरी ठिकाण काय आहे? उदा. नाशिक प्रक्रिया संयंत्र. 'सोडा' म्हणता येईल.",
      },
      confirmTemplate: {
        en: (v) => `Delivery to: ${v}`,
        hi: (v) => `डिलीवरी: ${v}`,
        mr: (v) => `डिलिव्हरी: ${v}`,
      },
      emoji: '🏭',
      parser: 'text',
    },
  ],

  summary: {
    en: (v) => `Summary: Need ${v.newReqQty || '—'} quintals of ${v.newReqCrop || '—'} at ₹${v.newReqPrice || '—'} per quintal${v.newReqLocation ? `, delivered to ${v.newReqLocation}` : ''}. Post this requirement?`,
    hi: (v) => `सारांश: ${v.newReqQty || '—'} क्विंटल ${v.newReqCrop || '—'} चाहिए, ₹${v.newReqPrice || '—'} प्रति क्विंटल${v.newReqLocation ? `, ${v.newReqLocation} डिलीवरी` : ''}। यह मांग दर्ज करें?`,
    mr: (v) => `सारांश: ${v.newReqQty || '—'} क्विंटल ${v.newReqCrop || '—'} हवे, ₹${v.newReqPrice || '—'} प्रति क्विंटल${v.newReqLocation ? `, ${v.newReqLocation} डिलिव्हरी` : ''}. ही मागणी नोंदवायची का?`,
  },
};

/* ════════════════════════════════════════════════════
   FORM: REGISTRATION STEP 1  (RegistrationFlow.jsx)
   Fields collected by voice: name, mobile
   Fields SKIPPED (security — password/OTP): email, password, confirmPassword, termsAccepted
   // TODO: voice-security — password collection via voice is intentionally not
   // implemented as it is a security anti-pattern. The voice flow pre-fills
   // name+mobile only; the user must type password and verify OTP manually.
════════════════════════════════════════════════════ */
export const FORM_REGISTRATION_S1 = {
  formId: 'registration_s1',
  color: '#0d9488',  // teal — matches RegistrationFlow color scheme

  intro: {
    en: "I'll help you fill the registration form. I'll collect your name and phone number. Password and OTP must be entered manually for security.",
    hi: "मैं आपका नाम और मोबाइल नंबर भरने में मदद करूंगा। पासवर्ड और OTP आपको खुद टाइप करना होगा — सुरक्षा के लिए।",
    mr: "मी तुमचे नाव आणि मोबाइल नंबर भरण्यास मदत करेन. पासवर्ड आणि OTP सुरक्षेसाठी स्वतः टाइप करावा लागेल.",
  },

  fields: [
    {
      key: 'name',
      type: 'text',
      required: true,
      questions: {
        en: "Please say your full name.",
        hi: "अपना पूरा नाम बोलें।",
        mr: "तुमचे पूर्ण नाव सांगा.",
      },
      confirmTemplate: {
        en: (v) => `Name: ${v}`,
        hi: (v) => `नाम: ${v}`,
        mr: (v) => `नाव: ${v}`,
      },
      emoji: '👤',
      parser: 'text',
    },
    {
      key: 'mobile',
      type: 'phone',
      required: true,
      questions: {
        en: "Please say your 10-digit mobile number, one digit at a time.",
        hi: "अपना 10 अंकों का मोबाइल नंबर बोलें — एक-एक अंक करके बोलें।",
        mr: "तुमचा 10 अंकी मोबाइल नंबर सांगा — एक-एक अंक सांगा.",
      },
      confirmTemplate: {
        en: (v) => `Mobile: ${v}`,
        hi: (v) => `मोबाइल: ${v}`,
        mr: (v) => `मोबाइल: ${v}`,
      },
      emoji: '📱',
      parser: 'phone',
    },
  ],

  summary: {
    en: (v) => `Name: ${v.name || '—'}, Mobile: ${v.mobile || '—'}. I'll pre-fill these. You'll still need to type your email, password, and verify OTP. Is the above correct?`,
    hi: (v) => `नाम: ${v.name || '—'}, मोबाइल: ${v.mobile || '—'}। ये भर दूंगा। ईमेल, पासवर्ड और OTP आपको खुद भरना होगा। क्या यह सही है?`,
    mr: (v) => `नाव: ${v.name || '—'}, मोबाइल: ${v.mobile || '—'}. हे भरेन. ईमेल, पासवर्ड आणि OTP स्वतः भरावा लागेल. बरोबर आहे का?`,
  },
};

/* ════════════════════════════════════════════════════
   FORM: FPO JOIN REQUEST  (FpoMembershipManager.jsx)
   Fields: customHarvestQty (optional), customMessage (optional)
════════════════════════════════════════════════════ */
export const FORM_FPO_JOIN = {
  formId: 'fpo_join',
  color: '#d97706',  // amber — matches FPO color scheme

  intro: {
    en: "I'll help you send a join request to an FPO. Both questions are optional — say 'skip' to skip.",
    hi: "FPO में शामिल होने का अनुरोध भेजने में मदद करूंगा। दोनों सवाल वैकल्पिक हैं — 'छोड़ें' बोल सकते हैं।",
    mr: "FPO मध्ये सामील होण्याचा अर्ज पाठवण्यास मदत करेन. दोन्ही प्रश्न ऐच्छिक आहेत — 'सोडा' म्हणता येईल.",
  },

  fields: [
    {
      key: 'customHarvestQty',
      type: 'text',
      required: false,
      questions: {
        en: "How much harvest do you have ready? For example: 85 quintals Onion. Say 'skip' to skip.",
        hi: "आपके पास कितनी फसल तैयार है? जैसे: 85 क्विंटल प्याज। 'छोड़ें' बोल सकते हैं।",
        mr: "तुमच्याकडे किती पीक तयार आहे? उदा. 85 क्विंटल कांदा. 'सोडा' म्हणता येईल.",
      },
      confirmTemplate: {
        en: (v) => `Harvest: ${v}`,
        hi: (v) => `फसल: ${v}`,
        mr: (v) => `पीक: ${v}`,
      },
      emoji: '🌾',
      parser: 'text',
    },
    {
      key: 'customMessage',
      type: 'text',
      required: false,
      questions: {
        en: "Do you want to send a message to the FPO? Say your message or say 'skip'.",
        hi: "FPO को कोई संदेश देना चाहते हैं? संदेश बोलें या 'छोड़ें' बोलें।",
        mr: "FPO ला काही संदेश द्यायचा आहे का? संदेश बोला किंवा 'सोडा' म्हणा.",
      },
      confirmTemplate: {
        en: (v) => `Message: "${v}"`,
        hi: (v) => `संदेश: "${v}"`,
        mr: (v) => `संदेश: "${v}"`,
      },
      emoji: '💬',
      parser: 'text',
    },
  ],

  summary: {
    en: (v) => `Sending join request${v.customHarvestQty ? ` with ${v.customHarvestQty}` : ''}${v.customMessage ? ` and message: "${v.customMessage}"` : ''}. Confirm?`,
    hi: (v) => `जुड़ने का अनुरोध भेजें${v.customHarvestQty ? ` — ${v.customHarvestQty} के साथ` : ''}${v.customMessage ? ` — संदेश: "${v.customMessage}"` : ''}। पुष्टि करें?`,
    mr: (v) => `सामील होण्याचा अर्ज पाठवा${v.customHarvestQty ? ` — ${v.customHarvestQty}` : ''}${v.customMessage ? ` — संदेश: "${v.customMessage}"` : ''}. पुष्टी करा?`,
  },
};

/* ─── Lookup helper ─── */
export const FORM_CONFIG_MAP = {
  create_lot:         FORM_CREATE_LOT,
  grievance_farmer:   FORM_GRIEVANCE_FARMER,
  grievance_buyer:    FORM_GRIEVANCE_BUYER,
  post_requirement:   FORM_POST_REQUIREMENT,
  registration_s1:    FORM_REGISTRATION_S1,
  fpo_join:           FORM_FPO_JOIN,
};
