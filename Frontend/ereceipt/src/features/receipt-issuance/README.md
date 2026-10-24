# Receipt Issuance Feature (`receipt-issuance`)

This directory contains the complete implementation for the **Receipt Issuance** feature of the **eReceipt** web application. It handles capturing transactions, computing statutory taxes, validating taxpayer identities, and simulating real-time clearance with the Ethiopian Ministry of Revenues (MoR) Electronic Invoice Management System (EIMS).

---

## 📂 Folder Structure

```
Frontend/ereceipt/src/features/receipt-issuance/
├── components/
│   ├── DocumentClassificationCard.tsx       # Document type (VAT invoice, cash, credit/debit) & transaction mode
│   ├── DocumentClassificationCard.module.css
│   ├── BuyerDetailsCard.tsx                 # Buyer TIN, Fayda FIN, phone, and Designated Agent flag
│   ├── BuyerDetailsCard.module.css
│   ├── TaxLineItemsTable.tsx                # Dynamic item table with VAT, excise, discounts, and footer summary
│   ├── TaxLineItemsTable.module.css
│   ├── PaymentWithholdingCard.tsx           # Payment methods and statutory 2% withholding threshold check
│   ├── PaymentWithholdingCard.module.css
│   ├── ClearanceSummaryCard.tsx             # Financial summary card and submit clearance button
│   ├── ClearanceSummaryCard.module.css
│   ├── IssuedReceiptModal.tsx               # Official cleared invoice modal with verification QR and thermal print
│   └── IssuedReceiptModal.module.css
├── ReceiptIssuance.tsx                      # Master feature container wrapped in DashboardLayout
├── ReceiptIssuance.module.css               # Page headers and layout styling
├── types.ts                                 # Shared TypeScript models, products catalog, and math helpers
├── index.ts                                 # Barrel exports for easy importing
└── README.md                                # This documentation file
```

---

## 🧮 Tax & Calculation Rules

The calculations in this feature follow the statutory tax formulas specified in the project requirements:

1. **Net Line Amount**:
   $$\text{Net Amount} = (\text{Unit Price} \times \text{Quantity}) - \text{Discount}$$

2. **Line Excise Tax**:
   $$\text{Excise Tax} = \text{Net Amount} \times \left(\frac{\text{Excise Rate}}{100}\right)$$

3. **Standard VAT (15%)**:
   $$\text{VAT} = (\text{Net Amount} + \text{Excise Tax}) \times 0.15$$
   *(Zero-Rated and Exempt items produce 0% VAT)*

4. **Withholding Tax (2%)**:
   - Only eligible if **Transaction Mode** is `B2B` AND **Goods Subtotal > 10,000 ETB** OR **Services Subtotal > 3,000 ETB**.
   - Requires buyer to be flagged as a **Designated Withholding Agent**.
   $$\text{Withholding Tax} = \text{Subtotal} \times 0.02$$

5. **Grand Total**:
   $$\text{Grand Total} = \text{Subtotal} + \text{Excise Tax} + \text{VAT} - \text{Withholding Tax}$$

6. **Customer Identification Rules**:
   - **B2B / Registered Buyer**: Requires registered legal business name and 10-digit TIN.
   - **B2C / Walk-in Customer**: Buyer TIN and Ethiopian National ID (Fayda FIN) are completely optional, including for high-value sales.

---

## ⚡ Quick Test Scenarios

The user interface provides quick-test preset buttons above the form:
- **B2B Wholesale Sample**: Pre-populates registered buyer "Hana Trading PLC", valid 10-digit TIN, CBE bank transfer, and qualifying withholding items.
- **Retail Walk-in Sample**: Pre-populates a walk-in retail customer paying cash with optional TIN and optional Fayda FIN.

