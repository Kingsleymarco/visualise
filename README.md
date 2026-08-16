# Visualise
Visualise is a personal cash-flow forecaster that helps users understand the flow of their money through income and expenses entries. By logging income and recurring expenses, the app simulates every day of the current month and provides the date in which the user's balance is lowest. Unlike other budget trackers, Visualise models overlapping billing cycles with recurrence types like daily, weekly, monthly, yearly, and custom intervals. This is to give an accurate picture of the financial situation of the user as to their net monthly total, monthly expenses and income.

Tech Stack
•	React + TypeScript (Frontend) – Allows for app to built with reusable components with TypeScript catching mistake before it runs.
•	FastAPI (Backend) – Fast and straightforward, it handles request behind the scenes.
•	PostgreSQL (Database) – The data is stored in an organised manner.
•	SQLAlchemy  - Allows developers to use Python which talks to PostgresSQL.
•	Recharts – Turns data into charts and works well with React.

## Getting Started
### Prerequisites
- Python 3.10+
- Node.js 20+
- PostgreSQL installed and running
- Git

### Clone the repo
```bash
git clone https://github.com/Kingsleymarco/visualise.git
cd visualise
```

### Backend setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create an .env file inside have your DATABASE_URL
e.g.: DATABASE_URL=postgresql://username:password@localhost:5432/visualise

### Running Backend
cd backed/app
uvicorn main:app --reload
Backend runs at `http://localhost:8000`

### Frontend setup

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

## Features
- Log income and expenses with recurrence types — once, daily, weekly, monthly, yearly, custom
- Day by day balance forecast for the current month
- Monthly income and expense summaries with net monthly calculation
- Transaction event log showing every financial event per day
- Donut charts showing income source breakdown and expense category breakdown

Demo Video: https://youtu.be/SWs7j-EoyGQ 
Please switch the quality to 1080p.