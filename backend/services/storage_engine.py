from typing import Dict, Any

# WDRA Standard Tariff Baselines (₹ per Quintal per Month)
WAREHOUSE_RATES = {
    "Onion": {"cold_storage": 95, "ventilated": 45, "subsidy_pct": 35},
    "Soybean": {"dry_godown": 18, "silo": 24, "subsidy_pct": 40},
    "Wheat": {"cwc_swc_godown": 16, "silo": 22, "subsidy_pct": 40},
    "Gram": {"dry_godown": 17, "silo": 22, "subsidy_pct": 40},
    "Arhar (Tur/Red Gram)": {"dry_godown": 19, "silo": 25, "subsidy_pct": 40},
    "Default": {"dry_godown": 20, "subsidy_pct": 30}
}

def calculate_storage_advisory(
    crop: str,
    volume_qtl: float,
    current_price: float,
    expected_future_price: float,
    holding_months: int = 2,
    use_wdra: bool = True
) -> Dict[str, Any]:
    """
    Computes precise storage economics:
    Compares Immediate Distress Sale vs WDRA Storage + e-NWR Loan + Future Sale.
    """
    rates = WAREHOUSE_RATES.get(crop, WAREHOUSE_RATES["Default"])
    base_rent = rates.get("cold_storage" if crop == "Onion" else "dry_godown", 25)
    subsidy_pct = rates.get("subsidy_pct", 30) if use_wdra else 0

    effective_monthly_rent = base_rent * (1 - (subsidy_pct / 100))
    total_rent = effective_monthly_rent * holding_months * volume_qtl

    # In-and-Out handling & bagging charges
    handling_per_qtl = 25 if use_wdra else 35
    total_handling = handling_per_qtl * volume_qtl

    # Spoilage / Weight loss factor
    loss_rate_per_month = 0.012 if crop == "Onion" else 0.003  # ~1.2% per mo for onion, 0.3% for grains
    total_loss_pct = loss_rate_per_month * holding_months
    effective_volume_after_loss = volume_qtl * (1 - total_loss_pct)

    # Financial Comparison
    immediate_revenue = current_price * volume_qtl
    future_gross_revenue = expected_future_price * effective_volume_after_loss
    total_storage_costs = total_rent + total_handling
    future_net_revenue = future_gross_revenue - total_storage_costs

    net_gain = future_net_revenue - immediate_revenue
    roi_pct = (net_gain / immediate_revenue) * 100 if immediate_revenue > 0 else 0

    # e-NWR Pledge Loan (Kisan Credit against electronic Negotiable Warehouse Receipt)
    # 70% of lot value at 7% subsidized interest rate
    enwr_eligible = use_wdra
    pledge_loan_amount = (immediate_revenue * 0.70) if enwr_eligible else 0

    if net_gain > 0:
        verdict = "STORE_AND_WAIT"
        verdict_text = f"गोदाम में रखें — शुद्ध अतिरिक्त लाभ ₹{int(net_gain):,} (+{roi_pct:.1f}% ROI)"
        verdict_badge = "emerald"
    else:
        verdict = "SELL_NOW"
        verdict_text = f"तुरंत मंडी में बेचें — भंडारण खर्च भाव वृद्धि से अधिक है"
        verdict_badge = "rose"

    return {
        "crop": crop,
        "volume_qtl": volume_qtl,
        "holding_months": holding_months,
        "use_wdra": use_wdra,
        "immediate_sale_revenue": round(immediate_revenue, 2),
        "future_net_revenue": round(future_net_revenue, 2),
        "total_storage_cost": round(total_storage_costs, 2),
        "government_subsidy_amount": round((base_rent * (subsidy_pct / 100)) * holding_months * volume_qtl, 2),
        "weight_loss_pct": round(total_loss_pct * 100, 2),
        "net_gain": round(net_gain, 2),
        "roi_pct": round(roi_pct, 1),
        "verdict": verdict,
        "verdict_text": verdict_text,
        "verdict_badge": verdict_badge,
        "enwr_pledge_loan_available": enwr_eligible,
        "pledge_loan_amount": round(pledge_loan_amount, 2),
        "details": {
            "effective_monthly_rent_per_qtl": round(effective_monthly_rent, 2),
            "handling_charges_per_qtl": handling_per_qtl,
            "wdra_accredited": use_wdra
        }
    }
