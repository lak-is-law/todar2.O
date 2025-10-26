const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, '../data/expenses.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Create expenses table
    const createExpensesTable = `
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.run(createExpensesTable, (err) => {
        if (err) {
            console.error('Error creating expenses table:', err.message);
        } else {
            console.log('Expenses table ready');
            // Insert sample data if table is empty
            insertSampleData();
        }
    });
}

// Insert sample data for demonstration
function insertSampleData() {
    const sampleExpenses = [
        {
            date: '2024-01-15',
            category: 'Food',
            amount: 1200,
            description: 'Grocery shopping'
        },
        {
            date: '2024-01-16',
            category: 'Travel',
            amount: 800,
            description: 'Uber rides'
        },
        {
            date: '2024-01-17',
            category: 'Shopping',
            amount: 2500,
            description: 'New clothes'
        },
        {
            date: '2024-01-18',
            category: 'Food',
            amount: 600,
            description: 'Restaurant dinner'
        },
        {
            date: '2024-01-19',
            category: 'Other',
            amount: 300,
            description: 'Movie tickets'
        }
    ];

    // Check if table is empty
    db.get("SELECT COUNT(*) as count FROM expenses", (err, row) => {
        if (err) {
            console.error('Error checking table:', err.message);
            return;
        }

        if (row.count === 0) {
            console.log('Inserting sample data...');
            const insertStmt = db.prepare(`
                INSERT INTO expenses (date, category, amount, description)
                VALUES (?, ?, ?, ?)
            `);

            sampleExpenses.forEach(expense => {
                insertStmt.run([
                    expense.date,
                    expense.category,
                    expense.amount,
                    expense.description
                ]);
            });

            insertStmt.finalize((err) => {
                if (err) {
                    console.error('Error inserting sample data:', err.message);
                } else {
                    console.log('Sample data inserted successfully');
                }
            });
        }
    });
}

// Database operations
const dbOperations = {
    // Add new expense
    addExpense: (expense) => {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare(`
                INSERT INTO expenses (date, category, amount, description)
                VALUES (?, ?, ?, ?)
            `);
            
            stmt.run([expense.date, expense.category, expense.amount, expense.description], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...expense });
                }
            });
            
            stmt.finalize();
        });
    },

    // Get all expenses
    getAllExpenses: () => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM expenses ORDER BY date DESC", (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },

    // Get expenses by month
    getExpensesByMonth: (year, month) => {
        return new Promise((resolve, reject) => {
            const monthStr = month.toString().padStart(2, '0');
            const yearMonth = `${year}-${monthStr}`;
            
            db.all(
                "SELECT * FROM expenses WHERE date LIKE ? ORDER BY date DESC",
                [`${yearMonth}%`],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
    },

    // Get category totals for a month
    getCategoryTotals: (year, month) => {
        return new Promise((resolve, reject) => {
            const monthStr = month.toString().padStart(2, '0');
            const yearMonth = `${year}-${monthStr}`;
            
            db.all(
                `SELECT category, SUM(amount) as total
                 FROM expenses 
                 WHERE date LIKE ? 
                 GROUP BY category 
                 ORDER BY total DESC`,
                [`${yearMonth}%`],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
    },

    // Get monthly totals for the last 6 months
    getMonthlyTotals: () => {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT 
                    strftime('%Y-%m', date) as month,
                    SUM(amount) as total
                 FROM expenses 
                 GROUP BY strftime('%Y-%m', date)
                 ORDER BY month DESC
                 LIMIT 6`,
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
    }
};

module.exports = { db, dbOperations };

