import { createContext, useContext, useReducer, useEffect } from 'react';
import { generateTransactions } from '../data/mockData';

const AppContext = createContext();

const STORAGE_KEY = 'finDash_state';

const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        // Ensure filters always have defaults
        filters: {
          search: '',
          category: 'All',
          type: 'All',
          sortBy: 'date',
          sortOrder: 'desc',
          ...parsed.filters,
        },
      };
    }
  } catch (e) {
    console.warn('Failed to load state from localStorage', e);
  }
  return null;
};

const defaultState = {
  transactions: generateTransactions(),
  filters: {
    search: '',
    category: 'All',
    type: 'All',
    sortBy: 'date',
    sortOrder: 'desc',
  },
  role: 'admin',
  theme: 'light',
};

const initialState = loadState() || defaultState;

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [
          { ...action.payload, id: Date.now() },
          ...state.transactions,
        ],
      };
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: defaultState.filters,
      };
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light',
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state to localStorage', e);
    }
  }, [state]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Derive filtered & sorted transactions
  const filteredTransactions = getFilteredTransactions(state.transactions, state.filters);

  return (
    <AppContext.Provider value={{ state, dispatch, filteredTransactions }}>
      {children}
    </AppContext.Provider>
  );
}

function getFilteredTransactions(transactions, filters) {
  let result = [...transactions];

  // Search
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }

  // Category filter
  if (filters.category !== 'All') {
    result = result.filter((t) => t.category === filters.category);
  }

  // Type filter
  if (filters.type !== 'All') {
    result = result.filter((t) => t.type === filters.type);
  }

  // Sorting
  result.sort((a, b) => {
    let comparison = 0;
    if (filters.sortBy === 'date') {
      comparison = new Date(a.date) - new Date(b.date);
    } else if (filters.sortBy === 'amount') {
      comparison = a.amount - b.amount;
    }
    return filters.sortOrder === 'desc' ? -comparison : comparison;
  });

  return result;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
