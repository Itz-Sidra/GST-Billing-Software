# GST Billing Software

A responsive web-based portal for managing **Goods and Services Tax (GST)** services in India. This project mimics a government-like interface for educational and demonstrational purposes, offering taxpayers a clean and interactive platform for registration, GST calculation, news, downloads, and assistance.

---

## Live Preview

> _To be hosted_ 

---

## Project Structure

```

📁 GST-Billing-Software/
├── css/
│   └── All CSS files (modular per page)
├── js/
│   └── JavaScript logic (e.g., calculator, search, localStorage)
├── assets/
│   └── Government logos, icons, etc.
├── files/
│   └── PDF and DOCX resources for download
├── html/
│   └── Static pages like home, services, laws, registration etc.
└── README.md

````

---

## Features

### Core Pages
- **Home** – Introduction & overview
- **Services** – GST registration, filing, compliance, e-way bill
- **GST Law** – Collapsible details of major Acts (CGST, SGST, IGST)
- **e-Invoice** – GST calculator & preview with PDF download
- **Downloads** – Forms & documents with search filter
- **Search Taxpayer** – Mock GSTIN lookup (with hardcoded examples)
- **Taxpayer Facilities** – FAQ
- **News & Updates** – Add/delete updates with localStorage
- **Registration** – Simple form for taxpayer onboarding
- **Contact Us** – Submit queries via contact form (mock)

---

## Tech Stack

- **HTML5** – Structured and semantic content
- **CSS3** – Clean, responsive design with custom styling
- **JavaScript (Vanilla)** – Interactive features & validation
- **LocalStorage** – Persisting user-generated news updates

---

## ample GSTINs for Testing

Use the following GSTINs on the **Search Taxpayer** page:

| GSTIN             | Business Name       | State         | Status     |
|------------------|---------------------|---------------|------------|
| 22AAAAA0000A1Z5   | ABC Pvt Ltd         | Chhattisgarh  | Active     |
| 07BBBBB1111B2X3   | XYZ Enterprises     | Delhi         | Suspended  |
| 27CCCCC2222C3Y7   | LMN Traders         | Maharashtra   | Active     |
| 09DDDDD3333D4Z2   | Ram & Sons         | Uttar Prdesh   | Cancelled     |
| 19EEEEE4444E5P9   | Sunrise Retail         | West Bengal   | Active     |
| 24FFFFF5555F6X1   | Mehta Electronics         | Gujarat   | Suspended     |
| 32GGGGG6666G7L3   | Kerala Spices Co.         | Kerala   | Active     |
| 29HHHHH7777H8T5   | Karnataka Textiles         | Karnataka   | Active     |
| 36IIIII8888I9M8   | Hyderabad Steel Works        | Telengana   | Cancelled     |
| 33JJJJJ9999J0U6   | Chennai Builders         | Tamil Nadu   | Active     |

---

## Setup Instructions

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/gst-billing-software.git
   cd gst-billing-software
````

2. Open `home.html` in your browser:

   ```
   Right-click → Open with Live Server (VS Code) or simply double-click
   ```

3. Explore all linked pages through the navigation bar.

---

## Enhancements

* [ ] Add real-time GSTIN validation via API (if needed)
* [ ] PDF export of e-invoices
* [ ] Backend support for registration and contact forms (Node.js / Firebase)
* [ ] Dark mode toggle

---

## ⚠️ Disclaimer

This project is **not affiliated with the Government of India**. It is intended purely for **educational and demonstrational** purposes.

---

## 🧑‍💻 Author

**Sidra**
Frontend Web Developer | Passionate Learner
📧 [Email](mailto:sidra@example.com) | 🌐 [LinkedIn](https://www.linkedin.com/in/sidra-jahangir-6a3887320/)

---