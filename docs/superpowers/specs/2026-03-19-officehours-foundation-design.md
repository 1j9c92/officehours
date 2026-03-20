# OfficeHours — Sub-project 1: Foundation Design Spec

**Date:** 2026-03-19
**Status:** Approved
**Sub-project:** 1 of 6 — Foundation
**Covers:** Project scaffold, auth, user profiles, database schema, admin approval flow

---

## Overview

OfficeHours is a mentorship marketplace connecting mid-career and senior tech professionals (mentors) with early-career people and career pivoters (mentees). Mentees pay for 30-minute video sessions. The platform takes a 20–25% cut; mentors are paid out via Stripe Connect after sessions complete.

This spec covers Sub-project 1 only: the foundation layer that all subsequent sub-projects build on.

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS | Standard modern stack; fastest feedback loop; most tutorials available |
| Backend | Supabase | Postgres DB, auth, storage, edge functions — no server to manage |
| Auth | Supabase Auth (email/password) | Built-in; social login deferred to later phase |
| Hosting | Vercel | Free tier; connects to GitHub; auto-deploys on push |
| PWA | Vite PWA plugin | Installable on iOS home screen |

---

## Visual Design

**Theme:** Warm Human

| Token | Value |
|---|---|
| Background | `#FCF4E9` (warm cream) |
| Text primary | `#282725` |
| Text secondary | `#8a7060` |
| Text muted | `#a09080` |
| Border | `#e8ddd0` / `#d4c0aa` |
| CTA / accent | `#F6544A` (coral-red) |
| Success | `#2E7D32` |
| Card background | `#ffffff` |
| Heading font | Georgia, serif |
| Body font | system-ui, sans-serif |
| Border radius | 8–12px (rounded, not pill) |

---

## Project Structure

```
officehours/
├── public/
├── src/
│   ├── components/
│   │   ├── Layout.jsx           # Nav + footer wrapper
│   │   ├── ProtectedRoute.jsx   # Redirects unauthenticated users
│   │   └── RoleGate.jsx         # Shows content by role
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx           # Email/password + role selection
│   │   ├── Dashboard.jsx        # Role-aware post-login home
│   │   ├── MentorProfile.jsx    # Mentor fills out profile
│   │   ├── MenteeProfile.jsx    # Mentee fills out profile
│   │   └── AdminApproval.jsx    # Admin reviews mentor applications
│   ├── lib/
│   │   └── supabase.js          # Supabase client
│   ├── context/
│   │   └── AuthContext.jsx      # Logged-in user state
│   ├── App.jsx                  # Route definitions
│   └── main.jsx
├── supabase/
│   └── migrations/              # SQL schema files
├── docs/
│   └── superpowers/specs/
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## Database Schema

All tables live in Supabase (Postgres). Supabase manages `auth.users` automatically.

### `profiles`
Extends `auth.users` with app-level fields. One row per user. `id` equals `auth.users.id` (no separate sequence).

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, FK → auth.users.id (no default needed — always set to auth.users.id) |
| role | text | `'mentor'` or `'mentee'`. Set once at signup, not changeable in MVP. |
| is_admin | bool | Default false. Set manually in Supabase dashboard to grant admin access. |
| full_name | text | Required at signup, not null |
| email | text | Written once at signup from auth.users.email. Convenience field only — not kept in sync. |
| avatar_url | text | Optional |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Auto-updated via trigger |

### `mentor_profiles`
Mentor-specific fields. Created after role selection. One row per mentor user; `user_id` is also the PK (no separate `id` column needed — enforces one profile per user).

| Column | Type | Notes |
|---|---|---|
| user_id | uuid | PK, FK → profiles.id |
| linkedin_url | text | Required, not null |
| job_function | text | e.g. "Product Management" (renamed from `function` — reserved word in Postgres) |
| industry | text | e.g. "Fintech" |
| years_experience | int | Used to auto-assign pricing tier |
| bio | text | Optional short description |
| pricing_tier | int | 50 / 75 / 100 / 125 (USD). Set by DB trigger on insert/update of `years_experience` — not writable by the client. |
| approval_status | text | `'pending'` / `'approved'` / `'rejected'`. Default `'pending'`. |
| rejection_reason | text | Optional admin note. Null if not rejected. |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Auto-updated via trigger |

**Pricing tier assignment — implemented as a Postgres trigger on `mentor_profiles`:**
- 0–2 yrs → $50
- 3–4 yrs → $75
- 5–9 yrs → $100
- 10+ yrs → $125

**Resubmission policy:** A rejected mentor may update their profile and resubmit. Saving any profile field resets `approval_status` to `'pending'`. The mentor dashboard shows the rejection reason (from `rejection_reason`) when status is `'rejected'`, along with an "Update & Resubmit" button.

### `mentee_profiles`
Mentee-specific fields. Created after role selection. `user_id` is the PK — one profile per mentee.

| Column | Type | Notes |
|---|---|---|
| user_id | uuid | PK, FK → profiles.id |
| career_stage | text | `'student'` / `'recent_grad'` / `'entry_level'` / `'career_pivot'` / `'other'` |
| school_or_role | text | Current school or job title |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Auto-updated via trigger |

---

## Auth & Signup Flow

```
Landing Page
    ↓
Sign Up (full name + email + password)
    ↓
Role selection — "Find a Mentor" or "Be a Mentor"
    ↓
        [Mentor]                    [Mentee]
   Mentor Profile Form          Mentee Profile Form
   (LinkedIn, function,         (career stage, school/role)
    industry, YoE, bio)                ↓
         ↓                      Mentee Dashboard
   Pending Approval             (intake CTA unlocked)
   state (dashboard)
         ↓
   Admin approves
         ↓
   Mentor Dashboard
```

**Rules:**
- Supabase sends an email verification link automatically on signup. The password reset email is also handled by Supabase automatically; no custom UI is needed in this sub-project — the default Supabase hosted page is acceptable for MVP.
- Mentors cannot access platform features until `approval_status = 'approved'`
- Mentees go straight to their dashboard after completing their profile
- Pricing tier is auto-assigned via a Postgres trigger on `mentor_profiles` — the client never writes `pricing_tier` directly
- Dual roles are not supported. A user has exactly one role (`mentor` or `mentee`) set at signup and stored in `profiles.role`. There is no UI or database path to create both a `mentor_profiles` and `mentee_profiles` row for the same user. This is enforced by the onboarding flow (role is set once, not changeable in MVP).
- Admin access is granted by setting `profiles.is_admin = true` in Supabase. The `/admin` route guard checks this field. RLS policies on admin-only operations check `profiles.is_admin`.
- `profiles.email` is written once at signup from `auth.users.email` and is not kept in sync with auth changes. It exists for convenience in admin queries only; the authoritative email is always `auth.users.email`.

---

## Pages

### Landing Page (`/`)
Public. Hero with headline, value prop, stat bar — three hardcoded tiles: "30 min / Focused session", "$50–125 / Per session", "AI / Smart matching". Values are static copy, not live database queries. Two CTAs: "Find My Mentor" (→ `/signup?role=mentee`) and "Become a Mentor" (→ `/signup?role=mentor`).

### Sign Up (`/signup`)
Single form: full name, email, password, role toggle (card-style). Submits to Supabase Auth. On success, redirects to role-specific profile form.

### Log In (`/login`)
Email + password. On success, redirects to `/dashboard`.

### Mentor Profile Form (`/onboarding/mentor`)
Protected (must be authenticated, role = mentor). If a `mentor_profiles` row already exists for this user (i.e., they are revisiting), pre-populate the form with existing values and allow editing. Saving resets `approval_status` to `'pending'` regardless. Fields: LinkedIn URL (required), `job_function` (dropdown), industry (dropdown), years of experience (number input with inline rate preview). Bio (optional textarea). On submit: upsert `mentor_profiles`, redirect to `/dashboard`.

### Mentee Profile Form (`/onboarding/mentee`)
Protected. Fields: school or current role (text), career stage (4-card grid selector). Submit redirects to dashboard.

### Dashboard (`/dashboard`)
Role-aware:
- **Mentor (pending):** "Under review" state showing profile summary. No other actions available.
- **Mentor (approved):** *(Out of scope for this sub-project — scaffold only)*
- **Mentee:** "Complete your AI intake" CTA (prominent). Browse Mentors card (locked, greyed out until intake complete). *(Intake and browse are Sub-projects 3 and 4)*

### Admin Approval (`/admin`)
Protected, admin-only (requires `profiles.is_admin = true`). Lists mentors with `approval_status = 'pending'`. Each row shows name, `job_function`, industry, YoE, rate, LinkedIn link. Approve / Reject buttons. Approve sets `approval_status = 'approved'`. Reject sets `approval_status = 'rejected'`; admin may optionally enter a `rejection_reason` (plain text, shown to mentor on their dashboard). No email notifications in MVP.

---

## Routes

| Path | Component | Auth required | Role |
|---|---|---|---|
| `/` | Landing | No | — |
| `/signup` | Signup | No | — |
| `/login` | Login | No | — |
| `/onboarding/mentor` | MentorProfile | Yes | mentor |
| `/onboarding/mentee` | MenteeProfile | Yes | mentee |
| `/dashboard` | Dashboard | Yes | any |
| `/admin` | AdminApproval | Yes | admin |

---

## Out of Scope for This Sub-project

The following are explicitly deferred to later sub-projects:

- AI intake flow (Sub-project 3)
- Mentor browse/filter page (Sub-project 4)
- Calendar integration (Sub-project 5)
- Stripe Connect (Sub-project 5)
- Google Meet link generation (Sub-project 5)
- Post-session AI notes (Sub-project 6)
- Email notifications to mentors on approval/rejection
- Password reset flow (Supabase provides this out of the box; wire up later)
- Social login (Google, LinkedIn)
- Ratings, reviews, subscriptions (V2)

---

## Row-Level Security (RLS)

Supabase RLS must be enabled on all tables. Minimum policies for this sub-project:

| Table | Policy |
|---|---|
| `profiles` | Users can read and update their own row (`id = auth.uid()`). Admins (`is_admin = true`) can read all rows. |
| `mentor_profiles` | Users can read and upsert their own row (`user_id = auth.uid()`). Admins can read and update all rows (for approval). Public read of approved mentor profiles is deferred to Sub-project 4. |
| `mentee_profiles` | Users can read and upsert their own row (`user_id = auth.uid()`). |

---

## Non-functional Requirements

- **PWA:** Installable on iOS via Vite PWA plugin. Offline support not required for MVP.
- **iCloud compatibility:** `node_modules/` should be excluded from iCloud sync via `.nosync` suffix or `.gitignore`. Build artifacts go to `dist/`.
- **Environment variables:** All Supabase keys stored in `.env.local` (never committed).
- **Deployment:** Vercel connected to the GitHub repo (`1j9c92/officehours`). Auto-deploys on push to `main`.
