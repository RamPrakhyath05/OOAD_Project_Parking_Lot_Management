import { useState, useEffect } from 'react';
import { api } from '../api';
import { PlusCircle, Trash2, Hash, Layers, Info } from 'lucide-react';

export default function Admin() {
  const [formData, setFormData] = useState({ slotNumber: '', type: 'CAR' });
  const [slots, setSlots] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const slotsData = await api.getFast('/api/admin/slots');
      setSlots(slotsData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      await api.postJSON('/api/admin/slot', {
        slotNumber: formData.slotNumber,
        slotType: formData.type,
        occupied: false,
        floor: 1
      });

      setResult(`Slot "${formData.slotNumber}" added successfully!`);
      setFormData({ slotNumber: '', type: 'CAR' });
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to add slot');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlot = async (slotNumber) => {
    if (!confirm(`Delete slot "${slotNumber}"?`)) return;

    try {
      await api.delete(`/api/admin/slot/${slotNumber}`);
      setResult(`Slot "${slotNumber}" deleted.`);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-view">
      <div className="admin-grid">
        
        {/* Left Column: Form */}
        <div className="admin-section">
          <div className="section-header">
            <PlusCircle size={20} color="#fbbf24" />
            <h3>Configuration</h3>
          </div>
          
          <div className="admin-card">
            <form onSubmit={handleAddSlot} className="admin-form">
              <div className="form-group">
                <label><Hash size={14} /> Slot Number</label>
                <input
                  type="text"
                  placeholder="e.g. A-101"
                  required
                  value={formData.slotNumber}
                  onChange={(e) => setFormData({ ...formData, slotNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label><Layers size={14} /> Vehicle Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="CAR">CAR</option>
                  <option value="BIKE">BIKE</option>
                </select>
              </div>

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Processing...' : 'Register Slot'}
              </button>
            </form>
          </div>

          {error && <div className="admin-alert error">{error}</div>}
          {result && <div className="admin-alert success">{result}</div>}
        </div>

        {/* Right Column: List */}
        <div className="admin-section">
          <div className="section-header">
            <Info size={20} color="#fbbf24" />
            <h3>Inventory Management</h3>
          </div>
          
          <div className="admin-card scrollable-list">
            {slots.length === 0 ? (
              <div className="empty-state">No slots registered in system</div>
            ) : (
              <div className="slot-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>SLOT</th>
                      <th>TYPE</th>
                      <th>STATUS</th>
                      <th style={{ textAlign: 'right' }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map((slot) => (
                      <tr key={slot.slotNumber}>
                        <td><strong>{slot.slotNumber}</strong></td>
                        <td>
                          <span className={`badge ${slot.slotType.toLowerCase()}`}>
                            {slot.slotType}
                          </span>
                        </td>
                        <td>
                          <div className="status-indicator">
                            <span className={`dot ${slot.occupied ? 'occupied' : 'available'}`}></span>
                            {slot.occupied ? 'Occupied' : 'Available'}
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteSlot(slot.slotNumber)}
                            disabled={slot.occupied}
                            title={slot.occupied ? "Cannot delete occupied slot" : "Delete slot"}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-view {
          animation: fadeIn 0.4s ease-out;
        }

        .admin-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 30px;
          align-items: start;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .section-header h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #1e293b;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .admin-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .scrollable-list {
          max-height: 600px;
          overflow-y: auto;
          padding: 0;
        }

        .admin-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .form-group input, .form-group select {
          padding: 10px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #fbbf24;
          box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.1);
        }

        .primary-btn {
          background: #0f172a;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .primary-btn:hover {
          background: #1e293b;
        }

        .primary-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }

        .admin-table th {
          background: #f8fafc;
          padding: 14px 24px;
          text-align: left;
          font-size: 0.75rem;
          color: #64748b;
          border-bottom: 1px solid #e2e8f0;
        }

        .admin-table td {
          padding: 16px 24px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.9rem;
        }

        .badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .badge.car { background: #dcfce7; color: #166534; }
        .badge.bike { background: #fef9c3; color: #854d0e; }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .dot.available { background: #22c55e; box-shadow: 0 0 8px #22c55e; }
        .dot.occupied { background: #ef4444; }

        .delete-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .delete-btn:hover:not(:disabled) {
          background: #fee2e2;
          color: #ef4444;
        }

        .delete-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .admin-alert {
          margin-top: 15px;
          padding: 12px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .admin-alert.success { background: #ecfdf5; color: #059669; border: 1px solid #10b981; }
        .admin-alert.error { background: #fef2f2; color: #dc2626; border: 1px solid #ef4444; }

        .empty-state {
          padding: 40px;
          text-align: center;
          color: #94a3b8;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          .admin-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
