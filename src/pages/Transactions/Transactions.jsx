import { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import Modal from '../../components/Modal/Modal';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import EmptyState from '../../components/EmptyState/EmptyState';
import {
  LuSearch, LuPlus, LuPencil, LuTrash2, LuArrowUpDown,
  LuArrowUp, LuArrowDown, LuDownload, LuFilter, LuX
} from 'react-icons/lu';
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
    if (window.confirm('Are you sure you want to delete this transaction?')) {
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

  const SortIcon = ({ field }) => {
    if (filters.sortBy !== field) return <LuArrowUpDown size={14} />;
    return filters.sortOrder === 'asc' ? <LuArrowUp size={14} /> : <LuArrowDown size={14} />;
  };

  return (
    <div className="transactions">
      {/* Toolbar */}
      <div className="transactions__toolbar">
        <div className="transactions__search-wrapper">
          <LuSearch size={18} className="transactions__search-icon" />
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
              <LuX size={16} />
            </button>
          )}
        </div>

        <div className="transactions__toolbar-right">
          <button
            className={`btn btn--secondary ${activeFilterCount > 0 ? 'btn--filter-active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <LuFilter size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="transactions__filter-badge">{activeFilterCount}</span>
            )}
          </button>

          <div className="transactions__export-group">
            <button className="btn btn--secondary" onClick={() => handleExport('csv')}>
              <LuDownload size={16} />
              CSV
            </button>
            <button className="btn btn--secondary" onClick={() => handleExport('json')}>
              <LuDownload size={16} />
              JSON
            </button>
          </div>

          {isAdmin && (
            <button className="btn btn--primary" onClick={handleAdd}>
              <LuPlus size={16} />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="transactions__filters animate-slide-up">
          <div className="transactions__filter-group">
            <label className="transactions__filter-label">Category</label>
            <select
              className="select"
              value={filters.category}
              onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { category: e.target.value } })}
            >
              <option value="All">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="transactions__filter-group">
            <label className="transactions__filter-label">Type</label>
            <select
              className="select"
              value={filters.type}
              onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { type: e.target.value } })}
            >
              <option value="All">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          {activeFilterCount > 0 && (
            <button
              className="btn btn--secondary transactions__clear-filters"
              onClick={() => dispatch({ type: 'RESET_FILTERS' })}
            >
              <LuX size={14} />
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="transactions__meta">
        <span className="transactions__count">
          {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          {activeFilterCount > 0 && ' (filtered)'}
        </span>
      </div>

      {/* Table */}
      {filteredTransactions.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="🔍"
            title="No transactions found"
            message="Try adjusting your search or filters to find what you're looking for."
          />
        </div>
      ) : (
        <div className="card transactions__table-wrapper">
          <table className="transactions__table">
            <thead>
              <tr>
                <th>
                  <button className="transactions__sort-btn" onClick={() => handleSort('date')}>
                    Date <SortIcon field="date" />
                  </button>
                </th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>
                  <button className="transactions__sort-btn" onClick={() => handleSort('amount')}>
                    Amount <SortIcon field="amount" />
                  </button>
                </th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t, index) => (
                <tr key={t.id} className="animate-fade-in" style={{ animationDelay: `${Math.min(index * 30, 300)}ms`, opacity: 0 }}>
                  <td className="transactions__date">
                    {new Date(t.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td>
                    <div className="transactions__desc">
                      <span className="transactions__desc-icon" style={{ background: `${CATEGORIES[t.category]?.color}15` }}>
                        {CATEGORIES[t.category]?.icon || '💳'}
                      </span>
                      {t.description}
                    </div>
                  </td>
                  <td>
                    <span
                      className="transactions__category-badge"
                      style={{
                        background: `${CATEGORIES[t.category]?.color}15`,
                        color: CATEGORIES[t.category]?.color,
                      }}
                    >
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
                        <button className="btn btn--icon" onClick={() => handleEdit(t)} title="Edit">
                          <LuPencil size={16} />
                        </button>
                        <button className="btn btn--icon" onClick={() => handleDelete(t.id)} title="Delete">
                          <LuTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTransaction(null);
        }}
        title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
      >
        <TransactionForm
          transaction={editingTransaction}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditingTransaction(null);
          }}
        />
      </Modal>
    </div>
  );
}
