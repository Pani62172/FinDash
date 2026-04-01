import { useAppContext } from '../../context/AppContext';
import './Header.css';

export default function Header({ title, subtitle, onMenuClick }) {
  const { state, dispatch } = useAppContext();

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn" onClick={onMenuClick}>
          ☰
        </button>
        <div className="header__title-group">
          <h1 className="header__title">{title}</h1>
          {subtitle && <p className="header__subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="header__right">
        <span className="header__role-badge">
          {state.role}
        </span>
        <button
          className="header__theme-btn"
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          title={state.theme === 'light' ? 'Dark mode' : 'Light mode'}
        >
          {state.theme === 'light' ? '●' : '○'}
        </button>
        <div className="header__avatar">SP</div>
      </div>
    </header>
  );
}
