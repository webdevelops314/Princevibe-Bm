import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaHome, 
  FaBoxes, 
  FaShoppingCart, 
  FaChartLine, 
  FaReceipt, 
  FaUsers, 
  FaDatabase,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaChevronDown
} from 'react-icons/fa';
import './MobileLayout.css';

function MobileLayout({ children }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/', icon: FaHome, label: 'Dashboard', color: '#4F46E5' },
    { path: '/inventory', icon: FaBoxes, label: 'Inventory', color: '#059669' },
    { path: '/purchases', icon: FaShoppingCart, label: 'Purchases', color: '#DC2626' },
    { path: '/sales', icon: FaChartLine, label: 'Sales', color: '#EA580C' },
    { path: '/expenses', icon: FaReceipt, label: 'Expenses', color: '#7C3AED' },
    { path: '/profit-loss', icon: FaChartLine, label: 'Profit & Loss', color: '#0891B2' },
    { path: '/partners', icon: FaUsers, label: 'Partners', color: '#BE185D' },
    { path: '/data-loader', icon: FaDatabase, label: 'Data Loader', color: '#6366F1' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    showNotificationMessage('Logged out successfully', 'success');
  };

  const showNotificationMessage = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setShowUserMenu(false);
  };

  return (
    <div className="mobile-layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="mobile-header-content">
          <div className="mobile-brand">
            <div className="mobile-brand-icon">👑</div>
            <div className="mobile-brand-text">
              <h2>PrinceVibe</h2>
              <span>Business Manager</span>
            </div>
          </div>
          
          <div className="mobile-user-menu">
            <button 
              className="mobile-user-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <FaUser />
            </button>
            
            {showUserMenu && (
              <div className="mobile-user-dropdown">
                <div className="mobile-user-info">
                  <div className="mobile-user-email">{user?.email || 'Business Owner'}</div>
                  <div className="mobile-user-role">Administrator</div>
                </div>
                <div className="mobile-user-actions">
                  <button 
                    className="mobile-user-action"
                    onClick={() => handleNavigation('/partners')}
                  >
                    <FaCog />
                    Settings
                  </button>
                  <button 
                    className="mobile-user-action logout"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Content */}
      <main className="mobile-content">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        <div className="mobile-nav-items">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setShowUserMenu(false)}
              >
                <div className="mobile-nav-icon" style={{ color: item.color }}>
                  <Icon />
                </div>
                <span className="mobile-nav-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Notification */}
      {showNotification && (
        <div className={`mobile-notification ${notificationType} show`}>
          {notificationMessage}
        </div>
      )}

      {/* Mobile User Menu Overlay */}
      {showUserMenu && (
        <div 
          className="mobile-modal-overlay"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
}

export default MobileLayout;
