import { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { getMonthlyData, getSpendingByCategory, CATEGORIES } from '../../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line,
} from 'recharts';
import './Insights.css';

export default function Insights() {
  const { state } = useAppContext();
  const { transactions } = state;

  const monthlyData = useMemo(() => getMonthlyData(transactions), [transactions]);
  const spendingByCategory = useMemo(() => getSpendingByCategory(transactions), [transactions]);

  const stats = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const incomes = transactions.filter((t) => t.type === 'income');

    const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0);
    const totalIncome = incomes.reduce((s, t) => s + t.amount, 0);

    const highestCategory = spendingByCategory.length > 0 ? spendingByCategory[0] : null;

    const uniqueDays = new Set(expenses.map((t) => t.date)).size;
    const avgDaily = uniqueDays > 0 ? totalExpenses / uniqueDays : 0;

    const top5 = [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 5);

    const months = new Set(expenses.map((t) => t.date.substring(0, 7))).size;
    const avgMonthly = months > 0 ? totalExpenses / months : 0;

    let highestMonth = null;
    if (monthlyData.length > 0) {
      highestMonth = monthlyData.reduce((max, m) => (m.expenses > max.expenses ? m : max), monthlyData[0]);
    }

    let momChange = 0;
    if (monthlyData.length >= 2) {
      const lastTwo = monthlyData.slice(-2);
      momChange = lastTwo[0].expenses > 0 ? ((lastTwo[1].expenses - lastTwo[0].expenses) / lastTwo[0].expenses) * 100 : 0;
    }

    return { totalExpenses, totalIncome, highestCategory, avgDaily, top5, avgMonthly, highestMonth, momChange };
  }, [transactions, spendingByCategory, monthlyData]);

  const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip__label">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="chart-tooltip__value" style={{ color: entry.color }}>
            {entry.name}: ₹{entry.value?.toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="insights">
      {/* Metrics */}
      <div className="insights__metrics">
        <div className="insights__metric card animate-fade-in" style={{ animationDelay: '0s', opacity: 0 }}>
          <span className="insights__metric-label">Highest Category</span>
          <span className="insights__metric-value">{stats.highestCategory?.name || 'N/A'}</span>
          <span className="insights__metric-sub">₹{stats.highestCategory?.value?.toLocaleString('en-IN') || 0} total</span>
        </div>

        <div className="insights__metric card animate-fade-in" style={{ animationDelay: '0.06s', opacity: 0 }}>
          <span className="insights__metric-label">Avg. Daily</span>
          <span className="insights__metric-value">₹{stats.avgDaily.toFixed(0)}</span>
          <span className="insights__metric-sub">across all tracked days</span>
        </div>

        <div className="insights__metric card animate-fade-in" style={{ animationDelay: '0.12s', opacity: 0 }}>
          <span className="insights__metric-label">Avg. Monthly</span>
          <span className="insights__metric-value">₹{stats.avgMonthly.toFixed(0)}</span>
          <span className="insights__metric-sub">{monthlyData.length} months tracked</span>
        </div>

        <div className="insights__metric card animate-fade-in" style={{ animationDelay: '0.18s', opacity: 0 }}>
          <span className="insights__metric-label">Monthly Change</span>
          <span className="insights__metric-value" style={{ color: stats.momChange <= 0 ? '#22c55e' : '#ef4444' }}>
            {stats.momChange >= 0 ? '+' : ''}{stats.momChange.toFixed(1)}%
          </span>
          <span className="insights__metric-sub">
            {stats.momChange <= 0 ? 'Spending decreased' : 'Spending increased'}
          </span>
        </div>
      </div>

      {/* Charts */}
      <div className="insights__charts">
        <div className="card insights__chart-card animate-fade-in" style={{ animationDelay: '0.25s', opacity: 0 }}>
          <h3 className="section-title">Income vs Expenses</h3>
          <p className="insights__chart-sub">Monthly comparison</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fill: 'var(--text-tertiary)', fontSize: 12, fontFamily: 'Inter' }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12, fontFamily: 'Inter' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" iconSize={6} formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '11px', fontFamily: 'Inter' }}>{value}</span>} />
              <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card insights__chart-card animate-fade-in" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <h3 className="section-title">Expense Trend</h3>
          <p className="insights__chart-sub">Monthly trajectory</p>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fill: 'var(--text-tertiary)', fontSize: 12, fontFamily: 'Inter' }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12, fontFamily: 'Inter' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', strokeWidth: 0, r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="income" name="Income" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', strokeWidth: 0, r: 3 }} activeDot={{ r: 5 }} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom */}
      <div className="insights__bottom">
        {/* Category Breakdown */}
        <div className="card insights__categories animate-fade-in" style={{ animationDelay: '0.35s', opacity: 0 }}>
          <h3 className="section-title">Category Breakdown</h3>
          <div className="insights__category-list">
            {spendingByCategory.map((cat) => {
              const pct = stats.totalExpenses > 0 ? (cat.value / stats.totalExpenses) * 100 : 0;
              return (
                <div key={cat.name} className="insights__category-item">
                  <div className="insights__category-header">
                    <span className="insights__category-name" style={{ color: cat.color }}>{cat.name}</span>
                    <div className="insights__category-right">
                      <span className="insights__category-amount">₹{cat.value.toLocaleString('en-IN')}</span>
                      <span className="insights__category-pct">{pct.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="insights__category-bar">
                    <div className="insights__category-fill" style={{ width: `${pct}%`, background: cat.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Expenses */}
        <div className="card insights__top-expenses animate-fade-in" style={{ animationDelay: '0.4s', opacity: 0 }}>
          <h3 className="section-title">Top Expenses</h3>
          <p className="insights__chart-sub" style={{ marginBottom: '16px' }}>Largest individual transactions</p>
          <div className="insights__top-list">
            {stats.top5.map((t, i) => (
              <div key={t.id} className="insights__top-item animate-slide-up" style={{ animationDelay: `${0.45 + i * 0.06}s`, opacity: 0 }}>
                <span className="insights__top-rank">{i + 1}</span>
                <div className="insights__top-info">
                  <span className="insights__top-desc">{t.description}</span>
                  <span className="insights__top-date">
                    {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' · '}{t.category}
                  </span>
                </div>
                <span className="insights__top-amount">₹{t.amount.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div className="insights__observation">
            <p>
              Highest spending month was <strong>{stats.highestMonth?.label}</strong> at{' '}
              <strong>₹{stats.highestMonth?.expenses?.toLocaleString('en-IN')}</strong>.
              {stats.momChange <= 0
                ? ' Your spending has been trending down — keep it up.'
                : ' Consider reviewing discretionary spending to optimize your budget.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
