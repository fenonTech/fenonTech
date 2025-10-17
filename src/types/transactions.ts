export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  value: number;
  formattedValue: string;
  type: "income" | "expense";
  createdAt: Date;
  updatedAt: Date;
}

export interface Income extends Transaction {
  type: "income";
}

export interface Expense extends Transaction {
  type: "expense";
}

export interface Bill {
  id: string;
  date: string;
  description: string;
  category: string;
  value: number;
  formattedValue: string;
  dueDate: string;
  status: "pending" | "paid" | "overdue";
  type: "receivable" | "payable";
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionFormData = {
  description: string;
  category: string;
  value: string;
  date: string;
};

export type BillFormData = {
  description: string;
  category: string;
  value: string;
  date: string;
  dueDate: string;
  status: "pending" | "paid" | "overdue";
};
