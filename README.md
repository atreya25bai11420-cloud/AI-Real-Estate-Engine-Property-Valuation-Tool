# 🏢 SqFtSense

**SqFtSense** is a production-grade, responsive PropTech SaaS that provides real-time real estate property valuation across Indian pincodes using dynamic dataset parsing, proximity matching, and interactive reporting.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React--Vite-61DAFB.svg)
![Node.js](https://img.shields.io/badge/Backend-Node.js--Express-339933.svg)

---

## 🌟 Key Features

* **Live CSV Ingestion**: Direct parsing of `database/market_data.csv` with header auto-detection and fallback rate logic.
* **Smart Pincode Matching**: Exact pincode lookup with nearest-neighbor numeric matching when invalid or missing codes are queried.
* **Real-Time Reactivity**: Instant property value recalculation as area slider parameters change.
* **PDF Valuation Export**: Browser-native print styles formatted for downloading clean PDF valuation reports.
* **Adaptive Theme Engine**: Dynamic dark/light mode UI toggle for day and night viewing.
* **Normalized Data Heuristics**: Automatic parsing and standardizing of total prices, lakhs/crores, and per-sq.ft. rates.

---

## 🛠️ Tech Stack

* **Frontend**: React, Vite, CSS
* **Backend**: Node.js, Express.js, CORS, Node `fs`
* **Dataset**: CSV (`database/market_data.csv`)

---

## 📁 Project Architecture

```text
ai-property-intelligence/
├── database/
│   └── market_data.csv     # Central property market dataset
├── backend/
│   ├── server.js           # Node/Express API engine
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # React UI & PDF export logic
│   │   └── main.jsx
│   └── package.json
├── report/                 # Generated report exports
├── .gitignore
└── README.md
🚀 Getting Started
1. Start Backend Server
Bash
cd backend
npm install
node server.js
Server runs on http://localhost:5000

2. Start Frontend Application
Bash
cd frontend
npm install
npm run dev
App runs on http://localhost:5173

📊 Dataset Schema (database/market_data.csv)
Code snippet
ZipCode,City,PricePerSqFt,MedianSalePrice,Inventory
560001,Bengaluru (Karnataka),16500,19800000,320
400001,Mumbai South (Maharashtra),52000,62400000,90
530001,Visakhapatnam (Andhra Pradesh),7500,9000000,120
📜 License
This project is licensed under the MIT License.
'@ | Set-Content -Path 'README.md' -Encoding utf8
