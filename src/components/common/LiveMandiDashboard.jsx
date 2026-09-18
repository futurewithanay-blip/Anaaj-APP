import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  Printer,
  Download,
  ChevronRight,
  ChevronDown,
  Zap,
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Check,
  X,
  Layers,
  Sprout,
  Landmark,
  ShieldCheck,
  Building2,
  Radio
} from 'lucide-react';
import {
  OFFICIAL_ENAM_STATE_DATA,
  ENAM_NATIONAL_SUMMARY
} from '../../data/officialGovtBenchmarkData';
import VoiceInputMic from './VoiceInputMic';
import { getLiveMandiPrices } from '../../services/apiClient';


import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

/* ─────────────────────────────────────────────────────────────────────────────
   ALL INDIA STATES & UNION TERRITORIES (36 States / UTs)
───────────────────────────────────────────────────────────────────────────── */
export const ALL_INDIA_STATES = [
  { code: 'ALL', label: 'All States/UTs' },
  { code: 'AP', label: 'Andhra Pradesh' },
  { code: 'AR', label: 'Arunachal Pradesh' },
  { code: 'AS', label: 'Assam' },
  { code: 'BR', label: 'Bihar' },
  { code: 'CH', label: 'Chandigarh' },
  { code: 'CG', label: 'Chhattisgarh' },
  { code: 'DN', label: 'Dadra and Nagar Haveli and Daman and Diu' },
  { code: 'DL', label: 'Delhi' },
  { code: 'GA', label: 'Goa' },
  { code: 'GJ', label: 'Gujarat' },
  { code: 'HR', label: 'Haryana' },
  { code: 'HP', label: 'Himachal Pradesh' },
  { code: 'JK', label: 'Jammu and Kashmir' },
  { code: 'JH', label: 'Jharkhand' },
  { code: 'KA', label: 'Karnataka' },
  { code: 'KL', label: 'Kerala' },
  { code: 'LA', label: 'Ladakh' },
  { code: 'LD', label: 'Lakshadweep' },
  { code: 'MP', label: 'Madhya Pradesh' },
  { code: 'MH', label: 'Maharashtra' },
  { code: 'MN', label: 'Manipur' },
  { code: 'ML', label: 'Meghalaya' },
  { code: 'MZ', label: 'Mizoram' },
  { code: 'NL', label: 'Nagaland' },
  { code: 'OD', label: 'Odisha' },
  { code: 'PY', label: 'Puducherry' },
  { code: 'PB', label: 'Punjab' },
  { code: 'RJ', label: 'Rajasthan' },
  { code: 'SK', label: 'Sikkim' },
  { code: 'TN', label: 'Tamil Nadu' },
  { code: 'TS', label: 'Telangana' },
  { code: 'TR', label: 'Tripura' },
  { code: 'UP', label: 'Uttar Pradesh' },
  { code: 'UK', label: 'Uttarakhand' },
  { code: 'WB', label: 'West Bengal' },
];

/* ─────────────────────────────────────────────────────────────────────────────
   DISTRICTS MAP PER STATE
───────────────────────────────────────────────────────────────────────────── */
export const STATE_DISTRICTS_MAP = {
  ALL: ['All Districts', 'Prayagraj', 'Nashik', 'Pune', 'Indore', 'Ludhiana', 'Karnal', 'Jaipur', 'Rajkot', 'Lucknow', 'Varanasi', 'Bhopal', 'Ahmedabad', 'Patna', 'Bengaluru'],
  UP: [
    'All Districts', 'Prayagraj', 'Lucknow', 'Varanasi', 'Kanpur', 'Agra', 'Meerut', 'Bareilly',
    'Gorakhpur', 'Aligarh', 'Mathura', 'Ayodhya', 'Jhansi', 'Moradabad', 'Saharanpur', 'Muzaffarnagar',
    'Sitapur', 'Mirzapur', 'Banda', 'Barabanki', 'Unnao', 'Hardoi', 'Fatehpur', 'Rae Bareli',
    'Ballia', 'Jaunpur', 'Ghazipur', 'Deoria', 'Basti', 'Gonda', 'Bahraich', 'Azamgarh', 'Mau'
  ],
  MH: [
    'All Districts', 'Nashik', 'Pune', 'Ahmednagar', 'Nagpur', 'Latur', 'Solapur', 'Kolhapur',
    'Jalgaon', 'Amravati', 'Chhatrapati Sambhaji Nagar', 'Thane', 'Mumbai', 'Yavatmal', 'Akola',
    'Nanded', 'Satara', 'Sangli', 'Dhule', 'Nandurbar', 'Beed', 'Buldhana', 'Jalna', 'Dharashiv',
    'Parbhani', 'Wardha', 'Chandrapur', 'Raigad', 'Ratnagiri', 'Sindhudurg'
  ],
  MP: [
    'All Districts', 'Indore', 'Bhopal', 'Ujjain', 'Jabalpur', 'Gwalior', 'Sagar', 'Dewas',
    'Khandwa', 'Chhindwara', 'Mandsaur', 'Neemuch', 'Vidisha', 'Narmadapuram', 'Ratlam', 'Dhar',
    'Khargone', 'Sehore', 'Harda', 'Shivpuri', 'Rewa', 'Satna', 'Morena', 'Bhind', 'Katni'
  ],
  PB: [
    'All Districts', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Sangrur',
    'Firozpur', 'Hoshiarpur', 'Moga', 'Fazilka', 'Mansa', 'Kapurthala', 'Muktsar', 'Barnala',
    'Faridkot', 'Fatehgarh Sahib', 'Gurdaspur', 'Pathankot', 'Rupnagar', 'Tarn Taran'
  ],
  HR: [
    'All Districts', 'Karnal', 'Ambala', 'Hisar', 'Rohtak', 'Panipat', 'Sirsa', 'Kurukshetra',
    'Sonipat', 'Jind', 'Fatehabad', 'Yamunanagar', 'Kaithal', 'Gurugram', 'Faridabad', 'Rewari',
    'Bhiwani', 'Jhajjar', 'Palwal', 'Mahendragarh'
  ],
  RJ: [
    'All Districts', 'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Sri Ganganagar', 'Alwar', 'Nagaur',
    'Hanumangarh', 'Bharatpur', 'Ajmer', 'Sikar', 'Udaipur', 'Bhilwara', 'Pali', 'Chittorgarh',
    'Tonk', 'Baran', 'Bundi', 'Jhalawar', 'Churu', 'Dausa'
  ],
  GJ: [
    'All Districts', 'Ahmedabad', 'Rajkot', 'Surat', 'Vadodara', 'Mehsana', 'Junagadh', 'Gondal',
    'Anand', 'Bhavnagar', 'Jamnagar', 'Amreli', 'Banaskantha', 'Patan', 'Kheda', 'Dahod',
    'Surendranagar', 'Bharuch', 'Navsari', 'Valsad', 'Porbandar'
  ],
  BR: [
    'All Districts', 'Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga', 'Purnia',
    'Begusarai', 'Arrah', 'Samastipur', 'Katihar', 'Munger', 'Chhapra', 'Sasaram', 'Bettiah'
  ],
  KA: [
    'All Districts', 'Bengaluru', 'Belagavi', 'Hubballi-Dharwad', 'Mysuru', 'Kalaburagi',
    'Davanagere', 'Ballari', 'Vijayapura', 'Shivamogga', 'Tumakuru', 'Raichur', 'Bidar', 'Hassan'
  ],
  WB: [
    'All Districts', 'Kolkata', 'Siliguri', 'Burdwan', 'Hooghly', 'Murshidabad', 'Nadia',
    'Malda', 'Jalpaiguri', 'Midnapore', 'Bankura', 'Birbhum', 'Howrah', 'North 24 Parganas'
  ],
  TS: [
    'All Districts', 'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam',
    'Mahabubnagar', 'Nalgonda', 'Adilabad', 'Medak', 'Rangareddy', 'Siddipet', 'Suryapet'
  ],
  TN: [
    'All Districts', 'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
    'Erode', 'Tirunelveli', 'Thanjavur', 'Dindigul', 'Vellore', 'Thoothukudi', 'Tiruppur'
  ],
  AP: [
    'All Districts', 'Visakhapatnam', 'Vijayawada', 'Guntur', 'Kurnool', 'Nellore',
    'Tirupati', 'Anantapur', 'Chittoor', 'Kadapa', 'Kakinada', 'Rajahmundry', 'Eluru'
  ],
  OD: [
    'All Districts', 'Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur', 'Balasore',
    'Berhampur', 'Bargarh', 'Bhadrak', 'Puri', 'Jeypore', 'Angul', 'Bolangir'
  ],
  CG: [
    'All Districts', 'Raipur', 'Bilaspur', 'Durg', 'Rajnandgaon', 'Korba', 'Jagdalpur',
    'Raigarh', 'Ambikapur', 'Dhamtari', 'Mahasamund'
  ],
  JH: [
    'All Districts', 'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar',
    'Giridih', 'Ramgarh', 'Dumka', 'Chaibasa'
  ],
  AS: [
    'All Districts', 'Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat', 'Nagaon', 'Tezpur',
    'Tinsukia', 'Bongaigaon', 'Barpeta'
  ],
  KL: [
    'All Districts', 'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Palakkad',
    'Wayanad', 'Kottayam', 'Kollam', 'Alappuzha', 'Kannur', 'Idukki'
  ],
  UK: [
    'All Districts', 'Dehradun', 'Haridwar', 'Udham Singh Nagar', 'Nainital', 'Almora',
    'Pauri Garhwal', 'Tehri Garhwal', 'Rudraprayag'
  ],
  HP: [
    'All Districts', 'Shimla', 'Mandi', 'Kangra', 'Kullu', 'Solan', 'Una', 'Hamirpur', 'Bilaspur'
  ],
  JK: [
    'All Districts', 'Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur', 'Kathua', 'Pulwama'
  ],
  DL: [
    'All Districts', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi',
    'Najafgarh', 'Narela', 'Azadpur'
  ],
  GA: ['All Districts', 'North Goa', 'South Goa', 'Panaji', 'Margao'],
  CH: ['All Districts', 'Chandigarh'],
  PY: ['All Districts', 'Puducherry', 'Karaikal'],
  TR: ['All Districts', 'Agartala', 'Udaipur'],
  MN: ['All Districts', 'Imphal', 'Thoubal'],
  ML: ['All Districts', 'Shillong', 'Tura'],
  MZ: ['All Districts', 'Aizawl', 'Lunglei'],
  NL: ['All Districts', 'Kohima', 'Dimapur'],
  SK: ['All Districts', 'Gangtok', 'Namchi'],
  AR: ['All Districts', 'Itanagar', 'Tawang'],
  LA: ['All Districts', 'Leh', 'Kargil'],
  LD: ['All Districts', 'Kavaratti'],
  DN: ['All Districts', 'Daman', 'Diu', 'Silvassa'],
};

/* ─────────────────────────────────────────────────────────────────────────────
   MARKETS / APMC MAP PER DISTRICT
───────────────────────────────────────────────────────────────────────────── */
export const DISTRICT_MARKETS_MAP = {
  'All Districts': ['All Markets', 'Lasalgaon APMC', 'Pimpalgaon APMC', 'Navi Mumbai APMC', 'Pune APMC', 'Prayagraj Mandi', 'Indore APMC', 'Khanna APMC', 'Karnal Mandi', 'Kota APMC', 'Rajkot APMC'],
  Prayagraj: ['All Markets', 'Prayagraj Mandi', 'Jasra Mandi', 'Sirsa Mandi', 'Phulpur Mandi', 'Koraon Mandi'],
  Lucknow: ['All Markets', 'Lucknow APMC', 'Dubagga Mandi', 'Sitapur Road Mandi'],
  Varanasi: ['All Markets', 'Varanasi APMC', 'Panchkoshi Mandi', 'Raja Ka Talab Mandi'],
  Kanpur: ['All Markets', 'Chakeri Mandi', 'Naubasta APMC', 'Chaubeypur Mandi'],
  Agra: ['All Markets', 'Agra APMC', 'Fatehabad Mandi', 'Achhnera Mandi'],
  Nashik: ['All Markets', 'Lasalgaon APMC', 'Pimpalgaon APMC', 'Yeola Mandi', 'Chandwad Mandi', 'Malegaon Mandi', 'Nashik Dindori APMC', 'Sinnar Mandi'],
  Pune: ['All Markets', 'Pune Gultekdi APMC', 'Narayangaon APMC', 'Junnar Mandi', 'Manchar Mandi', 'Khed APMC', 'Baramati APMC'],
  Nagpur: ['All Markets', 'Nagpur Cotton Market APMC', 'Kalmeshwar Mandi', 'Katol APMC'],
  Latur: ['All Markets', 'Latur APMC', 'Ausa Mandi', 'Udgir APMC'],
  Ahmednagar: ['All Markets', 'Rahata APMC', 'Shrirampur Mandi', 'Kopargaon APMC', 'Shevgaon Mandi'],
  Indore: ['All Markets', 'Indore Choithram APMC', 'Sanwer Mandi', 'Mhow APMC', 'Depalpur Mandi'],
  Ujjain: ['All Markets', 'Ujjain Chimanganj APMC', 'Tarana Mandi', 'Nagda Mandi'],
  Bhopal: ['All Markets', 'Bhopal Karond APMC', 'Berasia Mandi'],
  Ludhiana: ['All Markets', 'Khanna APMC', 'Ludhiana Dana Mandi', 'Jagraon APMC', 'Samrala Mandi'],
  Amritsar: ['All Markets', 'Amritsar Bhagtanwala APMC', 'Rayya Mandi', 'Mehta Mandi'],
  Karnal: ['All Markets', 'Karnal New Grain Market', 'Gharaunda Mandi', 'Taraori Mandi', 'Assandh APMC'],
  Ambala: ['All Markets', 'Ambala City APMC', 'Ambala Cantt Mandi', 'Barara Mandi'],
  Jaipur: ['All Markets', 'Jaipur Muhana Mandi', 'Surajpole APMC', 'Chomu Mandi', 'Kotputli Mandi'],
  Kota: ['All Markets', 'Kota Bhamashah APMC', 'Ramganj Mandi', 'Itawa Mandi'],
  Rajkot: ['All Markets', 'Rajkot APMC (Bedi)', 'Gondal APMC', 'Jetpur Mandi', 'Dhoraji APMC'],
  Ahmedabad: ['All Markets', 'Ahmedabad Jamalpur APMC', 'Sanand Mandi', 'Bawla APMC'],
  Patna: ['All Markets', 'Patna Bazar Samiti', 'Mokama Mandi', 'Bakhtiyarpur Mandi'],
  Bengaluru: ['All Markets', 'Bengaluru Yeshwanthpur APMC', 'Binny Mill Mandi', 'K.R. Market'],
};

/* ─────────────────────────────────────────────────────────────────────────────
   COMMODITY GROUPS & COMMODITIES FOR TOP FILTERS
───────────────────────────────────────────────────────────────────────────── */
export const COMMODITY_GROUPS = [
  'All Commodity Groups',
  'Cereals',
  'Pulses',
  'Oil Seeds',
  'Vegetables',
  'Fruits',
  'Spices',
  'Fibre',
];

export const COMMODITIES_BY_GROUP = {
  'All Commodity Groups': [
    'All Commodities', 'Paddy(Common)', 'Wheat', 'Onion', 'Potato', 'Tomato',
    'Groundnut', 'Green Gram(Moong)(Whole)', 'Bengal Gram(Gram)(Whole)', 'Soybean',
    'Mustard', 'Bajra(Pearl Millet/Cumbu)', 'Maize', 'Cotton', 'Banana', 'Apple', 'Turmeric', 'Red Chilli'
  ],
  Cereals: ['All Commodities', 'Paddy(Common)', 'Wheat', 'Bajra(Pearl Millet/Cumbu)', 'Maize', 'Barley', 'Jowar(Sorghum)'],
  Pulses: ['All Commodities', 'Green Gram(Moong)(Whole)', 'Bengal Gram(Gram)(Whole)', 'Red Gram(Arhar/Tur)', 'Black Gram(Urd)', 'Lentil(Masur)'],
  'Oil Seeds': ['All Commodities', 'Groundnut', 'Soybean', 'Mustard', 'Sunflower', 'Sesame(Til)'],
  Vegetables: ['All Commodities', 'Onion', 'Potato', 'Tomato', 'Garlic', 'Ginger', 'Green Chilli', 'Cabbage', 'Cauliflower'],
  Fruits: ['All Commodities', 'Banana', 'Apple', 'Mango', 'Grapes', 'Pomegranate'],
  Spices: ['All Commodities', 'Turmeric', 'Coriander', 'Cumin(Jeera)', 'Red Chilli'],
  Fibre: ['All Commodities', 'Cotton', 'Jute'],
};

export const VARIETIES = [
  'All Varieties', 'FAQ', 'Common', 'Desi', 'Hybrid', 'Local',
  'Sharbati', 'Lokwan', 'Red', 'White', 'Jyoti', '1121', 'Pusa'
];

export const GRADES = [
  'FAQ', 'All Grades', 'Standard', 'Medium', 'Large', 'Grade A', 'Superior'
];

/* ─────────────────────────────────────────────────────────────────────────────
   COMPREHENSIVE ALL-CROPS MASTER DIRECTORY (For Menu Bar Filter)
───────────────────────────────────────────────────────────────────────────── */
export const ALL_CROPS_DIRECTORY = [
  // 🌾 Cereals
  { id: 'wheat', label: 'Wheat', hindi: 'गेहूं', icon: '🌾', group: 'Cereals', latestPrice: 2250 },
  { id: 'paddy', label: 'Paddy (Rice)', hindi: 'धान / चावल', icon: '🍚', group: 'Cereals', latestPrice: 2370 },
  { id: 'maize', label: 'Maize', hindi: 'मक्का', icon: '🌽', group: 'Cereals', latestPrice: 2280 },
  { id: 'bajra', label: 'Bajra (Pearl Millet)', hindi: 'बाजरा', icon: '🌾', group: 'Cereals', latestPrice: 2580 },
  { id: 'barley', label: 'Barley', hindi: 'जौ', icon: '🌾', group: 'Cereals', latestPrice: 2150 },
  { id: 'jowar', label: 'Jowar (Sorghum)', hindi: 'ज्वार', icon: '🌾', group: 'Cereals', latestPrice: 3250 },
  { id: 'ragi', label: 'Ragi (Finger Millet)', hindi: 'रागी', icon: '🌾', group: 'Cereals', latestPrice: 4290 },

  // 🍲 Pulses
  { id: 'moong', label: 'Moong (Green Gram)', hindi: 'मूंग दाल', icon: '🍲', group: 'Pulses', latestPrice: 8768 },
  { id: 'chana', label: 'Bengal Gram (Chana)', hindi: 'चना', icon: '🧆', group: 'Pulses', latestPrice: 6500 },
  { id: 'tur', label: 'Tur / Arhar', hindi: 'तुअर / अरहर', icon: '🥣', group: 'Pulses', latestPrice: 10800 },
  { id: 'urad', label: 'Urad (Black Gram)', hindi: 'उड़द', icon: '🥣', group: 'Pulses', latestPrice: 8600 },
  { id: 'masoor', label: 'Masoor (Lentil)', hindi: 'मसूर', icon: '🥣', group: 'Pulses', latestPrice: 6800 },

  // 🥦 Vegetables
  { id: 'onion', label: 'Onion', hindi: 'प्याज', icon: '🧅', group: 'Vegetables', latestPrice: 2600 },
  { id: 'potato', label: 'Potato', hindi: 'आलू', icon: '🥔', group: 'Vegetables', latestPrice: 720 },
  { id: 'tomato', label: 'Tomato', hindi: 'टमाटर', icon: '🍅', group: 'Vegetables', latestPrice: 1900 },
  { id: 'garlic', label: 'Garlic', hindi: 'लहसुन', icon: '🧄', group: 'Vegetables', latestPrice: 14500 },
  { id: 'ginger', label: 'Ginger', hindi: 'अदरक', icon: '🫚', group: 'Vegetables', latestPrice: 8200 },
  { id: 'green_chilli', label: 'Green Chilli', hindi: 'हरी मिर्च', icon: '🌶️', group: 'Vegetables', latestPrice: 3600 },
  { id: 'cabbage', label: 'Cabbage', hindi: 'पत्ता गोभी', icon: '🥬', group: 'Vegetables', latestPrice: 1250 },
  { id: 'cauliflower', label: 'Cauliflower', hindi: 'फूल गोभी', icon: '🥦', group: 'Vegetables', latestPrice: 1650 },

  // 🌻 Oilseeds
  { id: 'soybean', label: 'Soybean', hindi: 'सोयाबीन', icon: '🌱', group: 'Oilseeds', latestPrice: 4800 },
  { id: 'groundnut', label: 'Groundnut', hindi: 'मूंगफली', icon: '🥜', group: 'Oilseeds', latestPrice: 7740 },
  { id: 'mustard', label: 'Mustard (Sarson)', hindi: 'सरसों', icon: '🌼', group: 'Oilseeds', latestPrice: 5850 },
  { id: 'sunflower', label: 'Sunflower', hindi: 'सूरजमुखी', icon: '🌻', group: 'Oilseeds', latestPrice: 6800 },
  { id: 'sesame', label: 'Sesame (Til)', hindi: 'तिल', icon: '🌾', group: 'Oilseeds', latestPrice: 13500 },

  // 🧵 Cash Crops, Fruits & Spices
  { id: 'cotton', label: 'Cotton', hindi: 'कपास', icon: '🧵', group: 'Cash Crops & Spices', latestPrice: 7950 },
  { id: 'sugarcane', label: 'Sugarcane', hindi: 'गन्ना', icon: '🎋', group: 'Cash Crops & Spices', latestPrice: 340 },
  { id: 'banana', label: 'Banana', hindi: 'केला', icon: '🍌', group: 'Cash Crops & Spices', latestPrice: 1850 },
  { id: 'apple', label: 'Apple', hindi: 'सेब', icon: '🍎', group: 'Cash Crops & Spices', latestPrice: 8800 },
  { id: 'mango', label: 'Mango', hindi: 'आम', icon: '🥭', group: 'Cash Crops & Spices', latestPrice: 4800 },
  { id: 'turmeric', label: 'Turmeric', hindi: 'हल्दी', icon: '🟡', group: 'Cash Crops & Spices', latestPrice: 15200 },
  { id: 'cumin', label: 'Cumin (Jeera)', hindi: 'जीरा', icon: '🌿', group: 'Cash Crops & Spices', latestPrice: 28500 },
  { id: 'coriander', label: 'Coriander', hindi: 'धनिया', icon: '🌿', group: 'Cash Crops & Spices', latestPrice: 7950 },
  { id: 'red_chilli', label: 'Red Chilli', hindi: 'लाल मिर्च', icon: '🌶️', group: 'Cash Crops & Spices', latestPrice: 22500 },
];

/* ─────────────────────────────────────────────────────────────────────────────
   AGMARKNET MULTI-DAY DATASET (Matching Image 2 + Multi-state coverage)
───────────────────────────────────────────────────────────────────────────── */
export const AGMARKNET_TABLE_DATA = [
  // ── UP / Prayagraj (Exact rows matching Image 2) ──
  {
    id: 'up-1',
    state: 'UP',
    district: 'Prayagraj',
    market: 'Prayagraj Mandi',
    group: 'Cereals',
    commodity: 'Paddy(Common)',
    variety: 'Common',
    grade: 'FAQ',
    msp: 2369.00,
    price_03Sep: '-',
    price_02Sep: '-',
    price_01Sep: '1,850.00',
    arr_03Sep: '-',
    arr_02Sep: '-',
    arr_01Sep: '38.00',
  },
  {
    id: 'up-2',
    state: 'UP',
    district: 'Prayagraj',
    market: 'Prayagraj Mandi',
    group: 'Cereals',
    commodity: 'Wheat',
    variety: 'Sharbati',
    grade: 'FAQ',
    msp: 2585.00,
    price_03Sep: '2,348.17',
    price_02Sep: '2,435.77',
    price_01Sep: '2,400.46',
    arr_03Sep: '251.10',
    arr_02Sep: '99.87',
    arr_01Sep: '368.95',
  },
  {
    id: 'up-3',
    state: 'UP',
    district: 'Prayagraj',
    market: 'Jasra Mandi',
    group: 'Oil Seeds',
    commodity: 'Groundnut',
    variety: 'Bold',
    grade: 'FAQ',
    msp: 7263.00,
    price_03Sep: '-',
    price_02Sep: '7,616.83',
    price_01Sep: '13,090.00',
    arr_03Sep: '-',
    arr_02Sep: '90.00',
    arr_01Sep: '12.50',
  },
  {
    id: 'up-4',
    state: 'UP',
    district: 'Prayagraj',
    market: 'Prayagraj Mandi',
    group: 'Pulses',
    commodity: 'Green Gram(Moong)(Whole)',
    variety: 'Desi',
    grade: 'FAQ',
    msp: 8768.00,
    price_03Sep: '7,800.00',
    price_02Sep: '8,768.00',
    price_01Sep: '8,768.00',
    arr_03Sep: '0.30',
    arr_02Sep: '49.15',
    arr_01Sep: '41.40',
  },
  {
    id: 'up-5',
    state: 'UP',
    district: 'Prayagraj',
    market: 'Prayagraj Mandi',
    group: 'Vegetables',
    commodity: 'Onion',
    variety: 'Red',
    grade: 'FAQ',
    msp: null,
    price_03Sep: '3,020.55',
    price_02Sep: '3,000.00',
    price_01Sep: '3,000.00',
    arr_03Sep: '73.00',
    arr_02Sep: '5.00',
    arr_01Sep: '11.00',
  },
  {
    id: 'up-6',
    state: 'UP',
    district: 'Prayagraj',
    market: 'Sirsa Mandi',
    group: 'Vegetables',
    commodity: 'Potato',
    variety: 'Jyoti',
    grade: 'FAQ',
    msp: null,
    price_03Sep: '700.23',
    price_02Sep: '685.78',
    price_01Sep: '700.00',
    arr_03Sep: '321.50',
    arr_02Sep: '211.00',
    arr_01Sep: '189.10',
  },
  {
    id: 'up-7',
    state: 'UP',
    district: 'Prayagraj',
    market: 'Jasra Mandi',
    group: 'Vegetables',
    commodity: 'Tomato',
    variety: 'Hybrid',
    grade: 'FAQ',
    msp: null,
    price_03Sep: '2,009.60',
    price_02Sep: '2,000.00',
    price_01Sep: '-',
    arr_03Sep: '25.00',
    arr_02Sep: '31.00',
    arr_01Sep: '-',
  },

  // ── Maharashtra / Nashik & Pune ──
  {
    id: 'mh-1',
    state: 'MH',
    district: 'Nashik',
    market: 'Lasalgaon APMC',
    group: 'Vegetables',
    commodity: 'Onion',
    variety: 'Red Nasik',
    grade: 'Large',
    msp: null,
    price_03Sep: '2,580.00',
    price_02Sep: '2,520.00',
    price_01Sep: '2,490.00',
    arr_03Sep: '124.00',
    arr_02Sep: '118.50',
    arr_01Sep: '135.20',
  },
  {
    id: 'mh-2',
    state: 'MH',
    district: 'Nashik',
    market: 'Pimpalgaon APMC',
    group: 'Vegetables',
    commodity: 'Tomato',
    variety: 'Desi Red',
    grade: 'Grade A',
    msp: null,
    price_03Sep: '1,820.00',
    price_02Sep: '1,780.00',
    price_01Sep: '1,720.00',
    arr_03Sep: '82.00',
    arr_02Sep: '78.50',
    arr_01Sep: '65.00',
  },
  {
    id: 'mh-3',
    state: 'MH',
    district: 'Latur',
    market: 'Latur APMC',
    group: 'Oil Seeds',
    commodity: 'Soybean',
    variety: 'JS-335',
    grade: 'FAQ',
    msp: 4892.00,
    price_03Sep: '5,180.00',
    price_02Sep: '5,120.00',
    price_01Sep: '4,980.00',
    arr_03Sep: '320.00',
    arr_02Sep: '310.00',
    arr_01Sep: '290.00',
  },
  {
    id: 'mh-4',
    state: 'MH',
    district: 'Nagpur',
    market: 'Nagpur Cotton Market APMC',
    group: 'Fibre',
    commodity: 'Cotton',
    variety: 'Medium Staple',
    grade: 'FAQ',
    msp: 7521.00,
    price_03Sep: '7,890.00',
    price_02Sep: '7,840.00',
    price_01Sep: '7,750.00',
    arr_03Sep: '160.00',
    arr_02Sep: '180.00',
    arr_01Sep: '175.00',
  },

  // ── Madhya Pradesh / Indore & Ujjain ──
  {
    id: 'mp-1',
    state: 'MP',
    district: 'Indore',
    market: 'Indore Choithram APMC',
    group: 'Oil Seeds',
    commodity: 'Soybean',
    variety: 'Yellow',
    grade: 'FAQ',
    msp: 4892.00,
    price_03Sep: '5,240.00',
    price_02Sep: '5,190.00',
    price_01Sep: '5,150.00',
    arr_03Sep: '450.00',
    arr_02Sep: '420.00',
    arr_01Sep: '480.00',
  },
  {
    id: 'mp-2',
    state: 'MP',
    district: 'Ujjain',
    market: 'Ujjain Chimanganj APMC',
    group: 'Cereals',
    commodity: 'Wheat',
    variety: 'Lokwan',
    grade: 'FAQ',
    msp: 2585.00,
    price_03Sep: '2,640.00',
    price_02Sep: '2,610.00',
    price_01Sep: '2,580.00',
    arr_03Sep: '380.00',
    arr_02Sep: '350.00',
    arr_01Sep: '390.00',
  },

  // ── Punjab / Ludhiana ──
  {
    id: 'pb-1',
    state: 'PB',
    district: 'Ludhiana',
    market: 'Khanna APMC',
    group: 'Cereals',
    commodity: 'Wheat',
    variety: 'Sharbati',
    grade: 'Grade A',
    msp: 2585.00,
    price_03Sep: '2,750.00',
    price_02Sep: '2,720.00',
    price_01Sep: '2,680.00',
    arr_03Sep: '520.00',
    arr_02Sep: '490.00',
    arr_01Sep: '540.00',
  },
  {
    id: 'pb-2',
    state: 'PB',
    district: 'Ludhiana',
    market: 'Khanna APMC',
    group: 'Cereals',
    commodity: 'Paddy(Common)',
    variety: 'PR-126',
    grade: 'FAQ',
    msp: 2369.00,
    price_03Sep: '2,370.00',
    price_02Sep: '2,360.00',
    price_01Sep: '2,350.00',
    arr_03Sep: '640.00',
    arr_02Sep: '590.00',
    arr_01Sep: '610.00',
  },

  // ── Haryana / Karnal ──
  {
    id: 'hr-1',
    state: 'HR',
    district: 'Karnal',
    market: 'Karnal New Grain Market',
    group: 'Cereals',
    commodity: 'Paddy(Common)',
    variety: '1121 Basmati',
    grade: 'Grade A',
    msp: 2369.00,
    price_03Sep: '3,850.00',
    price_02Sep: '3,820.00',
    price_01Sep: '3,780.00',
    arr_03Sep: '280.00',
    arr_02Sep: '260.00',
    arr_01Sep: '310.00',
  },

  // ── Rajasthan / Kota & Jaipur ──
  {
    id: 'rj-1',
    state: 'RJ',
    district: 'Kota',
    market: 'Kota Bhamashah APMC',
    group: 'Oil Seeds',
    commodity: 'Mustard',
    variety: 'Black',
    grade: 'FAQ',
    msp: 5650.00,
    price_03Sep: '5,820.00',
    price_02Sep: '5,780.00',
    price_01Sep: '5,740.00',
    arr_03Sep: '340.00',
    arr_02Sep: '310.00',
    arr_01Sep: '360.00',
  },

  // ── Gujarat / Rajkot ──
  {
    id: 'gj-1',
    state: 'GJ',
    district: 'Rajkot',
    market: 'Rajkot APMC (Bedi)',
    group: 'Oil Seeds',
    commodity: 'Groundnut',
    variety: 'Bold G-20',
    grade: 'Superior',
    msp: 7263.00,
    price_03Sep: '7,740.00',
    price_02Sep: '7,680.00',
    price_01Sep: '7,620.00',
    arr_03Sep: '410.00',
    arr_02Sep: '390.00',
    arr_01Sep: '430.00',
  }
];

/* ─────────────────────────────────────────────────────────────────────────────
   7-DAY HISTORICAL TREND DATA (Mon to Sun)
───────────────────────────────────────────────────────────────────────────── */
export const CROP_7DAY_TRENDS = {
  onion: [
    { day: 'Mon', price: 2200 }, { day: 'Tue', price: 2350 }, { day: 'Wed', price: 2280 },
    { day: 'Thu', price: 2400 }, { day: 'Fri', price: 2500 }, { day: 'Sat', price: 2450 }, { day: 'Sun', price: 2600 }
  ],
  wheat: [
    { day: 'Mon', price: 2050 }, { day: 'Tue', price: 2100 }, { day: 'Wed', price: 2130 },
    { day: 'Thu', price: 2150 }, { day: 'Fri', price: 2200 }, { day: 'Sat', price: 2180 }, { day: 'Sun', price: 2250 }
  ],
  soybean: [
    { day: 'Mon', price: 4400 }, { day: 'Tue', price: 4500 }, { day: 'Wed', price: 4450 },
    { day: 'Thu', price: 4600 }, { day: 'Fri', price: 4700 }, { day: 'Sat', price: 4650 }, { day: 'Sun', price: 4800 }
  ],
  tomato: [
    { day: 'Mon', price: 1600 }, { day: 'Tue', price: 1750 }, { day: 'Wed', price: 1700 },
    { day: 'Thu', price: 1800 }, { day: 'Fri', price: 1850 }, { day: 'Sat', price: 1820 }, { day: 'Sun', price: 1900 }
  ],
  paddy: [
    { day: 'Mon', price: 2100 }, { day: 'Tue', price: 2150 }, { day: 'Wed', price: 2180 },
    { day: 'Thu', price: 2250 }, { day: 'Fri', price: 2300 }, { day: 'Sat', price: 2340 }, { day: 'Sun', price: 2370 }
  ],
  groundnut: [
    { day: 'Mon', price: 7100 }, { day: 'Tue', price: 7250 }, { day: 'Wed', price: 7300 },
    { day: 'Thu', price: 7450 }, { day: 'Fri', price: 7550 }, { day: 'Sat', price: 7600 }, { day: 'Sun', price: 7740 }
  ],
  potato: [
    { day: 'Mon', price: 650 }, { day: 'Tue', price: 670 }, { day: 'Wed', price: 680 },
    { day: 'Thu', price: 695 }, { day: 'Fri', price: 710 }, { day: 'Sat', price: 700 }, { day: 'Sun', price: 720 }
  ],
  moong: [
    { day: 'Mon', price: 8200 }, { day: 'Tue', price: 8350 }, { day: 'Wed', price: 8400 },
    { day: 'Thu', price: 8550 }, { day: 'Fri', price: 8650 }, { day: 'Sat', price: 8700 }, { day: 'Sun', price: 8768 }
  ],
  chana: [
    { day: 'Mon', price: 5850 }, { day: 'Tue', price: 5980 }, { day: 'Wed', price: 6100 },
    { day: 'Thu', price: 6250 }, { day: 'Fri', price: 6380 }, { day: 'Sat', price: 6420 }, { day: 'Sun', price: 6500 }
  ],
  tur: [
    { day: 'Mon', price: 9600 }, { day: 'Tue', price: 9800 }, { day: 'Wed', price: 10100 },
    { day: 'Thu', price: 10350 }, { day: 'Fri', price: 10500 }, { day: 'Sat', price: 10600 }, { day: 'Sun', price: 10800 }
  ],
  urad: [
    { day: 'Mon', price: 7900 }, { day: 'Tue', price: 8050 }, { day: 'Wed', price: 8180 },
    { day: 'Thu', price: 8300 }, { day: 'Fri', price: 8450 }, { day: 'Sat', price: 8520 }, { day: 'Sun', price: 8600 }
  ],
  masoor: [
    { day: 'Mon', price: 6250 }, { day: 'Tue', price: 6350 }, { day: 'Wed', price: 6420 },
    { day: 'Thu', price: 6580 }, { day: 'Fri', price: 6650 }, { day: 'Sat', price: 6720 }, { day: 'Sun', price: 6800 }
  ],
  maize: [
    { day: 'Mon', price: 1980 }, { day: 'Tue', price: 2050 }, { day: 'Wed', price: 2120 },
    { day: 'Thu', price: 2180 }, { day: 'Fri', price: 2220 }, { day: 'Sat', price: 2250 }, { day: 'Sun', price: 2280 }
  ],
  bajra: [
    { day: 'Mon', price: 2280 }, { day: 'Tue', price: 2320 }, { day: 'Wed', price: 2390 },
    { day: 'Thu', price: 2450 }, { day: 'Fri', price: 2500 }, { day: 'Sat', price: 2520 }, { day: 'Sun', price: 2580 }
  ],
  barley: [
    { day: 'Mon', price: 1880 }, { day: 'Tue', price: 1920 }, { day: 'Wed', price: 1980 },
    { day: 'Thu', price: 2040 }, { day: 'Fri', price: 2090 }, { day: 'Sat', price: 2110 }, { day: 'Sun', price: 2150 }
  ],
  jowar: [
    { day: 'Mon', price: 2850 }, { day: 'Tue', price: 2920 }, { day: 'Wed', price: 3000 },
    { day: 'Thu', price: 3080 }, { day: 'Fri', price: 3150 }, { day: 'Sat', price: 3190 }, { day: 'Sun', price: 3250 }
  ],
  mustard: [
    { day: 'Mon', price: 5450 }, { day: 'Tue', price: 5520 }, { day: 'Wed', price: 5600 },
    { day: 'Thu', price: 5680 }, { day: 'Fri', price: 5750 }, { day: 'Sat', price: 5790 }, { day: 'Sun', price: 5850 }
  ],
  sunflower: [
    { day: 'Mon', price: 6250 }, { day: 'Tue', price: 6380 }, { day: 'Wed', price: 6490 },
    { day: 'Thu', price: 6580 }, { day: 'Fri', price: 6650 }, { day: 'Sat', price: 6720 }, { day: 'Sun', price: 6800 }
  ],
  sesame: [
    { day: 'Mon', price: 12200 }, { day: 'Tue', price: 12450 }, { day: 'Wed', price: 12700 },
    { day: 'Thu', price: 12950 }, { day: 'Fri', price: 13150 }, { day: 'Sat', price: 13300 }, { day: 'Sun', price: 13500 }
  ],
  cotton: [
    { day: 'Mon', price: 7450 }, { day: 'Tue', price: 7550 }, { day: 'Wed', price: 7680 },
    { day: 'Thu', price: 7750 }, { day: 'Fri', price: 7850 }, { day: 'Sat', price: 7890 }, { day: 'Sun', price: 7950 }
  ],
  garlic: [
    { day: 'Mon', price: 11200 }, { day: 'Tue', price: 11800 }, { day: 'Wed', price: 12500 },
    { day: 'Thu', price: 13200 }, { day: 'Fri', price: 13800 }, { day: 'Sat', price: 14100 }, { day: 'Sun', price: 14500 }
  ],
  ginger: [
    { day: 'Mon', price: 6600 }, { day: 'Tue', price: 6900 }, { day: 'Wed', price: 7200 },
    { day: 'Thu', price: 7550 }, { day: 'Fri', price: 7850 }, { day: 'Sat', price: 8000 }, { day: 'Sun', price: 8200 }
  ],
  green_chilli: [
    { day: 'Mon', price: 2850 }, { day: 'Tue', price: 3000 }, { day: 'Wed', price: 3150 },
    { day: 'Thu', price: 3300 }, { day: 'Fri', price: 3450 }, { day: 'Sat', price: 3500 }, { day: 'Sun', price: 3600 }
  ],
  cabbage: [
    { day: 'Mon', price: 880 }, { day: 'Tue', price: 950 }, { day: 'Wed', price: 1020 },
    { day: 'Thu', price: 1100 }, { day: 'Fri', price: 1180 }, { day: 'Sat', price: 1200 }, { day: 'Sun', price: 1250 }
  ],
  cauliflower: [
    { day: 'Mon', price: 1150 }, { day: 'Tue', price: 1250 }, { day: 'Wed', price: 1350 },
    { day: 'Thu', price: 1450 }, { day: 'Fri', price: 1550 }, { day: 'Sat', price: 1590 }, { day: 'Sun', price: 1650 }
  ],
  banana: [
    { day: 'Mon', price: 1450 }, { day: 'Tue', price: 1520 }, { day: 'Wed', price: 1600 },
    { day: 'Thu', price: 1680 }, { day: 'Fri', price: 1750 }, { day: 'Sat', price: 1800 }, { day: 'Sun', price: 1850 }
  ],
  apple: [
    { day: 'Mon', price: 6800 }, { day: 'Tue', price: 7200 }, { day: 'Wed', price: 7600 },
    { day: 'Thu', price: 8100 }, { day: 'Fri', price: 8400 }, { day: 'Sat', price: 8600 }, { day: 'Sun', price: 8800 }
  ],
  mango: [
    { day: 'Mon', price: 3600 }, { day: 'Tue', price: 3850 }, { day: 'Wed', price: 4100 },
    { day: 'Thu', price: 4350 }, { day: 'Fri', price: 4550 }, { day: 'Sat', price: 4680 }, { day: 'Sun', price: 4800 }
  ],
  turmeric: [
    { day: 'Mon', price: 12800 }, { day: 'Tue', price: 13200 }, { day: 'Wed', price: 13700 },
    { day: 'Thu', price: 14200 }, { day: 'Fri', price: 14700 }, { day: 'Sat', price: 14950 }, { day: 'Sun', price: 15200 }
  ],
  cumin: [
    { day: 'Mon', price: 24500 }, { day: 'Tue', price: 25200 }, { day: 'Wed', price: 26000 },
    { day: 'Thu', price: 26800 }, { day: 'Fri', price: 27500 }, { day: 'Sat', price: 28000 }, { day: 'Sun', price: 28500 }
  ],
  coriander: [
    { day: 'Mon', price: 6900 }, { day: 'Tue', price: 7100 }, { day: 'Wed', price: 7300 },
    { day: 'Thu', price: 7550 }, { day: 'Fri', price: 7750 }, { day: 'Sat', price: 7850 }, { day: 'Sun', price: 7950 }
  ],
  red_chilli: [
    { day: 'Mon', price: 18400 }, { day: 'Tue', price: 19100 }, { day: 'Wed', price: 19900 },
    { day: 'Thu', price: 20800 }, { day: 'Fri', price: 21500 }, { day: 'Sat', price: 22000 }, { day: 'Sun', price: 22500 }
  ],
};

/* ─────────────────────────────────────────────────────────────────────────────
   MANDI APMC SPOT CARDS PER CROP
───────────────────────────────────────────────────────────────────────────── */
export const CROP_APMC_DIRECTORY = {
  onion: [
    { name: 'Lasalgaon APMC, Nashik', price: '₹2,580', min: '₹2,200', max: '₹2,900', arrivals: '12,400 Q' },
    { name: 'Pimpalgaon APMC, Nashik', price: '₹2,520', min: '₹2,100', max: '₹2,800', arrivals: '8,200 Q' },
    { name: 'Navi Mumbai Vashi APMC', price: '₹2,650', min: '₹2,300', max: '₹3,100', arrivals: '5,600 Q' },
    { name: 'Pune Gultekdi APMC', price: '₹2,600', min: '₹2,250', max: '₹3,000', arrivals: '4,100 Q' },
  ],
  wheat: [
    { name: 'Khanna APMC, Punjab', price: '₹2,750', min: '₹2,550', max: '₹2,900', arrivals: '18,500 Q' },
    { name: 'Indore Choithram APMC, MP', price: '₹2,640', min: '₹2,480', max: '₹2,800', arrivals: '14,200 Q' },
    { name: 'Karnal Grain Market, HR', price: '₹2,585', min: '₹2,450', max: '₹2,720', arrivals: '12,800 Q' },
    { name: 'Kota Bhamashah APMC, RJ', price: '₹2,610', min: '₹2,460', max: '₹2,780', arrivals: '9,500 Q' },
  ],
  soybean: [
    { name: 'Latur APMC, Maharashtra', price: '₹5,180', min: '₹4,850', max: '₹5,400', arrivals: '15,200 Q' },
    { name: 'Indore APMC, MP', price: '₹5,240', min: '₹4,900', max: '₹5,450', arrivals: '16,800 Q' },
    { name: 'Ujjain Chimanganj APMC', price: '₹5,150', min: '₹4,820', max: '₹5,380', arrivals: '11,400 Q' },
    { name: 'Akola APMC, Maharashtra', price: '₹5,120', min: '₹4,800', max: '₹5,350', arrivals: '8,900 Q' },
  ],
  tomato: [
    { name: 'Pimpalgaon APMC, Nashik', price: '₹1,820', min: '₹1,400', max: '₹2,100', arrivals: '9,600 Q' },
    { name: 'Narayangaon APMC, Pune', price: '₹1,780', min: '₹1,350', max: '₹2,050', arrivals: '8,400 Q' },
    { name: 'Kolar APMC, Karnataka', price: '₹1,950', min: '₹1,500', max: '₹2,300', arrivals: '18,200 Q' },
    { name: 'Madanapalle APMC, AP', price: '₹1,880', min: '₹1,450', max: '₹2,200', arrivals: '14,500 Q' },
  ],
  paddy: [
    { name: 'Karnal APMC, Haryana', price: '₹3,850', min: '₹3,400', max: '₹4,200', arrivals: '22,400 Q' },
    { name: 'Amritsar APMC, Punjab', price: '₹3,780', min: '₹3,350', max: '₹4,150', arrivals: '19,800 Q' },
    { name: 'Guntur APMC, AP', price: '₹2,370', min: '₹2,200', max: '₹2,500', arrivals: '16,200 Q' },
    { name: 'Prayagraj Mandi, UP', price: '₹2,369', min: '₹2,150', max: '₹2,480', arrivals: '11,500 Q' },
  ],
  cotton: [
    { name: 'Rajkot APMC (Bedi), Gujarat', price: '₹7,950', min: '₹7,400', max: '₹8,400', arrivals: '14,200 Q' },
    { name: 'Nagpur Cotton Market, MH', price: '₹7,890', min: '₹7,350', max: '₹8,350', arrivals: '12,800 Q' },
    { name: 'Warangal APMC, Telangana', price: '₹7,850', min: '₹7,300', max: '₹8,300', arrivals: '11,500 Q' },
    { name: 'Yavatmal APMC, Maharashtra', price: '₹7,820', min: '₹7,250', max: '₹8,250', arrivals: '9,400 Q' },
  ],
  mustard: [
    { name: 'Bharatpur APMC, Rajasthan', price: '₹5,850', min: '₹5,500', max: '₹6,150', arrivals: '16,400 Q' },
    { name: 'Alwar APMC, Rajasthan', price: '₹5,820', min: '₹5,480', max: '₹6,100', arrivals: '13,200 Q' },
    { name: 'Jaipur Muhana APMC', price: '₹5,790', min: '₹5,450', max: '₹6,080', arrivals: '10,500 Q' },
    { name: 'Morena APMC, MP', price: '₹5,760', min: '₹5,400', max: '₹6,050', arrivals: '8,800 Q' },
  ],
  groundnut: [
    { name: 'Rajkot APMC (Bedi), Gujarat', price: '₹7,740', min: '₹7,100', max: '₹8,200', arrivals: '15,600 Q' },
    { name: 'Gondal APMC, Gujarat', price: '₹7,680', min: '₹7,050', max: '₹8,150', arrivals: '14,200 Q' },
    { name: 'Bikaner APMC, Rajasthan', price: '₹7,550', min: '₹6,950', max: '₹7,980', arrivals: '8,900 Q' },
    { name: 'Jasra Mandi, Prayagraj', price: '₹7,616', min: '₹7,000', max: '₹8,050', arrivals: '4,500 Q' },
  ],
  moong: [
    { name: 'Merta City APMC, Rajasthan', price: '₹8,768', min: '₹8,100', max: '₹9,200', arrivals: '9,200 Q' },
    { name: 'Nagaur APMC, Rajasthan', price: '₹8,720', min: '₹8,050', max: '₹9,150', arrivals: '8,400 Q' },
    { name: 'Indore Choithram APMC, MP', price: '₹8,650', min: '₹7,950', max: '₹9,050', arrivals: '6,800 Q' },
    { name: 'Latur APMC, Maharashtra', price: '₹8,600', min: '₹7,900', max: '₹9,000', arrivals: '5,500 Q' },
  ],
  chana: [
    { name: 'Bikaner APMC, Rajasthan', price: '₹6,500', min: '₹6,000', max: '₹6,900', arrivals: '18,500 Q' },
    { name: 'Latur APMC, Maharashtra', price: '₹6,450', min: '₹5,950', max: '₹6,850', arrivals: '16,200 Q' },
    { name: 'Indore APMC, MP', price: '₹6,420', min: '₹5,900', max: '₹6,800', arrivals: '14,800 Q' },
    { name: 'Akola APMC, Maharashtra', price: '₹6,380', min: '₹5,850', max: '₹6,750', arrivals: '9,500 Q' },
  ],
  potato: [
    { name: 'Agra APMC, UP', price: '₹720', min: '₹620', max: '₹820', arrivals: '28,500 Q' },
    { name: 'Farrukhabad Mandi, UP', price: '₹700', min: '₹600', max: '₹800', arrivals: '24,000 Q' },
    { name: 'Sirsa Mandi, Prayagraj', price: '₹700', min: '₹610', max: '₹790', arrivals: '8,200 Q' },
    { name: 'Jalandhar APMC, Punjab', price: '₹740', min: '₹640', max: '₹850', arrivals: '19,500 Q' },
  ],
  garlic: [
    { name: 'Mandsaur APMC, MP', price: '₹14,500', min: '₹12,000', max: '₹17,000', arrivals: '11,200 Q' },
    { name: 'Neemuch APMC, MP', price: '₹14,200', min: '₹11,800', max: '₹16,800', arrivals: '9,800 Q' },
    { name: 'Kota Bhamashah APMC, RJ', price: '₹13,800', min: '₹11,500', max: '₹16,200', arrivals: '6,500 Q' },
    { name: 'Ooty APMC, Tamil Nadu', price: '₹15,200', min: '₹12,500', max: '₹18,000', arrivals: '4,200 Q' },
  ],
  cumin: [
    { name: 'Unjha APMC, Gujarat', price: '₹28,500', min: '₹25,000', max: '₹32,000', arrivals: '12,500 Q' },
    { name: 'Jodhpur APMC, Rajasthan', price: '₹27,800', min: '₹24,500', max: '₹31,200', arrivals: '9,400 Q' },
    { name: 'Nagaur APMC, Rajasthan', price: '₹27,500', min: '₹24,000', max: '₹30,800', arrivals: '7,800 Q' },
    { name: 'Rajkot APMC, Gujarat', price: '₹28,000', min: '₹24,800', max: '₹31,500', arrivals: '6,200 Q' },
  ],
  turmeric: [
    { name: 'Nizamabad APMC, Telangana', price: '₹15,200', min: '₹13,500', max: '₹17,000', arrivals: '14,500 Q' },
    { name: 'Erode APMC, Tamil Nadu', price: '₹14,800', min: '₹13,200', max: '₹16,500', arrivals: '12,800 Q' },
    { name: 'Sangli APMC, Maharashtra', price: '₹15,000', min: '₹13,400', max: '₹16,800', arrivals: '10,200 Q' },
    { name: 'Duggirala APMC, AP', price: '₹14,500', min: '₹13,000', max: '₹16,200', arrivals: '7,400 Q' },
  ]
};

// Helper: dynamic Mandi cards generator fallback
function getMandiCardsForCrop(cropId, cropLabel) {
  if (CROP_APMC_DIRECTORY[cropId]) {
    return CROP_APMC_DIRECTORY[cropId];
  }
  const baseRate = ALL_CROPS_DIRECTORY.find(c => c.id === cropId)?.latestPrice || 2500;
  return [
    { name: `${cropLabel} APMC Hub (North)`, price: `₹${baseRate.toLocaleString()}`, min: `₹${Math.round(baseRate * 0.9).toLocaleString()}`, max: `₹${Math.round(baseRate * 1.1).toLocaleString()}`, arrivals: '11,200 Q' },
    { name: `${cropLabel} Terminal Market (West)`, price: `₹${Math.round(baseRate * 1.02).toLocaleString()}`, min: `₹${Math.round(baseRate * 0.92).toLocaleString()}`, max: `₹${Math.round(baseRate * 1.12).toLocaleString()}`, arrivals: '9,400 Q' },
    { name: `${cropLabel} Central Mandi (Central)`, price: `₹${Math.round(baseRate * 0.98).toLocaleString()}`, min: `₹${Math.round(baseRate * 0.88).toLocaleString()}`, max: `₹${Math.round(baseRate * 1.08).toLocaleString()}`, arrivals: '7,800 Q' },
    { name: `${cropLabel} Commercial Yard (South)`, price: `₹${Math.round(baseRate * 1.04).toLocaleString()}`, min: `₹${Math.round(baseRate * 0.94).toLocaleString()}`, max: `₹${Math.round(baseRate * 1.15).toLocaleString()}`, arrivals: '6,500 Q' },
  ];
}

// Helper: dynamic 7-day trend generator fallback
function getTrendDataForCrop(cropId) {
  if (CROP_7DAY_TRENDS[cropId]) {
    return CROP_7DAY_TRENDS[cropId];
  }
  const cropObj = ALL_CROPS_DIRECTORY.find(c => c.id === cropId);
  const base = cropObj?.latestPrice || 2500;
  return [
    { day: 'Mon', price: Math.round(base * 0.93) },
    { day: 'Tue', price: Math.round(base * 0.96) },
    { day: 'Wed', price: Math.round(base * 0.95) },
    { day: 'Thu', price: Math.round(base * 0.98) },
    { day: 'Fri', price: Math.round(base * 1.01) },
    { day: 'Sat', price: Math.round(base * 0.99) },
    { day: 'Sun', price: base },
  ];
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT: LiveMandiDashboard
───────────────────────────────────────────────────────────────────────────── */
export default function LiveMandiDashboard({ t = {}, lang = 'en' }) {
  // ── 7 Filter States (Top Agmarknet Bar) ──
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedMarket, setSelectedMarket] = useState('All Markets');
  const [selectedGroup, setSelectedGroup] = useState('All Commodity Groups');
  const [selectedCommodity, setSelectedCommodity] = useState('All Commodities');
  const [selectedVariety, setSelectedVariety] = useState('All Varieties');
  const [selectedGrade, setSelectedGrade] = useState('FAQ');

  // Applied Filter Snapshot (applied on "Go" button click)
  const [appliedFilters, setAppliedFilters] = useState({
    state: 'ALL',
    district: 'All Districts',
    market: 'All Markets',
    group: 'All Commodity Groups',
    commodity: 'All Commodities',
    variety: 'All Varieties',
    grade: 'FAQ',
  });

  // Active Crop for 7-Day Trend Chart
  const [activeTrendCrop, setActiveTrendCrop] = useState('onion');

  // Menu Bar Filter Modal / Dropdown Open State
  const [cropMenuOpen, setCropMenuOpen] = useState(false);
  const [cropMenuSearch, setCropMenuSearch] = useState('');
  const [cropMenuCategory, setCropMenuCategory] = useState('All');
  const cropMenuRef = useRef(null);

  // Search Filter in table
  const [tableSearch, setTableSearch] = useState('');

  // ── e-NAM Mandis Directory Tab State & Filters ──
  const [activeDashboardTab, setActiveDashboardTab] = useState('live_prices'); // 'live_prices' | 'enam_directory'
  const [enamSearch, setEnamSearch] = useState('');
  const [enamCategoryFilter, setEnamCategoryFilter] = useState('ALL'); // 'ALL' | 'State' | 'Union Territory'

  // Backend Live Agmarknet Stream status
  const [liveStreamSource, setLiveStreamSource] = useState('benchmarks'); // 'agmarknet_api' | 'benchmarks'
  const [liveRecordCount, setLiveRecordCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function checkStream() {
      try {
        const res = await getLiveMandiPrices({ limit: 10 });
        if (isMounted && res && res.records) {
          setLiveStreamSource(res.source === 'data.gov.in_agmarknet_api' ? 'agmarknet_api' : 'benchmarks');
          setLiveRecordCount(res.count || res.records.length);
        }
      } catch (e) {
        if (isMounted) setLiveStreamSource('benchmarks');
      }
    }
    checkStream();
    return () => { isMounted = false; };
  }, []);

  const filteredEnamData = useMemo(() => {
    return OFFICIAL_ENAM_STATE_DATA.filter((item) => {
      if (enamCategoryFilter !== 'ALL' && item.category !== enamCategoryFilter) return false;
      if (enamSearch.trim()) {
        const q = enamSearch.toLowerCase();
        return item.state.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [enamCategoryFilter, enamSearch]);


  // Close crop menu dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (cropMenuRef.current && !cropMenuRef.current.contains(event.target)) {
        setCropMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dynamic District Options based on selected state
  const districtOptions = useMemo(() => {
    return STATE_DISTRICTS_MAP[selectedState] || ['All Districts'];
  }, [selectedState]);

  // Dynamic Market Options based on selected district
  const marketOptions = useMemo(() => {
    if (DISTRICT_MARKETS_MAP[selectedDistrict]) {
      return DISTRICT_MARKETS_MAP[selectedDistrict];
    }
    if (selectedDistrict !== 'All Districts') {
      return ['All Markets', `${selectedDistrict} Main APMC`, `${selectedDistrict} Sub-Yard`];
    }
    return DISTRICT_MARKETS_MAP['All Districts'];
  }, [selectedDistrict]);

  // Dynamic Commodity Options based on selected group
  const commodityOptions = useMemo(() => {
    return COMMODITIES_BY_GROUP[selectedGroup] || COMMODITIES_BY_GROUP['All Commodity Groups'];
  }, [selectedGroup]);

  // Handle State Change: reset district and market to defaults
  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    setSelectedDistrict('All Districts');
    setSelectedMarket('All Markets');
  };

  // Handle District Change: reset market to default
  const handleDistrictChange = (e) => {
    const newDistrict = e.target.value;
    setSelectedDistrict(newDistrict);
    setSelectedMarket('All Markets');
  };

  // Handle Commodity Group Change: reset commodity to default
  const handleGroupChange = (e) => {
    const newGroup = e.target.value;
    setSelectedGroup(newGroup);
    setSelectedCommodity('All Commodities');
  };

  // Apply Filters (⚡ Go button from Image 1 & 2)
  const handleApplyFilters = () => {
    setAppliedFilters({
      state: selectedState,
      district: selectedDistrict,
      market: selectedMarket,
      group: selectedGroup,
      commodity: selectedCommodity,
      variety: selectedVariety,
      grade: selectedGrade,
    });
  };

  // Reset Filters (Reset button from Image 2)
  const handleResetFilters = () => {
    setSelectedState('ALL');
    setSelectedDistrict('All Districts');
    setSelectedMarket('All Markets');
    setSelectedGroup('All Commodity Groups');
    setSelectedCommodity('All Commodities');
    setSelectedVariety('All Varieties');
    setSelectedGrade('FAQ');
    setAppliedFilters({
      state: 'ALL',
      district: 'All Districts',
      market: 'All Markets',
      group: 'All Commodity Groups',
      commodity: 'All Commodities',
      variety: 'All Varieties',
      grade: 'FAQ',
    });
    setTableSearch('');
  };

  // Filtered Table Data based on Applied Filters
  const filteredTableData = useMemo(() => {
    return AGMARKNET_TABLE_DATA.filter((row) => {
      if (appliedFilters.state !== 'ALL' && row.state !== appliedFilters.state) return false;
      if (appliedFilters.district !== 'All Districts' && row.district !== appliedFilters.district) return false;
      if (appliedFilters.market !== 'All Markets' && row.market !== appliedFilters.market) return false;
      if (appliedFilters.group !== 'All Commodity Groups' && row.group !== appliedFilters.group) return false;
      if (appliedFilters.commodity !== 'All Commodities' && !row.commodity.toLowerCase().includes(appliedFilters.commodity.toLowerCase())) return false;
      if (appliedFilters.variety !== 'All Varieties' && row.variety !== appliedFilters.variety) return false;
      if (appliedFilters.grade !== 'FAQ' && appliedFilters.grade !== 'All Grades' && row.grade !== appliedFilters.grade) return false;
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase();
        return (
          row.commodity.toLowerCase().includes(q) ||
          row.group.toLowerCase().includes(q) ||
          row.market.toLowerCase().includes(q) ||
          row.district.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [appliedFilters, tableSearch]);

  // Dynamic Location Title (from Image 2, e.g. "Uttar Pradesh / Prayagraj / All Markets")
  const locationTitle = useMemo(() => {
    const stateObj = ALL_INDIA_STATES.find(s => s.code === appliedFilters.state);
    const stateName = stateObj && stateObj.code !== 'ALL' ? stateObj.label : 'All States';
    return `${stateName} / ${appliedFilters.district} / ${appliedFilters.market}`;
  }, [appliedFilters]);

  // Current selected crop object from directory
  const currentCropObj = useMemo(() => {
    return ALL_CROPS_DIRECTORY.find(c => c.id === activeTrendCrop) || ALL_CROPS_DIRECTORY[0];
  }, [activeTrendCrop]);

  // Filtered list of crops for the Crop Menu Bar Filter modal/popover
  const filteredCropsList = useMemo(() => {
    return ALL_CROPS_DIRECTORY.filter(crop => {
      if (cropMenuCategory !== 'All' && crop.group !== cropMenuCategory) return false;
      if (cropMenuSearch.trim()) {
        const s = cropMenuSearch.toLowerCase();
        return (
          crop.label.toLowerCase().includes(s) ||
          crop.hindi.toLowerCase().includes(s) ||
          crop.group.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [cropMenuCategory, cropMenuSearch]);

  // Mandi Spot Cards dynamically chosen for active crop
  const activeMandiCards = useMemo(() => {
    return getMandiCardsForCrop(activeTrendCrop, currentCropObj.label);
  }, [activeTrendCrop, currentCropObj]);

  // Chart trend data for active crop
  const currentTrendData = useMemo(() => {
    return getTrendDataForCrop(activeTrendCrop);
  }, [activeTrendCrop]);

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = [
      'Commodity Group',
      'Commodity',
      'MSP (Rs/Qtl)',
      'Price 03 Sep 2026',
      'Price 02 Sep 2026',
      'Price 01 Sep 2026',
      'Arrival MT 03 Sep 2026',
      'Arrival MT 02 Sep 2026',
      'Arrival MT 01 Sep 2026'
    ];
    const rows = filteredTableData.map(r => [
      `"${r.group}"`,
      `"${r.commodity}"`,
      r.msp ? r.msp : '-',
      `"${r.price_03Sep}"`,
      `"${r.price_02Sep}"`,
      `"${r.price_01Sep}"`,
      `"${r.arr_03Sep}"`,
      `"${r.arr_02Sep}"`,
      `"${r.arr_01Sep}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Agmarknet_Live_Prices_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* ── 1. HEADER & BREADCRUMB (Matching Image 3) ── */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
          <span>Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700 font-bold">Market Prices</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              📊 Live Market Prices
            </h2>
            {liveStreamSource === 'agmarknet_api' ? (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Data.gov.in Live API Synced ({liveRecordCount} Records)
              </span>
            ) : (
              <span className="bg-sky-100 text-sky-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-sky-300 flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                Agmarknet Official Benchmark Stream
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Official Price Discovery Feed</span>
          </div>
        </div>
      </div>

      {/* ── Top Level Mode Switcher: Real-Time Rates vs Official e-NAM Directory ── */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveDashboardTab('live_prices')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeDashboardTab === 'live_prices'
              ? 'bg-[#035572] text-white shadow-sm font-black ring-2 ring-sky-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>📊 Real-Time Agmarknet Mandi Rates</span>
        </button>
        <button
          onClick={() => setActiveDashboardTab('enam_directory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeDashboardTab === 'enam_directory'
              ? 'bg-emerald-700 text-white shadow-sm font-black ring-2 ring-emerald-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>🏛️ Official e-NAM Mandis & ₹30L Assistance Directory (27 States/UTs)</span>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
            1,389 Mandis
          </span>
        </button>
      </div>

      {activeDashboardTab === 'live_prices' ? (
        <>
      {/* ── 2. SEVEN-FILTER AGMARKNET BAR (Matching Image 1 & 2) ── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">

        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-sky-600" /> Official Agmarknet Filters
          </span>
          <span className="text-[11px] text-slate-400">
            Select State & District to discover real-time APMC mandi rates
          </span>
        </div>

        {/* The 7 Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          
          {/* 1. State/UT */}
          <div className="relative bg-slate-50 border border-slate-200 rounded-xl px-2.5 pt-1.5 pb-1 focus-within:border-sky-500 focus-within:bg-white transition">
            <label className="block text-[10px] font-bold text-slate-500 tracking-tight leading-tight">
              State/UT
            </label>
            <div className="relative flex items-center">
              <select
                value={selectedState}
                onChange={handleStateChange}
                className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer truncate py-1 pr-6"
              >
                {ALL_INDIA_STATES.map(s => (
                  <option key={s.code} value={s.code}>
                    {s.label}
                  </option>
                ))}
              </select>
              <VoiceInputMic onResult={handleStateChange} type="dropdown" title="बोलकर राज्य चुनें (Speak State)" />
            </div>
          </div>

          {/* 2. District (Dynamically loaded as per State) */}
          <div className="relative bg-slate-50 border border-slate-200 rounded-xl px-2.5 pt-1.5 pb-1 focus-within:border-sky-500 focus-within:bg-white transition">
            <label className="block text-[10px] font-bold text-slate-500 tracking-tight leading-tight">
              District
            </label>
            <div className="relative flex items-center">
              <select
                value={selectedDistrict}
                onChange={handleDistrictChange}
                className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer truncate py-1 pr-6"
              >
                {districtOptions.map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <VoiceInputMic onResult={handleDistrictChange} type="dropdown" title="बोलकर जिला चुनें (Speak District)" />
            </div>
          </div>

          {/* 3. Market */}
          <div className="relative bg-slate-50 border border-slate-200 rounded-xl px-2.5 pt-1.5 pb-1 focus-within:border-sky-500 focus-within:bg-white transition">
            <label className="block text-[10px] font-bold text-slate-500 tracking-tight leading-tight">
              Market
            </label>
            <div className="relative flex items-center">
              <select
                value={selectedMarket}
                onChange={e => setSelectedMarket(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer truncate py-1 pr-6"
              >
                {marketOptions.map(m => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <VoiceInputMic onResult={setSelectedMarket} type="dropdown" title="बोलकर मंडी चुनें (Speak Mandi)" />
            </div>
          </div>

          {/* 4. Commodity Group */}
          <div className="relative bg-slate-50 border border-slate-200 rounded-xl px-2.5 pt-1.5 pb-1 focus-within:border-sky-500 focus-within:bg-white transition">
            <label className="block text-[10px] font-bold text-slate-500 tracking-tight leading-tight">
              Commodity Group
            </label>
            <div className="relative flex items-center">
              <select
                value={selectedGroup}
                onChange={handleGroupChange}
                className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer truncate py-1 pr-6"
              >
                {COMMODITY_GROUPS.map(g => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <VoiceInputMic onResult={handleGroupChange} type="dropdown" title="बोलकर श्रेणी चुनें (Speak Group)" />
            </div>
          </div>

          {/* 5. Commodity */}
          <div className="relative bg-slate-50 border border-slate-200 rounded-xl px-2.5 pt-1.5 pb-1 focus-within:border-sky-500 focus-within:bg-white transition">
            <label className="block text-[10px] font-bold text-slate-500 tracking-tight leading-tight">
              Commodity
            </label>
            <div className="relative flex items-center">
              <select
                value={selectedCommodity}
                onChange={e => setSelectedCommodity(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer truncate py-1 pr-6"
              >
                {commodityOptions.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <VoiceInputMic onResult={setSelectedCommodity} type="dropdown" title="बोलकर फसल चुनें (Speak Crop)" />
            </div>
          </div>

          {/* 6. Variety */}
          <div className="relative bg-slate-50 border border-slate-200 rounded-xl px-2.5 pt-1.5 pb-1 focus-within:border-sky-500 focus-within:bg-white transition">
            <label className="block text-[10px] font-bold text-slate-500 tracking-tight leading-tight">
              Variety
            </label>
            <div className="relative flex items-center">
              <select
                value={selectedVariety}
                onChange={e => setSelectedVariety(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer truncate py-1 pr-6"
              >
                {VARIETIES.map(v => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <VoiceInputMic onResult={setSelectedVariety} type="dropdown" title="बोलकर किस्म चुनें (Speak Variety)" />
            </div>
          </div>

          {/* 7. Grade */}
          <div className="relative bg-slate-50 border border-slate-200 rounded-xl px-2.5 pt-1.5 pb-1 focus-within:border-sky-500 focus-within:bg-white transition">
            <label className="block text-[10px] font-bold text-slate-500 tracking-tight leading-tight">
              Grade
            </label>
            <div className="relative flex items-center">
              <select
                value={selectedGrade}
                onChange={e => setSelectedGrade(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer truncate py-1 pr-6"
              >
                {GRADES.map(g => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <VoiceInputMic onResult={setSelectedGrade} type="dropdown" title="बोलकर ग्रेड चुनें (Speak Grade)" />
            </div>
          </div>

        </div>

        {/* Buttons Row: ⚡ Go & Reset (Matching Image 1 & 2) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={tableSearch}
              onChange={e => setTableSearch(e.target.value)}
              placeholder="Search in table (e.g. Wheat, Prayagraj)..."
              className="w-full pl-8 pr-9 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:ring-1 focus:ring-sky-500"
            />
            <VoiceInputMic onResult={setTableSearch} title="बोलकर सर्च करें (Speak to Search)" />
          </div>


          <div className="flex items-center gap-2">
            <button
              onClick={handleApplyFilters}
              className="px-6 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current" /> Go
            </button>

            <button
              onClick={handleResetFilters}
              className="px-5 py-2 bg-slate-600 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition cursor-pointer active:scale-95"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. LOCATION STATUS STRIP & ACTIONS (Matching Image 2) ── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
            <span>{locationTitle}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Data shown is for 3 days, and data is frozen up to <strong>03 September 2026</strong>
          </p>
        </div>

        {/* Print & Download Action Cluster */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition cursor-pointer"
            title="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportCSV}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition cursor-pointer"
            title="Download CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── 4. AGMARKNET MULTI-DAY COMPARISON TABLE (Matching Image 2) ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              {/* Top Header Row with Exact Teal-Blue Theme from Image 2 */}
              <tr className="bg-[#02688b] text-white text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4 border-r border-[#035572] whitespace-nowrap">Commodity Group</th>
                <th className="py-3 px-4 border-r border-[#035572] whitespace-nowrap">Commodity</th>
                <th className="py-3 px-4 border-r border-[#035572] text-center whitespace-nowrap">MSP (Rs./Quintal) 2026-27</th>
                <th colSpan={3} className="py-3 px-4 border-r border-[#035572] text-center whitespace-nowrap">
                  Price (Rs./Quintal)
                </th>
                <th colSpan={3} className="py-3 px-4 text-center whitespace-nowrap">
                  Arrival (Metric Tonnes)
                </th>
              </tr>
              {/* Sub-header with Dates */}
              <tr className="bg-[#035572] text-white text-[10px] font-bold border-t border-[#02435b]">
                <th className="py-2 px-4 border-r border-[#02435b]"></th>
                <th className="py-2 px-4 border-r border-[#02435b]"></th>
                <th className="py-2 px-4 border-r border-[#02435b]"></th>
                {/* 3 Price Dates */}
                <th className="py-2 px-3 text-center border-r border-[#02435b] whitespace-nowrap">03 Sep, 2026</th>
                <th className="py-2 px-3 text-center border-r border-[#02435b] whitespace-nowrap">02 Sep, 2026</th>
                <th className="py-2 px-3 text-center border-r border-[#02435b] whitespace-nowrap">01 Sep, 2026</th>
                {/* 3 Arrival Dates */}
                <th className="py-2 px-3 text-center border-r border-[#02435b] whitespace-nowrap">03 Sep, 2026</th>
                <th className="py-2 px-3 text-center border-r border-[#02435b] whitespace-nowrap">02 Sep, 2026</th>
                <th className="py-2 px-3 text-center whitespace-nowrap">01 Sep, 2026</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 bg-white">
              {filteredTableData.length > 0 ? (
                filteredTableData.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-sky-50/60 transition ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-slate-600 border-r border-slate-200 whitespace-nowrap">
                      {row.group}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-slate-900 border-r border-slate-200 whitespace-nowrap">
                      {row.commodity}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-700 border-r border-slate-200 whitespace-nowrap">
                      {row.msp ? `${row.msp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                    </td>
                    
                    {/* Price 3 Dates */}
                    <td className="py-3 px-3 text-center font-bold text-slate-800 border-r border-slate-200 whitespace-nowrap">
                      {row.price_03Sep}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800 border-r border-slate-200 whitespace-nowrap">
                      {row.price_02Sep}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800 border-r border-slate-200 whitespace-nowrap">
                      {row.price_01Sep}
                    </td>

                    {/* Arrival 3 Dates */}
                    <td className="py-3 px-3 text-center font-medium text-slate-700 border-r border-slate-200 whitespace-nowrap">
                      {row.arr_03Sep}
                    </td>
                    <td className="py-3 px-3 text-center font-medium text-slate-700 border-r border-slate-200 whitespace-nowrap">
                      {row.arr_02Sep}
                    </td>
                    <td className="py-3 px-3 text-center font-medium text-slate-700 whitespace-nowrap">
                      {row.arr_01Sep}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400">
                    <p className="font-bold text-slate-600 text-sm">No commodity rates found for the selected filter combination.</p>
                    <p className="text-xs text-slate-400 mt-1">Please select "All Districts" or change the filter, or click Reset.</p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-3 px-4 py-1.5 bg-[#0284c7] text-white text-xs font-bold rounded-lg"
                    >
                      Reset Filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. CROP MENU BAR FILTER, 7-DAY AREA CHART & APMC CARDS ── */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> 7-Day Price Trajectory & Mandi Spot Rates
            </h3>
            <p className="text-xs text-slate-400">Select any crop from the menu bar filter below to view dynamic trends & spot prices</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              30+ Mandi Crops Available
            </span>
          </div>
        </div>

        {/* ── NEW: CROP MENU BAR FILTER COMPONENT (Replaces the simple pill row) ── */}
        <div ref={cropMenuRef} className="relative bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 space-y-3">
          
          {/* Main Menu Bar Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Left: Interactive Menu Button */}
            <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center text-lg shadow-sm font-bold flex-shrink-0">
                {currentCropObj.icon}
              </div>
              
              <div className="flex-1">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <span>Selected Crop for Graph</span>
                  <span className="text-emerald-600">• Active</span>
                </div>
                
                <div className="flex items-center gap-2 mt-0.5">
                  <button
                    type="button"
                    onClick={() => setCropMenuOpen(!cropMenuOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer shadow-xs"
                  >
                    <span>{currentCropObj.icon}</span>
                    <span>{currentCropObj.label}</span>
                    <span className="text-emerald-700 font-bold text-xs">({currentCropObj.hindi})</span>
                    <ChevronDown className={`w-4 h-4 text-emerald-700 transition-transform duration-200 ${cropMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setCropMenuOpen(!cropMenuOpen)}
                    className="text-xs text-slate-500 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer underline decoration-dotted"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Browse All Crops ({ALL_CROPS_DIRECTORY.length})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Middle: Native Select Dropdown for direct 1-click select */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold hidden lg:inline">Quick Dropdown:</span>
              <select
                value={activeTrendCrop}
                onChange={(e) => {
                  setActiveTrendCrop(e.target.value);
                  setCropMenuOpen(false);
                }}
                className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
              >
                {['Cereals', 'Pulses', 'Vegetables', 'Oilseeds', 'Cash Crops & Spices'].map(grp => (
                  <optgroup key={grp} label={`── ${grp} ──`}>
                    {ALL_CROPS_DIRECTORY.filter(c => c.group === grp).map(crop => (
                      <option key={crop.id} value={crop.id}>
                        {crop.icon} {crop.label} ({crop.hindi}) - ₹{crop.latestPrice}/q
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Right: Latest Modal Price Badge */}
            <div className="flex items-center gap-3 border-l border-slate-100 pl-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold block leading-none mb-1">
                  Modal Rate
                </span>
                <span className="text-base sm:text-lg font-black text-emerald-700 leading-none">
                  ₹{currentTrendData[currentTrendData.length - 1]?.price.toLocaleString()}/q
                </span>
              </div>
            </div>

          </div>

          {/* Quick Shortcuts Bar (Top popular crops pills) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 pb-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 whitespace-nowrap mr-1">
              Popular:
            </span>
            {[
              'onion', 'wheat', 'soybean', 'tomato', 'paddy', 'groundnut', 'potato', 'moong', 'mustard', 'cotton'
            ].map((cropId) => {
              const crop = ALL_CROPS_DIRECTORY.find(c => c.id === cropId);
              if (!crop) return null;
              const isActive = activeTrendCrop === crop.id;
              return (
                <button
                  key={crop.id}
                  onClick={() => {
                    setActiveTrendCrop(crop.id);
                    setCropMenuOpen(false);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                >
                  <span>{crop.icon}</span>
                  <span>{crop.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── DROPDOWN MENU MODAL/DRAWER (When cropMenuOpen is true) ── */}
          {cropMenuOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 sm:p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[480px] overflow-y-auto">
              
              {/* Header with Search and Close */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-black text-slate-800 text-sm flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-emerald-600" /> All India Agricultural Commodities List
                  </h4>
                  <p className="text-[11px] text-slate-400">Click any crop to dynamically plot its 7-day modal price trend graph</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="relative w-48 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={cropMenuSearch}
                      onChange={(e) => setCropMenuSearch(e.target.value)}
                      placeholder="Search crop (e.g. Gehun, Chana)..."
                      className="w-full pl-8 pr-9 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      autoFocus
                    />
                    <VoiceInputMic onResult={setCropMenuSearch} title="बोलकर फसल खोजें (Speak crop name)" />
                  </div>

                  <button
                    onClick={() => setCropMenuOpen(false)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['All', 'Cereals', 'Pulses', 'Vegetables', 'Oilseeds', 'Cash Crops & Spices'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCropMenuCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      cropMenuCategory === cat
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'All' ? '🌟 All Crops' : cat}
                  </button>
                ))}
              </div>

              {/* Grid of All Crops */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 pt-1">
                {filteredCropsList.map(crop => {
                  const isSelected = activeTrendCrop === crop.id;
                  return (
                    <button
                      key={crop.id}
                      onClick={() => {
                        setActiveTrendCrop(crop.id);
                        setCropMenuOpen(false);
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/30'
                          : 'bg-slate-50/70 border-slate-200/80 hover:bg-emerald-50/50 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl flex-shrink-0">{crop.icon}</span>
                        <div className="min-w-0 truncate">
                          <p className={`text-xs font-black truncate ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                            {crop.label}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {crop.hindi} • <span className="font-semibold text-slate-500">{crop.group}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 ml-2">
                        <span className="text-xs font-black text-emerald-700 block">
                          ₹{crop.latestPrice.toLocaleString()}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-100 px-1.5 py-0.2 rounded inline-flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Selected
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>
          )}

        </div>

        {/* ── 7-Day Interactive Area Trend Chart ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>{currentCropObj.icon}</span>
              <span>{currentCropObj.label} ({currentCropObj.hindi})</span>
              <span className="text-slate-400 font-normal">Modal Price Trajectory (₹ / Quintal)</span>
            </div>
            <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Latest Modal: ₹{currentTrendData[currentTrendData.length - 1]?.price.toLocaleString()}/q
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={currentTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="liveMktGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={['dataMin - 150', 'dataMax + 150']} />
              <Tooltip
                formatter={(val) => [`₹${val.toLocaleString()}/q`, `${currentCropObj.label} Modal Price`]}
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#059669"
                strokeWidth={2.5}
                fill="url(#liveMktGrad)"
                dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#047857' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── 4 Mandi Spot APMC Cards (Dynamically matched to Selected Crop) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeMandiCards.map((m) => (
            <div key={m.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition">
              <p className="font-black text-slate-800 text-sm mb-2 truncate" title={m.name}>{m.name}</p>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-slate-400 text-xs font-semibold">Modal</span>
                  <div className="font-black text-emerald-700 text-lg">{m.price}</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-xs font-semibold">Range</span>
                  <div className="text-xs text-slate-600 font-bold">{m.min} – {m.max}</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-xs font-semibold">Arrivals</span>
                  <div className="font-bold text-slate-700 text-xs">{m.arrivals}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </>
      ) : (
        /* ── OFFICIAL e-NAM MANDIS INTEGRATION & ₹30 LAKH ASSISTANCE DIRECTORY ── */
        <div className="space-y-6">
          
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white border border-emerald-800/40 shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-harvest-400" />
                    Ministry of Agriculture & Farmers Welfare, Govt. of India
                  </span>
                  <span className="text-xs text-emerald-200/70">Verified e-NAM Records</span>
                </div>
                <h3 className="text-2xl font-black font-heading text-white">
                  National e-NAM Mandis Integration & Infrastructure Assistance
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/80 max-w-3xl leading-relaxed">
                  Official status of electronic National Agriculture Market (e-NAM) integration across 27 States and Union Territories. Mandis receive free e-NAM trading software and up to ₹30 Lakh financial assistance for electronic weighbridges, assaying labs, and computer infrastructure.
                </p>
              </div>

              <div className="shrink-0 bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/15 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block tracking-wider">Total e-NAM Mandis</span>
                <span className="text-3xl font-black text-harvest-400 font-heading">1,389</span>
                <span className="text-xs text-white/90 font-medium block mt-0.5">Across 27 States & UTs</span>
              </div>
            </div>
          </div>

          {/* 4 National Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1 */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Integrated Mandis</span>
                <Landmark className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="my-2">
                <div className="text-2xl font-black text-slate-900 font-heading">
                  {ENAM_NATIONAL_SUMMARY.totalMandisIntegrated.toLocaleString()} Mandis
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Live on unified e-NAM portal</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Coverage:</span>
                <strong className="text-emerald-700">23 States + 4 UTs</strong>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">₹30 Lakh Assistance</span>
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </div>
              <div className="my-2">
                <div className="text-2xl font-black text-slate-900 font-heading">
                  {ENAM_NATIONAL_SUMMARY.totalMandisAssistance.toLocaleString()} Mandis
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{ENAM_NATIONAL_SUMMARY.assistanceCoveragePercent} Mandi Coverage</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Per Mandi Grant:</span>
                <strong className="text-blue-700">{ENAM_NATIONAL_SUMMARY.assistanceAmountPerMandi}</strong>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Assistance Fund</span>
                <Building2 className="w-4 h-4 text-amber-600" />
              </div>
              <div className="my-2">
                <div className="text-2xl font-black text-slate-900 font-heading">
                  {ENAM_NATIONAL_SUMMARY.totalAssistanceSanctionedCrores}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Agri-Tech Infrastructure Fund</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Status:</span>
                <span className="text-emerald-700 font-bold">Sanctioned & Disbursed</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Free Software Mandis</span>
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="my-2">
                <div className="text-2xl font-black text-slate-900 font-heading">
                  {ENAM_NATIONAL_SUMMARY.totalMandisSoftware.toLocaleString()} Mandis
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">100% Free Software Deployment</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Tech Adoption:</span>
                <strong className="text-emerald-700">100% Complete</strong>
              </div>
            </div>

          </div>

          {/* Top Integrated States Highlight Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Top Mandi Hub States on e-NAM Network
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {ENAM_NATIONAL_SUMMARY.topIntegratedStates.slice(0, 6).map((item) => (
                <div key={item.state} className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-300 transition">
                  <span className="text-xs font-extrabold text-slate-800 block truncate">{item.state}</span>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-lg font-black text-emerald-700 font-heading">{item.mandis}</span>
                    <span className="text-[10px] text-slate-500">Mandis</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{item.assistance} Assisted (₹30L)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search, Filter Toolbar & Detailed Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              
              {/* Category Pills */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEnamCategoryFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    enamCategoryFilter === 'ALL'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  All States/UTs ({OFFICIAL_ENAM_STATE_DATA.length})
                </button>
                <button
                  onClick={() => setEnamCategoryFilter('State')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    enamCategoryFilter === 'State'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  States ({OFFICIAL_ENAM_STATE_DATA.filter(d => d.category === 'State').length})
                </button>
                <button
                  onClick={() => setEnamCategoryFilter('Union Territory')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    enamCategoryFilter === 'Union Territory'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  UTs ({OFFICIAL_ENAM_STATE_DATA.filter(d => d.category === 'Union Territory').length})
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search State or UT..."
                  value={enamSearch}
                  onChange={(e) => setEnamSearch(e.target.value)}
                  className="w-full pl-8 pr-9 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <VoiceInputMic onResult={setEnamSearch} title="बोलकर राज्य या UT खोजें (Speak State/UT)" />
              </div>


            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#035572] text-white font-bold">
                  <tr>
                    <th className="py-3 px-4 text-center w-16">Sl. No.</th>
                    <th className="py-3 px-4">State / UT</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-4 text-center">Number of mandis received free software</th>
                    <th className="py-3 px-4 text-center">Number of mandis received Rs.30 lakh assistance under e-NAM</th>
                    <th className="py-3 px-4 text-center">Number of Mandis Integrated with e-NAM Platform</th>
                    <th className="py-3 px-4 text-center">Assistance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredEnamData.map((row, idx) => {
                    const isFullyAssisted = row.assistanceMandis === row.softwareMandis && row.softwareMandis > 0;
                    const isNA = row.assistanceNote === 'NA' || (row.assistanceMandis === 0 && row.softwareMandis > 0);

                    return (
                      <tr key={row.sno} className={idx % 2 === 0 ? 'bg-white hover:bg-sky-50/40' : 'bg-slate-50/50 hover:bg-sky-50/40'}>
                        <td className="py-2.5 px-4 text-center font-bold text-slate-500">{row.sno}</td>
                        <td className="py-2.5 px-4 font-extrabold text-slate-900">{row.state}</td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            row.category === 'State' ? 'bg-slate-100 text-slate-700' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {row.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center font-bold text-slate-900">{row.softwareMandis}</td>
                        <td className="py-2.5 px-4 text-center font-bold">
                          {isNA ? (
                            <span className="text-slate-400 font-semibold italic">NA</span>
                          ) : (
                            <span className={row.assistanceMandis > 0 ? 'text-emerald-700' : 'text-slate-600'}>
                              {row.assistanceMandis}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-center font-black text-slate-900">{row.integratedMandis}</td>
                        <td className="py-2.5 px-4 text-center">
                          {isFullyAssisted ? (
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                              100% Assisted ✓
                            </span>
                          ) : isNA ? (
                            <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                              Under Review (NA)
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                              {Math.round((row.assistanceMandis / row.softwareMandis) * 100)}% Assisted ({row.assistanceMandis}/{row.softwareMandis})
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Summary / Total Row */}
                  <tr className="bg-slate-900 text-white font-black border-t-2 border-slate-700">
                    <td className="py-3 px-4 text-center">Total</td>
                    <td className="py-3 px-4 font-black">All India (27 States/UTs)</td>
                    <td className="py-3 px-3 text-emerald-400">Total</td>
                    <td className="py-3 px-4 text-center text-harvest-400 font-heading text-sm">
                      {ENAM_NATIONAL_SUMMARY.totalMandisSoftware.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center text-emerald-400 font-heading text-sm">
                      {ENAM_NATIONAL_SUMMARY.totalMandisAssistance.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center text-white font-heading text-sm">
                      {ENAM_NATIONAL_SUMMARY.totalMandisIntegrated.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                        {ENAM_NATIONAL_SUMMARY.assistanceCoveragePercent} Overall Coverage
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          {/* Scheme Details Explanatory Note */}
          <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 flex items-start gap-3.5 text-xs text-sky-950">
            <Landmark className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-black text-sky-950 text-sm">
                About the Central Sector Scheme for Promotion of National Agriculture Market (e-NAM):
              </h5>
              <p className="text-[11px] text-sky-900 leading-relaxed font-medium">
                Under the e-NAM scheme funded through the Agri-Tech Infrastructure Fund (ATIF), the Government of India provides free software to all participating APMCs and one-time financial assistance of up to ₹30.00 Lakh per mandi for procurement of quality assaying equipment, electronic weighbridges, grading lines, and IT infrastructure.
              </p>
              <p className="text-[10px] text-sky-800/80">
                Data reflects official records covering 1,389 wholesale regulated markets integrated across 23 States and 4 Union Territories.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

