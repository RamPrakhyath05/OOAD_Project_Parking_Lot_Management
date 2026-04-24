import { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  LayoutDashboard, 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  PieChart, 
  Car, 
  Clock, 
  Hash 
} from 'lucide-react';

export default function Dashboard() {
  const [status, setStatus] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [allSlots, setAllSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [activeData, slotsData] = await Promise.all([
        api.getFast('/api/parking/active'),
        api.getFast('/api/admin/slots'),
      ]);

      const totalSlots = slotsData.length;
      const occupiedSlots = slotsData.filter(s => s.occupied).length;
      const availableSlots = totalSlots - occupiedSlots;

      setStatus({
        totalSlots,
        occupiedSlots,
        availableSlots
      });

      setTickets(activeData);
      setAllSlots(slotsData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (t) => {
    if (!t) return '—';
    try {
      return new Date(t).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' });
    } catch {
      return t;
    }
  };

  if (loading) return <div className="loading-state">Initializing System Data...</div>;
  if (error) return <div className="alert error">{error}</div>;
  if (!status) return null;

  const occupancyPercent = status.totalSlots > 0
    ? Math.round((status.occupiedSlots / status.totalSlots) * 100)
    : 0;

  return (
    <div className="dashboard-view">
      
      {/* Top Header Section */}
      <div className="dashboard-header">
        <div className="title-area">
          <LayoutDashboard size={24} color="#fbbf24" />
          <h2>Live Fleet Status</h2>
        </div>
        <button onClick={fetchAll} className="refresh-btn text-black">
          <RotateCw size={16} /> Refresh Data
        </button>
      </div>

      {/* Primary Stats Grid */}
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-info">
            <label>Total Capacity</label>
            <div className="val">{status.totalSlots}</div>
          </div>
          <div className="stat-icon"><Hash size={24} /></div>
        </div>

        <div className="stat-box available">
          <div className="stat-info">
            <label>Available Slots</label>
            <div className="val">{status.availableSlots}</div>
          </div>
          <div className="stat-icon"><CheckCircle2 size={24} /></div>
        </div>

        <div className="stat-box occupied">
          <div className="stat-info">
            <label>Occupied</label>
            <div className="val">{status.occupiedSlots}</div>
          </div>
          <div className="stat-icon"><XCircle size={24} /></div>
        </div>

        <div className="stat-box occupancy">
          <div className="stat-info">
            <label>Load Factor</label>
            <div className="val">{occupancyPercent}%</div>
          </div>
          <div className="stat-icon"><PieChart size={24} /></div>
        </div>
      </div>

      {/* Visual Capacity Bar */}
      <div className="dashboard-card">
        <div className="card-head">
          <h3>Real-time Capacity</h3>
          <span className={occupancyPercent > 90 ? 'critical' : ''}>
            {status.occupiedSlots} / {status.totalSlots} Units
          </span>
        </div>
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${occupancyPercent}%`,
              background: occupancyPercent > 80 ? '#ef4444' : occupancyPercent > 50 ? '#fbbf24' : '#22c55e'
            }} 
          />
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="content-grid">
        
        {/* Slot Map Section */}
        <div className="dashboard-card">
          <div className="card-head">
            <h3>Interactive Slot Map</h3>
          </div>
          <div className="slot-grid-container">
            {allSlots.length === 0 ? (
              <p className="empty-msg">No slots configured in administrative settings.</p>
            ) : (
              <div className="slot-map">
                {allSlots.map((slot) => (
                  <div 
                    key={slot.slotNumber} 
                    className={`slot-tile ${slot.occupied ? 'occupied' : 'available'}`}
                    title={`${slot.slotType} - ${slot.occupied ? 'Occupied' : 'Free'}`}
                  >
                    <span className="s-num">{slot.slotNumber}</span>
                    <span className="s-type">{slot.slotType}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Vehicles Table */}
        <div className="dashboard-card">
          <div className="card-head">
            <h3>Active Sessions</h3>
          </div>
          <div className="table-overflow">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Location</th>
                  <th>Entry Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr><td colSpan="4" className="empty-msg">No active sessions found.</td></tr>
                ) : (
                  tickets.map((t) => (
                    <tr key={t.ticketId}>
                      <td className="plate-cell"><Car size={14} /> {t.vehicleLicensePlate}</td>
                      <td><span className="slot-badge">{t.slotNumber}</span></td>
                      <td className="time-cell"><Clock size={12} /> {formatTime(t.entryTime)}</td>
                      <td><span className="status-dot-active">Live</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <style jsx>{`
        .dashboard-view { animation: fadeIn 0.4s ease-out; }
        
        .dashboard-header { 
          display: flex; justify-content: space-between; align-items: center; 
          margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px;
        }
        
        .title-area { display: flex; align-items: center; gap: 12px; }
        .title-area h2 { margin: 0; font-size: 1.25rem; font-weight: 800; color: #0f172a; }

        .refresh-btn {
          background: white; border: 1px solid #cbd5e1; padding: 8px 16px;
          border-radius: 6px; display: flex; align-items: center; gap: 8px;
          font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .refresh-btn:hover { background: #f8fafc; border-color: #94a3b8; }

        /* Stats Blocks */
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
        .stat-box { 
          background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;
          display: flex; justify-content: space-between; align-items: center;
        }
        .stat-info label { display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; }
        .stat-info .val { font-size: 1.75rem; font-weight: 800; color: #0f172a; margin-top: 4px; }
        .stat-icon { color: #cbd5e1; }
        
        .stat-box.available .val { color: #22c55e; }
        .stat-box.occupied .val { color: #ef4444; }
        .stat-box.occupancy .val { color: #fbbf24; }

        /* Card System */
        .dashboard-card { 
          background: white; border: 1px solid #e2e8f0; border-radius: 12px; 
          padding: 20px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .card-head h3 { margin: 0; font-size: 0.95rem; font-weight: 700; color: #475569; text-transform: uppercase; }
        .card-head span { font-size: 0.85rem; font-weight: 700; color: #64748b; }
        .card-head span.critical { color: #ef4444; }

        .progress-track { height: 10px; background: #f1f5f9; border-radius: 5px; overflow: hidden; }
        .progress-fill { height: 100%; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1); }

        /* Grid Content */
        .content-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 24px; }

        /* Slot Map */
        .slot-map { display: grid; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap: 10px; }
        .slot-tile {
          height: 60px; border-radius: 8px; border: 1px solid transparent;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          transition: all 0.2s; cursor: default;
        }
        .slot-tile.available { background: #f0fdf4; border-color: #bbf7d0; color: #166534; }
        .slot-tile.occupied { background: #fef2f2; border-color: #fecaca; color: #991b1b; }
        .s-num { font-size: 1rem; font-weight: 800; }
        .s-type { font-size: 0.6rem; text-transform: uppercase; font-weight: 600; opacity: 0.7; }

        /* Table */
        .table-overflow { overflow-x: auto; }
        .dash-table { width: 100%; border-collapse: collapse; }
        .dash-table th { text-align: left; font-size: 0.7rem; color: #94a3b8; padding: 12px 8px; border-bottom: 1px solid #f1f5f9; text-transform: uppercase; }
        .dash-table td { padding: 12px 8px; font-size: 0.85rem; border-bottom: 1px solid #f8fafc; }
        
        .plate-cell { font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 6px; }
        .slot-badge { background: #0f172a; color: #fbbf24; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 0.75rem; }
        .time-cell { color: #64748b; font-size: 0.75rem; }
        
        .status-dot-active { 
          display: inline-flex; align-items: center; gap: 5px; 
          color: #22c55e; font-weight: 700; font-size: 0.7rem; text-transform: uppercase;
        }
        .status-dot-active::before { content: ''; width: 6px; height: 6px; background: #22c55e; border-radius: 50%; }

        .empty-msg { text-align: center; color: #94a3b8; padding: 20px; font-size: 0.85rem; }
        .loading-state { padding: 40px; text-align: center; color: #64748b; font-weight: 500; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 1200px) { .content-grid { grid-template-columns: 1fr; } .stats-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </div>
  );
}
