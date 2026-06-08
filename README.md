# 🔐 RBAC — Role-Based Access Control Admin

> A production-ready full-stack RBAC system with a Next.js admin dashboard. Manage users, roles, and permissions, with every protected API route guarded by Edge-runtime JWT middleware.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

🔗 **Live:** [rbac-kappa-lac.vercel.app](https://rbac-kappa-lac.vercel.app)

---

## 📸 Screenshots

| Landing | Login |
|---------|-------|
| ![Landing](screenshots/home.png) | ![Login](screenshots/login.png) |

| Dashboard | Users |
|-----------|-------|
| ![Dashboard](screenshots/dashboard.png) | ![Users](screenshots/users.png) |

---

## ✨ Features

- 👤 **User management** — create users, view, assign/revoke roles
- 🎭 **Role management** — create roles and attach permissions to them
- 🔑 **Permission management** — granular, named permissions (`manage_users`, etc.)
- 🔒 **Protected APIs** — Edge middleware verifies a JWT on every `/api/*` route
- 🛡️ **JWT auth** — login issues a signed token, stored client-side
- 📊 **Admin dashboard** — live counts of users, roles and permissions
- 🌱 **Seed script** — bootstraps an Admin user, role, and core permissions

---

## 🗄️ Data Model (Prisma)

```
User ──< UserRole >── Role ──< RolePermission >── Permission
```

- `User` — id, email, password (bcrypt), createdAt
- `Role` — id, name
- `Permission` — id, name, description
- `UserRole` / `RolePermission` — many-to-many join tables

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | Public | Create a user |
| POST | `/api/auth/login` | Public | Login → JWT |
| GET | `/api/users` | 🔒 | List users (with roles) |
| GET/PATCH/DELETE | `/api/users/[id]` | 🔒 | Manage a user |
| POST | `/api/users/[id]/roles` | 🔒 | Assign roles to a user |
| GET/POST | `/api/roles` | 🔒 | List / create roles |
| GET/PATCH/DELETE | `/api/roles/[id]` | 🔒 | Manage a role |
| POST | `/api/roles/[id]/permissions` | 🔒 | Attach permissions to a role |
| GET/POST | `/api/permissions` | 🔒 | List / create permissions |
| GET/PATCH/DELETE | `/api/permissions/[id]` | 🔒 | Manage a permission |

> 🔒 routes require an `Authorization: Bearer <token>` header. Verification runs
> in `middleware.ts` on the **Edge runtime** using [`jose`](https://github.com/panva/jose)
> (the Node `jsonwebtoken` library does not run on the Edge).

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT (`jsonwebtoken` to sign, `jose` to verify on Edge) |
| Hashing | bcrypt |
| Styling | Tailwind CSS |

---

## 🚀 Local Setup

```bash
git clone https://github.com/jeetupal31/RBAC.git
cd RBAC
npm install

cp .env.example .env   # set DATABASE_URL and JWT_SECRET

# Set up the database
npx prisma generate
npx prisma migrate deploy
npx prisma db seed     # creates admin@example.com / password

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with the seeded
admin credentials.

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/rbac?schema=public"
JWT_SECRET="your_jwt_secret"
```

---

## 👨‍💻 Author

**Jeetu Pal** · [github.com/jeetupal31](https://github.com/jeetupal31)

## 📄 License

MIT
