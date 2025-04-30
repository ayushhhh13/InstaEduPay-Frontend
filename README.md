# InstaEduPay – Frontend

🔗 **Live App:** [https://insta-edu-pay-frontend-41wdxiyeo.vercel.app](https://insta-edu-pay-frontend-41wdxiyeo.vercel.app)

📂 **GitHub Repo:** [your-github-repo-link](https://github.com/ayushhhh13/insta-edu-pay-frontend)

This project is the frontend module of the **School Payments and Dashboard System**, developed using **Next.js** and styled with **Tailwind CSS**. It interfaces with a secure backend to visualize, filter, and manage transaction data efficiently.

---

## 🎯 Objective

Develop a **responsive and user-friendly** interface for school administrators to:
- Monitor and search payment transactions.
- Check individual transaction statuses.
- View school-specific transaction summaries.
- Navigate efficiently with persistent filters and shareable URLs.

---

## 🔧 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **API Handling**: [Axios](https://axios-http.com/)
- **Routing**: Next.js Routing
- **Hosting**: [Vercel](https://vercel.com/)
- **Data Visualization**: Recharts / Chart.js
- **Auth & State**: JWT-based

---

## 🚀 Project Setup

```bash
# Clone the repository
git clone https://github.com/your-username/insta-edu-pay-frontend.git
cd insta-edu-pay-frontend

# Install dependencies
npm install

# Run locally
npm run dev

Backend URL Link:
NEXT_PUBLIC_API_BASE_URL=https://instaedupay.onrender.com
```

## Folder Structure

├── .gitignore
├── README.md
├── app
    ├── auth
    │   ├── login
    │   │   └── page.tsx
    │   └── register
    │   │   └── page.tsx
    ├── dashboard
    │   ├── create-payment
    │   │   └── page.tsx
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── payment-callback
    │   │   ├── loading.tsx
    │   │   └── page.tsx
    │   ├── schools
    │   │   ├── loading.tsx
    │   │   └── page.tsx
    │   ├── transaction-status
    │   │   ├── loading.tsx
    │   │   └── page.tsx
    │   ├── transactions-by-school
    │   │   ├── loading.tsx
    │   │   └── page.tsx
    │   └── transactions
    │   │   ├── loading.tsx
    │   │   └── page.tsx
    ├── globals.css
    ├── layout.tsx
    └── page.tsx
├── components.json
├── components
    ├── date-picker.tsx
    ├── theme-provider.tsx
    └── ui
    │   ├── accordion.tsx
    │   ├── alert-dialog.tsx
    │   ├── alert.tsx
    │   ├── aspect-ratio.tsx
    │   ├── avatar.tsx
    │   ├── badge.tsx
    │   ├── breadcrumb.tsx
    │   ├── button.tsx
    │   ├── calendar.tsx
    │   ├── card.tsx
    │   ├── carousel.tsx
    │   ├── chart.tsx
    │   ├── checkbox.tsx
    │   ├── collapsible.tsx
    │   ├── command.tsx
    │   ├── context-menu.tsx
    │   ├── dialog.tsx
    │   ├── drawer.tsx
    │   ├── dropdown-menu.tsx
    │   ├── form.tsx
    │   ├── hover-card.tsx
    │   ├── input-otp.tsx
    │   ├── input.tsx
    │   ├── label.tsx
    │   ├── menubar.tsx
    │   ├── navigation-menu.tsx
    │   ├── pagination.tsx
    │   ├── popover.tsx
    │   ├── progress.tsx
    │   ├── radio-group.tsx
    │   ├── resizable.tsx
    │   ├── scroll-area.tsx
    │   ├── select.tsx
    │   ├── separator.tsx
    │   ├── sheet.tsx
    │   ├── sidebar.tsx
    │   ├── skeleton.tsx
    │   ├── slider.tsx
    │   ├── sonner.tsx
    │   ├── switch.tsx
    │   ├── table.tsx
    │   ├── tabs.tsx
    │   ├── textarea.tsx
    │   ├── toast.tsx
    │   ├── toaster.tsx
    │   ├── toggle-group.tsx
    │   ├── toggle.tsx
    │   ├── tooltip.tsx
    │   ├── use-mobile.tsx
    │   └── use-toast.ts
├── hooks
    ├── use-mobile.tsx
    └── use-toast.ts
├── lib
    ├── services
    │   ├── auth-service.ts
    │   ├── payment-service.ts
    │   └── transaction-service.ts
    └── utils.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── public
    ├── placeholder-logo.png
    ├── placeholder-logo.svg
    ├── placeholder-user.jpg
    ├── placeholder.jpg
    └── placeholder.svg
├── styles
    └── globals.css
├── tailwind.config.ts
└── tsconfig.json

### ✅ Core Features

- 🔍 **Transactions Overview Page**
  - Paginated and searchable table of all transactions.
  - Multi-select filters for `status`, `school_id`, and `date`.
  - Sortable columns (ascending/descending).
  - Filters persist in the URL (shareable views).

- 🏫 **Transactions by School**
  - View transaction data filtered by `school_id`.
  - Dropdown/search-based school selection.
  - Dedicated route for each school view.

- 📌 **Transaction Status Checker**
  - Input `custom_order_id` to check live transaction status.
  - API: `/check-status?custom_order_id=...`

### 🎨 UI & UX Enhancements

- 🌓 **Dark Mode / Light Mode Toggle**
  - Clean UI switch to toggle themes.
  - Theme persists on refresh via localStorage.

- 📊 **Real-Time Data Visualizations**
  - Dynamic charts using `Recharts` or `Chart.js`:
    - Line graph: transaction volume over time.
    - Pie chart: status distribution (Success, Pending, Failed).
    - Bar chart: school-wise collection summary.

- 📱 **Responsive Design**
  - Fully responsive across mobile, tablet, and desktop.
  - Smooth navigation using Next.js routing.

---
### Screenshots
Register Page
<img width="1470" alt="Screenshot 2025-04-30 at 3 34 42 PM" src="https://github.com/user-attachments/assets/e5f92980-043a-46cf-91f2-c787911b5c45" />

Sign-In Page:
<img width="1468" alt="Screenshot 2025-04-30 at 3 35 54 PM" src="https://github.com/user-attachments/assets/5927dfb7-91a4-46a8-a1f5-7f2efe908678" />

Dashboard Tab: 
<img width="1470" alt="Screenshot 2025-04-30 at 3 37 49 PM" src="https://github.com/user-attachments/assets/dd928a20-c84f-4f5a-a23b-d38741a7cec5" />

Transaction Tab:
<img width="1470" alt="Screenshot 2025-04-30 at 3 38 40 PM" src="https://github.com/user-attachments/assets/4a1b84f1-5a33-4498-bc3a-cb1098af47e3" />
<img width="1193" alt="Screenshot 2025-04-30 at 3 39 44 PM" src="https://github.com/user-attachments/assets/bc3855b2-bba3-45e5-9dd9-a3da80f3e07e" />
<img width="1470" alt="Screenshot 2025-04-30 at 3 40 14 PM" src="https://github.com/user-attachments/assets/bddd60ab-8148-44b4-80f6-6247cb6ef3b8" />

School Transactions Tab:
<img width="1470" alt="Screenshot 2025-04-30 at 3 40 44 PM" src="https://github.com/user-attachments/assets/8c3f43b8-b95b-4fde-b408-7c4e07605812" />
<img width="1470" alt="Screenshot 2025-04-30 at 3 41 27 PM" src="https://github.com/user-attachments/assets/23f4a8cb-339a-405d-960c-9328fea30cd3" />

Create Payment Tab:
<img width="1470" alt="Screenshot 2025-04-30 at 3 42 01 PM" src="https://github.com/user-attachments/assets/a9234e73-f1e7-41b9-9d32-b7e27af1ac06" />
<img width="1470" alt="Screenshot 2025-04-30 at 3 42 58 PM" src="https://github.com/user-attachments/assets/f11af004-0539-487f-b036-5b83558f948e" />

Redirecting to Edviron Payments Page:
<img width="1470" alt="Screenshot 2025-04-30 at 3 43 43 PM" src="https://github.com/user-attachments/assets/9dc6eee3-4dae-4029-a401-5dfa3ca76111" />

Payments Page by Simulator cashfree:
<img width="1470" alt="Screenshot 2025-04-30 at 3 44 46 PM" src="https://github.com/user-attachments/assets/d26e5ca1-c317-4f15-8f7a-8a3aa8065acb" />

Redirected back to InstaEduPay Payments Page:
<img width="1469" alt="Screenshot 2025-04-30 at 3 45 53 PM" src="https://github.com/user-attachments/assets/1fda3e05-76d7-4b2a-97f5-004e84f0d4f4" />

Check Status tab:
<img width="1470" alt="Screenshot 2025-04-30 at 3 47 01 PM" src="https://github.com/user-attachments/assets/843ae8ec-3d25-4292-9e85-e7beb21e332e" />
<img width="1468" alt="Screenshot 2025-04-30 at 3 47 42 PM" src="https://github.com/user-attachments/assets/6dd74cec-2198-4879-af0d-15fa246fec9f" />

Dark Mode:
<img width="1470" alt="Screenshot 2025-04-30 at 3 48 16 PM" src="https://github.com/user-attachments/assets/0f1fab16-4f5a-40e8-8af3-4389f8d931ae" />
<img width="1470" alt="Screenshot 2025-04-30 at 3 48 43 PM" src="https://github.com/user-attachments/assets/c1139cf5-f545-4df7-8b2e-625e67ffc7cd" />
<img width="1470" alt="Screenshot 2025-04-30 at 3 49 09 PM" src="https://github.com/user-attachments/assets/41b6f7f7-9c4b-4fad-8496-eab17ea072fc" />
<img width="1470" alt="Screenshot 2025-04-30 at 3 49 41 PM" src="https://github.com/user-attachments/assets/19b96080-9745-4c53-a92d-815c6a906bea" />

Sorting Option For Transaction Amounts(Ascending and Descending) :
<img width="1470" alt="Screenshot 2025-04-30 at 3 50 11 PM" src="https://github.com/user-attachments/assets/3d810837-87cb-43a1-b5f1-314518b08742" />

Real-time Data Visualisation:
<img width="1470" alt="Screenshot 2025-04-30 at 3 51 29 PM" src="https://github.com/user-attachments/assets/ab86e093-1b82-4c47-9c43-7f0e0c0e4257" />

### 🌐 Hosting & Deployment
- Platform: Vercel
- Live App: https://insta-edu-pay-frontend-41wdxiyeo.vercel.app

### 📄 License
This project is licensed under the MIT License.





