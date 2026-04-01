import { useAppContext } from '../../context/AppContext';
import { LuMenu, LuSun, LuMoon, LuShield, LuEye } from 'react-icons/lu';
import './Header.css';

export default function Header({ title, subtitle, onMenuClick }) {
  const { state, dispatch } = useAppContext();

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn" onClick={onMenuClick}>
          <LuMenu size={22} />
        </button>
        <div className="header__title-group">
          <h1 className="header__title">{title}</h1>
          {subtitle && <p className="header__subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="header__right">
        <div className="header__role-badge">
          {state.role === 'admin' ? <LuShield size={14} /> : <LuEye size={14} />}
          <span>{state.role === 'admin' ? 'Admin' : 'Viewer'}</span>
        </div>
        <button
          className="header__theme-btn"
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          title={state.theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {state.theme === 'light' ? <LuMoon size={18} /> : <LuSun size={18} />}
        </button>
        <div className="header__avatar">
          <span>SP</span>
        </div>
      </div>
    </header>
  );
}
