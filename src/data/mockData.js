// Categories with colors and icons
export const CATEGORIES = {
  Food: { color: '#FF6B6B', icon: '🍔' },
  Transport: { color: '#4ECDC4', icon: '🚗' },
  Shopping: { color: '#A78BFA', icon: '🛍️' },
  Entertainment: { color: '#F59E0B', icon: '🎬' },
  Bills: { color: '#EF4444', icon: '📄' },
  Healthcare: { color: '#10B981', icon: '🏥' },
  Education: { color: '#3B82F6', icon: '📚' },
  Salary: { color: '#22C55E', icon: '💰' },
  Freelance: { color: '#8B5CF6', icon: '💻' },
  Investment: { color: '#06B6D4', icon: '📈' },
  Rent: { color: '#F97316', icon: '🏠' },
  Groceries: { color: '#84CC16', icon: '🥦' },
};

// Generate a set of realistic transactions
export const generateTransactions = () => {
  const transactions = [
    // January 2026
    { id: 1, date: '2026-01-02', description: 'Monthly Salary', amount: 5200, category: 'Salary', type: 'income' },
    { id: 2, date: '2026-01-03', description: 'Apartment Rent', amount: 1200, category: 'Rent', type: 'expense' },
    { id: 3, date: '2026-01-05', description: 'Grocery Shopping', amount: 85.50, category: 'Groceries', type: 'expense' },
    { id: 4, date: '2026-01-07', description: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', type: 'expense' },
    { id: 5, date: '2026-01-10', description: 'Freelance Web Project', amount: 800, category: 'Freelance', type: 'income' },
    { id: 6, date: '2026-01-12', description: 'Uber to Airport', amount: 35, category: 'Transport', type: 'expense' },
    { id: 7, date: '2026-01-15', description: 'Electric Bill', amount: 95, category: 'Bills', type: 'expense' },
    { id: 8, date: '2026-01-18', description: 'Restaurant Dinner', amount: 65, category: 'Food', type: 'expense' },
    { id: 9, date: '2026-01-22', description: 'Online Course - React', amount: 49.99, category: 'Education', type: 'expense' },
    { id: 10, date: '2026-01-25', description: 'Grocery Shopping', amount: 92.30, category: 'Groceries', type: 'expense' },

    // February 2026
    { id: 11, date: '2026-02-01', description: 'Monthly Salary', amount: 5200, category: 'Salary', type: 'income' },
    { id: 12, date: '2026-02-02', description: 'Apartment Rent', amount: 1200, category: 'Rent', type: 'expense' },
    { id: 13, date: '2026-02-04', description: 'New Headphones', amount: 150, category: 'Shopping', type: 'expense' },
    { id: 14, date: '2026-02-06', description: 'Gas Station', amount: 45, category: 'Transport', type: 'expense' },
    { id: 15, date: '2026-02-08', description: 'Stock Dividend', amount: 120, category: 'Investment', type: 'income' },
    { id: 16, date: '2026-02-10', description: 'Movie Tickets', amount: 28, category: 'Entertainment', type: 'expense' },
    { id: 17, date: '2026-02-12', description: 'Internet Bill', amount: 60, category: 'Bills', type: 'expense' },
    { id: 18, date: '2026-02-15', description: 'Grocery Shopping', amount: 110, category: 'Groceries', type: 'expense' },
    { id: 19, date: '2026-02-18', description: 'Doctor Visit', amount: 75, category: 'Healthcare', type: 'expense' },
    { id: 20, date: '2026-02-22', description: 'Freelance Logo Design', amount: 450, category: 'Freelance', type: 'income' },

    // March 2026
    { id: 21, date: '2026-03-01', description: 'Monthly Salary', amount: 5200, category: 'Salary', type: 'income' },
    { id: 22, date: '2026-03-02', description: 'Apartment Rent', amount: 1200, category: 'Rent', type: 'expense' },
    { id: 23, date: '2026-03-05', description: 'Coffee Machine', amount: 199, category: 'Shopping', type: 'expense' },
    { id: 24, date: '2026-03-07', description: 'Bus Pass Monthly', amount: 75, category: 'Transport', type: 'expense' },
    { id: 25, date: '2026-03-10', description: 'Pizza Night', amount: 42, category: 'Food', type: 'expense' },
    { id: 26, date: '2026-03-12', description: 'Spotify Premium', amount: 9.99, category: 'Entertainment', type: 'expense' },
    { id: 27, date: '2026-03-14', description: 'Phone Bill', amount: 55, category: 'Bills', type: 'expense' },
    { id: 28, date: '2026-03-16', description: 'Freelance App Design', amount: 1200, category: 'Freelance', type: 'income' },
    { id: 29, date: '2026-03-18', description: 'Grocery Shopping', amount: 78, category: 'Groceries', type: 'expense' },
    { id: 30, date: '2026-03-20', description: 'Gym Membership', amount: 40, category: 'Healthcare', type: 'expense' },
    { id: 31, date: '2026-03-25', description: 'Book Purchase', amount: 22, category: 'Education', type: 'expense' },

    // April 2026 (partial)
    { id: 32, date: '2026-04-01', description: 'Monthly Salary', amount: 5500, category: 'Salary', type: 'income' },
    { id: 33, date: '2026-04-01', description: 'Apartment Rent', amount: 1200, category: 'Rent', type: 'expense' },

    // November 2025
    { id: 34, date: '2025-11-01', description: 'Monthly Salary', amount: 5000, category: 'Salary', type: 'income' },
    { id: 35, date: '2025-11-03', description: 'Apartment Rent', amount: 1200, category: 'Rent', type: 'expense' },
    { id: 36, date: '2025-11-05', description: 'Grocery Shopping', amount: 95, category: 'Groceries', type: 'expense' },
    { id: 37, date: '2025-11-08', description: 'Winter Jacket', amount: 180, category: 'Shopping', type: 'expense' },
    { id: 38, date: '2025-11-10', description: 'Concert Tickets', amount: 120, category: 'Entertainment', type: 'expense' },
    { id: 39, date: '2025-11-15', description: 'Electric Bill', amount: 110, category: 'Bills', type: 'expense' },
    { id: 40, date: '2025-11-20', description: 'Freelance Consulting', amount: 650, category: 'Freelance', type: 'income' },
    { id: 41, date: '2025-11-25', description: 'Thanksgiving Dinner', amount: 88, category: 'Food', type: 'expense' },

    // December 2025
    { id: 42, date: '2025-12-01', description: 'Monthly Salary', amount: 5000, category: 'Salary', type: 'income' },
    { id: 43, date: '2025-12-02', description: 'Apartment Rent', amount: 1200, category: 'Rent', type: 'expense' },
    { id: 44, date: '2025-12-05', description: 'Christmas Gifts', amount: 350, category: 'Shopping', type: 'expense' },
    { id: 45, date: '2025-12-08', description: 'Holiday Party', amount: 75, category: 'Food', type: 'expense' },
    { id: 46, date: '2025-12-10', description: 'Year-End Bonus', amount: 2000, category: 'Salary', type: 'income' },
    { id: 47, date: '2025-12-12', description: 'Grocery Shopping', amount: 130, category: 'Groceries', type: 'expense' },
    { id: 48, date: '2025-12-15', description: 'Gas Station', amount: 50, category: 'Transport', type: 'expense' },
    { id: 49, date: '2025-12-20', description: 'Investment Deposit', amount: 500, category: 'Investment', type: 'income' },
    { id: 50, date: '2025-12-28', description: 'New Year Outfit', amount: 120, category: 'Shopping', type: 'expense' },
  ];

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Helper to compute monthly summaries
export const getMonthlyData = (transactions) => {
  const monthMap = {};

  transactions.forEach((t) => {
    const month = t.date.substring(0, 7); // "2026-01"
    if (!monthMap[month]) {
      monthMap[month] = { month, income: 0, expenses: 0 };
    }
    if (t.type === 'income') {
      monthMap[month].income += t.amount;
    } else {
      monthMap[month].expenses += t.amount;
    }
  });

  const sorted = Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month));

  let runningBalance = 0;
  return sorted.map((m) => {
    runningBalance += m.income - m.expenses;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [year, monthNum] = m.month.split('-');
    return {
      ...m,
      label: `${monthNames[parseInt(monthNum) - 1]} ${year.slice(2)}`,
      balance: parseFloat(runningBalance.toFixed(2)),
    };
  });
};

// Get spending by category
export const getSpendingByCategory = (transactions) => {
  const catMap = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      if (!catMap[t.category]) {
        catMap[t.category] = 0;
      }
      catMap[t.category] += t.amount;
    });

  return Object.entries(catMap)
    .map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
      color: CATEGORIES[name]?.color || '#888',
    }))
    .sort((a, b) => b.value - a.value);
};
