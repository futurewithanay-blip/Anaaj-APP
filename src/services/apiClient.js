/**
 * Anaaj API Client
 * Seamlessly interfaces React frontend with Python FastAPI backend.
 * Falls back to verified official government benchmark algorithms if backend is offline.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

let _backendAvailable = null;
let _lastCheckTime = 0;

export async function isBackendAlive() {
  const now = Date.now();
  if (_backendAvailable !== null && now - _lastCheckTime < 30000) {
    return _backendAvailable;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);
    const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    _backendAvailable = res.ok;
  } catch (err) {
    _backendAvailable = false;
  }

  _lastCheckTime = now;
  return _backendAvailable;
}

export async function getLiveMandiPrices(state = '', commodity = '', limit = 50) {
  try {
    const params = new URLSearchParams();
    if (state) params.append('state', state);
    if (commodity) params.append('commodity', commodity);
    if (limit) params.append('limit', limit);

    const res = await fetch(`${API_BASE_URL}/api/v1/mandi/live?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[ApiClient] Failed to fetch live mandi from backend, using local fallback:', err.message);
    return null;
  }
}

export async function getAiPriceForecast({ cropName, targetMandi, harvestDate, moisturePercent, grade }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/forecast/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crop_name: cropName,
        target_mandi: targetMandi || 'Lasalgaon',
        harvest_date: harvestDate || '',
        moisture_percent: Number(moisturePercent) || 12.0,
        grade: grade || 'A'
      })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();
    return result.data;
  } catch (err) {
    console.warn('[ApiClient] Backend forecast unreachable, utilizing local ML engine fallback:', err.message);
    return null;
  }
}

export async function getStorageAdvisory({ crop, volumeQtl, currentPrice, expectedFuturePrice, holdingMonths = 2, useWdra = true }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/storage/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crop,
        volume_qtl: Number(volumeQtl),
        current_price: Number(currentPrice),
        expected_future_price: Number(expectedFuturePrice),
        holding_months: Number(holdingMonths) || 2,
        use_wdra: Boolean(useWdra)
      })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();
    return result.data;
  } catch (err) {
    console.warn('[ApiClient] Backend storage advisory unreachable, utilizing local fallback:', err.message);
    return null;
  }
}

export async function getLiveWeather({ district = 'Nashik', state = 'Maharashtra' }) {
  try {
    const params = new URLSearchParams({ district, state });
    const res = await fetch(`${API_BASE_URL}/api/v1/weather/live?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();
    return result.data;
  } catch (err) {
    console.warn('[ApiClient] Backend live weather unreachable:', err.message);
    return null;
  }
}

