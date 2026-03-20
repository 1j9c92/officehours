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
Extends `auth.users` with app-level fields. One row per user.

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, FK → auth.users.id |
| role | text | `'mentor'` or `'mentee'` |
| full_name | text | Required at signup |
| email | text | Mirrors auth.users.email |
| avatar_url | text | Optional |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Auto-updated |

### `mentor_profiles`
Mentor-specific fields. Created after role selection.

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → profiles.id |
| linkedin_url | text | Required |
| function | text | e.g. "Product Management" |
| industry | text | e.g. "Fintech" |
| years_experience | int | Used to auto-assign pricing tier |
| bio | text | Optional short description |
| pricing_tier | int | 50 / 75 / 100 / 125 (USD) |
| approval_status | text | `'pending'` / `'approved'` / `'rejected'` |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Auto-updated |

**Pricing tier assignment (by years of experience):**
- 0–2 yrs → $50
- 3–4 yrs → $75
- 5–9 yrs → $100
- 10+ yrs → $125

### `mentee_profiles`
Mentee-specific fields. Created after role selection.

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → profiles.id |
| career_stage | text | `'student'` / `'recent_grad'` / `'entry_level'` / `'career_pivot'` / `'other'` |
| school_or_role | text | Current school or job title |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Auto-updated |

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
- Supabase sends an email verification link automatically on signup
- Mentors cannot access platform features until `approval_status = 'approved'`
- Mentees go straight to their dashboard after completing their profile
- Pricing tier is auto-assigned server-side based on `years_experience` — mentors do not choose their rate
- Admin access is granted by setting a flag in Supabase (not a separate auth system)

---

## Pages

### Landing Page (`/`)
Public. Hero with headline, value prop, stat bar (30 min / $50–125 / AI). Two CTAs: "Find My Mentor" (→ signup as mentee) and "Become a Mentor" (→ signup as mentor).

### Sign Up (`/signup`)
Single form: full name, email, password, role toggle (card-style). Submits to Supabase Auth. On success, redirects to role-specific profile form.

### Log In (`/login`)
Email + password. On success, redirects to `/dashboard`.

### Mentor Profile Form (`/onboarding/mentor`)
Protected (must be authenticated). Fields: LinkedIn URL (required), function (dropdown), industry (dropdown), years of experience (number input). Rate preview shown inline based on YoE. Bio (optional textarea). Submit triggers approval status = `'pending'` and redirects to dashboard.

### Mentee Profile Form (`/onboarding/mentee`)
Protected. Fields: school or current role (text), career stage (4-card grid selector). Submit redirects to dashboard.

### Dashboard (`/dashboard`)
Role-aware:
- **Mentor (pending):** "Under review" state showing profile summary. No other actions available.
- **Mentor (approved):** *(Out of scope for this sub-project — scaffold only)*
- **Mentee:** "Complete your AI intake" CTA (prominent). Browse Mentors card (locked, greyed out until intake complete). *(Intake and browse are Sub-projects 3 and 4)*

### Admin Approval (`/admin`)
Protected, admin-only. Lists mentors with `approval_status = 'pending'`. Each row shows name, function, industry, YoE, rate, LinkedIn link. Approve / Reject buttons. Approve sets status to `'approved'`; reject sets to `'rejected'` (no email notification in MVP).

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

## Non-functional Requirements

- **PWA:** Installable on iOS via Vite PWA plugin. Offline support not required for MVP.
- **iCloud compatibility:** `node_modules/` should be excluded from iCloud sync via `.nosync` suffix or `.gitignore`. Build artifacts go to `dist/`.
- **Environment variables:** All Supabase keys stored in `.env.local` (never committed).
- **Deployment:** Vercel connected to the GitHub repo (`1j9c92/officehours`). Auto-deploys on push to `main`.
