import { Invoice, ProductLine } from './types'

export const initialProductLine: ProductLine = {
  description: '',
  quantity: '1',
  rate: '0.00',
}

let clientNameSaved = null;
let clientAddressSaved = null;
let clientAddress2Saved = null;
let invoiceTitleSaved = null;
let notesSaved = null;
let termSaved = null;

if (typeof window !== 'undefined') {
	clientNameSaved = localStorage.getItem("clientName");
	clientAddressSaved = localStorage.getItem("clientAddress");
	clientAddress2Saved = localStorage.getItem("clientAddress2");
	invoiceTitleSaved = localStorage.getItem("invoiceTitle");
	notesSaved = localStorage.getItem("notes");
	termSaved = localStorage.getItem("term");
} else {
	console.log('You are on the server')
	// 👉️ can't use localStorage
}

export const initialInvoice: Invoice = {
  logo: '',
  logoWidth: 300,
  title: 'INVOICE',
  companyName: '',
  name: '',
  companyAddress: '',
  companyAddress2: '',
  companyCountry: 'United States',
  billTo: 'Bill To:',
	clientName: clientNameSaved ? clientNameSaved : '',
	clientAddress: clientAddressSaved ? clientAddressSaved : '',
	clientAddress2: clientAddress2Saved ? clientAddress2Saved : '',
  clientCountry: 'United States',
  invoiceTitleLabel: 'Invoice#',
invoiceTitle: invoiceTitleSaved ? invoiceTitleSaved : '',
  invoiceDateLabel: 'Invoice Date',
  invoiceDate: '',
  invoiceDueDateLabel: 'Due Date',
  invoiceDueDate: '',
  productLineDescription: 'Item Description',
  productLineQuantity: 'Qty',
  productLineQuantityRate: 'Rate',
  productLineQuantityAmount: 'Amount',
  productLines: [
    {
      description: 'Building Services',
      quantity: '24',
      rate: '100.00',
    },
    { ...initialProductLine },
  ],
  subTotalLabel: 'Sub Total',
  taxLabel: 'GST (10%)',
  totalLabel: 'TOTAL',
  currency: '$',
  notesLabel: 'Notes',
  notes: notesSaved ? notesSaved : 'It was great doing business with you.',
  termLabel: 'Terms & Conditions',
	term: termSaved ? termSaved : 'Please make the payment by the due date.',
}
