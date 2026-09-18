/**
 * anaaj Shared Payment Database Service
 * Provides persistent, reactive cross-role transaction management
 * connecting Buyer, FPO, and Farmer.
 */

const STORAGE_KEY_PAYMENTS = 'anaaj_db_payments';
const STORAGE_KEY_BUYER_SCHEDULE = 'anaaj_db_buyer_schedule';
const STORAGE_KEY_FPO_PAYOUTS = 'anaaj_db_fpo_payouts';
const DB_EVENT_NAME = 'anaaj_db_payment_update';

// Initial seed payments for demonstration
const INITIAL_PAYMENTS = [
  {
    id: 'PAY-8801',
    fromRole: 'buyer',
    fromName: 'Reliance Fresh Ltd',
    toFarmer: 'Dnyaneshwar Patil',
    crop: 'Sharbati Wheat (200 Qtl)',
    amount: 184000,
    amountFormatted: '₹1,84,000',
    date: '22 Aug 2026',
    timestamp: '2026-08-22T11:45:00.000Z',
    method: 'NEFT / RTGS',
    status: 'Received',
    orderId: 'ORD-501',
    utr: 'UTR-HDFC9928172635',
    accountMasked: 'SBI •••• 4321',
    notes: 'Escrow payment released after quality assay clearance (Lasalgaon APMC)',
  },
  {
    id: 'PAY-8802',
    fromRole: 'buyer',
    fromName: 'BigBasket Wholesale',
    toFarmer: 'Dnyaneshwar Patil',
    crop: 'Red Onion (120 Qtl)',
    amount: 96000,
    amountFormatted: '₹96,000',
    date: '15 Aug 2026',
    timestamp: '2026-08-15T15:20:00.000Z',
    method: 'UPI Instant Payout',
    status: 'Received',
    orderId: 'ORD-488',
    utr: 'UPI-BB2026081599812',
    accountMasked: 'SBI •••• 4321',
    notes: 'Advance token payment for farm-gate lot pickup',
  },
  {
    id: 'PAY-8803',
    fromRole: 'fpo',
    fromName: 'Sahyadri Farmers Producer Co.',
    toFarmer: 'Dnyaneshwar Patil',
    crop: 'Summer Onion Pooling (28 Qtl)',
    amount: 73915,
    amountFormatted: '₹73,915',
    date: '10 Aug 2026',
    timestamp: '2026-08-10T14:10:00.000Z',
    method: 'Direct DBT / FPO Settlement',
    status: 'Received',
    orderId: 'FPO-POOL-102',
    utr: 'UTR-ICIC8812903817',
    accountMasked: 'SBI •••• 4321',
    notes: 'Member realization: ₹75,040 gross − 1.5% management cess',
  },
  {
    id: 'PAY-8804',
    fromRole: 'buyer',
    fromName: 'Godrej Agrovet Ltd',
    toFarmer: 'Dnyaneshwar Patil',
    crop: 'Yellow Soybean (80 Qtl)',
    amount: 120000,
    amountFormatted: '₹1,20,000',
    date: 'Pending',
    timestamp: '2026-09-06T10:00:00.000Z',
    method: 'Digital Escrow (Locked)',
    status: 'Pending',
    orderId: 'ORD-519',
    utr: 'Pending Delivery Weighment',
    accountMasked: 'SBI •••• 4321',
    notes: 'Funds locked in SBI Escrow. Release on final delivery inspection.',
  }
];

class PaymentDatabase {
  constructor() {
    this._initStorage();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY_PAYMENTS) {
          this._notifyListeners();
        }
      });
    }
  }

  _initStorage() {
    if (typeof window === 'undefined') return;
    try {
      const existing = localStorage.getItem(STORAGE_KEY_PAYMENTS);
      if (!existing) {
        localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
      }
    } catch (err) {
      console.warn('LocalStorage unavailable for PaymentDatabase', err);
    }
  }

  _notifyListeners(newPayment = null) {
    if (typeof window === 'undefined') return;
    const event = new CustomEvent(DB_EVENT_NAME, { detail: { newPayment } });
    window.dispatchEvent(event);
  }

  /**
   * Get all payments, optionally filtered by farmer name or role
   */
  getPayments(filter = {}) {
    if (typeof window === 'undefined') return INITIAL_PAYMENTS;
    try {
      const data = localStorage.getItem(STORAGE_KEY_PAYMENTS);
      let list = data ? JSON.parse(data) : INITIAL_PAYMENTS;

      if (filter.farmerName) {
        const query = filter.farmerName.toLowerCase();
        list = list.filter(p => !p.toFarmer || p.toFarmer.toLowerCase().includes(query) || p.toFarmer.toLowerCase().includes('patil'));
      }
      if (filter.fromRole) {
        list = list.filter(p => p.fromRole === filter.fromRole);
      }
      if (filter.status) {
        list = list.filter(p => p.status.toLowerCase() === filter.status.toLowerCase());
      }
      // Sort newest first
      return list.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
    } catch (err) {
      console.error('Error fetching payments', err);
      return INITIAL_PAYMENTS;
    }
  }

  /**
   * Record a new payment (called when Buyer pays or FPO releases payout)
   */
  recordPayment({
    fromRole, // 'buyer' | 'fpo'
    fromName, // Name of buyer or FPO company
    toFarmer = 'Dnyaneshwar Patil',
    crop = 'Produce Lot',
    amount,
    method = 'NEFT / Escrow Release',
    orderId = `ORD-${Math.floor(100 + Math.random() * 900)}`,
    accountMasked = 'SBI •••• 4321',
    notes = 'Payment completed via anaaj Escrow Portal',
    status = 'Received'
  }) {
    const numericAmount = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.]/g, '')) || 0;
    const formattedAmount = `₹${numericAmount.toLocaleString('en-IN')}`;
    const newId = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const utrCode = `UTR-${fromRole.toUpperCase()}${Date.now().toString().slice(-8)}`;

    const newRecord = {
      id: newId,
      fromRole,
      fromName: fromName || (fromRole === 'buyer' ? 'Adani Wilmar Ltd' : 'Sahyadri Agro FPO'),
      toFarmer,
      crop,
      amount: numericAmount,
      amountFormatted: formattedAmount,
      date: dateStr,
      timestamp: now.toISOString(),
      method,
      status,
      orderId,
      utr: utrCode,
      accountMasked,
      notes
    };

    if (typeof window !== 'undefined') {
      try {
        const list = this.getPayments();
        list.unshift(newRecord);
        localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(list));
        this._notifyListeners(newRecord);
      } catch (err) {
        console.error('Failed to record payment in LocalStorage', err);
      }
    }

    return newRecord;
  }

  /**
   * Compute live summary metrics for farmer
   */
  getFarmerStats(farmerName = 'Dnyaneshwar Patil') {
    const list = this.getPayments({ farmerName });
    let totalReceived = 0;
    let totalPending = 0;

    list.forEach(p => {
      const amt = typeof p.amount === 'number' ? p.amount : (parseFloat(String(p.amount).replace(/[^0-9.]/g, '')) || 0);
      if (p.status === 'Received') {
        totalReceived += amt;
      } else if (p.status === 'Pending') {
        totalPending += amt;
      }
    });

    const totalSales = totalReceived + totalPending;

    return {
      totalReceived,
      totalReceivedFormatted: `₹${(totalReceived / 100000).toFixed(2)}L (₹${totalReceived.toLocaleString('en-IN')})`,
      totalPending,
      totalPendingFormatted: `₹${(totalPending / 100000).toFixed(2)}L (₹${totalPending.toLocaleString('en-IN')})`,
      totalSales,
      totalSalesFormatted: `₹${(totalSales / 100000).toFixed(2)}L (₹${totalSales.toLocaleString('en-IN')})`,
      count: list.length,
      receivedCount: list.filter(p => p.status === 'Received').length
    };
  }

  /**
   * Subscribe to real-time payment updates across components and tabs
   */
  subscribe(callback) {
    if (typeof window === 'undefined') return () => {};
    const handler = (e) => {
      callback(e.detail?.newPayment || null);
    };
    window.addEventListener(DB_EVENT_NAME, handler);
    return () => {
      window.removeEventListener(DB_EVENT_NAME, handler);
    };
  }
}

export const sharedPaymentDB = new PaymentDatabase();
export default sharedPaymentDB;
