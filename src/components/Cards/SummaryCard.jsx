import { useEffect, useRef, useState } from 'react';
import './SummaryCard.css';

export default function SummaryCard({ label, value, prefix = '', suffix = '', trend, trendLabel, color, delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const cardRef = useRef(null);

  useEffect(() => {
    const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
    const duration = 1200;
    const steps = 50;
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;

    setDisplayValue(0);

    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        current = numericValue;
        clearInterval(timer);
      }
      setDisplayValue(current);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const formatValue = (val) => {
    if (typeof value === 'string') return value;
    return val >= 1000
      ? `${prefix}${val.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}${suffix}`
      : `${prefix}${val.toFixed(1)}${suffix}`;
  };

  return (
    <div
      className="summary-card animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
      ref={cardRef}
    >
      <div className="summary-card__top">
        <span className="summary-card__label">{label}</span>
        {trend !== undefined && (
          <span className={`summary-card__trend ${trend >= 0 ? 'summary-card__trend--up' : 'summary-card__trend--down'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="summary-card__value" style={{ color }}>{formatValue(displayValue)}</div>
      {trendLabel && <div className="summary-card__sub">{trendLabel}</div>}
      <div className="summary-card__accent" style={{ background: color }} />
    </div>
  );
}
