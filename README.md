# Pro-Portal

A modern company portal designed to centralize organisational communication, task management, employee collaboration, and company resources in a single platform.

Built with **Next.js**, **React**, **TypeScript**, and **Supabase**.

---

## Features

### Authentication

- Secure user registration
- Secure user login
- Session management with Supabase Auth
- Protected routes
- Automatic login redirects
- Logout functionality

### Organisation Management

- Create organisations
- Join organisations using organisation keys
- Membership tracking
- Organisation ownership support

### User Profiles

- Profile creation
- Profile updates
- Personal account settings

### Task Management

- Create tasks
- Assign tasks to users
- Update task status
- Track due dates
- View task progress
- Delete tasks
- Overdue task detection

### Announcements

- Create announcements
- View organisation announcements
- Delete announcements
- Announcement count dashboard

### Dashboard

- Quick navigation
- Organisation overview
- Task overview
- Company announcements

---

## Tech Stack

### Frontend

- Next.js 15
- React
- TypeScript
- CSS Modules

### Backend

- Supabase

### Services

- Supabase Authentication
- Supabase Database
- Supabase Row Level Security (RLS)

---

## Project Structure

```text
app
├── dashboard
├── login
├── signup
├── profile-settings
├── organisation
├── new-organisation
├── task
│   ├── create
│   └── page.tsx
├── announcement
└── layout.tsx

lib
└── supabase.ts

public
└── assets
```

---

## Database Structure

### user_profiles

```text
user_id (PK)
display_name
created_at
```

### organisation

```text
id (PK)
owner_id
name
join_key
created_at
```

### membership

```text
id (PK)
user_id
organisation_id
created_at
```

### announcement

```text
id (PK)
organisation_id
title
content
created_at
```

### task

```text
id (PK)
assigned_user_id
title
description
status
due_date
created_at
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/pro-portal.git
```

Navigate into the project:

```bash
cd pro-portal
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Environment Variables

Create:

```env
.env.local
```

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## Authentication Flow

```text
Login
    ↓
Session Created
    ↓
Protected Pages
    ↓
Dashboard
    ↓
Logout
    ↓
Session Removed
    ↓
Redirect To Login
```

---

## Route Protection

Unauthenticated users are redirected to:

```text
/login
```

Authenticated users are redirected away from:

```text
/login
/signup
```

and sent to:

```text
/dashboard
```

---

## Task Statuses

Supported statuses:

```text
Not Started
In Progress
Completed
```

---

## Security

### Implemented

- Supabase Authentication
- Route Protection
- Row Level Security (RLS)
- User Session Validation

### Recommended

- Email Verification
- Password Recovery
- Organisation Role Permissions
- Activity Logging

---

## Future Improvements

### Employee Directory

```text
Employee Profiles
Department Listings
Search Employees
```

### Knowledge Base

```text
Company Policies
Documentation
Search Functionality
```

### Leave Management

```text
Leave Requests
Approvals
Leave Balance Tracking
```

### Asset Management

```text
Equipment Tracking
Asset Assignment
Maintenance Records
```

### AI Assistant

```text
Knowledge Search
Employee Support
Document Assistance
```

---

## Screenshots

### Dashboard

- Task overview
- Announcements
- Navigation sidebar
- Organisation information

### Task Management

- Task listing
- Status updates
- Due date tracking
- Task deletion

---

## Contributors

### Syntax Terror

Developed as part of the Pro-Portal project.

---

## License

This project is intended for educational, academic, and demonstration purposes.

---

## Author

**Putra Danialzulqarnain Bin Zaidi**

Pro-Portal aims to provide a clean and centralized digital workspace for organisations by combining communication, task tracking, and employee collaboration into one platform.
