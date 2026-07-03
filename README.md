# 🚀 Pro-Portal

> **A modern, enterprise-grade employee portal unifying communication, task management, and collaboration in one seamless platform.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3FCF8E?logo=supabase)](https://supabase.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![License](https://img.shields.io/badge/License-Educational-green)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-0070F3?logo=vercel)](https://pro-portal-ten.vercel.app)

---

## ✨ Features at a Glance

| Feature | Description |
|---------|-------------|
| 🔐 **Secure Authentication** | Supabase-powered registration, login, and session management with protected routes |
| 🏢 **Organisation Management** | Create orgs, join via keys, track memberships, and assign ownership |
| 👤 **User Profiles** | Complete profile management with personal account settings |
| ✅ **Task Management** | Create, assign, track, and monitor tasks with status updates and due dates |
| 📢 **Announcements** | Broadcast company-wide announcements with real-time visibility |
| 📊 **Interactive Dashboard** | Centralized hub for tasks, announcements, and organisation overview |

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 6
- **Styling**: Tailwind CSS 4 + CSS Modules
- **UI Library**: React 19

### Backend & Services
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Security**: Row Level Security (RLS) policies
- **Hosting**: Vercel

---

## 📁 Project Architecture

```
pro-portal/
├── app/                           # Next.js app directory
│   ├── (auth)/
│   │   ├── login/                 # Login page
│   │   └── signup/                # Registration page
│   ├── dashboard/                 # Main dashboard
│   ├── profile-settings/          # User profile management
│   ├── organisation/              # Org management
│   ├── new-organisation/          # Create new org
│   ├── task/
│   │   ├── create/                # Task creation
│   │   └── page.tsx               # Task listing
│   ├── announcement/              # Announcements
│   └── layout.tsx                 # Root layout
├── lib/
│   └── supabase.ts                # Supabase client config
├── public/
│   └── assets/                    # Static images & media
├── package.json
└── README.md
```

---

## 🗄️ Database Schema

### `user_profiles`
Stores user account information
```sql
user_id          (Primary Key, FK: auth.users)
display_name     (VARCHAR)
created_at       (TIMESTAMP)
```

### `organisation`
Company/team entities
```sql
id               (Primary Key)
owner_id         (FK: user_profiles)
name             (VARCHAR)
join_key         (VARCHAR, Unique)
created_at       (TIMESTAMP)
```

### `membership`
Organisation membership records
```sql
id               (Primary Key)
user_id          (FK: user_profiles)
organisation_id  (FK: organisation)
created_at       (TIMESTAMP)
```

### `announcement`
Company-wide broadcasts
```sql
id               (Primary Key)
organisation_id  (FK: organisation)
title            (VARCHAR)
content          (TEXT)
created_at       (TIMESTAMP)
```

### `task`
Task management records
```sql
id               (Primary Key)
assigned_user_id (FK: user_profiles)
title            (VARCHAR)
description      (TEXT)
status           (ENUM: 'Not Started' | 'In Progress' | 'Completed')
due_date         (DATE)
created_at       (TIMESTAMP)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PutraDanialzul/pro-portal.git
   cd pro-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   Get these from your [Supabase Dashboard](https://supabase.com/dashboard) → Settings → API

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 🔄 Authentication Flow

```
┌─────────────┐
│   Login     │ User enters credentials
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│ Session Created         │ Supabase Auth validates
│ (JWT in secure cookie)  │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Protected Pages         │ Route guards verify session
│ (RLS enforced)          │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Dashboard Access        │ User can access features
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Logout                  │ Session destroyed
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Redirect to /login      │ Automatic redirect
└─────────────────────────┘
```

---

## 🛣️ Route Protection

### Public Routes
- `/login` - User login
- `/signup` - User registration

### Protected Routes
- `/dashboard` - Main dashboard (requires auth)
- `/profile-settings` - User profile (requires auth)
- `/organisation/*` - All org features (requires auth + membership)
- `/task/*` - Task management (requires auth)
- `/announcement` - Announcements (requires auth)

**Unauthenticated Access**: Automatically redirected to `/login`  
**Authenticated Access to Public Routes**: Automatically redirected to `/dashboard`

---

## 📋 Task Statuses

Tasks can be in one of three states:

| Status | Description |
|--------|-------------|
| **Not Started** | Task created but work hasn't begun |
| **In Progress** | Work is actively being performed |
| **Completed** | Task finished and closed |

The system automatically detects **overdue tasks** (past due date with non-completed status).

---

## 🔒 Security Features

### ✅ Implemented
- **Supabase Authentication** - Industry-standard JWT-based auth
- **Route Protection** - Middleware guards on protected pages
- **Row Level Security (RLS)** - Database-level access control
- **Session Validation** - Real-time auth state verification
- **Secure Cookies** - HTTP-only, secure token storage

### 🔜 Recommended for Production
- [ ] Email verification for new accounts
- [ ] Password recovery mechanism
- [ ] Role-based access control (Admin, Manager, Employee)
- [ ] Activity logging and audit trails
- [ ] Rate limiting on auth endpoints
- [ ] 2FA (Two-Factor Authentication)
- [ ] Data encryption at rest

---

## 📈 Future Enhancements

### 🧑‍💼 Employee Directory
- Full employee profiles with departments
- Search and filter capabilities
- Department-based organization

### 📚 Knowledge Base
- Company policies and documentation
- Searchable content library
- Version control for documents

### 🗓️ Leave Management
- Leave request workflows
- Manager approval system
- Balance tracking and accruals

### 🛠️ Asset Management
- Equipment tracking and assignment
- Maintenance scheduling
- Asset lifecycle management

### 🤖 AI Assistant
- Smart knowledge search
- Employee support chatbot
- Document analysis and summaries

---

## 📸 User Interface

### Dashboard
- 📊 Task progress overview
- 📢 Latest company announcements
- 🧭 Quick navigation sidebar
- 🏢 Organisation information card

### Task Management
- ✏️ Create and edit tasks
- 👥 Assign to team members
- 📅 Set and track due dates
- ✅ Update task status
- 🗑️ Delete completed tasks

### Announcements
- 📝 Create announcements
- 👁️ Real-time visibility
- 🔔 Announcement counter
- 🗑️ Delete outdated posts

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is provided for **educational, academic, and demonstration purposes**. For commercial use, please contact the author.

---

## 👨‍💻 Author

**Putra Danialzulqarnain Bin Zaidi**

[GitHub](https://github.com/PutraDanialzul) | [Live Demo](https://pro-portal-ten.vercel.app)

---

## 💡 Project Vision

Pro-Portal aims to revolutionize workplace collaboration by providing a **clean, intuitive, and centralized digital workspace** that combines:
- 💬 Real-time communication
- ✅ Efficient task tracking
- 👥 Seamless employee collaboration
- 📊 Actionable insights

All in **one unified platform**.

---

<div align="center">

**Made with ❤️ by Putra Danialzul**

[Report Bug](https://github.com/PutraDanialzul/pro-portal/issues) · [Request Feature](https://github.com/PutraDanialzul/pro-portal/issues)

</div>
