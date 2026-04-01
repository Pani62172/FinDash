import { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { getMonthlyData, getSpendingByCategory, CATEGORIES } from '../../data/mockData';
import SummaryCard from '../../components/Cards/SummaryCard';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { LuWallet, LuTrendingUp, LuTrendingDown, LuPiggyBank } from 'react-icons/lu';
import './Dashboard.css';

export default function Dashboard() {
  const { state } = useAppContext();
  const { transactions } = state;

  // Compute summary stats
  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    return { totalIncome, totalExpenses, balance, savingsRate };
  }, [transactions]);

  const monthlyData = useMemo(() => getMonthlyData(transactions), [transactions]);
  const spendingData = useMemo(() => getSpendingByCategory(transactions), [transactions]);
  const recentTransactions = useMemo(
    () => [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    [transactions]
  );

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

  const PieTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload[0]) return null;
    const data = payload[0];
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip__label">{data.name}</p>
        <p className="chart-tooltip__value" style={{ color: data.payload.color }}>
          ₹{data.value?.toLocaleString('en-IN')}
        </p>
      </div>
    );
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="dashboard">
      {/* Summary Cards */}
      <div className="dashboard__cards">
        <SummaryCard
          icon={<LuWallet size={22} />}
          label="Total Balance"
          value={stats.balance}
          prefix="₹"
          color="#6366f1"
          trend={12.5}
          trendLabel="vs last month"
          delay={0}
        />
        <SummaryCard
          icon={<LuTrendingUp size={22} />}
          label="Total Income"
          value={stats.totalIncome}
          prefix="₹"
          color="#22c55e"
          trend={8.2}
          trendLabel="vs last month"
          delay={80}
        />
        <SummaryCard
          icon={<LuTrendingDown size={22} />}
          label="Total Expenses"
          value={stats.totalExpenses}
          prefix="₹"
          color="#ef4444"
          trend={-3.1}
          trendLabel="vs last month"
          delay={160}
        />
        <SummaryCard
          icon={<LuPiggyBank size={22} />}
          label="Savings Rate"
          value={stats.savingsRate}
          suffix="%"
          color="#f59e0b"
          trend={5.4}
          trendLabel="vs last month"
          delay={240}
        />
      </div>

      {/* Charts Row */}
      <div className="dashboard__charts">
        {/* Balance Trend */}
        <div className="card dashboard__chart-card animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <h3 className="section-title">Balance Trend</h3>
          <p className="dashboard__chart-subtitle">Monthly balance over time</p>
          <div className="dashboard__chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="balance"
                  name="Balance"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#balanceGradient)"
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending Breakdown */}
        <div className="card dashboard__chart-card animate-fade-in" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <h3 className="section-title">Spending Breakdown</h3>
          <p className="dashboard__chart-subtitle">Expenses by category</p>
          <div className="dashboard__chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={spendingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {spendingData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card dashboard__recent animate-fade-in" style={{ animationDelay: '0.35s', opacity: 0 }}>
        <div className="dashboard__recent-header">
          <h3 className="section-title" style={{ marginBottom: 0 }}>Recent Transactions</h3>
          <a href="/transactions" className="dashboard__view-all">View All →</a>
        </div>
        <div className="dashboard__recent-list">
          {recentTransactions.map((t) => (
            <div key={t.id} className="dashboard__recent-item">
              <div className="dashboard__recent-icon" style={{ background: `${CATEGORIES[t.category]?.color}15`, color: CATEGORIES[t.category]?.color }}>
                {CATEGORIES[t.category]?.icon || '💳'}
              </div>
              <div className="dashboard__recent-info">
                <span className="dashboard__recent-desc">{t.description}</span>
                <span className="dashboard__recent-date">
                  {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <span className={`dashboard__recent-amount dashboard__recent-amount--${t.type}`}>
                {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
