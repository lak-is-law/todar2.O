// API Base URL
const API_BASE_URL = 'https://todar2o.vercel.app/';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    setupForm();
    setupThemeSwitcher();
    loadDashboard();
});

// Setup navigation
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.dataset.section;
            switchSection(section);
        });
    });
}

// Switch sections
function switchSection(sectionName) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === sectionName) {
            btn.classList.add('active');
        }
    });

    // Update content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionName) {
            section.classList.add('active');
        }
    });

    // Load section data
    if (sectionName === 'dashboard') loadDashboard();
    if (sectionName === 'expenses') loadExpenses();
    if (sectionName === 'insights') loadAIInsights();
}

// Setup form
function setupForm() {
    const form = document.getElementById('expenseForm');
    form.addEventListener('submit', handleAddExpense);
}

// Load dashboard
async function loadDashboard() {
    try {
        const response = await fetch(`${API_BASE_URL}/report`);
        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Update dashboard
function updateDashboard(data) {
    document.getElementById('totalSpending').textContent = `₹${data.totalSpending}`;
    document.getElementById('expenseCount').textContent = data.expenses.length;
    
    if (data.isOverBudget) {
        document.getElementById('warningBanner').style.display = 'flex';
    } else {
        document.getElementById('warningBanner').style.display = 'none';
    }

    updateCategoryList(data.categoryTotals);
}

// Update category list
function updateCategoryList(categories) {
    const list = document.getElementById('categoryList');
    list.innerHTML = '';
    
    categories.forEach(cat => {
        const item = document.createElement('div');
        item.className = 'category-item';
        item.innerHTML = `
            <span>${cat.category}</span>
            <span>₹${cat.total}</span>
        `;
        list.appendChild(item);
    });
}

// Load expenses
async function loadExpenses() {
    try {
        const response = await fetch(`${API_BASE_URL}/expenses`);
        const expenses = await response.json();
        updateExpensesTable(expenses);
    } catch (error) {
        console.error('Error loading expenses:', error);
    }
}

// Update expenses table
function updateExpensesTable(expenses) {
    const tbody = document.getElementById('expensesTableBody');
    tbody.innerHTML = '';
    
    expenses.forEach(exp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(exp.date).toLocaleDateString()}</td>
            <td>${exp.category}</td>
            <td>${exp.description || '-'}</td>
            <td>₹${exp.amount}</td>
        `;
        tbody.appendChild(row);
    });
}

// Load AI insights
async function loadAIInsights() {
    try {
        const response = await fetch(`${API_BASE_URL}/ai-insights`);
        const data = await response.json();
        updateInsights(data.insights);
    } catch (error) {
        console.error('Error loading insights:', error);
    }
}

// Update insights
function updateInsights(insights) {
    document.getElementById('predictionsContent').innerHTML = 
        `<p>Next month: ₹${insights.predictions.nextMonth || 0}</p>`;
    
    document.getElementById('recommendationsContent').innerHTML = 
        insights.recommendations.map(r => `<p>• ${r}</p>`).join('');
    
    document.getElementById('anomaliesContent').innerHTML = 
        insights.anomalies.map(a => `<p>• ₹${a.amount} on ${a.date}</p>`).join('');
}

// Handle add expense
async function handleAddExpense(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const expense = {
        date: formData.get('date'),
        category: formData.get('category'),
        amount: parseFloat(formData.get('amount')),
        description: formData.get('description')
    };

    try {
        const response = await fetch(`${API_BASE_URL}/add-expense`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense)
        });

        if (response.ok) {
            hideAddExpenseModal();
            event.target.reset();
            loadDashboard();
            loadExpenses();
            loadAIInsights();
        }
    } catch (error) {
        console.error('Error adding expense:', error);
    }
}

// Modal functions
function showAddExpenseModal() {
    document.getElementById('addExpenseModal').classList.add('active');
    document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];
}

function hideAddExpenseModal() {
    document.getElementById('addExpenseModal').classList.remove('active');
}

// Theme Switcher Functions
function setupThemeSwitcher() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('selectedTheme') || 'default';
    applyTheme(savedTheme);
    
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.dataset.theme;
            applyTheme(theme);
            localStorage.setItem('selectedTheme', theme);
        });
    });
}

function applyTheme(theme) {
    // Remove existing theme classes
    document.documentElement.removeAttribute('data-theme');
    
    // Apply new theme
    if (theme !== 'default') {
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    // Update active theme button
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        }
    });
    
    // Add theme transition effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

// Get current theme
function getCurrentTheme() {
    return localStorage.getItem('selectedTheme') || 'default';
}

// Theme preview function (for future use)
function previewTheme(theme) {
    const originalTheme = getCurrentTheme();
    applyTheme(theme);
    
    // Auto-revert after 3 seconds
    setTimeout(() => {
        applyTheme(originalTheme);
    }, 3000);
}
