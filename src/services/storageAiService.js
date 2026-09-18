/**
 * anaaj Storage AI & Sell Advisory Service
 * Powers the Agentic AI in Farmer & FPO Storage/Warehouse Panels.
 * Models past-year harvest price cycles vs lean season peaks,
 * live fluctuating mandi spot rates, cold storage economics, and e-NWR pledge loans.
 */

const STORAGE_KEY_BOOKINGS = 'anaaj_db_storage_bookings';
const EVENT_BOOKINGS_UPDATED = 'anaaj_storage_bookings_updated';

// ─── COMPREHENSIVE CROP ADVISORY & PRICE CYCLE DATABASE ──────────────────────
export const STORAGE_AI_CROPS = [
  {
    id: 'wheat',
    name: 'Wheat (गहू / गेहूं - Sharbati & Lokwan)',
    hindiName: 'गेहूं',
    category: 'Cereals & Food Grains',
    msp: 2425,
    currentAvgPrice: 2720,
    unit: '₹/Quintal',
    recommendedStorageType: 'Steel Silo / Dry Warehouse (e-NWR)',
    storageRatePerQtlDay: 0.75, // ₹22.50 / month / qtl
    shrinkageRatePercent: 0.8, // minimal weight loss in scientific silos
    optimalHoldingDays: 75,
    harvestCycle: {
      harvestPeriod: 'March – April (Rabi Peak Arrivals)',
      glutArrivalPriceDip: '-13.5% price slump during harvest arrivals',
      leanSeasonPriceSpike: '+18% to +24% surge during festival & winter restocking (Sept – Nov)',
      pastYearHarvestPrice: 2340,
      pastYearPostHarvest60DPrice: 2780,
      pastYearGainPercent: '+18.8%'
    },
    liveMarketDynamics: {
      dailyArrivalTrend: 'Declining (-22% week-on-week)',
      mandiArrivalPressure: 'Low (Off-season lean supply)',
      buyerDemand: 'Very High (Flour mills & biscuits manufacturers building buffer stocks)',
      exportMomentum: 'Steady domestic mill contracts',
      spotVolatility: 'Moderate upward bias (+₹45/Qtl in last 10 days)'
    },
    aiAdvisory: {
      verdict: 'STORE_AND_SELL_LATER', // 'STORE_AND_SELL_LATER' | 'SELL_NOW'
      badgeText: 'Store in Silo for 60–90 Days (भंडारण करें)',
      actionColor: 'emerald',
      confidenceScore: 94,
      projectedPeakPrice: 2980,
      projectedTimeframe: 'Late October to Mid November 2026',
      expectedGrossChange: '+9.6%',
      summaryHindi: 'अक्टूबर-नवंबर के त्योहारी सीजन और सर्दियों में मिलों की मांग बढ़ने से गेहूं की कीमतों में ₹250-₹300/क्विंटल का उछाल आने का 94% अनुमान है। वेयरहाउस का किराया काटकर भी भारी मुनाफा होगा।',
      summaryEnglish: 'Flour mills are aggressively restocking before winter festivals. Incurring 60-75 days of scientific storage yields significantly higher net profit even after warehouse rental charges.'
    }
  },
  {
    id: 'onion',
    name: 'Onion (कांदा / प्याज - Red & Gavran)',
    hindiName: 'प्याज',
    category: 'Vegetables & Perishables',
    msp: 1800,
    currentAvgPrice: 2450,
    unit: '₹/Quintal',
    recommendedStorageType: 'Ventilated Solar Chawl / CA Cold Store',
    storageRatePerQtlDay: 1.25, // ₹37.50 / month / qtl (higher energy/loss)
    shrinkageRatePercent: 4.5, // moisture loss & sorting decay
    optimalHoldingDays: 0, // Sell now
    harvestCycle: {
      harvestPeriod: 'Late September – October (Early Kharif Arrivals)',
      glutArrivalPriceDip: '-25% to -35% price collapse as fresh Karnataka & MP Kharif floods mandis',
      leanSeasonPriceSpike: 'Already peaked in July-August lean window',
      pastYearHarvestPrice: 2450,
      pastYearPostHarvest60DPrice: 1850,
      pastYearGainPercent: '-24.5% (Price dropped drastically)'
    },
    liveMarketDynamics: {
      dailyArrivalTrend: 'Surging rapidly (+32% daily in South India & MP)',
      mandiArrivalPressure: 'High (Kharif arrivals starting to hit major consumption hubs)',
      buyerDemand: 'Cautious (Wholesalers liquidating summer stock)',
      exportMomentum: 'Regulated minimum export price cap in place',
      spotVolatility: 'Downward volatility starting (-₹60/Qtl in last 4 days)'
    },
    aiAdvisory: {
      verdict: 'SELL_NOW',
      badgeText: 'Sell Immediately at Spot Mandi (तुरंत बेचें)',
      actionColor: 'rose',
      confidenceScore: 91,
      projectedPeakPrice: 2050,
      projectedTimeframe: 'Sell within next 7–10 days',
      expectedGrossChange: '-16.3%',
      summaryHindi: 'कर्नाटक और मध्य प्रदेश की खरीफ प्याज की भारी आवक 10-15 दिनों में शुरू होने वाली है, जिससे मंडियों में दाम गिरेंगे। अभी मौजूदा ₹2,450/क्विंटल पर बेचें; भंडारण में सड़न और भाव गिरने का खतरा है।',
      summaryEnglish: 'Heavy Kharif arrivals from southern states will depress spot prices by mid-October. Holding onion now incurs heavy moisture loss, rot risk, and price erosion. Sell immediately.'
    }
  },
  {
    id: 'soybean',
    name: 'Soybean (सोयाबीन - Yellow Gold)',
    hindiName: 'सोयाबीन',
    category: 'Oilseeds & Cash Crops',
    msp: 4892,
    currentAvgPrice: 4980,
    unit: '₹/Quintal',
    recommendedStorageType: 'Moisture-Controlled Grain Warehouse',
    storageRatePerQtlDay: 0.80, // ₹24 / month / qtl
    shrinkageRatePercent: 1.0,
    optimalHoldingDays: 60,
    harvestCycle: {
      harvestPeriod: 'October (Kharif Harvest Arrivals Peak)',
      glutArrivalPriceDip: '-8% to -12% dip in October arrival rush',
      leanSeasonPriceSpike: '+14% to +18% recovery in December–January for domestic crushing plants',
      pastYearHarvestPrice: 4720,
      pastYearPostHarvest60DPrice: 5390,
      pastYearGainPercent: '+14.2%'
    },
    liveMarketDynamics: {
      dailyArrivalTrend: 'Moderate (Early harvest lots arriving)',
      mandiArrivalPressure: 'Moderate (Crushers actively bidding near MSP)',
      buyerDemand: 'High (Solvent extraction plants operating at lower inventories)',
      exportMomentum: 'Strong global de-oiled cake (DOC) export inquiries',
      spotVolatility: 'Firm floor near MSP of ₹4,892'
    },
    aiAdvisory: {
      verdict: 'STORE_AND_SELL_LATER',
      badgeText: 'Store in Warehouse for 45–60 Days (भंडारण करें)',
      actionColor: 'emerald',
      confidenceScore: 89,
      projectedPeakPrice: 5420,
      projectedTimeframe: 'Late November to December 2026',
      expectedGrossChange: '+8.8%',
      summaryHindi: 'क्रशिंग प्लांट और पोल्ट्री फीड उत्पादक सक्रिय हैं। 45-60 दिन वेयरहाउस में रखने पर ₹5,350-₹5,450 का भाव मिलने की उम्मीद है। ई-एनडब्ल्यूआर पर 70% लोन लेकर बिना नकदी समस्या के होल्ड करें।',
      summaryEnglish: 'Domestic edible oil crushing units are running with low raw seed reserves. Storing for 60 days captures peak crushing demand while utilizing e-NWR pledge loans to maintain cash flow.'
    }
  },
  {
    id: 'mustard',
    name: 'Mustard / Sarson (सरसों - High Oil Content)',
    hindiName: 'सरसों',
    category: 'Oilseeds',
    msp: 5650,
    currentAvgPrice: 5850,
    unit: '₹/Quintal',
    recommendedStorageType: 'Scientific Dry Warehouse (FCI / CWC Standard)',
    storageRatePerQtlDay: 0.85,
    shrinkageRatePercent: 0.9,
    optimalHoldingDays: 70,
    harvestCycle: {
      harvestPeriod: 'February – March (Rabi Peak)',
      glutArrivalPriceDip: '-10% drop during March arrivals',
      leanSeasonPriceSpike: '+15% to +22% rally during winter mustard oil crushing (October – December)',
      pastYearHarvestPrice: 5200,
      pastYearPostHarvest60DPrice: 6050,
      pastYearGainPercent: '+16.3%'
    },
    liveMarketDynamics: {
      dailyArrivalTrend: 'Very Low (Off-season)',
      mandiArrivalPressure: 'Near zero spot arrivals',
      buyerDemand: 'Very High (Winter festive cooking oil season starting)',
      exportMomentum: 'Strong domestic oil refiner uptake',
      spotVolatility: 'Upward trend (+₹120/Qtl in last 15 days)'
    },
    aiAdvisory: {
      verdict: 'STORE_AND_SELL_LATER',
      badgeText: 'Store / Hold for Peak Winter (भंडारण करें)',
      actionColor: 'emerald',
      confidenceScore: 92,
      projectedPeakPrice: 6380,
      projectedTimeframe: 'November – December 2026',
      expectedGrossChange: '+9.1%',
      summaryHindi: 'सर्दियों में सरसों के तेल की खपत बढ़ने से रिफाइनरी कंपनियां ऊंचा प्रीमियम देंगी। वेयरहाउस में 2 महीने रोक कर बेचने पर प्रति क्विंटल ₹450-₹530 का शुद्ध लाभ मिलेगा।',
      summaryEnglish: 'Winter mustard oil consumption surge is imminent. Scientific holding till November captures peak processor margins, yielding attractive net returns after warehouse rent.'
    }
  },
  {
    id: 'cotton',
    name: 'Cotton / Kapas (कापूस / कपास - Medium/Long Staple)',
    hindiName: 'कपास',
    category: 'Fibers & Cash Crops',
    msp: 7122,
    currentAvgPrice: 7350,
    unit: '₹/Quintal',
    recommendedStorageType: 'Covered Fire-Safe Baling Godown',
    storageRatePerQtlDay: 1.10,
    shrinkageRatePercent: 1.2,
    optimalHoldingDays: 45,
    harvestCycle: {
      harvestPeriod: 'October – November (First Picking Arrivals)',
      glutArrivalPriceDip: '-7% dip in initial high-moisture picking',
      leanSeasonPriceSpike: '+12% recovery as second/third picking staple matures',
      pastYearHarvestPrice: 6900,
      pastYearPostHarvest60DPrice: 7750,
      pastYearGainPercent: '+12.3%'
    },
    liveMarketDynamics: {
      dailyArrivalTrend: 'Moderate (Early arrivals with higher moisture)',
      mandiArrivalPressure: 'Moderate (CCI active at MSP levels)',
      buyerDemand: 'Active (Spinning mills purchasing on quality assay)',
      exportMomentum: 'Yarn exports stable',
      spotVolatility: 'Stable above MSP'
    },
    aiAdvisory: {
      verdict: 'STORE_AND_SELL_LATER',
      badgeText: 'Dry & Hold in Godown for 45 Days (भंडारण करें)',
      actionColor: 'emerald',
      confidenceScore: 88,
      projectedPeakPrice: 7890,
      projectedTimeframe: 'Late November to Early December 2026',
      expectedGrossChange: '+7.3%',
      summaryHindi: 'शुरुआती कपास में नमी के कारण भाव कम मिल रहा है। सीसीआई खरीद केंद्र और कताई मिलें सूखे लाट के लिए ₹7,800+ का भाव देंगी। 45 दिन गोडाउन में सुखाकर रखें।',
      summaryEnglish: 'Early picking lots face moisture price cuts. Air-curing and warehousing for 40-50 days will enable grade-A staple realization with spinning mill direct contracts.'
    }
  },
  {
    id: 'chana',
    name: 'Gram / Chana (चना - Desi & Kabuli)',
    hindiName: 'चना',
    category: 'Pulses',
    msp: 5440,
    currentAvgPrice: 6150,
    unit: '₹/Quintal',
    recommendedStorageType: 'Fumigated Pulse Silo (PACS / CWC)',
    storageRatePerQtlDay: 0.70,
    shrinkageRatePercent: 0.7,
    optimalHoldingDays: 60,
    harvestCycle: {
      harvestPeriod: 'February – March',
      glutArrivalPriceDip: '-11% during March-April arrivals',
      leanSeasonPriceSpike: '+20% during festival & wedding sweet manufacturing season (Sept – Nov)',
      pastYearHarvestPrice: 5150,
      pastYearPostHarvest60DPrice: 6200,
      pastYearGainPercent: '+20.4%'
    },
    liveMarketDynamics: {
      dailyArrivalTrend: 'Very low',
      mandiArrivalPressure: 'Low',
      buyerDemand: 'Very High (Besan & Dal millers building inventories)',
      exportMomentum: 'Domestic consumption dominant',
      spotVolatility: 'Strong upward drift'
    },
    aiAdvisory: {
      verdict: 'STORE_AND_SELL_LATER',
      badgeText: 'Store in Pulse Silo for 60 Days (भंडारण करें)',
      actionColor: 'emerald',
      confidenceScore: 93,
      projectedPeakPrice: 6680,
      projectedTimeframe: 'October – November 2026',
      expectedGrossChange: '+8.6%',
      summaryHindi: 'त्योहारों में बेसन और मिठाई उद्योग में चने की मांग चरम पर रहती है। 60 दिन वेयरहाउस में रखने से ₹500/क्विंटल से अधिक का अतिरिक्त लाभ मिल सकता है।',
      summaryEnglish: 'Festive demand for gram flour (besan) and packaged snacks creates a seasonal supply squeeze. Certified pulse silo storage protects against weevils and delivers high ROI.'
    }
  },
  {
    id: 'maize',
    name: 'Maize / Corn (मक्का - Yellow Feed & Starch Grade)',
    hindiName: 'मक्का',
    category: 'Coarse Cereals & Feed',
    msp: 2090,
    currentAvgPrice: 2320,
    unit: '₹/Quintal',
    recommendedStorageType: 'Aerated Bulk Silo',
    storageRatePerQtlDay: 0.65,
    shrinkageRatePercent: 1.0,
    optimalHoldingDays: 45,
    harvestCycle: {
      harvestPeriod: 'September – October (Kharif Arrivals)',
      glutArrivalPriceDip: '-12% as fresh moisture-heavy cobs arrive',
      leanSeasonPriceSpike: '+16% recovery as ethanol distilleries and poultry feed plants procure',
      pastYearHarvestPrice: 2050,
      pastYearPostHarvest60DPrice: 2420,
      pastYearGainPercent: '+18.0%'
    },
    liveMarketDynamics: {
      dailyArrivalTrend: 'Increasing (+15% arrivals in South & West)',
      mandiArrivalPressure: 'Moderate to High',
      buyerDemand: 'High (Ethanol blending units & poultry feed compounders competing)',
      exportMomentum: 'Zero duty imports blocked; domestic price favored',
      spotVolatility: 'Stable'
    },
    aiAdvisory: {
      verdict: 'STORE_AND_SELL_LATER',
      badgeText: 'Dry & Store for 45 Days (भंडारण करें)',
      actionColor: 'emerald',
      confidenceScore: 87,
      projectedPeakPrice: 2540,
      projectedTimeframe: 'November 2026',
      expectedGrossChange: '+9.5%',
      summaryHindi: 'एथेनॉल और पोल्ट्री फीड उद्योग से लगातार मांग है। गीली मक्का अभी सस्ते में बिकेगी, लेकिन साइलो में सुखाकर 45 दिन रखने पर ₹200+/क्विंटल अधिक मिलेगा।',
      summaryEnglish: 'Starch and ethanol manufacturers are offering premiums for low-moisture maize lots. Drying and storing for 45 days maximizes net payout.'
    }
  },
  {
    id: 'potato',
    name: 'Potato (बटाटा / आलू - Jyoti & Pukhraj)',
    hindiName: 'आलू',
    category: 'Vegetables & Cold Store Roots',
    msp: 1200,
    currentAvgPrice: 1980,
    unit: '₹/Quintal',
    recommendedStorageType: 'Refrigerated Multi-Chamber Cold Store (2-4°C)',
    storageRatePerQtlDay: 0.95,
    shrinkageRatePercent: 3.0,
    optimalHoldingDays: 60,
    harvestCycle: {
      harvestPeriod: 'January – March (Cold store loading)',
      glutArrivalPriceDip: '-30% during field harvest',
      leanSeasonPriceSpike: '+45% during summer & monsoon (June – October)',
      pastYearHarvestPrice: 1350,
      pastYearPostHarvest60DPrice: 2100,
      pastYearGainPercent: '+55.5%'
    },
    liveMarketDynamics: {
      dailyArrivalTrend: 'Steady releases from cold storage',
      mandiArrivalPressure: 'Low to Moderate',
      buyerDemand: 'High (Chips/processing plants and retail mandis)',
      exportMomentum: 'Gulf exports active',
      spotVolatility: 'Firm at ₹1,900–₹2,050'
    },
    aiAdvisory: {
      verdict: 'STORE_AND_SELL_LATER',
      badgeText: 'Continue Cold Storage Till Diwali (भंडारण रखें)',
      actionColor: 'emerald',
      confidenceScore: 90,
      projectedPeakPrice: 2280,
      projectedTimeframe: 'October – Early November 2026',
      expectedGrossChange: '+15.1%',
      summaryHindi: 'कोल्ड स्टोरेज में रखे आलू की बाजार में अच्छी मांग बनी हुई है। दिवाली से पहले दाम ₹2,200-₹2,300 तक जाने की उम्मीद है। अभी न निकालें।',
      summaryEnglish: 'Cold store release margins remain highly favorable ahead of the festival peak. Maintaining cold storage till late October yields top realization.'
    }
  },
  {
    id: 'arhar',
    name: 'Arhar / Tur (तुअर / अरहर - Red Gram)',
    hindiName: 'अरहर / तुअर',
    category: 'Pulses & Legumes',
    msp: 7550,
    currentAvgPrice: 10450,
    unit: '₹/Quintal',
    recommendedStorageType: 'Scientific Dry Godown / WDRA Silo (e-NWR)',
    storageRatePerQtlDay: 0.80, // ₹24 / month / qtl
    shrinkageRatePercent: 0.5, // dry pulse storage maintains moisture stability
    optimalHoldingDays: 60,
    harvestCycle: {
      harvestPeriod: 'December – January (Kharif Harvest Arrivals)',
      glutArrivalPriceDip: '-15% to -20% dip during heavy post-harvest crop arrivals',
      leanSeasonPriceSpike: '+20% to +35% rally in festive and pre-sowing lean period (Aug – Nov)',
      pastYearHarvestPrice: 9350,
      pastYearPostHarvest60DPrice: 10450,
      pastYearGainPercent: '+11.8%'
    },
    benchmarkHistory: {
      source: 'Official Govt Historical Series (2016-2020)',
      prices: { 2016: 8011, 2017: 4374, 2018: 4001, 2019: 5016, 2020: 4958 },
      reboundRate: '+23.9% recovery from 2018 base'
    },
    liveMarketDynamics: {
      dailyArrivalTrend: 'Extremely thin lean arrivals (-35% month-on-month)',
      mandiArrivalPressure: 'Very Low (Pipeline supplies drying up)',
      buyerDemand: 'High (Dal millers actively competing for sound dry lots)',
      exportMomentum: 'Import parity elevated; strong domestic preference',
      spotVolatility: 'Bullish firmness (+₹150/Qtl over last fortnight)'
    },
    aiAdvisory: {
      verdict: 'STORE_AND_SELL_LATER',
      badgeText: 'Hold in Warehouse for 45–60 Days (भंडारण रखें)',
      actionColor: 'emerald',
      confidenceScore: 93,
      projectedPeakPrice: 11200,
      projectedTimeframe: 'Late October to Mid November 2026 (Diwali Peak)',
      expectedGrossChange: '+7.2%',
      summaryHindi: 'सरकारी आंकड़ों (2016 शिखर ₹8,011, 2018 न्यूनतम ₹4,001) के ऐतिहासिक चक्रों के अनुसार तुअर में त्योहारी सीजन में बड़ी तेजी आती है। 60 दिन वेयरहाउस में रखने पर किराया काटकर भी प्रति क्विंटल ₹600-₹750 का शुद्ध लाभ मिलेगा।',
      summaryEnglish: 'Historical multi-year cyclical patterns establish high storage profitability for Arhar ahead of Diwali. Storing for 45–60 days yields an estimated ₹600–₹750/Qtl net gain above warehouse and financing costs.'
    }
  },
  {
    id: 'urad',
    name: 'Urad / Black Gram (उड़द - Black Matpe)',
    hindiName: 'उड़द',
    category: 'Pulses & Legumes',
    msp: 7400,
    currentAvgPrice: 8750,
    unit: '₹/Quintal',
    recommendedStorageType: 'Dry Ventilated Warehouse (WDRA Certified)',
    storageRatePerQtlDay: 0.77, // ₹23.10 / month / qtl
    shrinkageRatePercent: 0.6,
    optimalHoldingDays: 50,
    harvestCycle: {
      harvestPeriod: 'September – October (Early Kharif Arrivals)',
      glutArrivalPriceDip: '-12% to -18% seasonal dip',
      leanSeasonPriceSpike: '+25% festival dal requirement surge',
      pastYearHarvestPrice: 7950,
      pastYearPostHarvest60DPrice: 8750,
      pastYearGainPercent: '+10.1%'
    },
    benchmarkHistory: {
      source: 'Official Govt Historical Series (2016-2020)',
      prices: { 2016: 7309, 2017: 3825, 2018: 3760, 2019: 4652, 2020: 5961 },
      reboundRate: '+58.5% recovery between 2018 and 2020'
    },
    liveMarketDynamics: {
      dailyArrivalTrend: 'Early arrivals starting in MP & Maharashtra',
      mandiArrivalPressure: 'Moderate',
      buyerDemand: 'High (Snack manufacturers and South Indian mills buying)',
      exportMomentum: 'Myanmar import landed parity firm',
      spotVolatility: 'Steady with strong festival support'
    },
    aiAdvisory: {
      verdict: 'STORE_AND_SELL_LATER',
      badgeText: 'Hold for Festive Peak (भंडारण रखें)',
      actionColor: 'emerald',
      confidenceScore: 91,
      projectedPeakPrice: 9400,
      projectedTimeframe: 'Late October to November 2026',
      expectedGrossChange: '+7.4%',
      summaryHindi: 'उड़द के सरकारी टाइम-सीरीज़ डेटा (2018 में ₹3,760 से 2020 में ₹5,961 तक +58.5% का उछाल) से स्पष्ट है कि उड़द में पोस्ट-हार्वेस्ट के बाद तीव्र उछाल आता है। दिवाली तक होल्ड करना अत्यधिक लाभदायक है।',
      summaryEnglish: 'Government time-series proves Urad holds the highest 2-year cyclical rebound (+58.5%). With Diwali and festive snack demand peaking, holding in WDRA godowns yields an estimated ₹500+/Qtl net surplus.'
    }
  },
  {
    id: 'moong',
    name: 'Moong / Green Gram (मूंग - Green Beans)',
    hindiName: 'मूंग',
    category: 'Pulses & Legumes',
    msp: 8682,
    currentAvgPrice: 8850,
    unit: '₹/Quintal',
    recommendedStorageType: 'Dry Grain Godown / Metal Bin Storage',
    storageRatePerQtlDay: 0.74, // ₹22.20 / month / qtl
    shrinkageRatePercent: 0.4,
    optimalHoldingDays: 60,
    harvestCycle: {
      harvestPeriod: 'September – October (Kharif Harvest)',
      glutArrivalPriceDip: '-10% to -14% dip cushioned by MSP operations',
      leanSeasonPriceSpike: '+15% to +22% steady appreciation',
      pastYearHarvestPrice: 8200,
      pastYearPostHarvest60DPrice: 8850,
      pastYearGainPercent: '+7.9%'
    },
    benchmarkHistory: {
      source: 'Official Govt Historical Series (2016-2020)',
      prices: { 2016: 5479, 2017: 4744, 2018: 4823, 2019: 5662, 2020: 6216 },
      reboundRate: 'Unbroken 4-year upward compounding trend (+28.9%)'
    },
    liveMarketDynamics: {
      dailyArrivalTrend: 'Rajasthan & MP arrivals commencing',
      mandiArrivalPressure: 'Moderate',
      buyerDemand: 'Very High (Dal mills, sprout processors, and NAFED buying)',
      exportMomentum: 'Steady domestic consumption',
      spotVolatility: 'Low downside volatility, protected by MSP floor ₹8,682'
    },
    aiAdvisory: {
      verdict: 'STORE_AND_SELL_LATER',
      badgeText: 'Store in Silo (कम जोखिम, स्थिर लाभ)',
      actionColor: 'emerald',
      confidenceScore: 95,
      projectedPeakPrice: 9650,
      projectedTimeframe: 'November to Early December 2026',
      expectedGrossChange: '+9.0%',
      summaryHindi: 'मूंग में 2017 से 2020 तक लगातार 4 वर्षों तक अटूट वार्षिक वृद्धि (₹4,744 → ₹4,823 → ₹5,662 → ₹6,216) दर्ज हुई है। यह सबसे सुरक्षित दलहन फसल है। 60 दिन का भंडारण सुरक्षित रूप से ₹650/क्विंटल से अधिक अतिरिक्त लाभ दिलाएगा।',
      summaryEnglish: 'Official multi-year data demonstrates an unbroken 4-year bull cycle for Moong. With minimal storage risk and solid MSP backing, warehousing for 60 days provides consistent, high-probability gains.'
    }
  }
];

// ─── ACCREDITED WAREHOUSE & COLD STORAGE DIRECTORY ───────────────────────────
export const ACCREDITED_STORAGES = [
  // Maharashtra - Nashik Cluster
  {
    id: 'WH-NSK-01',
    name: 'MahaAgro Mega Cold Chain & Logistics Hub',
    district: 'Nashik',
    state: 'Maharashtra',
    village: 'Mohadi, Dindori MIDC',
    distanceKm: 14,
    suitableCrops: ['onion', 'potato', 'tomato', 'grapes', 'wheat'],
    type: 'Controlled Atmosphere (CA) Cold Storage',
    totalCapacityMt: 10000,
    availableCapacityMt: 4200,
    ratePerQtlDay: 1.15,
    ratePerQtlMonth: 34.50,
    accreditation: 'WDRA Registered • e-NWR Linked • Govt 35% Subsidy Hub',
    phone: '+91 253 299100',
    rating: 4.9,
    facilities: ['Electronic Weighbridge', 'Solar Backup', 'Pre-Cooling Cells', 'Direct APMC Rail Siding'],
    pledgeLoanAvailable: true
  },
  {
    id: 'WH-NSK-02',
    name: 'Niphad Taluka Kisan Bhandaran Silo (PACS)',
    district: 'Nashik',
    state: 'Maharashtra',
    village: 'Pimpalas, Niphad',
    distanceKm: 6,
    suitableCrops: ['wheat', 'chana', 'soybean', 'maize'],
    type: 'Scientific Steel Grain Silo',
    totalCapacityMt: 6000,
    availableCapacityMt: 2800,
    ratePerQtlDay: 0.70,
    ratePerQtlMonth: 21.00,
    accreditation: 'WDRA Certified • FCI & NAFED Approved Node',
    phone: '+91 2554 224150',
    rating: 4.8,
    facilities: ['Aeration Fans', 'Moisture Meter Assaying', 'Weevil Fumigation', 'Instant Token Entry'],
    pledgeLoanAvailable: true
  },
  {
    id: 'WH-NSK-03',
    name: 'Lasalgaon APMC Modern Onion Chawl Federation',
    district: 'Nashik',
    state: 'Maharashtra',
    village: 'Lasalgaon Mandi Yard',
    distanceKm: 18,
    suitableCrops: ['onion', 'garlic'],
    type: 'Ventilated Solar Onion Chawl',
    totalCapacityMt: 8000,
    availableCapacityMt: 3100,
    ratePerQtlDay: 0.90,
    ratePerQtlMonth: 27.00,
    accreditation: 'Maharashtra Agri Marketing Board (MSAMB) Certified',
    phone: '+91 2550 250080',
    rating: 4.7,
    facilities: ['Draft Air Circulation', 'Low Rotten Loss Guarantee', 'Spot Mandi Conveyor Belt'],
    pledgeLoanAvailable: true
  },
  // Maharashtra - Latur Cluster
  {
    id: 'WH-LTR-01',
    name: 'Marathwada Oilseed Silo & Warehousing Corp',
    district: 'Latur',
    state: 'Maharashtra',
    village: 'Murud, Latur',
    distanceKm: 12,
    suitableCrops: ['soybean', 'chana', 'mustard'],
    type: 'Scientific Dry Grain Godown',
    totalCapacityMt: 12000,
    availableCapacityMt: 5400,
    ratePerQtlDay: 0.75,
    ratePerQtlMonth: 22.50,
    accreditation: 'WDRA Certified • NABARD Supported',
    phone: '+91 2382 259000',
    rating: 4.9,
    facilities: ['Solvent Plant Direct Pipeline', 'Quality Assayer Lab', 'e-NWR 70% Loan Desk'],
    pledgeLoanAvailable: true
  },
  // Madhya Pradesh - Indore Cluster
  {
    id: 'WH-IND-01',
    name: 'Malwa Agro Warehousing & Grain Silos Ltd',
    district: 'Indore',
    state: 'Madhya Pradesh',
    village: 'Sanwer Road, Indore',
    distanceKm: 16,
    suitableCrops: ['wheat', 'soybean', 'chana', 'garlic', 'potato'],
    type: 'Multi-Commodity Dry Silo & Cold Store',
    totalCapacityMt: 15000,
    availableCapacityMt: 6800,
    ratePerQtlDay: 0.80,
    ratePerQtlMonth: 24.00,
    accreditation: 'Central Warehousing Corporation (CWC) Linked',
    phone: '+91 731 2400100',
    rating: 4.9,
    facilities: ['Steel Silo Automation', 'FCI Weighbridge', 'SBI Agri Pledge Desk'],
    pledgeLoanAvailable: true
  },
  // Punjab - Ludhiana Cluster
  {
    id: 'WH-LDH-01',
    name: 'Punjab State Warehousing Silo Complex',
    district: 'Ludhiana',
    state: 'Punjab',
    village: 'GT Road, Khanna',
    distanceKm: 11,
    suitableCrops: ['wheat', 'maize', 'paddy'],
    type: 'High-Tech Temperature Controlled Silo',
    totalCapacityMt: 25000,
    availableCapacityMt: 11000,
    ratePerQtlDay: 0.65,
    ratePerQtlMonth: 19.50,
    accreditation: 'WDRA Certified • Asia Largest Mandi Feeder',
    phone: '+91 1628 221050',
    rating: 5.0,
    facilities: ['Automated Grain Sampling', 'Rail Loading Gantry', 'Online Token Booking'],
    pledgeLoanAvailable: true
  }
];

// Seed storage bookings
const INITIAL_STORAGE_BOOKINGS = [
  {
    id: 'ST-BK-901',
    warehouseId: 'WH-NSK-02',
    warehouseName: 'Niphad Taluka Kisan Bhandaran Silo (PACS)',
    farmerId: 'farmer-dnyaneshwar',
    farmerName: 'Dnyaneshwar Patil',
    cropName: 'Wheat (Sharbati & Lokwan)',
    quantityQtl: 80,
    startDate: '2026-09-08',
    durationDays: 75,
    expiryDate: '2026-11-22',
    dailyRate: 0.70,
    estimatedTotalCost: 4200,
    enwrReceiptNo: 'ENWR-MH-2026-88910',
    pledgeLoanEligible: 152320,
    status: 'ACTIVE_STORED', // 'ACTIVE_STORED' | 'PENDING_DELIVERY' | 'COMPLETED'
    location: 'Pimpalas, Niphad, Nashik',
    phone: '+91 2554 224150'
  }
];

// ─── AGENTIC ENGINE & CALCULATOR ─────────────────────────────────────────────

class StorageAiService {
  constructor() {
    this._initStorage();
  }

  _initStorage() {
    if (typeof window === 'undefined') return;
    try {
      if (!localStorage.getItem(STORAGE_KEY_BOOKINGS)) {
        localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(INITIAL_STORAGE_BOOKINGS));
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for storageAiService', e);
    }
  }

  /**
   * Run the complete Agentic AI Evaluation for a crop, quantity, and holding period
   */
  runAdvisoryAgent({
    cropId = 'wheat',
    quantityQtl = 100,
    locationDistrict = 'Nashik',
    locationState = 'Maharashtra',
    customHoldingDays = null
  }) {
    const crop = STORAGE_AI_CROPS.find(c => c.id === cropId) || STORAGE_AI_CROPS[0];
    const qty = Number(quantityQtl) || 100;
    const holdingDays = customHoldingDays !== null ? Number(customHoldingDays) : crop.optimalHoldingDays;

    // 1. Current spot valuation (Selling today)
    const currentSpotPrice = crop.currentAvgPrice;
    const revenueToday = Math.round(qty * currentSpotPrice);

    // 2. Projected future valuation after holdingDays
    let projectedFuturePrice = crop.aiAdvisory.projectedPeakPrice;
    if (crop.aiAdvisory.verdict === 'SELL_NOW') {
      projectedFuturePrice = crop.aiAdvisory.projectedPeakPrice;
    }

    // Shrinkage loss calculation
    const shrinkageLossQtl = Number(((qty * crop.shrinkageRatePercent) / 100).toFixed(1));
    const effectiveSoldQtl = Number((qty - shrinkageLossQtl).toFixed(1));
    const grossFutureRevenue = Math.round(effectiveSoldQtl * projectedFuturePrice);

    // 3. Storage and handling expenses
    const daysToStore = holdingDays > 0 ? holdingDays : 1;
    const totalStorageRent = Math.round(qty * crop.storageRatePerQtlDay * daysToStore);
    const laborAndBagging = Math.round(qty * 6); // ₹6/Qtl inward-outward labor
    const totalHoldingExpense = totalStorageRent + laborAndBagging;

    // 4. Net Future Realization
    const netFutureRevenue = grossFutureRevenue - totalHoldingExpense;
    const netProfitDifference = netFutureRevenue - revenueToday;
    const netRoiPercent = Number(((netProfitDifference / revenueToday) * 100).toFixed(1));

    // 5. e-NWR Pledge Loan (70% instant pledge value at 7% annual interest)
    const eNwrPledgeLoanValue = Math.round(revenueToday * 0.70);
    const monthlyLoanInterest = Math.round((eNwrPledgeLoanValue * 0.07) / 12);

    // 6. Matched nearby storages
    const nearbyStorages = this.getNearbyStorages({
      cropId: crop.id,
      state: locationState,
      district: locationDistrict
    });

    return {
      crop,
      quantityQtl: qty,
      holdingDays: daysToStore,
      verdict: crop.aiAdvisory.verdict,
      badgeText: crop.aiAdvisory.badgeText,
      actionColor: crop.aiAdvisory.actionColor,
      confidenceScore: crop.aiAdvisory.confidenceScore,
      projectedTimeframe: crop.aiAdvisory.projectedTimeframe,
      
      // Financial breakdown
      financials: {
        currentSpotPrice,
        revenueToday,
        projectedFuturePrice,
        grossFutureRevenue,
        shrinkageLossQtl,
        effectiveSoldQtl,
        totalStorageRent,
        laborAndBagging,
        totalHoldingExpense,
        netFutureRevenue,
        netProfitDifference,
        netRoiPercent,
        eNwrPledgeLoanValue,
        monthlyLoanInterest
      },

      // Historical context & live dynamics
      harvestCycle: crop.harvestCycle,
      liveMarketDynamics: crop.liveMarketDynamics,
      aiSummaryHindi: crop.aiAdvisory.summaryHindi,
      aiSummaryEnglish: crop.aiAdvisory.summaryEnglish,

      // Recommended nearby storages
      nearbyStorages
    };
  }

  /**
   * Filter and sort nearby accredited storages
   */
  getNearbyStorages({ cropId, state, district }) {
    let list = [...ACCREDITED_STORAGES];

    if (cropId) {
      list = list.filter(s => s.suitableCrops.includes(cropId) || s.suitableCrops.includes('wheat'));
    }

    // Sort by location match then distance
    list.sort((a, b) => {
      const aStateMatch = a.state.toLowerCase() === (state || '').toLowerCase() ? -100 : 0;
      const bStateMatch = b.state.toLowerCase() === (state || '').toLowerCase() ? -100 : 0;
      const aDistMatch = a.district.toLowerCase() === (district || '').toLowerCase() ? -50 : 0;
      const bDistMatch = b.district.toLowerCase() === (district || '').toLowerCase() ? -50 : 0;

      const scoreA = aStateMatch + aDistMatch + a.distanceKm;
      const scoreB = bStateMatch + bDistMatch + b.distanceKm;
      return scoreA - scoreB;
    });

    return list;
  }

  // ─── STORAGE BOOKING OPERATIONS ─────────────────────────────────────────────

  getBookings(filter = {}) {
    if (typeof window === 'undefined') return INITIAL_STORAGE_BOOKINGS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_BOOKINGS);
      let list = raw ? JSON.parse(raw) : INITIAL_STORAGE_BOOKINGS;
      if (filter.farmerId) {
        list = list.filter(b => b.farmerId === filter.farmerId);
      }
      return list;
    } catch (e) {
      console.error(e);
      return INITIAL_STORAGE_BOOKINGS;
    }
  }

  createBooking({
    warehouseId,
    warehouseName,
    farmerId = 'farmer-dnyaneshwar',
    farmerName = 'Dnyaneshwar Patil',
    cropName = 'Wheat (Sharbati & Lokwan)',
    quantityQtl = 100,
    durationDays = 60,
    dailyRate = 0.75,
    location = 'Niphad, Nashik'
  }) {
    const qty = Number(quantityQtl) || 100;
    const days = Number(durationDays) || 60;
    const rate = Number(dailyRate) || 0.75;
    const totalCost = Math.round(qty * rate * days);
    const pledgeLoan = Math.round(qty * 2720 * 0.70);

    const now = new Date();
    const expiry = new Date();
    expiry.setDate(now.getDate() + days);

    const newBooking = {
      id: `ST-BK-${Date.now().toString().slice(-4)}`,
      warehouseId: warehouseId || 'WH-NSK-01',
      warehouseName: warehouseName || 'MahaAgro Mega Cold Storage Hub',
      farmerId,
      farmerName,
      cropName,
      quantityQtl: qty,
      startDate: now.toISOString().split('T')[0],
      durationDays: days,
      expiryDate: expiry.toISOString().split('T')[0],
      dailyRate: rate,
      estimatedTotalCost: totalCost,
      enwrReceiptNo: `ENWR-MH-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      pledgeLoanEligible: pledgeLoan,
      status: 'ACTIVE_STORED',
      location: location,
      bookedAt: now.toISOString()
    };

    const list = this.getBookings();
    list.unshift(newBooking);
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(list));
    this._dispatch(EVENT_BOOKINGS_UPDATED, newBooking);
    return newBooking;
  }

  cancelBooking(bookingId) {
    const list = this.getBookings();
    const updated = list.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b);
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
    this._dispatch(EVENT_BOOKINGS_UPDATED);
  }

  subscribe(callback) {
    if (typeof window === 'undefined') return () => {};
    const handler = () => callback();
    window.addEventListener(EVENT_BOOKINGS_UPDATED, handler);
    return () => window.removeEventListener(EVENT_BOOKINGS_UPDATED, handler);
  }

  _dispatch(eventName, detail) {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
}

export const storageAiService = new StorageAiService();
export default storageAiService;
