# 🛡️ RBAC Admin Dashboard

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan)
![Prisma](https://img.shields.io/badge/Prisma-5.0-white)

> A powerful, secure, and modern **Role-Based Access Control (RBAC)** system built with Next.js 15, Prisma, and Tailwind CSS. Manage users, roles, and permissions with a beautiful, responsive interface.

---

## ✨ Features

-   **🔐 Secure Authentication**: Robust login system with JWT-based session management.
-   **👥 User Management**: Create, view, update, and delete users effortlessly.
-   **🛡️ Role Management**: Define dynamic roles (e.g., Admin, Editor, Viewer) and assign them to users.
-   **🔑 Granular Permissions**: Fine-grained control over what roles can do (`manage_users`, `manage_roles`, etc.).
-   **🎨 Modern UI/UX**: Built with Tailwind CSS for a sleek, dark-mode ready design.
-   **⚡ High Performance**: Powered by Next.js App Router and Server Actions.
-   **🛠️ Developer Ready**: Type-safe database queries with Prisma ORM.

## 🚀 Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Database**: PostgreSQL
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Auth**: Custom JWT Auth (or NextAuth.js ready)

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   Node.js 18+
-   PostgreSQL (Local or Cloud like Neon/Supabase)

### 1. Clone the Repository

```bash
git clone https://github.com/JeetuPalhub/RBAC.git
cd RBAC
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root directory and add your database URL and a secret for JWT:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/rbac?schema=public"
JWT_SECRET="your-super-secret-key-change-me"
```

### 4. Setup Database

Run migrations and seed the database with an initial Admin user and default permissions.

```bash
# Push schema to database
npx prisma migrate dev --name init

# Seed the database (Default: admin@example.com / password)
npm run prisma:seed
```

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 📦 Deployment

Easily deploy to [Vercel](https://vercel.com/):

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Add `DATABASE_URL` and `JWT_SECRET` to Environment Variables.
4.  **Deploy!** (The postinstall script handles Prisma generation automatically).

## 🔑 Default Credentials

After seeding, use these credentials to log in:

-   **Email**: `admin@example.com`
-   **Password**: `password`

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

Made with ❤️ by Jeetu Pal
