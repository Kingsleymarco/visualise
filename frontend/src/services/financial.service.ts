import axios from "axios";
import type {
  Category,
  Expense,
  ExpenseCreate,
  ForecastResponse,
  Income,
  IncomeCreate,
} from "@/models/financial";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export class FinancialService {
  static async getIncomes(userId: number): Promise<Income[]> {
    const response = await api.get<Income[]>("/income", {
      params: {
        user_id: userId,
      },
    });

    return response.data;
  }

  static async createIncome(
    userId: number,
    income: IncomeCreate,
  ): Promise<Income> {
    const response = await api.post<Income>("/income", income, {
      params: {
        user_id: userId,
      },
    });

    return response.data;
  }

  static async updateIncome(
    incomeId: number,
    income: IncomeCreate,
  ): Promise<Income> {
    const response = await api.put<Income>(`/income/${incomeId}`, income);

    return response.data;
  }

  static async deleteIncome(incomeId: number): Promise<void> {
    await api.delete(`/income/${incomeId}`);
  }

  static async getExpenses(userId: number): Promise<Expense[]> {
    const response = await api.get<Expense[]>("/expense", {
      params: {
        user_id: userId,
      },
    });

    return response.data;
  }

  static async createExpense(
    userId: number,
    expense: ExpenseCreate,
  ): Promise<Expense> {
    const response = await api.post<Expense>("/expense", expense, {
      params: {
        user_id: userId,
      },
    });

    return response.data;
  }

  static async updateExpense(
    expenseId: number,
    expense: ExpenseCreate,
  ): Promise<Expense> {
    const response = await api.put<Expense>(`/expense/${expenseId}`, expense);

    return response.data;
  }

  static async deleteExpense(expenseId: number): Promise<void> {
    await api.delete(`/expense/${expenseId}`);
  }

  static async getCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>("/categories");

    return response.data;
  }

  static async getForecast(
    userId: number,
    month: string,
  ): Promise<ForecastResponse> {
    const response = await api.get<ForecastResponse>("/forecast", {
      params: {
        user_id: userId,
        month,
      },
    });

    return response.data;
  }
}
