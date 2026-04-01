import { useState, useEffect } from 'react';
import { CATEGORIES } from '../../data/mockData';
import './TransactionForm.css';

const expenseCategories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Rent', 'Groceries'];
const incomeCategories = ['Salary', 'Freelance', 'Investment'];

export default function TransactionForm({ transaction, onSubmit, onCancel }) {
  const isEditing = !!transaction;

  const [form, setForm] = useState({
    date: '',
    description: '',
    amount: '',
    category: 'Food',
    type: 'expense',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transaction) {
      setForm({
        date: transaction.date,
        description: transaction.description,
        amount: transaction.amount.toString(),
        category: transaction.category,
        type: transaction.type,
      });
    }
  }, [transaction]);

  const categories = form.type === 'income' ? incomeCategories : expenseCategories;

  const handleChange = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      // Reset category if type changes
      if (field === 'type') {
        const cats = value === 'income' ? incomeCategories : expenseCategories;
        if (!cats.includes(updated.category)) {
          updated.category = cats[0];
        }
      }
      return updated;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.date) newErrors.date = 'Date is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.amount || parseFloat(form.amount) <= 0) newErrors.amount = 'Enter a valid amount';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...(transaction && { id: transaction.id }),
      date: form.date,
      description: form.description.trim(),
      amount: parseFloat(form.amount),
      category: form.category,
      type: form.type,
    });
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      {/* Type Toggle */}
      <div className="form-group">
        <label className="form-label">Type</label>
        <div className="form-type-toggle">
          <button
            type="button"
            className={`form-type-btn ${form.type === 'expense' ? 'form-type-btn--expense' : ''}`}
            onClick={() => handleChange('type', 'expense')}
          >
            Expense
          </button>
          <button
            type="button"
            className={`form-type-btn ${form.type === 'income' ? 'form-type-btn--income' : ''}`}
            onClick={() => handleChange('type', 'income')}
          >
            Income
          </button>
        </div>
      </div>

      {/* Date */}
      <div className="form-group">
        <label className="form-label">Date</label>
        <input
          type="date"
          className={`input ${errors.date ? 'input--error' : ''}`}
          value={form.date}
          onChange={(e) => handleChange('date', e.target.value)}
        />
        {errors.date && <span className="form-error">{errors.date}</span>}
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label">Description</label>
        <input
          type="text"
          className={`input ${errors.description ? 'input--error' : ''}`}
          placeholder="e.g., Grocery shopping"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

      {/* Amount */}
      <div className="form-group">
        <label className="form-label">Amount (₹)</label>
        <input
          type="number"
          className={`input ${errors.amount ? 'input--error' : ''}`}
          placeholder="0.00"
          min="0"
          step="0.01"
          value={form.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
        />
        {errors.amount && <span className="form-error">{errors.amount}</span>}
      </div>

      {/* Category */}
      <div className="form-group">
        <label className="form-label">Category</label>
        <select
          className="select"
          value={form.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORIES[cat]?.icon} {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary">
          {isEditing ? 'Update' : 'Add'} Transaction
        </button>
      </div>
    </form>
  );
}
