import { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import Modal from '../../components/Modal/Modal';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import EmptyState from '../../components/EmptyState/EmptyState';
import './Transactions.css';

export default function Transactions() {
  const { state, dispatch, filteredTransactions } = useAppContext();
  const { filters, role } = state;
  const isAdmin = role === 'admin';

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const allCategories = useMemo(() => {
    const cats = [...new Set(state.transactions.map((t) => t.category))];
    return cats.sort();
  }, [state.transactions]);

  const handleAdd = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }
  };

  const handleSubmit = (formData) => {
    if (editingTransaction) {
      dispatch({ type: 'EDIT_TRANSACTION', payload: formData });
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: formData });
    }
    setModalOpen(false);
    setEditingTransaction(null);
  };

  const handleSort = (field) => {
    dispatch({
      type: 'SET_FILTER',
      payload: {
        sortBy: field,
        sortOrder: filters.sortBy === field && filters.sortOrder === 'desc' ? 'asc' : 'desc',
      },
    });
  };

  const activeFilterCount = [
    filters.category !== 'All',
    filters.type !== 'All',
    filters.search !== '',
  ].filter(Boolean).length;

  const handleExport = (format) => {
    const data = filteredTransactions.map(({ id, ...rest }) => rest);
    let content, filename, type;
    if (format === 'csv') {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map((row) => Object.values(row).join(','));
      content = [headers, ...rows].join('\n');
      filename = 'transactions.csv';
      type = 'text/csv';
    } else {
      content = JSON.stringify(data, null, 2);
      filename = 'transactions.json';
      type = 'application/json';
    }
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortIndicator = ({ field }) => {
    if (filters.sortBy !== field) return <span className="sort-icon">↕</span>;
    return <span className="sort-icon sort-icon--active">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="transactions animate-fade-in">
      {/* Toolbar */}
      <div className="transactions__toolbar">
        <div className="transactions__search-wrapper">
          <input
            type="text"
            className="transactions__search"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { search: e.target.value } })}
          />
          {filters.search && (
            <button
              className="transactions__search-clear"
              onClick={() => dispatch({ type: 'SET_FILTER', payload: { search: '' } })}
            >
              ✕
            </button>
          )}
        </div>

        <div className="transactions__toolbar-right">
          <button
            className={`btn btn--secondary ${activeFilterCount > 0 ? 'btn--filter-active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
          </button>

          <div className="transactions__export-group">
            <button className="btn btn--secondary" onClick={() => handleExport('csv')}>CSV</button>
            <button className="btn btn--secondary" onClick={() => handleExport('json')}>JSON</button>
          </div>

          {isAdmin && (
            <button className="btn btn--primary" onClick={handleAdd}>
              + Add
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="transactions__filters animate-slide-up">
          <div className="transactions__filter-group">
            <label className="transactions__filter-label">Category</label>
            <select className="select" value={filters.category} onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { category: e.target.value } })}>
              <option value="All">All</option>
              {allCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="transactions__filter-group">
            <label className="transactions__filter-label">Type</label>
            <select className="select" value={filters.type} onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { type: e.target.value } })}>
              <option value="All">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          {activeFilterCount > 0 && (
            <button className="btn btn--secondary" onClick={() => dispatch({ type: 'RESET_FILTERS' })}>Clear</button>
          )}
        </div>
      )}

      {/* Count */}
      <div className="transactions__meta">
        <span className="transactions__count">
          {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          {activeFilterCount > 0 && ' (filtered)'}
        </span>
      </div>

      {/* Table */}
      {filteredTransactions.length === 0 ? (
        <div className="card">
          <EmptyState title="No transactions found" message="Try adjusting your search or filters." />
        </div>
      ) : (
        <div className="card transactions__table-wrapper">
          <table className="transactions__table">
            <thead>
              <tr>
                <th>
                  <button className="transactions__sort-btn" onClick={() => handleSort('date')}>
                    Date <SortIndicator field="date" />
                  </button>
                </th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>
                  <button className="transactions__sort-btn" onClick={() => handleSort('amount')}>
                    Amount <SortIndicator field="amount" />
                  </button>
                </th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t, index) => (
                <tr key={t.id} className="animate-fade-in" style={{ animationDelay: `${Math.min(index * 25, 400)}ms`, opacity: 0 }}>
                  <td className="transactions__date">
                    {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="transactions__desc">{t.description}</td>
                  <td>
                    <span className="transactions__category-badge" style={{ color: CATEGORIES[t.category]?.color }}>
                      {t.category}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge--${t.type}`}>
                      {t.type === 'income' ? '↗ Income' : '↙ Expense'}
                    </span>
                  </td>
                  <td className={`transactions__amount transactions__amount--${t.type}`}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                  </td>
                  {isAdmin && (
                    <td>
                      <div className="transactions__actions">
                        <button className="btn btn--icon" onClick={() => handleEdit(t)}>Edit</button>
                        <button className="btn btn--icon transactions__delete-btn" onClick={() => handleDelete(t.id)}>Del</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTransaction(null); }}
        title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
      >
        <TransactionForm
          transaction={editingTransaction}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditingTransaction(null); }}
        />
      </Modal>
    </div>
  );
}
