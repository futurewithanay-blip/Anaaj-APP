export const DISTRICT_WEATHER_ADVISORIES = [
  {
    district: "Nashik, Maharashtra",
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
    district: "Pune, Maharashtra",
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
    district: "Nagpur, Maharashtra",
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
];
