export type ExpenseLike = { amount: number; date: Date };

export function calculateExpenseTotals(expenses: ExpenseLike[], now = new Date()) {
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const sum = (after?: Date) => expenses.filter((expense) => !after || expense.date >= after).reduce((total, expense) => total + expense.amount, 0);
  return { month: sum(monthStart), year: sum(yearStart), lifetime: sum() };
}

