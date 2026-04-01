import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import './Sidebar.css';

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/transactions', label: 'Transactions' },
  { path: '/insights', label: 'Insights' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { state, dispatch } = useAppContext();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <span className="sidebar__logo-mark">F</span>
            <span className="sidebar__logo-text">FinDash</span>
          </div>
          <button className="sidebar__close" onClick={onClose}>✕</button>
        </div>

        <nav className="sidebar__nav">
          <span className="sidebar__nav-label">Menu</span>
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
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__section">
            <span className="sidebar__nav-label">Role</span>
            <div className="sidebar__role-switch">
              <button
                className={`sidebar__role-btn ${state.role === 'admin' ? 'sidebar__role-btn--active' : ''}`}
                onClick={() => dispatch({ type: 'SET_ROLE', payload: 'admin' })}
              >
                Admin
              </button>
              <button
                className={`sidebar__role-btn ${state.role === 'viewer' ? 'sidebar__role-btn--active' : ''}`}
                onClick={() => dispatch({ type: 'SET_ROLE', payload: 'viewer' })}
              >
                Viewer
              </button>
            </div>
          </div>

          <button
            className="sidebar__theme-toggle"
            onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          >
            {state.theme === 'light' ? '● Dark' : '○ Light'}
          </button>
        </div>
      </aside>
    </>
  );
}
