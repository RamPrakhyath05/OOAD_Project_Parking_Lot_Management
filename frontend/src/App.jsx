import { useState } from 'react';
import Dashboard from './components/Dashboard';
import ParkVehicle from './components/ParkVehicle';
import UnparkVehicle from './components/UnparkVehicle';
import SearchVehicle from './components/SearchVehicle';
import Admin from './components/Admin';

// Note: You can install 'lucide-react' for the icons used below
// npm install lucide-react
import { 
  LayoutDashboard, 
  Car, 
  LogOut, 
  Search, 
  Settings, 
  ShieldCheck 
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Overview Status', icon: <LayoutDashboard size={20} /> },
    { id: 'park', label: 'Park Vehicle', icon: <Car size={20} /> },
    { id: 'unpark', label: 'Unpark Vehicle', icon: <LogOut size={20} /> },
    { id: 'search', label: 'Search Vehicle', icon: <Search size={20} /> },
    { id: 'admin', label: 'Slot Admin', icon: <Settings size={20} /> },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'park': return <ParkVehicle />;
      case 'unpark': return <UnparkVehicle />;
      case 'search': return <SearchVehicle />;
      case 'admin': return <Admin />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <ShieldCheck size={28} color="#fbbf24" strokeWidth={2.5} />
          </div>
          <h1 className="brand-name">PARK<span>Q</span></h1>
        </div>

        <nav className="nav-list">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="icon-wrapper">{item.icon}</span>
              <span className="label">{item.label}</span>
              {activeTab === item.id && <div className="active-indicator" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>© 2024 ParkQ System</p>
          <small>v1.2.0-stable</small>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="content-wrapper">
        <header className="top-bar">
          <div className="page-title">
            <h2>{menuItems.find(m => m.id === activeTab)?.label}</h2>
          </div>
          <div className="user-profile">
            <div className="user-info">
              <span>Admin User</span>
              <small>System Controller</small>
            </div>
            <div className="avatar">AD</div>
          </div>
        </header>

        <section className="scroll-area">
          <div className="content-card">
            {renderContent()}
          </div>
        </section>
      </main>

      <style jsx>{`
        .app-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          background-color: #f1f5f9;
          font-family: 'Inter', -apple-system, sans-serif;
          color: #1e293b;
          overflow: hidden;
        }

        /* Sidebar Styling */
        .sidebar {
          width: 260px;
          background-color: #0f172a;
          color: #fff;
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 10px rgba(0,0,0,0.1);
        }

        .sidebar-header {
          padding: 32px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-name {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -1px;
          margin: 0;
        }

        .brand-name span {
          color: #fbbf24;
        }

        .nav-list {
          flex: 1;
          padding: 0 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-btn {
          all: unset;
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          color: #94a3b8;
        }

        .nav-btn:hover {
          background-color: rgba(255,255,255,0.05);
          color: #fff;
        }

        .nav-btn.active {
          background-color: rgba(251, 191, 36, 0.1);
          color: #fbbf24;
        }

        .icon-wrapper {
          margin-right: 12px;
          display: flex;
          align-items: center;
        }

        .label {
          font-size: 0.95rem;
          font-weight: 500;
        }

        .active-indicator {
          position: absolute;
          right: 0;
          height: 20px;
          width: 4px;
          background-color: #fbbf24;
          border-radius: 4px 0 0 4px;
        }

        /* Main Content Styling */
        .content-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .top-bar {
          height: 70px;
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
        }

        .page-title h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #334155;
          margin: 0;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-info {
          text-align: right;
          line-height: 1.2;
        }

        .user-info span {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .user-info small {
          color: #64748b;
          font-size: 0.75rem;
        }

        .avatar {
          width: 40px;
          height: 40px;
          background: #fbbf24;
          color: #0f172a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
        }

        .scroll-area {
          flex: 1;
          padding: 30px 40px;
          overflow-y: auto;
        }

        .content-card {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          min-height: 400px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
        }

        .sidebar-footer {
          padding: 24px;
          border-top: 1px solid rgba(255,255,255,0.05);
          color: #475569;
        }

        .sidebar-footer p { margin: 0; font-size: 0.8rem; }
        .sidebar-footer small { font-size: 0.7rem; }
      `}</style>
    </div>
  );
}

export default App;
