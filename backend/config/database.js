const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql2/promise');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

// Database configuration
const DB_CONFIG = {
    type: process.env.DB_TYPE || 'sqlite', // sqlite, mysql, postgresql
    sqlite: {
        path: path.join(__dirname, '../../data/expenses.db')
    },
    mysql: {
        host: process.env.MYSQL_HOST || 'localhost',
        port: process.env.MYSQL_PORT || 3306,
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'expense_tracker',
        connectionLimit: 10
    },
    postgresql: {
        host: process.env.PG_HOST || 'localhost',
        port: process.env.PG_PORT || 5432,
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD || '',
        database: process.env.PG_DATABASE || 'expense_tracker',
        max: 10
    }
};

class DatabaseManager {
    constructor() {
        this.db = null;
        this.type = DB_CONFIG.type;
        this.initializeDatabase();
    }

    async initializeDatabase() {
        try {
            switch (this.type) {
                case 'sqlite':
                    await this.initializeSQLite();
                    break;
                case 'mysql':
                    await this.initializeMySQL();
                    break;
                case 'postgresql':
                    await this.initializePostgreSQL();
                    break;
                default:
                    throw new Error(`Unsupported database type: ${this.type}`);
            }
            console.log(`✅ Connected to ${this.type.toUpperCase()} database`);
            await this.createTables();
        } catch (error) {
            console.error('❌ Database initialization failed:', error.message);
            // Fallback to SQLite if other databases fail
            if (this.type !== 'sqlite') {
                console.log('🔄 Falling back to SQLite...');
                this.type = 'sqlite';
                await this.initializeSQLite();
                await this.createTables();
            }
        }
    }

    async initializeSQLite() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(DB_CONFIG.sqlite.path, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async initializeMySQL() {
        this.db = await mysql.createConnection(DB_CONFIG.mysql);
        console.log('MySQL connection established');
    }

    async initializePostgreSQL() {
        this.db = new Pool(DB_CONFIG.postgresql);
        console.log('PostgreSQL connection pool created');
    }

    async createTables() {
        const createTableSQL = this.getCreateTableSQL();
        
        try {
            if (this.type === 'sqlite') {
                await this.runSQLite(createTableSQL);
            } else if (this.type === 'mysql') {
                await this.db.execute(createTableSQL);
            } else if (this.type === 'postgresql') {
                await this.db.query(createTableSQL);
            }
            console.log('📊 Database tables created/verified');
            await this.insertSampleData();
        } catch (error) {
            console.error('Error creating tables:', error.message);
        }
    }

    getCreateTableSQL() {
        const baseSQL = `
            CREATE TABLE IF NOT EXISTS expenses (
                id ${this.type === 'postgresql' ? 'SERIAL PRIMARY KEY' : 
                    this.type === 'mysql' ? 'INT AUTO_INCREMENT PRIMARY KEY' : 
                    'INTEGER PRIMARY KEY AUTOINCREMENT'},
                date ${this.type === 'postgresql' ? 'DATE' : 'TEXT'} NOT NULL,
                category ${this.type === 'postgresql' ? 'VARCHAR(100)' : 'TEXT'} NOT NULL,
                amount ${this.type === 'postgresql' ? 'DECIMAL(10,2)' : 'REAL'} NOT NULL,
                description ${this.type === 'postgresql' ? 'TEXT' : 'TEXT'},
                created_at ${this.type === 'postgresql' ? 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' : 
                    this.type === 'mysql' ? 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' : 
                    'DATETIME DEFAULT CURRENT_TIMESTAMP'}
            )
        `;
        return baseSQL;
    }

    async insertSampleData() {
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

        try {
            // Check if table is empty
            const count = await this.getExpenseCount();
            if (count === 0) {
                console.log('📝 Inserting sample data...');
                for (const expense of sampleExpenses) {
                    await this.addExpense(expense);
                }
                console.log('✅ Sample data inserted successfully');
            }
        } catch (error) {
            console.error('Error inserting sample data:', error.message);
        }
    }

    async getExpenseCount() {
        try {
            if (this.type === 'sqlite') {
                return new Promise((resolve, reject) => {
                    this.db.get("SELECT COUNT(*) as count FROM expenses", (err, row) => {
                        if (err) reject(err);
                        else resolve(row.count);
                    });
                });
            } else if (this.type === 'mysql') {
                const [rows] = await this.db.execute("SELECT COUNT(*) as count FROM expenses");
                return rows[0].count;
            } else if (this.type === 'postgresql') {
                const result = await this.db.query("SELECT COUNT(*) as count FROM expenses");
                return parseInt(result.rows[0].count);
            }
        } catch (error) {
            console.error('Error getting expense count:', error.message);
            return 0;
        }
    }

    // Database operations
    async addExpense(expense) {
        try {
            if (this.type === 'sqlite') {
                return new Promise((resolve, reject) => {
                    const stmt = this.db.prepare(`
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
            } else if (this.type === 'mysql') {
                const [result] = await this.db.execute(
                    "INSERT INTO expenses (date, category, amount, description) VALUES (?, ?, ?, ?)",
                    [expense.date, expense.category, expense.amount, expense.description]
                );
                return { id: result.insertId, ...expense };
            } else if (this.type === 'postgresql') {
                const result = await this.db.query(
                    "INSERT INTO expenses (date, category, amount, description) VALUES ($1, $2, $3, $4) RETURNING id",
                    [expense.date, expense.category, expense.amount, expense.description]
                );
                return { id: result.rows[0].id, ...expense };
            }
        } catch (error) {
            throw error;
        }
    }

    async getAllExpenses() {
        try {
            if (this.type === 'sqlite') {
                return new Promise((resolve, reject) => {
                    this.db.all("SELECT * FROM expenses ORDER BY date DESC", (err, rows) => {
                        if (err) reject(err);
                        else resolve(rows);
                    });
                });
            } else if (this.type === 'mysql') {
                const [rows] = await this.db.execute("SELECT * FROM expenses ORDER BY date DESC");
                return rows;
            } else if (this.type === 'postgresql') {
                const result = await this.db.query("SELECT * FROM expenses ORDER BY date DESC");
                return result.rows;
            }
        } catch (error) {
            throw error;
        }
    }

    async getExpensesByMonth(year, month) {
        try {
            const monthStr = month.toString().padStart(2, '0');
            const yearMonth = `${year}-${monthStr}`;
            
            if (this.type === 'sqlite') {
                return new Promise((resolve, reject) => {
                    this.db.all(
                        "SELECT * FROM expenses WHERE date LIKE ? ORDER BY date DESC",
                        [`${yearMonth}%`],
                        (err, rows) => {
                            if (err) reject(err);
                            else resolve(rows);
                        }
                    );
                });
            } else if (this.type === 'mysql') {
                const [rows] = await this.db.execute(
                    "SELECT * FROM expenses WHERE date LIKE ? ORDER BY date DESC",
                    [`${yearMonth}%`]
                );
                return rows;
            } else if (this.type === 'postgresql') {
                const result = await this.db.query(
                    "SELECT * FROM expenses WHERE date::text LIKE $1 ORDER BY date DESC",
                    [`${yearMonth}%`]
                );
                return result.rows;
            }
        } catch (error) {
            throw error;
        }
    }

    async getCategoryTotals(year, month) {
        try {
            const monthStr = month.toString().padStart(2, '0');
            const yearMonth = `${year}-${monthStr}`;
            
            if (this.type === 'sqlite') {
                return new Promise((resolve, reject) => {
                    this.db.all(
                        `SELECT category, SUM(amount) as total
                         FROM expenses 
                         WHERE date LIKE ? 
                         GROUP BY category 
                         ORDER BY total DESC`,
                        [`${yearMonth}%`],
                        (err, rows) => {
                            if (err) reject(err);
                            else resolve(rows);
                        }
                    );
                });
            } else if (this.type === 'mysql') {
                const [rows] = await this.db.execute(
                    `SELECT category, SUM(amount) as total
                     FROM expenses 
                     WHERE date LIKE ? 
                     GROUP BY category 
                     ORDER BY total DESC`,
                    [`${yearMonth}%`]
                );
                return rows;
            } else if (this.type === 'postgresql') {
                const result = await this.db.query(
                    `SELECT category, SUM(amount) as total
                     FROM expenses 
                     WHERE date::text LIKE $1 
                     GROUP BY category 
                     ORDER BY total DESC`,
                    [`${yearMonth}%`]
                );
                return result.rows;
            }
        } catch (error) {
            throw error;
        }
    }

    async getMonthlyTotals() {
        try {
            if (this.type === 'sqlite') {
                return new Promise((resolve, reject) => {
                    this.db.all(
                        `SELECT 
                            strftime('%Y-%m', date) as month,
                            SUM(amount) as total
                         FROM expenses 
                         GROUP BY strftime('%Y-%m', date)
                         ORDER BY month DESC
                         LIMIT 6`,
                        (err, rows) => {
                            if (err) reject(err);
                            else resolve(rows);
                        }
                    );
                });
            } else if (this.type === 'mysql') {
                const [rows] = await this.db.execute(
                    `SELECT 
                        DATE_FORMAT(date, '%Y-%m') as month,
                        SUM(amount) as total
                     FROM expenses 
                     GROUP BY DATE_FORMAT(date, '%Y-%m')
                     ORDER BY month DESC
                     LIMIT 6`
                );
                return rows;
            } else if (this.type === 'postgresql') {
                const result = await this.db.query(
                    `SELECT 
                        TO_CHAR(date, 'YYYY-MM') as month,
                        SUM(amount) as total
                     FROM expenses 
                     GROUP BY TO_CHAR(date, 'YYYY-MM')
                     ORDER BY month DESC
                     LIMIT 6`
                );
                return result.rows;
            }
        } catch (error) {
            throw error;
        }
    }

    async runSQLite(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve(this);
            });
        });
    }

    async close() {
        try {
            if (this.type === 'sqlite') {
                this.db.close();
            } else if (this.type === 'mysql') {
                await this.db.end();
            } else if (this.type === 'postgresql') {
                await this.db.end();
            }
            console.log('Database connection closed');
        } catch (error) {
            console.error('Error closing database:', error.message);
        }
    }
}

// Create singleton instance
const dbManager = new DatabaseManager();

// Export database operations for backward compatibility
const dbOperations = {
    addExpense: (expense) => dbManager.addExpense(expense),
    getAllExpenses: () => dbManager.getAllExpenses(),
    getExpensesByMonth: (year, month) => dbManager.getExpensesByMonth(year, month),
    getCategoryTotals: (year, month) => dbManager.getCategoryTotals(year, month),
    getMonthlyTotals: () => dbManager.getMonthlyTotals()
};

module.exports = { dbManager, dbOperations };
