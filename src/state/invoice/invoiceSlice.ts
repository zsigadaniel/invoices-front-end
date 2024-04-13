import { createSlice } from "@reduxjs/toolkit";

type Invoice = {
  id: string;
  vendor_name: string;
  amount: number;
  due_date: string;
  description: string;
  paid: boolean;
  createdAt: string;
};

interface InvoiceState {
  invoices: Invoice[];
  invoice: Invoice | null;
}

const initialState: InvoiceState = {
  invoices: [],
  invoice: null,
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    setInvoices: (state, action) => {
      state.invoices = action.payload;
    },
    setInvoice: (state, action) => {
      state.invoice = action.payload;
    },
  },
});

export const { setInvoices, setInvoice } = invoiceSlice.actions;

export default invoiceSlice.reducer;
