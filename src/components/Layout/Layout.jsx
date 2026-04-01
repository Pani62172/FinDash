import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const pageMeta = {
  '/': { title: 'Dashboard', subtitle: 'Your financial overview' },
  '/transactions': { title: 'Transactions', subtitle: 'Manage your transactions' },
  '/insights': { title: 'Insights', subtitle: 'Understand your spending' },
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const meta = pageMeta[location.pathname] || pageMeta['/'];

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="layout__main">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
