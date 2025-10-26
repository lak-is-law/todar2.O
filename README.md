# Smart Expense Tracker with AI Insights

A full-stack web application for tracking expenses with AI-powered insights and predictions, featuring an Apple-inspired clean and minimalistic design.

## 🚀 Features

- **Expense Management**: Add, view, and categorize expenses
- **Dashboard Analytics**: Monthly totals and category-wise breakdown
- **AI Insights**: Smart spending analysis and budget recommendations
- **Predictions**: Next month's spending predictions based on historical data
- **Spending Alerts**: Warning banner when monthly spending exceeds ₹5000
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠 Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Apple-inspired UI)
- **Backend**: Node.js + Express
- **Database**: SQLite
- **AI**: TensorFlow.js for trend analysis and predictions

## 📁 Project Structure

```
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── backend/
│   ├── server.js
│   ├── package.json
│   └── database.js
├── data/
│   └── expenses.db
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation & Setup

1. **Clone or download the project files**

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Start the backend server**
   ```bash
   npm start
   ```
   The server will start on `http://localhost:3000`

4. **Open the frontend**
   - Navigate to the `frontend` folder
   - Open `index.html` in your web browser
   - Or use a local server: `python -m http.server 8000` and visit `http://localhost:8000`

## 📖 How to Use

1. **Add Expenses**: Click "Add Expense" and fill in the details (date, category, amount, description)
2. **View Dashboard**: See your monthly totals and category breakdown
3. **AI Insights**: Check the AI-powered recommendations and predictions
4. **Track Spending**: Monitor your expenses and get alerts when spending exceeds ₹5000

## 🔧 API Endpoints

- `POST /add-expense` - Add a new expense
- `GET /expenses` - Get all expenses
- `GET /report` - Get monthly totals and category breakdown
- `GET /ai-insights` - Get AI-powered insights and predictions

## 🎨 Design Features

- **Apple-inspired UI**: Clean, minimalistic design with subtle gradients
- **Responsive Layout**: Optimized for both desktop and mobile
- **Smooth Animations**: Hover effects and transitions
- **Modern Typography**: Sans-serif fonts with proper hierarchy

## 🤖 AI Features

- **Spending Predictions**: Uses TensorFlow.js to predict next month's expenses
- **Category Analysis**: Identifies spending patterns by category
- **Anomaly Detection**: Highlights unusual expense spikes
- **Budget Recommendations**: Suggests areas to reduce spending

## 📱 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🐛 Troubleshooting

- If the backend doesn't start, ensure Node.js is installed and you're in the backend directory
- If the frontend doesn't load data, check that the backend server is running on port 3000
- Clear browser cache if you see outdated data

## 📄 License

This project is open source and available under the MIT License.

