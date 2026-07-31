# 🧰 Tool Lending Library — Backend

## 🔧 Overview
This backend powers the Tool Lending Library application, providing API endpoints, database operations, authentication, and integration with Supabase.

---

## 🗂️ Folder Structure

backend/
│
├── server.js                # 🔧 Express server entry point
├── routes/                  # 🛠️ API route definitions
├── controllers/             # ⚙️ Business logic
├── db/
│   ├── pool.js              # 🔧 Database connection
│   └── prisma/              # 🗄️ Prisma schema + migrations
├── middleware/              # 🪛 Auth + validation
├── utils/                   # 🧰 Helper functions
├── .env.example             # 📦 Environment template
└── README.md                # 📝 Backend documentation



---

## ⚙️ Technologies
- Node.js + Express  
- Supabase (PostgreSQL)  
- Prisma ORM  
- dotenv  
- nodemon  

---

## 🛠️ Setup Instructions
1. Clone the repository  
2. Navigate to `/backend`  
3. Install dependencies  
4. Add `.env` variables  
5. Run the dev server  

---

## 🔨 API Endpoints (expand for each new build)
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/tools` | Fetch all tools |
| POST | `/tools` | Add a new tool |
| PUT | `/tools/:id` | Update tool details |
| DELETE | `/tools/:id` | Remove a tool |

---

## 🗒️ Notes
Backend progress aligns with the Capstone Project task list stored in shared Google Doc. Tracking tasks will be updated in README as backend features evolve.

