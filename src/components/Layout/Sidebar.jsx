import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import {
  LuLayoutDashboard,
  LuArrowLeftRight,
  LuLightbulb,
  LuSun,
  LuMoon,
  LuShield,
  LuEye,
  LuChevronLeft,
  LuX,
} from 'react-icons/lu';
import './Sidebar.css';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LuLayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: LuArrowLeftRight },
  { path: '/insights', label: 'Insights', icon: LuLightbulb },
];

export default function Sidebar({ isOpen, onClose }) {
  const { state, dispatch } = useAppContext();
  const location = useLocation();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <div className="sidebar__logo-icon">₹</div>
            <span className="sidebar__logo-text">FinDash</span>
          </div>
          <button className="sidebar__close" onClick={onClose}>
            <LuX size={20} />
          </button>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
              onClick={onClose}
              end={item.path === '/'}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          {/* Role Switcher */}
          <div className="sidebar__section">
            <label className="sidebar__label">Role</label>
            <div className="sidebar__role-switch">
              <button
                className={`sidebar__role-btn ${state.role === 'admin' ? 'sidebar__role-btn--active' : ''}`}
                onClick={() => dispatch({ type: 'SET_ROLE', payload: 'admin' })}
              >
                <LuShield size={14} />
                Admin
              </button>
              <button
                className={`sidebar__role-btn ${state.role === 'viewer' ? 'sidebar__role-btn--active' : ''}`}
                onClick={() => dispatch({ type: 'SET_ROLE', payload: 'viewer' })}
              >
                <LuEye size={14} />
                Viewer
              </button>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            className="sidebar__theme-toggle"
            onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          >
            {state.theme === 'light' ? <LuMoon size={18} /> : <LuSun size={18} />}
            <span>{state.theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
