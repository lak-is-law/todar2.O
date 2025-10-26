const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { dbOperations } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Simple AI prediction function
function predictNextMonth(monthlyTotals) {
    if (monthlyTotals.length < 2) return 0;
    
    const recent = monthlyTotals[0].total;
    const previous = monthlyTotals[1].total;
    const trend = recent - previous;
    return Math.max(0, recent + trend);
}

// Generate AI insights
function generateInsights(expenses, categoryTotals, monthlyTotals) {
    const insights = {
        predictions: { nextMonth: predictNextMonth(monthlyTotals) },
        recommendations: [],
        anomalies: []
    };

    // Category recommendations
    if (categoryTotals.length > 0) {
        const total = categoryTotals.reduce((sum, cat) => sum + cat.total, 0);
        const highest = categoryTotals[0];
        const percentage = (highest.total / total) * 100;
        
        if (percentage > 50) {
            insights.recommendations.push(
                `Consider reducing ${highest.category} spending (${percentage.toFixed(1)}% of total)`
            );
        }
    }

    // Anomaly detection
    if (expenses.length > 0) {
        const amounts = expenses.map(exp => exp.amount);
        const avg = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
        const threshold = avg * 2;
        
        const anomalies = expenses.filter(exp => exp.amount > threshold);
        insights.anomalies = anomalies.map(exp => ({
            date: exp.date,
            amount: exp.amount,
            description: exp.description
        }));
    }

    return insights;
}

// API Routes
app.post('/add-expense', async (req, res) => {
    try {
        const { date, category, amount, description } = req.body;
        
        if (!date || !category || !amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid data' });
        }

        const expense = await dbOperations.addExpense({
            date, category, amount: parseFloat(amount), description: description || ''
        });

        res.status(201).json({ message: 'Expense added', expense });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add expense' });
    }
});

app.get('/expenses', async (req, res) => {
    try {
        const expenses = await dbOperations.getAllExpenses();
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});

app.get('/report', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        const [expenses, categoryTotals, monthlyTotals] = await Promise.all([
            dbOperations.getExpensesByMonth(currentYear, currentMonth),
            dbOperations.getCategoryTotals(currentYear, currentMonth),
            dbOperations.getMonthlyTotals()
        ]);

        const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        res.json({
            expenses,
            categoryTotals,
            monthlyTotals,
            totalSpending: Math.round(totalSpending * 100) / 100,
            isOverBudget: totalSpending > 5000,
            budgetLimit: 5000
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate report' });
    }
});

app.get('/ai-insights', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        const [expenses, categoryTotals, monthlyTotals] = await Promise.all([
            dbOperations.getExpensesByMonth(currentYear, currentMonth),
            dbOperations.getCategoryTotals(currentYear, currentMonth),
            dbOperations.getMonthlyTotals()
        ]);

        const insights = generateInsights(expenses, categoryTotals, monthlyTotals);

        res.json({ insights });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate insights' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Smart Expense Tracker API running' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/health`);
});
