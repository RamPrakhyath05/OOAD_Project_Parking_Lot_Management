import { useState } from 'react';
import { api } from '../api';
import { Search, MapPin, Hash, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

export default function SearchVehicle() {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!vehicleNumber) return;
    
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const data = await api.getFast(`/api/parking/search?vehicleNumber=${encodeURIComponent(vehicleNumber)}`);
      setResult(data);
    } catch (err) {
      setError('Vehicle not found in the active database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-view">
      <div className="search-grid">
        
        {/* Left: Search Input */}
        <div className="search-section">
          <div className="section-header">
            <Search size={20} color="#fbbf24" />
            <h3>Locate Vehicle</h3>
          </div>

          <div className="search-card">
            <form onSubmit={handleSearch} className="search-form">
              <div className="form-group">
                <label>Plate Number</label>
                <div className="search-input-wrapper">
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. KA-01-HH-1234"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Searching...' : 'Find Vehicle'}
              </button>
            </form>
          </div>

          {error && (
            <div className="search-alert error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right: Results Display */}
        <div className="search-section">
          <div className="section-header">
            <MapPin size={20} color="#fbbf24" />
            <h3>Location Results</h3>
          </div>

          {!result ? (
            <div className="empty-search-state">
              <Search size={48} strokeWidth={1} />
              <p>Enter a plate number to see parking details</p>
            </div>
          ) : (
            <div className="result-container animate-pop">
              <div className="location-highlight">
                <div className="slot-badge">
                  <small>Assigned Slot</small>
                  <h2>{result.slotNumber}</h2>
                </div>
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <Hash size={18} />
                  <div>
                    <label>Ticket ID</label>
                    <p>{result.ticketId}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <ShieldCheck size={18} />
                  <div>
                    <label>License Plate</label>
                    <p>{result.vehicleLicensePlate}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <Clock size={18} />
                  <div>
                    <label>Entry Timestamp</label>
                    <p>{result.entryTime ? new Date(result.entryTime).toLocaleString() : 'N/A'}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className={`status-pill ${result.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                    {result.status}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .search-view { animation: fadeIn 0.4s ease-out; }
        .search-grid { display: grid; grid-template-columns: 320px 1fr; gap: 30px; align-items: start; }
        
        .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
        .section-header h3 { 
          margin: 0; font-size: 1.1rem; color: #1e293b; font-weight: 700; 
          text-transform: uppercase; letter-spacing: 0.5px; 
        }

        .search-card { 
          background: white; border: 1px solid #e2e8f0; border-radius: 12px; 
          padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); 
        }

        .search-form { display: flex; flex-direction: column; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 0.85rem; font-weight: 600; color: #64748b; }
        
        input {
          width: 100%; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 8px;
          font-size: 0.95rem; transition: all 0.2s; outline: none; box-sizing: border-box;
        }

        input:focus { border-color: #fbbf24; box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.1); }

        .primary-btn {
          background: #0f172a; color: white; border: none; padding: 12px;
          border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;
        }

        .primary-btn:hover { background: #1e293b; }
        .primary-btn:disabled { opacity: 0.6; cursor: wait; }

        /* Result Styling */
        .result-container {
          background: white; border: 1px solid #e2e8f0; border-radius: 16px;
          overflow: hidden; display: flex; flex-direction: column;
        }

        .location-highlight {
          background: #0f172a; padding: 40px; display: flex; justify-content: center;
          border-bottom: 4px solid #fbbf24;
        }

        .slot-badge { text-align: center; color: white; }
        .slot-badge small { text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; font-weight: 600; }
        .slot-badge h2 { font-size: 4rem; margin: 0; color: #fbbf24; line-height: 1; }

        .details-grid {
          padding: 30px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px; background: #fff;
        }

        .detail-item { display: flex; align-items: flex-start; gap: 12px; color: #64748b; }
        .detail-item label { display: block; font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #94a3b8; }
        .detail-item p { margin: 0; font-size: 1rem; color: #1e293b; font-weight: 600; }

        .status-pill {
          display: inline-block; padding: 6px 16px; border-radius: 20px;
          font-size: 0.8rem; font-weight: 800; text-transform: uppercase;
        }
        .status-pill.active { background: #dcfce7; color: #166534; }
        .status-pill.inactive { background: #f1f5f9; color: #475569; }

        .empty-search-state {
          height: 350px; display: flex; flex-direction: column; align-items: center;
          justify-content: center; color: #94a3b8; border: 2px dashed #e2e8f0; border-radius: 16px;
          background: #f8fafc;
        }

        .empty-search-state p { margin-top: 15px; font-weight: 500; }

        .search-alert {
          margin-top: 15px; padding: 12px; border-radius: 8px; display: flex; 
          align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 500;
        }
        .search-alert.error { background: #fef2f2; color: #dc2626; border: 1px solid #ef4444; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pop { from { transform: scale(0.98); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-pop { animation: pop 0.3s ease-out; }

        @media (max-width: 1024px) { .search-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
