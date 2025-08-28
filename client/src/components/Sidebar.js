import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaHome, 
  FaBoxes, 
  FaShoppingCart, 
  FaChartLine, 
  FaReceipt, 
  FaUsers, 
  FaDatabase,
  FaBars, 
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt
} from 'react-icons/fa';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="mobile-overlay"
          onClick={toggleMobile}
        />
      )}

      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={toggleMobile}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <div 
        className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}
        data-collapsed={isCollapsed}
        style={{ 
          transition: 'all 0.3s ease'
        }}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header">
          {!isCollapsed && (
            <div className="brand">
              <div className="brand-icon">👑</div>
              <div className="brand-text">
                <h3>PrinceVibe</h3>
                <span>Business Manager</span>
              </div>
            </div>
          )}
          <button 
            className="collapse-btn"
            onClick={toggleSidebar}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            style={{ 
              marginLeft: isCollapsed ? 'auto' : '0',
              marginRight: isCollapsed ? 'auto' : '0'
            }}
          >
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
                style={{
                  '--hover-color': item.color
                }}
              >
                <div className="sidebar-link-icon" style={{ color: item.color }}>
                  <Icon />
                </div>
                {!isCollapsed && (
                  <span className="sidebar-link-label">{item.label}</span>
                )}
                {isActive(item.path) && (
                  <div className="active-indicator" style={{ backgroundColor: item.color }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        {!isCollapsed && (
          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">👤</div>
              <div className="user-details">
                <div className="user-name">{user?.email || 'Business Owner'}</div>
                <div className="user-role">Administrator</div>
              </div>
            </div>
            <button 
              className="logout-button"
              onClick={logout}
              title="Logout"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Sidebar;
