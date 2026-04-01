import { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { getMonthlyData, getSpendingByCategory, CATEGORIES } from '../../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line,
} from 'recharts';
import {
  LuTrendingUp, LuTrendingDown, LuDollarSign, LuCalendar,
  LuShoppingCart, LuChartColumn, LuTarget, LuActivity
} from 'react-icons/lu';
import './Insights.css';

export default function Insights() {
  const { state } = useAppContext();
  const { transactions } = state;

  const monthlyData = useMemo(() => getMonthlyData(transactions), [transactions]);
  const spendingByCategory = useMemo(() => getSpendingByCategory(transactions), [transactions]);

  // Key stats
  const stats = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const incomes = transactions.filter((t) => t.type === 'income');

    const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0);
    const totalIncome = incomes.reduce((s, t) => s + t.amount, 0);

    // Highest spending category
    const highestCategory = spendingByCategory.length > 0 ? spendingByCategory[0] : null;

    // Average daily spending
    const uniqueDays = new Set(expenses.map((t) => t.date)).size;
    const avgDaily = uniqueDays > 0 ? totalExpenses / uniqueDays : 0;

    // Top 3 largest expenses
    const top3 = [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 5);

    // Monthly avg expense
    const months = new Set(expenses.map((t) => t.date.substring(0, 7))).size;
    const avgMonthly = months > 0 ? totalExpenses / months : 0;

    // Highest expense month
    let highestMonth = null;
    if (monthlyData.length > 0) {
      highestMonth = monthlyData.reduce((max, m) => (m.expenses > max.expenses ? m : max), monthlyData[0]);
    }

    // Month-over-month change
    let momChange = 0;
    if (monthlyData.length >= 2) {
      const lastTwo = monthlyData.slice(-2);
      const prev = lastTwo[0].expenses;
      const curr = lastTwo[1].expenses;
      momChange = prev > 0 ? ((curr - prev) / prev) * 100 : 0;
    }

    return {
      totalExpenses,
      totalIncome,
      highestCategory,
      avgDaily,
      top3,
      avgMonthly,
      highestMonth,
      momChange,
    };
  }, [transactions, spendingByCategory, monthlyData]);

  const CustomTooltip = ({ active, payload, label }) => {
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
      {/* Key Metrics */}
      <div className="insights__metrics">
        <div className="insights__metric card animate-fade-in" style={{ animationDelay: '0s', opacity: 0 }}>
          <div className="insights__metric-icon" style={{ background: '#ef444415', color: '#ef4444' }}>
            <LuShoppingCart size={20} />
          </div>
          <div className="insights__metric-content">
            <span className="insights__metric-label">Highest Category</span>
            <span className="insights__metric-value">
              {CATEGORIES[stats.highestCategory?.name]?.icon} {stats.highestCategory?.name || 'N/A'}
            </span>
            <span className="insights__metric-sub">
              ₹{stats.highestCategory?.value?.toLocaleString('en-IN') || 0} total
            </span>
          </div>
        </div>

        <div className="insights__metric card animate-fade-in" style={{ animationDelay: '0.05s', opacity: 0 }}>
          <div className="insights__metric-icon" style={{ background: '#6366f115', color: '#6366f1' }}>
            <LuCalendar size={20} />
          </div>
          <div className="insights__metric-content">
            <span className="insights__metric-label">Avg. Daily Spending</span>
            <span className="insights__metric-value">₹{stats.avgDaily.toFixed(0)}</span>
            <span className="insights__metric-sub">across all tracked days</span>
          </div>
        </div>

        <div className="insights__metric card animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <div className="insights__metric-icon" style={{ background: '#f59e0b15', color: '#f59e0b' }}>
            <LuChartColumn size={20} />
          </div>
          <div className="insights__metric-content">
            <span className="insights__metric-label">Avg. Monthly Expense</span>
            <span className="insights__metric-value">₹{stats.avgMonthly.toFixed(0)}</span>
            <span className="insights__metric-sub">{monthlyData.length} months tracked</span>
          </div>
        </div>

        <div className="insights__metric card animate-fade-in" style={{ animationDelay: '0.15s', opacity: 0 }}>
          <div className="insights__metric-icon" style={{
            background: stats.momChange <= 0 ? '#22c55e15' : '#ef444415',
            color: stats.momChange <= 0 ? '#22c55e' : '#ef4444'
          }}>
            {stats.momChange <= 0 ? <LuTrendingDown size={20} /> : <LuTrendingUp size={20} />}
          </div>
          <div className="insights__metric-content">
            <span className="insights__metric-label">Monthly Change</span>
            <span className="insights__metric-value" style={{ color: stats.momChange <= 0 ? '#22c55e' : '#ef4444' }}>
              {stats.momChange >= 0 ? '+' : ''}{stats.momChange.toFixed(1)}%
            </span>
            <span className="insights__metric-sub">
              {stats.momChange <= 0 ? 'Spending decreased ✓' : 'Spending increased'}
            </span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="insights__charts">
        {/* Monthly Comparison */}
        <div className="card insights__chart-card animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <h3 className="section-title">Monthly Income vs Expenses</h3>
          <p className="insights__chart-sub">Compare your income and spending month by month</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{value}</span>
                )}
              />
              <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={28} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Trend Line */}
        <div className="card insights__chart-card animate-fade-in" style={{ animationDelay: '0.25s', opacity: 0 }}>
          <h3 className="section-title">Expense Trend</h3>
          <p className="insights__chart-sub">Monthly expense trajectory</p>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row: Category breakdown + Top expenses */}
      <div className="insights__bottom">
        {/* Category Breakdown */}
        <div className="card insights__categories animate-fade-in" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <h3 className="section-title">Category Breakdown</h3>
          <div className="insights__category-list">
            {spendingByCategory.map((cat, i) => {
              const percentage = stats.totalExpenses > 0 ? (cat.value / stats.totalExpenses) * 100 : 0;
              return (
                <div key={cat.name} className="insights__category-item">
                  <div className="insights__category-header">
                    <div className="insights__category-left">
                      <span className="insights__category-icon" style={{ background: `${cat.color}15` }}>
                        {CATEGORIES[cat.name]?.icon}
                      </span>
                      <span className="insights__category-name">{cat.name}</span>
                    </div>
                    <div className="insights__category-right">
                      <span className="insights__category-amount">
                        ₹{cat.value.toLocaleString('en-IN')}
                      </span>
                      <span className="insights__category-pct">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="insights__category-bar">
                    <div
                      className="insights__category-fill"
                      style={{
                        width: `${percentage}%`,
                        background: cat.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Expenses */}
        <div className="card insights__top-expenses animate-fade-in" style={{ animationDelay: '0.35s', opacity: 0 }}>
          <h3 className="section-title">Top Expenses</h3>
          <p className="insights__chart-sub" style={{ marginBottom: '16px' }}>Your largest individual transactions</p>
          <div className="insights__top-list">
            {stats.top3.map((t, i) => (
              <div key={t.id} className="insights__top-item">
                <div className="insights__top-rank">#{i + 1}</div>
                <div className="insights__top-icon" style={{ background: `${CATEGORIES[t.category]?.color}15` }}>
                  {CATEGORIES[t.category]?.icon || '💳'}
                </div>
                <div className="insights__top-info">
                  <span className="insights__top-desc">{t.description}</span>
                  <span className="insights__top-date">
                    {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' · '}{t.category}
                  </span>
                </div>
                <span className="insights__top-amount">
                  ₹{t.amount.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Observation */}
          <div className="insights__observation">
            <LuActivity size={16} />
            <p>
              Your highest spending month was <strong>{stats.highestMonth?.label}</strong> at{' '}
              <strong>₹{stats.highestMonth?.expenses?.toLocaleString('en-IN')}</strong>.
              {stats.momChange <= 0
                ? ' Great news — your spending has been trending down recently!'
                : ' Consider reviewing subscription and discretionary spending to optimize your budget.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
