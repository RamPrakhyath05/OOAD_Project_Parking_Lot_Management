import { useState } from 'react';
import { api } from '../api';
import { LogOut, Receipt, Clock, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';

export default function UnparkVehicle() {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicleNumber) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await api.postJSON('/api/parking/exit', {
        numberPlate: vehicleNumber
      });
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to unpark vehicle. Please check the vehicle number.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (t) => {
    if (!t) return '—';
    try {
      return new Date(t).toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: 'short'
      });
    } catch {
      return t;
    }
  };

  // Safe duration calculation
  const calculateDuration = () => {
    if (!result?.entryTime || !result?.exitTime) return 0;
    const diff = new Date(result.exitTime) - new Date(result.entryTime);
    return Math.ceil(diff / (1000 * 60 * 60));
  };

  const duration = calculateDuration();

  return (
    <div className="unpark-view">
      <div className="unpark-grid">

        {/* LEFT: INPUT */}
        <div className="unpark-section">
          <div className="section-header">
            <LogOut size={20} color="#fbbf24" />
            <h3>Exit Processing</h3>
          </div>

          <div className="unpark-card">
            <form onSubmit={handleSubmit} className="unpark-form">
              <div className="form-group">
                <label>License Plate</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KA-01-HH-1234"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                />
              </div>

              <button type="submit" className="warning-btn" disabled={loading}>
                <CreditCard size={18} />
                {loading ? 'Calculating Fee...' : 'Unpark & Generate Bill'}
              </button>
            </form>
          </div>

          {error && (
            <div className="unpark-alert error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* RIGHT: RECEIPT */}
        <div className="unpark-section">
          <div className="section-header">
            <Receipt size={20} color="#fbbf24" />
            <h3>Billing Summary</h3>
          </div>

          {!result ? (
            <div className="empty-receipt-state">
              <Receipt size={48} strokeWidth={1} />
              <p>Process a vehicle exit to view the final invoice</p>
            </div>
          ) : (
            <div className="invoice-card animate-pop">

              {/* STATUS */}
              <div className="invoice-status">
                <CheckCircle2 color="#fbbf24" size={32} />
                <h4>Payment Successful</h4>

                {/* ✅ FIXED (no split crash) */}
                <small>Transaction ID: TXN-{result.ticketId}</small>
              </div>

              {/* DETAILS */}
              <div className="invoice-details">

                <div className="invoice-row">
                  <div className="detail">
                    <label>Vehicle Plate</label>
                    <p>{result.vehicleLicensePlate}</p>
                  </div>

                  <div className="detail text-right">
                    <label>Slot Number</label>
                    <p className="slot-text">{result.slotNumber}</p>
                  </div>
                </div>

                <div className="invoice-row dashed-top">
                  <div className="detail">
                    <Clock size={14} />
                    <label>Duration</label>
                    <p>{duration} hr{duration !== 1 ? 's' : ''}</p>
                  </div>

                  <div className="detail text-right">
                    <label>Exit Time</label>
                    <p>{formatTime(result.exitTime)}</p>
                  </div>
                </div>

                {/* TOTAL */}
                <div className="total-section">
                  <div className="total-label">Total Amount Paid</div>

                  {/* ✅ SAFE fee rendering */}
                  <div className="total-amount">
                    ₹{result.fee ? result.fee.toFixed(2) : '0.00'}
                  </div>
                </div>

              </div>

              <div className="invoice-footer">
                <p>ParkQ Digital Receipt • {new Date().getFullYear()}</p>
                <small>Thank you for choosing ParkQ Systems</small>
              </div>

            </div>
          )}
        </div>
      </div>

    <style jsx>{`
      .unpark-view {
        animation: fadeIn 0.4s ease-out;
        padding: 20px;
      }

      .unpark-grid {
        display: grid;
        grid-template-columns: 360px 1fr;
        gap: 32px;
        align-items: start;
      }

      .section-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 16px;
      }

      .section-header h3 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 700;
        color: #0f172a;
      }

      /* LEFT PANEL */
      .unpark-card {
        background: rgba(255, 255, 255, 0.75);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(226, 232, 240, 0.6);
        border-radius: 16px;
        padding: 26px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      }

      .unpark-form {
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      .form-group label {
        font-size: 0.85rem;
        font-weight: 600;
        color: #475569;
        margin-bottom: 4px;
        display: block;
      }

      input {
        padding: 12px 14px;
        border-radius: 10px;
        border: 1px solid #cbd5f5;
        font-size: 0.95rem;
        transition: all 0.2s ease;
      }

      input:focus {
        outline: none;
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
      }

      .warning-btn {
        background: linear-gradient(135deg, #0f172a, #1e293b);
        color: #fbbf24;
        padding: 12px;
        border-radius: 10px;
        border: none;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        cursor: pointer;
        transition: all 0.25s ease;
      }

      .warning-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 8px 20px rgba(15, 23, 42, 0.25);
      }

      /* ERROR */
      .unpark-alert {
        margin-top: 12px;
        padding: 10px 12px;
        border-radius: 10px;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .unpark-alert.error {
        background: #fee2e2;
        color: #991b1b;
      }

      /* RIGHT PANEL */
      .invoice-card {
        background: linear-gradient(135deg, #0f172a, #020617);
        color: white;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
        animation: pop 0.35s ease;
      }

      .invoice-status {
        padding: 28px;
        text-align: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      .invoice-status h4 {
        margin: 10px 0 6px;
        font-size: 1.1rem;
      }

      .invoice-status small {
        color: #94a3b8;
      }

      .invoice-details {
        padding: 24px;
      }

      .invoice-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 18px;
      }

      .detail label {
        font-size: 0.7rem;
        text-transform: uppercase;
        color: #64748b;
        letter-spacing: 0.05em;
      }

      .detail p {
        margin: 4px 0 0;
        font-weight: 600;
      }

      .slot-text {
        color: #fbbf24;
      }

      .dashed-top {
        border-top: 1px dashed rgba(255, 255, 255, 0.15);
        padding-top: 16px;
      }

      .total-section {
        margin-top: 20px;
        text-align: center;
      }

      .total-label {
        font-size: 0.85rem;
        color: #94a3b8;
      }

      .total-amount {
        font-size: 2.2rem;
        font-weight: 700;
        margin-top: 6px;
        color: #fbbf24;
      }

      .invoice-footer {
        text-align: center;
        padding: 16px;
        font-size: 0.75rem;
        color: #64748b;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }

      .empty-receipt-state {
        text-align: center;
        padding: 60px 20px;
        color: #64748b;
      }

      /* ANIMATIONS */
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes pop {
        from { transform: scale(0.96); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }

    `}</style>
    </div>
  );
}
