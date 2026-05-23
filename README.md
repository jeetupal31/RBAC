# RBAC — Role-Based Access Control

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000?style=flat-square&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

> A production-ready Role-Based Access Control system — users are assigned roles (admin, moderator, user), and every API route is protected by a permission-checking middleware.

## Features

- 👤 **User management** — register, login, view profile
- 🎭 **Role system** — `admin` / `moderator` / `user` with distinct permission sets
- 🔒 **Route-level protection** — middleware guards every endpoint by required role
- 🛡️ **JWT auth** — stateless token-based sessions, refresh token support
- 🔑 **Permission matrix** — granular `can(action, resource)` checks
- 📋 **Admin panel routes** — user listing, role assignment (admin only)

## Role Permissions

| Action | User | Moderator | Admin |
|--------|------|-----------|-------|
| Read own profile | ✅ | ✅ | ✅ |
| Update own profile | ✅ | ✅ | ✅ |
| Read all users | ❌ | ✅ | ✅ |
| Delete users | ❌ | ❌ | ✅ |
| Assign roles | ❌ | ❌ | ✅ |
| Moderate content | ❌ | ✅ | ✅ |

## Architecture

```
Request
   │
JWT Middleware  (verify token → attach user)
   │
Role Middleware (check user.role against required role)
   │
Controller      (business logic)
```

## Tech Stack

| Layer | Tech |
|-------|------|
| Runtime | Node.js, TypeScript |
| Framework | Express 5 |
| Auth | JWT (access + refresh tokens) |
| Hashing | bcrypt |
| Validation | Zod |

## API Endpoints

```
POST   /auth/register          Public
POST   /auth/login             Public
GET    /auth/refresh           Public

GET    /user/profile           User+
PATCH  /user/profile           User+

GET    /admin/users            Admin only
PATCH  /admin/users/:id/role   Admin only
DELETE /admin/users/:id        Admin only

GET    /mod/content            Moderator+
```

## Local Setup

```bash
git clone https://github.com/jeetupal31/RBAC.git
cd RBAC
npm install
cp .env.example .env   # JWT_SECRET, DATABASE_URL
npm run dev
```

---

Made by [Jeetu Pal](https://github.com/jeetupal31)
