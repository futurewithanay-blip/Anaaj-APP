import asyncio
from backend.services.agmarknet_client import fetch_live_mandi_prices
from backend.services.forecasting_engine import generate_price_forecast
from backend.services.storage_engine import calculate_storage_advisory

async def run_tests():
    print("=== TEST 1: Live Agmarknet Client ===")
    mandi_res = await fetch_live_mandi_prices(commodity="Onion", limit=5)
    print("Mandi Response Status:", mandi_res.get("status"))
    print("Source:", mandi_res.get("source"))
    print("Records count:", len(mandi_res.get("records", [])))
    assert len(mandi_res.get("records", [])) > 0, "No records returned!"
    sample = mandi_res["records"][0]
    print(f"Sample Record: {sample['commodity']} @ {sample['market']}: Rs. {sample['modal_price']}/Qtl")

    print("\n=== TEST 2: AI Price Forecasting Engine ===")
    forecast = await generate_price_forecast(
        crop_name="Onion",
        target_mandi="Lasalgaon",
        moisture_percent=11.5,
        grade="Grade A"
    )
    print("Forecast Crop:", forecast["crop"])
    print("Current Modal Price: Rs.", forecast["current_modal_price"])
    print("MSP Floor: Rs.", forecast["msp_floor"])
    print("+7 Days:", forecast["forecast_7d"])
    print("+15 Days:", forecast["forecast_15d"])
    print("+30 Days:", forecast["forecast_30d"])
    print("Recommendation:", forecast["recommendation"])
    print("Best Selling Window:", forecast["best_selling_window"])
    assert forecast["current_modal_price"] > 0, "Forecast current price is 0!"

    print("\n=== TEST 3: WDRA Storage Economics Engine ===")
    storage = calculate_storage_advisory(
        crop="Onion",
        volume_qtl=80.0,
        current_price=forecast["current_modal_price"],
        expected_future_price=forecast["forecast_30d"]["modal"],
        holding_months=1,
        use_wdra=True
    )
    print("Immediate Revenue: Rs.", storage["immediate_sale_revenue"])
    print("Future Net Revenue: Rs.", storage["future_net_revenue"])
    print("Net Gain: Rs.", storage["net_gain"])
    print("Verdict:", storage["verdict"])
    print("e-NWR Pledge Loan Available: Rs.", storage["pledge_loan_amount"])

    print("\nAll Backend Service Tests PASSED successfully! [OK]")

if __name__ == "__main__":
    asyncio.run(run_tests())
