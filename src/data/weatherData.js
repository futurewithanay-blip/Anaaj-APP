export const WEATHER_DATA = {
  "Maharashtra": [
    {
      district: "Nashik",
      state: "Maharashtra",
      temp: "29°C",
      tempMin: "19°C",
      tempMax: "32°C",
      humidity: "62%",
      windSpeed: "14 km/h",
      rainfallForecast: "Light showers expected in 48h (3-7mm)",
      bulletinNo: "IMD-MEGHDOOT-MH/NSK/2026/38",
      validTill: "Valid till Sunday, 07 Sept 2026",
      advisories: [
        {
          crop: "Onion / कांदा",
          stage: "Bulb Development / Harvesting",
          recommendation: "Due to expected cloudy weather and light drizzle in 48 hours, complete harvesting of mature onion bulbs immediately and dry them in shaded ventilated sheds. Postpone irrigation by 3 days.",
          severity: "warning"
        },
        {
          crop: "Grapes / द्राक्षे",
          stage: "Canopy Management",
          recommendation: "Spray Bordeaux mixture 1% or copper oxychloride @ 2.5 g/L to prevent downy mildew infection following pre-monsoon showers.",
          severity: "info"
        },
        {
          crop: "Tomato / टोमॅटो",
          stage: "Fruiting",
          recommendation: "Provide staking support to plants against gusty winds. Avoid spraying chemical pesticides during rain hours.",
          severity: "success"
        }
      ]
    },
    {
      district: "Pune",
      state: "Maharashtra",
      temp: "28°C",
      tempMin: "20°C",
      tempMax: "31°C",
      humidity: "68%",
      windSpeed: "12 km/h",
      rainfallForecast: "Moderate rainfall (15-25mm) in next 24h",
      bulletinNo: "IMD-MEGHDOOT-MH/PUN/2026/41",
      validTill: "Valid till Monday, 08 Sept 2026",
      advisories: [
        {
          crop: "Sugarcane / ऊस",
          stage: "Grand Growth",
          recommendation: "Ensure proper drainage in low-lying fields to avoid waterlogging. Top dressing of urea with neem cake recommended after soil moisture levels ease.",
          severity: "info"
        },
        {
          crop: "Soybean / सोयाबीन",
          stage: "Pod Filling",
          recommendation: "Monitor for Spodoptera litura (caterpillar). Install 5 pheromone traps per acre.",
          severity: "warning"
        }
      ]
    },
    {
      district: "Nagpur",
      state: "Maharashtra",
      temp: "33°C",
      tempMin: "22°C",
      tempMax: "35°C",
      humidity: "48%",
      windSpeed: "9 km/h",
      rainfallForecast: "Dry & Sunny weather for next 5 days",
      bulletinNo: "IMD-MEGHDOOT-MH/NGP/2026/36",
      validTill: "Valid till Friday, 05 Sept 2026",
      advisories: [
        {
          crop: "Cotton / कापूस",
          stage: "Square & Boll Formation",
          recommendation: "Ideal condition for foliar spray of 19:19:19 (100g/10L water) along with micronutrients to enhance boll weight and reduce shedding.",
          severity: "success"
        },
        {
          crop: "Orange / संत्रा (Citrus)",
          stage: "Fruit Development",
          recommendation: "Maintain light regular irrigation through drip to prevent fruit cracking in high afternoon temperatures.",
          severity: "info"
        }
      ]
    }
  ],
  "Gujarat": [
    {
      district: "Rajkot",
      state: "Gujarat",
      temp: "32°C",
      tempMin: "24°C",
      tempMax: "36°C",
      humidity: "55%",
      windSpeed: "16 km/h",
      rainfallForecast: "Clear skies & dry winds",
      bulletinNo: "IMD-MEGHDOOT-GJ/RJT/2026/19",
      validTill: "Valid till Monday, 08 Sept 2026",
      advisories: [
        {
          crop: "Groundnut / મગફળી",
          stage: "Pegging & Pod Formation",
          recommendation: "Apply light irrigation at pegging stage. Spray Chlorpyrifos 20 EC @ 2ml/L to control white grub.",
          severity: "warning"
        },
        {
          crop: "Cotton / કપાસ",
          stage: "Flowering",
          recommendation: "Spray 1% Potassium Nitrate (10g/L) for better boll development during sunny dry spells.",
          severity: "success"
        }
      ]
    },
    {
      district: "Junagadh",
      state: "Gujarat",
      temp: "31°C",
      tempMin: "23°C",
      tempMax: "34°C",
      humidity: "64%",
      windSpeed: "18 km/h",
      rainfallForecast: "Scattered light rain expected",
      bulletinNo: "IMD-MEGHDOOT-GJ/JND/2026/22",
      validTill: "Valid till Sunday, 07 Sept 2026",
      advisories: [
        {
          crop: "Mango / કેરી",
          stage: "Post-harvest maintenance",
          recommendation: "Prune dry branches and apply copper oxychloride paste on cut surfaces to protect trees.",
          severity: "info"
        }
      ]
    }
  ],
  "Madhya Pradesh": [
    {
      district: "Indore",
      state: "Madhya Pradesh",
      temp: "30°C",
      tempMin: "21°C",
      tempMax: "33°C",
      humidity: "58%",
      windSpeed: "11 km/h",
      rainfallForecast: "Partly cloudy with light showers",
      bulletinNo: "IMD-MEGHDOOT-MP/IND/2026/14",
      validTill: "Valid till Sunday, 07 Sept 2026",
      advisories: [
        {
          crop: "Soybean / सोयाबीन",
          stage: "Pod maturation",
          recommendation: "Ensure field drainage to avoid root rot. Monitor for girdle beetle infestation.",
          severity: "warning"
        },
        {
          crop: "Wheat / गेहूं (Planning)",
          stage: "Field Preparation",
          recommendation: "Deep plowing advised to expose soil-borne pests to high daytime sun radiation.",
          severity: "success"
        }
      ]
    }
  ],
  "Punjab": [
    {
      district: "Ludhiana",
      state: "Punjab",
      temp: "34°C",
      tempMin: "25°C",
      tempMax: "37°C",
      humidity: "50%",
      windSpeed: "8 km/h",
      rainfallForecast: "Dry weather expected",
      bulletinNo: "IMD-MEGHDOOT-PB/LDH/2026/09",
      validTill: "Valid till Monday, 08 Sept 2026",
      advisories: [
        {
          crop: "Paddy / ਝੋਨਾ (Rice)",
          stage: "Panicle Initiation",
          recommendation: "Maintain 5 cm standing water layer. Apply second split dose of Urea fertilizer @ 35 kg/acre.",
          severity: "info"
        },
        {
          crop: "Basmati Rice",
          stage: "Tillering",
          recommendation: "Inspect crop regularly for stem borer and leaf folder attack. Spray Cartap Hydrochloride 50 SP if needed.",
          severity: "warning"
        }
      ]
    }
  ]
};

// Fallback for legacy imports if needed
export const DISTRICT_WEATHER_ADVISORIES = WEATHER_DATA["Maharashtra"];

