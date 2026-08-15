import calendar
from datetime import date

def happens_on(entry, current_date: date) -> bool:
    if current_date < entry.start_date:
        return False
    
    if entry.recurrence == "Once":
        return current_date == entry.start_date 

    if entry.recurrence == "Daily":
        return True

    if entry.recurrence == "Weekly":
        return (current_date - entry.start_date).days % 7 == 0

    if entry.recurrence == "Monthly":
        last_day = calendar.monthrange(current_date.year, current_date.month)[1]
        target_day = min(entry.start_date.day, last_day)
        return current_date.day == target_day

    if entry.recurrence == "Yearly":
        return ((current_date.day == entry.start_date.day) and (current_date.month == entry.start_date.month))

    if entry.recurrence == "Custom":
        return (current_date - entry.start_date).days % entry.recurrence_interval == 0

    return False


def calculate_forecast(incomes: list, expenses: list, month: str, starting_balance: float = 0):
    year, month_int = map(int, month.split("-"))
    num_days = calendar.monthrange(year, month_int)[1]

    balance = starting_balance
    balance_history = []
    remaining_events = []
    monthly_income = 0
    monthly_expense = 0
    lowest_balance_day = None

    for day in range(1, num_days + 1):
        current_date = date(year, month_int, day)

        for income_entry in incomes:
            if happens_on(income_entry, current_date):
                amount = float(income_entry.amount)
                balance += amount
                monthly_income += amount

                remaining_events.append({
                    "date": current_date.isoformat(),
                    "name": income_entry.label,
                    "amount": income_entry.amount,
                    "kind": "income",
                })

        for expense_entry in expenses:
            if happens_on(expense_entry, current_date):
                amount = float(expense_entry.amount)
                balance -= amount
                monthly_expense += amount

                remaining_events.append({
                    "date": current_date.isoformat(),
                    "name": expense_entry.label,
                    "amount": expense_entry.amount,
                    "kind": "expense",
                })

        balance_history.append({"date": current_date.isoformat(), "balance": balance})

        if (lowest_balance_day is None) or (balance < lowest_balance_day["balance"]):
            lowest_balance_day = {"date": current_date.isoformat(), "balance": balance}

    net_monthly = monthly_income - monthly_expense

    return {
        "balance_history": balance_history,
        "lowest_balance_day": lowest_balance_day,
        "remaining_events": remaining_events,
        "monthly_income": monthly_income,
        "monthly_expense": monthly_expense,
        "net_monthly": net_monthly,
    }