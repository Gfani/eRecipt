# eReceipt — Digital Receipt Management System

**eReceipt** is a digital receipt management system designed to modernize receipt issuance, improve transaction transparency, and simplify merchant registration and tax administration. The platform aims to reduce reliance on paper receipts while making receipts easier to access, verify, and manage.

## Team Members

Add the names of the project members below.

| No. | Full Name | Role / Responsibility |
|---:|---|---|
| 1 | *Fanuel Goitom* | *Add role* |
| 2 | *Fiema Yaregal* | *Add role* |
| 3 | *Fikirte Gebretsadik* | *Add role* |
| 4 | *Fuad Aman* | *Add role* |
| 5 | *Gelila Sintayehu* | *Add role* |
| 6 | *Gemechu Teso* | *Add role* |

## Overview

eReceipt provides a platform where merchants can manage their businesses and issue digital receipts, while authorized tax administrators (Gebiwoch) review merchant registrations and oversee compliance-related activities.

The system has two primary interfaces:

- **Merchant Portal:** For business registration, receipt issuance, and transaction management.
- **Admin Portal:** For reviewing merchant applications, managing merchant accounts, and overseeing receipt-related activities.

## Objectives

- Digitize the receipt issuance and management process.
- Reduce paper-based receipt handling and recordkeeping.
- Make receipts easier to verify using QR codes.
- Enable tax administrators to review and approve merchant registrations.
- Improve transaction traceability and record management.
- Support more transparent and efficient tax administration.

## Core Features

### 1. Merchant Portal

- Merchant registration and authentication.
- Business profile and tax identification number (TIN) management.
- Digital receipt creation and issuance.
- Transaction and receipt history.
- QR-code-based receipt verification.
- Receipt status tracking, including voided receipts where applicable.
- Access to business and transaction records.

### 2. Admin Portal

- Secure administrator login.
- Dashboard displaying merchant registration and approval statistics.
- List of pending merchant applications.
- Merchant information and submitted-document review.
- Merchant application approval or rejection.
- Rejection reasons and application status management.
- Merchant account management.
- Receipt oversight and verification support.

### 3. Digital Receipt Management

- Generate digital receipts for completed transactions.
- Assign a unique identifier to each receipt.
- Generate QR codes for receipt verification.
- Store and retrieve receipt records.
- Display receipt details, including merchant information, items, quantities, totals, and applicable taxes.
- Track receipt status and retain appropriate records of voided receipts.

### 4. Receipt Verification

Customers and authorized users should be able to scan a receipt's QR code to verify its authenticity.

The verification page is intended to display relevant receipt information, such as:

- Receipt number.
- Merchant name and identification details.
- Transaction date and time.
- Total transaction amount.
- Applicable tax amount.
- Current receipt status.

Verification should retrieve information from the system rather than relying solely on information encoded in the QR code.

## System Workflow

### Merchant Registration and Approval

1. A merchant creates an account and submits the required business information.
2. The application is stored with a pending status.
3. An authorized tax administrator signs in to the admin portal.
4. The administrator reviews the merchant's information and supporting documents.
5. The administrator approves the application or rejects it with a reason.
6. The merchant can view the updated application status.
7. Approved merchants gain access to the receipt issuance features permitted by the system.

### Receipt Issuance and Verification

1. An approved merchant records a transaction.
2. The system calculates the transaction total and applicable taxes according to the configured tax rules.
3. The system generates a unique digital receipt and its QR code.
4. The receipt is stored and made available to authorized users.
5. A customer or authorized user scans the QR code.
6. The system retrieves the receipt record and displays its current status and relevant details.

## User Roles

| Role | Responsibilities |
|---|---|
| Merchant | Register a business, manage permitted business information, issue receipts, and view transaction history. |
| Tax Administrator (Gebiwoch) | Review merchant applications, manage merchant approval status, and oversee relevant receipt records. |
| Customer / Receipt Verifier | Scan QR codes and verify receipt information and status. |

Access to administrative operations must be restricted to authorized users.

## Docker Deployment

The entire eReceipt platform is fully containerized with **Docker** and **Docker Compose**, orchestrating PostgreSQL, the Express API backend, and the Nginx-powered React SPA frontend.

### Architecture Overview

```
                      ┌──────────────────────────────────────────────┐
                      │              Docker Host                     │
                      │                                              │
                      │   ┌──────────────────────────────────────┐   │
   Browser :80 / :5173│──▶│  Frontend Container (Nginx + React)  │   │
                      │   └──────────────────┬───────────────────┘   │
                      │                      │ /api/ reverse proxy   │
                      │                      ▼                       │
                      │   ┌──────────────────────────────────────┐   │
   API Client :5000   │──▶│      Backend Container (Express)     │   │
                      │   └──────────────────┬───────────────────┘   │
                      │                      │ SQL connection        │
                      │                      ▼                       │
                      │   ┌──────────────────────────────────────┐   │
   PostgreSQL :5432   │──▶│      PostgreSQL 16 Database          │   │
                      │   │  (Auto-initialized Schema & Seed)    │   │
                      │   └──────────────────────────────────────┘   │
                      └──────────────────────────────────────────────┘
```

### Quick Start with Docker Compose

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gelila0913/eReceipt.git
   cd eReceipt
   ```

2. **Configure environment variables (optional):**
   ```bash
   cp .env.docker.example .env
   ```

3. **Build and start all services:**
   ```bash
   docker compose up --build -d
   ```

4. **Access the application:**
   - **Frontend (Web Application):** [http://localhost](http://localhost) or [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)
   - **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
   - **PostgreSQL Database:** `localhost:5432` (`db: ereceipt`, `user: postgres`, `pass: postgres`)

5. **Stop containers:**
   ```bash
   docker compose down
   ```
   *(To wipe database volumes and re-seed from scratch, use `docker compose down -v`)*

---

## Technology Stack

The following technologies should be updated to reflect the tools actually selected and configured in the repository.

- **UI/UX Design:** Figma
- **Frontend:** *Add technology*
- **Backend:** *Add technology*
- **Database:** *Add technology*
- **Authentication:** Secure role-based authentication
- **QR Code:** QR generation and server-side receipt verification
- **Version Control:** Git and GitHub

## Security and Data Integrity

The system should follow security practices appropriate for a receipt and tax administration platform:

- Secure authentication and authorization.
- Role-based access control for merchants and administrators.
- Server-side validation of transaction and receipt data.
- Secure storage and handling of business information.
- Unique receipt identifiers and reliable QR-code verification.
- Audit records for sensitive administrative actions.
- Protection against unauthorized receipt modification and duplicate issuance.
- Appropriate handling of voided receipts, preserving the original record and its status history.

## Project Status

**Current focus:** UI/UX design and implementation planning.

The merchant interface is being designed in Figma, with the administrator interface planned as a separate set of screens within the same design project. Development will connect the interfaces to a shared backend and database.

Planned development milestones:

- [x] Establish the project concept and core requirements.
- [x] Begin merchant-side UI/UX design in Figma.
- [ ] Design the admin login and dashboard.
- [ ] Design merchant application review and approval screens.
- [ ] Implement authentication and role-based access control.
- [ ] Implement merchant registration and approval workflows.
- [ ] Implement digital receipt generation and storage.
- [ ] Implement QR-code-based receipt verification.
- [ ] Test security, validation, and end-to-end workflows.
- [ ] Deploy the application.

*The checklist describes project progress and planned work; it does not imply that unfinished features are implemented.*

## Future Improvements

Potential future enhancements include:

- Analytics and reporting dashboards.
- Advanced receipt search and filtering.
- Merchant performance and transaction summaries.
- Downloadable digital receipts.
- Notifications for application status changes.
- Integration with authorized tax administration systems, subject to approval and API availability.
- Additional fraud-detection and transaction-monitoring capabilities.

## Contributing

Contributions should follow the repository's development workflow.

1. Fork or clone the repository.
2. Create a feature branch.
3. Make changes and test them locally.
4. Commit changes with clear messages.
5. Open a pull request for review.

Changes to protected branches should go through the configured review and approval process.

## License

The project's license has not yet been specified. A license should be added once the project owner determines the terms under which the source code may be used, modified, and distributed.

---

**eReceipt — Making digital receipts easier to issue, manage, and verify.**
