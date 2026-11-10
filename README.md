# NIET Pharmacy Backend

Beginner-friendly Next.js 14 App Router API for the NIET Pharmacy website and admin dashboard. It uses MongoDB Atlas through Mongoose and JWT-based admin sessions.

## Requirements

- Node.js 20.19 or newer
- MongoDB (local or Atlas)
- Cloudinary credentials if admin image uploads are enabled

## Configure and run

1. Copy `.env.example` to `.env.local`.
2. Set `MONGODB_URI`, `MONGODB_DB_NAME=NIETPharmacy`, and `JWT_SECRET`. `JWT_SECRET` must be at least 32 characters.
3. Install dependencies with `npm install`.
4. Start the development server with `npm run dev`. The API listens on port 5000.

The production workflow is `npm run type-check`, `npm run build`, then `npm start`. The application validates environment configuration at startup; it does not use a built-in database URI or JWT secret fallback.

## Create the first admin

Create an admin using one-time environment variables. Do not put the admin password in source control or add it to `.env.local`.

PowerShell:

```powershell
$env:ADMIN_NAME = "Site Administrator"
$env:ADMIN_EMAIL = "admin@example.com"
$env:ADMIN_PASSWORD = "use-a-unique-password-of-at-least-12-characters"
npm run admin:create
Remove-Item Env:ADMIN_NAME, Env:ADMIN_EMAIL, Env:ADMIN_PASSWORD
```

The command connects to the configured MongoDB database, creates a `superadmin` account, and stores a bcrypt hash of the password. It fails if the email already exists.

## Request flow

API route handlers under `src/app/api` call the matching controller in `src/controllers`. Controllers connect through the shared MongoDB connection, check admin authentication when required, and perform database operations directly through the Mongoose models in `src/models`. Authentication helpers are in `src/lib/auth.ts`.

Successful responses include `success`, `message`, `data`, and a timestamp. Paginated endpoints also include pagination metadata. Errors use the common error response shape.

Admin login is `POST /api/auth/login`. A successful login returns an admin profile and JWT and sets an HTTP-only cookie. Protected routes accept that cookie or an `Authorization: Bearer <token>` header. `POST /api/auth/logout` clears the cookie; `GET /api/auth/me` returns the active admin profile.

## API areas

| Route | Purpose |
|---|---|
| `/api/auth` | Admin login, logout, and current session |
| `/api/courses` | Course/program listing and admin management |
| `/api/departments` | Department listing and admin management |
| `/api/faculty` | Faculty listing and admin management |
| `/api/events` | Event listing and admin management |
| `/api/notices` | Notice listing and admin management |
| `/api/committees` | Committee listing and admin management |
| `/api/accreditations` | Accreditation and approval records |
| `/api/gallery` | Gallery items |
| `/api/inquiries` | Public inquiry submission and admin processing |
| `/api/placements` | Placement records |
| `/api/research` | Research records |
| `/api/settings` | Public website settings and protected updates |
| `/api/dashboard` | Protected admin dashboard metrics |
| `/api/uploads` | Protected Cloudinary upload signatures |

Collection routes generally support `GET` and `POST`; item routes use `/[id]` and generally support `GET`, `PUT`, or `DELETE`. Check the route file for the exact methods supported by each resource.

## Deployment notes

- Provide valid environment variables in the deployment platform; never commit `.env.local` or real credentials.
- Configure MongoDB network access and credentials for the deployed application. `npm run build` does not prove that the configured database is reachable.
- Rotate credentials if they were previously exposed in a committed file.
- The built-in rate limiter stores counters in process memory. Multi-instance production deployments should use a shared rate-limit store at the hosting or infrastructure layer.
