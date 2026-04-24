import { useState } from 'react';
import { api } from '../api';
import { Car, Bike, Navigation, Ticket, MapPin, Clock, CheckCircle2 } from 'lucide-react';

export default function ParkVehicle() {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    type: 'CAR',
    strategy: 'NEAREST'
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const data = await api.postJSON('/api/parking/entry', {
        numberPlate: formData.vehicleNumber,
        ownerName: "User", 
        vehicleType: formData.type,
        strategy: "nearestSlot"
      });

      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to park vehicle');
    } finally {
      setLoading(false);
    }  
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';
    try {
      const date = new Date(timeStr);
      if (isNaN(date.getTime())) return timeStr;
      return date.toLocaleString();
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="park-view">
      <div className="park-grid">
        
        {/* Left: Form Column */}
        <div className="park-section">
          <div className="section-header">
            <Car size={20} color="#fbbf24" />
            <h3>Vehicle Entry</h3>
          </div>

          <div className="park-card">
            <form onSubmit={handleSubmit} className="park-form">
              <div className="form-group">
                <label>Plate Number</label>
                <div className="input-with-icon">
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. KA-01-HH-1234"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Vehicle Type</label>
                <div className="type-selector">
                  <button 
                    type="button"
                    className={`type-btn ${formData.type === 'CAR' ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, type: 'CAR'})}
                  >
                    <Car size={18} /> Car
                  </button>
                  <button 
                    type="button"
                    className={`type-btn ${formData.type === 'BIKE' ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, type: 'BIKE'})}
                  >
                    <Bike size={18} /> Bike
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Parking Strategy</label>
                <select 
                  value={formData.strategy}
                  onChange={(e) => setFormData({...formData, strategy: e.target.value})}
                >
                  <option value="NEAREST">Nearest Available Slot</option>
                </select>
              </div>

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Assigning Slot...' : 'Park Vehicle'}
              </button>
            </form>
          </div>

          {error && <div className="park-alert error">{error}</div>}
        </div>

        {/* Right: Success Result */}
        <div className="park-section">
          <div className="section-header">
            <Navigation size={20} color="#fbbf24" />
            <h3>Parking Assignment</h3>
          </div>

          {!result ? (
            <div className="empty-assignment">
              <div className="pulse-circle"><Car size={32} /></div>
              <p>Assign a vehicle to generate a ticket</p>
            </div>
          ) : (
            <div className="ticket-card animate-pop">
              <div className="ticket-header">
                <CheckCircle2 color="#22c55e" size={24} />
                <span>Assignment Confirmed</span>
              </div>
              
              <div className="ticket-body">
                <div className="ticket-row big">
                  <small>Slot Number</small>
                  <strong>{result.slotNumber || 'N/A'}</strong>
                </div>

                <div className="ticket-info">
                  <div className="info-item">
                    <Ticket size={16} />
                    <div>
                      <small>Ticket ID</small>
                      <p>{result.ticketId}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <MapPin size={16} />
                    <div>
                      <small>License Plate</small>
                      <p>{result.vehicleLicensePlate || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <Clock size={16} />
                    <div>
                      <small>Entry Time</small>
                      <p>{formatTime(result.entryTime)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="ticket-footer">
                <small>ParkQ Smart Ticketing System</small>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .park-view { animation: fadeIn 0.4s ease-out; }
        .park-grid { display: grid; grid-template-columns: 320px 1fr; gap: 30px; align-items: start; }
        
        .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
        .section-header h3 { 
          margin: 0; font-size: 1.1rem; color: #1e293b; font-weight: 700; 
          text-transform: uppercase; letter-spacing: 0.5px; 
        }

        .park-card { 
          background: white; border: 1px solid #e2e8f0; border-radius: 12px; 
          padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); 
        }

        .park-form { display: flex; flex-direction: column; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 0.85rem; font-weight: 600; color: #64748b; }
        
        input, select {
          padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px;
          font-size: 0.95rem; transition: all 0.2s; outline: none;
        }

        input:focus { border-color: #fbbf24; box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.1); }

        .type-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .type-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;
          background: white; cursor: pointer; transition: all 0.2s;
          font-weight: 500; color: #64748b;
        }

        .type-btn.active { 
          background: #0f172a; color: #fbbf24; border-color: #0f172a; 
        }

        .primary-btn {
          background: #0f172a; color: white; border: none; padding: 12px;
          border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;
        }

        .primary-btn:hover { background: #1e293b; }
        .primary-btn:disabled { opacity: 0.6; cursor: wait; }

        /* Ticket Styling */
        .ticket-card {
          background: #0f172a; color: white; border-radius: 16px;
          overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.2);
          max-width: 400px;
        }

        .ticket-header {
          padding: 16px 24px; background: rgba(255, 255, 255, 0.05);
          display: flex; align-items: center; gap: 12px; border-bottom: 1px dashed rgba(255,255,255,0.1);
        }

        .ticket-body { padding: 24px; }
        .ticket-row.big { text-align: center; margin-bottom: 24px; }
        .ticket-row.big small { color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
        .ticket-row.big strong { display: block; font-size: 3rem; color: #fbbf24; line-height: 1; }

        .ticket-info { display: flex; flex-direction: column; gap: 16px; }
        .info-item { display: flex; align-items: flex-start; gap: 12px; color: #cbd5e1; }
        .info-item small { display: block; color: #94a3b8; font-size: 0.7rem; text-transform: uppercase; }
        .info-item p { margin: 0; font-size: 0.95rem; font-weight: 500; }

        .ticket-footer { padding: 12px; background: #fbbf24; text-align: center; color: #0f172a; font-weight: 700; }

        .empty-assignment {
          height: 300px; display: flex; flex-direction: column; align-items: center;
          justify-content: center; color: #94a3b8; border: 2px dashed #e2e8f0; border-radius: 16px;
        }

        .pulse-circle {
          width: 64px; height: 64px; border-radius: 50%; background: #f1f5f9;
          display: flex; align-items: center; justify-content: center; margin-bottom: 16px;
          color: #cbd5e1;
        }

        .park-alert.error { margin-top: 15px; padding: 12px; background: #fef2f2; color: #dc2626; border: 1px solid #ef4444; border-radius: 8px; font-size: 0.85rem; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-pop { animation: pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }

        @media (max-width: 1024px) { .park-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
