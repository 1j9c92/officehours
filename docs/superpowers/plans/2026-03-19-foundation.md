# OfficeHours Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete foundation layer of OfficeHours — a working React app with Supabase auth, user profiles (mentor + mentee), Postgres schema with RLS, all 7 pages, and deployment to Vercel.

**Architecture:** React SPA (Vite) with Tailwind CSS v3. Supabase handles auth, Postgres database, and row-level security. Client-side routing via React Router v6. Auth state lives in a React Context wrapping the Supabase session. No separate API server — all DB calls go direct to Supabase from the browser, secured by RLS.

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3, React Router 6, @supabase/supabase-js v2, Vitest + React Testing Library

---

## File Map

Files created or modified in this plan:

```
officehours/
├── .env.local                          # Supabase keys (never committed)
├── index.html                          # Vite entry point (update title/meta)
├── vite.config.js                      # Add PWA plugin
├── tailwind.config.js                  # Warm Human theme tokens
├── postcss.config.js                   # Required by Tailwind v3
├── src/
│   ├── main.jsx                        # React root, BrowserRouter wrapper
│   ├── App.jsx                         # All route definitions
│   ├── index.css                       # Tailwind directives + base styles
│   ├── lib/
│   │   └── supabase.js                 # Supabase client singleton
│   ├── context/
│   │   └── AuthContext.jsx             # Auth state + helpers (login, logout, signup)
│   ├── components/
│   │   ├── Layout.jsx                  # Top nav + page wrapper
│   │   ├── ProtectedRoute.jsx          # Redirect to /login if not authed
│   │   └── RoleGate.jsx                # Redirect if wrong role or not admin
│   └── pages/
│       ├── Landing.jsx                 # Public homepage
│       ├── Login.jsx                   # Email/password login
│       ├── Signup.jsx                  # Signup + role selection
│       ├── MentorProfile.jsx           # /onboarding/mentor
│       ├── MenteeProfile.jsx           # /onboarding/mentee
│       ├── Dashboard.jsx               # Role-aware post-login home
│       └── AdminApproval.jsx           # /admin — approve/reject mentors
├── supabase/
│   └── migrations/
│       └── 20260319000001_foundation.sql  # All schema + triggers + RLS
└── public/
    └── manifest.webmanifest            # PWA manifest
```

**Test files** (co-located with source):
```
src/
├── context/AuthContext.test.jsx
├── components/ProtectedRoute.test.jsx
├── components/RoleGate.test.jsx
└── lib/pricing.test.js                 # Pure function, easiest to test
```

---

## ⚠️ Manual Prerequisites (do these before running any tasks)

### A. Create a Supabase project
1. Go to [supabase.com](https://supabase.com) → sign up → New project
2. Choose a region close to you (e.g., US East)
3. Note your **Project URL** and **anon public key** (Settings → API)

### B. Create `.env.local`
In the `officehours/` directory, create a file called `.env.local`:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
This file is already in `.gitignore` — it will never be committed.

### C. Verify Node.js
Run: `node --version`
Need: v18 or higher. If not installed, download from [nodejs.org](https://nodejs.org).

---

## Task 1: Scaffold Project

**Files:** `package.json`, `vite.config.js`, `src/main.jsx`, `src/App.jsx`

- [ ] **Step 1: Initialize Vite React project**

Run from inside `officehours/`:
```bash
npm create vite@latest . -- --template react
```
When prompted "Current directory is not empty. Remove existing files and continue?" → select **Ignore files and continue**.

- [ ] **Step 2: Prevent iCloud from syncing node_modules**

```bash
mkdir node_modules.nosync
ln -s node_modules.nosync node_modules
```
This tells iCloud to ignore the folder (`.nosync` suffix) while Node still finds it via the symlink.

- [ ] **Step 3: Install base dependencies**

```bash
npm install
npm install react-router-dom @supabase/supabase-js
npm install -D tailwindcss postcss autoprefixer
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D vite-plugin-pwa
```

- [ ] **Step 4: Init Tailwind**

```bash
npx tailwindcss init -p
```
This creates `tailwind.config.js` and `postcss.config.js`.

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```
Expected: Vite server running at `http://localhost:5173`. Open it — you should see the default Vite React page.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite React project with dependencies"
```

---

## Task 2: Configure Tailwind + Theme

**Files:** `tailwind.config.js`, `src/index.css`, `index.html`

- [ ] **Step 1: Update tailwind.config.js with Warm Human theme tokens**

Replace the contents of `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FCF4E9',
        'text-primary': '#282725',
        'text-secondary': '#8a7060',
        'text-muted': '#a09080',
        'border-light': '#e8ddd0',
        'border-mid': '#d4c0aa',
        coral: '#F6544A',
        'coral-dark': '#D4392F',
        success: '#2E7D32',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Update src/index.css**

Replace with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-cream text-text-primary font-sans;
  }
  h1, h2, h3 {
    @apply font-serif;
  }
}
```

- [ ] **Step 3: Update index.html title**

Change `<title>` to `<title>OfficeHours</title>` and add:
```html
<meta name="description" content="30-minute mentorship sessions with experienced professionals">
<meta name="theme-color" content="#FCF4E9">
```

- [ ] **Step 4: Verify**

```bash
npm run dev
```
Background should now be `#FCF4E9` (warm cream) instead of white.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.js src/index.css index.html
git commit -m "feat: configure Tailwind with Warm Human theme"
```

---

## Task 3: Configure Vitest

**Files:** `vite.config.js`, `src/test-utils.jsx`

- [ ] **Step 1: Update vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'OfficeHours',
        short_name: 'OfficeHours',
        description: '30-minute mentorship sessions',
        theme_color: '#FCF4E9',
        background_color: '#FCF4E9',
        display: 'standalone',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.js'],
  },
})
```

- [ ] **Step 2: Create src/test-setup.js**

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 3: Add test script to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest",
"test:ui": "vitest --ui"
```

- [ ] **Step 4: Run tests to verify setup works**

```bash
npm test
```
Expected: "No test files found" (that's fine — setup is working).

- [ ] **Step 5: Commit**

```bash
git add vite.config.js src/test-setup.js package.json
git commit -m "feat: configure Vitest and PWA plugin"
```

---

## Task 4: Supabase Schema + Migrations

**Files:** `supabase/migrations/20260319000001_foundation.sql`

- [ ] **Step 1: Create migration file**

Create `supabase/migrations/20260319000001_foundation.sql` with the complete schema:

```sql
-- ============================================================
-- OfficeHours Foundation Schema
-- Run this in: Supabase dashboard → SQL Editor → New query
-- ============================================================

-- ========================
-- PROFILES (extends auth.users)
-- ========================
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  role         text not null check (role in ('mentor', 'mentee')),
  is_admin     boolean not null default false,
  full_name    text not null,
  email        text not null,
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ========================
-- MENTOR PROFILES
-- ========================
create table public.mentor_profiles (
  user_id          uuid primary key references public.profiles(id) on delete cascade,
  linkedin_url     text not null,
  job_function     text,
  industry         text,
  years_experience int,
  bio              text,
  pricing_tier     int check (pricing_tier in (50, 75, 100, 125)),
  approval_status  text not null default 'pending' check (approval_status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ========================
-- MENTEE PROFILES
-- ========================
create table public.mentee_profiles (
  user_id       uuid primary key references public.profiles(id) on delete cascade,
  career_stage  text check (career_stage in ('student', 'recent_grad', 'entry_level', 'career_pivot', 'other')),
  school_or_role text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ========================
-- TRIGGER: auto-update updated_at
-- ========================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger mentor_profiles_updated_at
  before update on public.mentor_profiles
  for each row execute function public.set_updated_at();

create trigger mentee_profiles_updated_at
  before update on public.mentee_profiles
  for each row execute function public.set_updated_at();

-- ========================
-- TRIGGER: auto-assign pricing_tier from years_experience
-- Client never writes pricing_tier directly.
-- ========================
create or replace function public.assign_pricing_tier()
returns trigger language plpgsql as $$
begin
  new.pricing_tier =
    case
      when new.years_experience is null then null
      when new.years_experience <= 2    then 50
      when new.years_experience <= 4    then 75
      when new.years_experience <= 9    then 100
      else 125
    end;
  return new;
end;
$$;

create trigger mentor_profiles_pricing_tier
  before insert or update of years_experience on public.mentor_profiles
  for each row execute function public.assign_pricing_tier();

-- ========================
-- TRIGGER: auto-reset approval_status to 'pending' on profile edit
-- ========================
create or replace function public.reset_approval_on_edit()
returns trigger language plpgsql as $$
begin
  -- only reset if a meaningful profile field changed (not status fields)
  if (
    new.linkedin_url     is distinct from old.linkedin_url or
    new.job_function     is distinct from old.job_function or
    new.industry         is distinct from old.industry or
    new.years_experience is distinct from old.years_experience or
    new.bio              is distinct from old.bio
  ) then
    new.approval_status = 'pending';
    new.rejection_reason = null;
  end if;
  return new;
end;
$$;

create trigger mentor_profiles_reset_approval
  before update on public.mentor_profiles
  for each row execute function public.reset_approval_on_edit();

-- ========================
-- TRIGGER: create profile row on auth.users insert
-- Called when a new user signs up via Supabase Auth.
-- ========================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'mentee')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ========================
-- ROW LEVEL SECURITY
-- ========================
alter table public.profiles       enable row level security;
alter table public.mentor_profiles enable row level security;
alter table public.mentee_profiles enable row level security;

-- profiles: own row read/update
create policy "profiles: own row select"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles: own row update"
  on public.profiles for update
  using (id = auth.uid());

-- profiles: admins can read all
create policy "profiles: admin read all"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- mentor_profiles: own row
create policy "mentor_profiles: own row select"
  on public.mentor_profiles for select
  using (user_id = auth.uid());

create policy "mentor_profiles: own row insert"
  on public.mentor_profiles for insert
  with check (user_id = auth.uid());

create policy "mentor_profiles: own row update"
  on public.mentor_profiles for update
  using (user_id = auth.uid());

-- mentor_profiles: admins can read and update all
create policy "mentor_profiles: admin select all"
  on public.mentor_profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

create policy "mentor_profiles: admin update all"
  on public.mentor_profiles for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- mentee_profiles: own row
create policy "mentee_profiles: own row select"
  on public.mentee_profiles for select
  using (user_id = auth.uid());

create policy "mentee_profiles: own row insert"
  on public.mentee_profiles for insert
  with check (user_id = auth.uid());

create policy "mentee_profiles: own row update"
  on public.mentee_profiles for update
  using (user_id = auth.uid());
```

- [ ] **Step 2: Run migration in Supabase**

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** → **New query**
3. Paste the entire contents of `supabase/migrations/20260319000001_foundation.sql`
4. Click **Run**
5. Expected: "Success. No rows returned"

- [ ] **Step 3: Verify tables exist**

In Supabase dashboard → **Table Editor** — you should see:
- `profiles`
- `mentor_profiles`
- `mentee_profiles`

- [ ] **Step 4: Commit**

```bash
git add supabase/
git commit -m "feat: add database schema with triggers and RLS"
```

---

## Task 5: Supabase Client + Pricing Helper

**Files:** `src/lib/supabase.js`, `src/lib/pricing.js`, `src/lib/pricing.test.js`

- [ ] **Step 1: Write failing test for pricing helper**

Create `src/lib/pricing.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { getPricingTier } from './pricing'

describe('getPricingTier', () => {
  it('returns 50 for 0 years', () => expect(getPricingTier(0)).toBe(50))
  it('returns 50 for 2 years', () => expect(getPricingTier(2)).toBe(50))
  it('returns 75 for 3 years', () => expect(getPricingTier(3)).toBe(75))
  it('returns 75 for 4 years', () => expect(getPricingTier(4)).toBe(75))
  it('returns 100 for 5 years', () => expect(getPricingTier(5)).toBe(100))
  it('returns 100 for 9 years', () => expect(getPricingTier(9)).toBe(100))
  it('returns 125 for 10 years', () => expect(getPricingTier(10)).toBe(125))
  it('returns 125 for 20 years', () => expect(getPricingTier(20)).toBe(125))
  it('returns null for null', () => expect(getPricingTier(null)).toBeNull())
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npm test src/lib/pricing.test.js
```
Expected: FAIL — "Cannot find module './pricing'"

- [ ] **Step 3: Create src/lib/pricing.js**

```js
/**
 * Returns the session price (in USD) for a given years of experience.
 * Matches the Postgres trigger logic in the DB.
 * Used client-side to show the inline rate preview on the mentor profile form.
 */
export function getPricingTier(years) {
  if (years === null || years === undefined) return null
  if (years <= 2) return 50
  if (years <= 4) return 75
  if (years <= 9) return 100
  return 125
}
```

- [ ] **Step 4: Run test — expect pass**

```bash
npm test src/lib/pricing.test.js
```
Expected: all 9 tests PASS

- [ ] **Step 5: Create src/lib/supabase.js**

```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/
git commit -m "feat: add Supabase client and pricing tier helper with tests"
```

---

## Task 6: Auth Context

**Files:** `src/context/AuthContext.jsx`, `src/context/AuthContext.test.jsx`

- [ ] **Step 1: Write failing test**

Create `src/context/AuthContext.test.jsx`:
```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'

// Mock the supabase module
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
    }),
  },
}))

function TestConsumer() {
  const { user, profile, loading } = useAuth()
  if (loading) return <div>loading</div>
  return (
    <div>
      <span data-testid="user">{user ? 'logged-in' : 'logged-out'}</span>
      <span data-testid="profile">{profile ? profile.role : 'no-profile'}</span>
    </div>
  )
}

describe('AuthContext', () => {
  it('renders children and shows logged-out state when no session', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )
    await waitFor(() => expect(screen.queryByText('loading')).not.toBeInTheDocument())
    expect(screen.getByTestId('user').textContent).toBe('logged-out')
  })
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npm test src/context/AuthContext.test.jsx
```
Expected: FAIL — "Cannot find module './AuthContext'"

- [ ] **Step 3: Create src/context/AuthContext.jsx**

```jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        if (session?.user) {
          fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function signUp({ email, password, fullName, role }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    })
    return { data, error }
  }

  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{
      session,
      user: session?.user ?? null,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
```

- [ ] **Step 4: Run test — expect pass**

```bash
npm test src/context/AuthContext.test.jsx
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/context/
git commit -m "feat: add AuthContext with session management"
```

---

## Task 7: Base Components

**Files:** `src/components/Layout.jsx`, `src/components/ProtectedRoute.jsx`, `src/components/RoleGate.jsx`, tests for each

- [ ] **Step 1: Write failing test for ProtectedRoute**

Create `src/components/ProtectedRoute.test.jsx`:
```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'

// Helper to wrap with fake auth context
function renderWithAuth(authValue, route = '/protected') {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/login" element={<div>login page</div>} />
          <Route path="/protected" element={
            <ProtectedRoute>
              <div>protected content</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  )
}

describe('ProtectedRoute', () => {
  it('redirects to /login when not authenticated', () => {
    renderWithAuth({ user: null, loading: false, profile: null })
    expect(screen.getByText('login page')).toBeInTheDocument()
  })

  it('renders children when authenticated', () => {
    renderWithAuth({ user: { id: '1' }, loading: false, profile: { role: 'mentee' } })
    expect(screen.getByText('protected content')).toBeInTheDocument()
  })

  it('shows nothing while loading', () => {
    const { container } = renderWithAuth({ user: null, loading: true, profile: null })
    expect(container.firstChild).toBeNull()
  })
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npm test src/components/ProtectedRoute.test.jsx
```

- [ ] **Step 3: Update AuthContext.jsx to export AuthContext directly** (needed by tests)

In `src/context/AuthContext.jsx`, change the first line of the context creation:
```jsx
// Change:
const AuthContext = createContext(null)
// To (add export):
export const AuthContext = createContext(null)
```

- [ ] **Step 4: Create src/components/ProtectedRoute.jsx**

```jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return children
}
```

- [ ] **Step 5: Run ProtectedRoute test — expect pass**

```bash
npm test src/components/ProtectedRoute.test.jsx
```

- [ ] **Step 6: Create src/components/RoleGate.jsx**

```jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Renders children only if the user's profile matches the required role or is admin.
 * Props:
 *   role: 'mentor' | 'mentee' — required profile role
 *   adminOnly: boolean — if true, requires is_admin = true regardless of role
 */
export default function RoleGate({ children, role, adminOnly = false }) {
  const { profile, loading } = useAuth()
  if (loading) return null
  if (!profile) return <Navigate to="/login" replace />
  if (adminOnly && !profile.is_admin) return <Navigate to="/dashboard" replace />
  if (role && profile.role !== role) return <Navigate to="/dashboard" replace />
  return children
}
```

- [ ] **Step 7: Create src/components/Layout.jsx**

```jsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-cream">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border-light bg-cream">
        <Link to="/" className="font-serif text-lg font-bold text-text-primary">
          OfficeHours
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={handleSignOut}
              className="text-sm text-text-muted hover:text-text-primary"
            >
              Sign Out
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm text-text-secondary hover:text-text-primary">
                Log In
              </Link>
              <Link
                to="/signup"
                className="text-sm font-bold text-white bg-coral hover:bg-coral-dark px-4 py-2 rounded"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
```

- [ ] **Step 8: Commit**

```bash
git add src/components/ src/context/AuthContext.jsx
git commit -m "feat: add Layout, ProtectedRoute, and RoleGate components"
```

---

## Task 8: Routing Setup

**Files:** `src/main.jsx`, `src/App.jsx`

- [ ] **Step 1: Update src/main.jsx**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
```

- [ ] **Step 2: Create src/App.jsx with all routes**

```jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import RoleGate from './components/RoleGate'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import MentorProfile from './pages/MentorProfile'
import MenteeProfile from './pages/MenteeProfile'
import AdminApproval from './pages/AdminApproval'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/onboarding/mentor" element={
          <ProtectedRoute>
            <RoleGate role="mentor">
              <MentorProfile />
            </RoleGate>
          </ProtectedRoute>
        } />

        <Route path="/onboarding/mentee" element={
          <ProtectedRoute>
            <RoleGate role="mentee">
              <MenteeProfile />
            </RoleGate>
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute>
            <RoleGate adminOnly>
              <AdminApproval />
            </RoleGate>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
```

- [ ] **Step 3: Create placeholder pages so the app compiles**

Create these files with minimal content so imports don't break (we'll fill them out in later tasks):

`src/pages/Landing.jsx` → `export default function Landing() { return <div>Landing</div> }`
`src/pages/Login.jsx` → `export default function Login() { return <div>Login</div> }`
`src/pages/Signup.jsx` → `export default function Signup() { return <div>Signup</div> }`
`src/pages/Dashboard.jsx` → `export default function Dashboard() { return <div>Dashboard</div> }`
`src/pages/MentorProfile.jsx` → `export default function MentorProfile() { return <div>MentorProfile</div> }`
`src/pages/MenteeProfile.jsx` → `export default function MenteeProfile() { return <div>MenteeProfile</div> }`
`src/pages/AdminApproval.jsx` → `export default function AdminApproval() { return <div>AdminApproval</div> }`

- [ ] **Step 4: Verify app runs**

```bash
npm run dev
```
Open `http://localhost:5173` — should show the nav bar and "Landing" text on cream background.

- [ ] **Step 5: Commit**

```bash
git add src/main.jsx src/App.jsx src/pages/
git commit -m "feat: add routing and page scaffolds"
```

---

## Task 9: Landing Page

**Files:** `src/pages/Landing.jsx`

- [ ] **Step 1: Replace Landing.jsx with full implementation**

```jsx
import { useNavigate } from 'react-router-dom'

const STATS = [
  { value: '30 min', label: 'Focused session' },
  { value: '$50–125', label: 'Per session' },
  { value: 'AI', label: 'Smart matching' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="text-center px-6 pt-20 pb-14">
        <p className="text-xs tracking-widest uppercase text-coral font-sans font-semibold mb-3">
          Career mentorship · AI-powered matching
        </p>
        <h1 className="font-serif text-4xl font-bold text-text-primary leading-tight mb-5 max-w-xl mx-auto">
          Talk to someone who has<br />walked your exact path
        </h1>
        <p className="text-text-secondary font-sans text-base max-w-md mx-auto mb-8 leading-relaxed">
          30-minute video sessions with vetted professionals. AI matches you to the right mentor for your career stage and goals.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => navigate('/signup?role=mentee')}
            className="bg-coral hover:bg-coral-dark text-white font-bold px-9 py-3 rounded-lg font-sans transition-colors"
          >
            Find My Mentor
          </button>
          <button
            onClick={() => navigate('/signup?role=mentor')}
            className="border-2 border-border-mid text-text-primary hover:border-text-secondary font-semibold px-7 py-3 rounded-lg font-sans transition-colors"
          >
            Become a Mentor
          </button>
        </div>
      </section>

      {/* Stat bar */}
      <section className="flex max-w-lg mx-auto gap-4 px-6 pb-16">
        {STATS.map(({ value, label }) => (
          <div
            key={value}
            className="flex-1 text-center py-5 bg-white rounded-lg shadow-sm"
          >
            <div className="font-sans text-2xl font-bold text-text-primary">{value}</div>
            <div className="font-sans text-xs text-text-muted mt-1">{label}</div>
          </div>
        ))}
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Verify visually**

```bash
npm run dev
```
Open `http://localhost:5173` — should match the Warm Human landing wireframe.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Landing.jsx
git commit -m "feat: build landing page"
```

---

## Task 10: Login + Signup Pages

**Files:** `src/pages/Login.jsx`, `src/pages/Signup.jsx`

- [ ] **Step 1: Build Login.jsx**

```jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-14">
      <h2 className="font-serif text-3xl font-bold text-center mb-2">Welcome back</h2>
      <p className="text-text-muted text-sm text-center mb-8 font-sans">Sign in to your account</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded mb-5 font-sans">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral"
            placeholder="jane@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-coral hover:bg-coral-dark disabled:opacity-50 text-white font-bold py-3 rounded-lg font-sans transition-colors"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-text-muted text-sm mt-5 font-sans">
        No account yet?{' '}
        <Link to="/signup" className="text-coral hover:underline">Sign up</Link>
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Build Signup.jsx**

```jsx
import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(searchParams.get('role') || 'mentee')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signUp({ email, password, fullName, role })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      // Redirect to role-specific onboarding
      navigate(role === 'mentor' ? '/onboarding/mentor' : '/onboarding/mentee')
    }
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-12">
      <h2 className="font-serif text-3xl font-bold text-center mb-2">Create your account</h2>
      <p className="text-text-muted text-sm text-center mb-8 font-sans">Join in under a minute</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded mb-5 font-sans">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">Full Name</label>
          <input
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral"
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral"
            placeholder="jane@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral"
            placeholder="••••••••"
          />
        </div>

        {/* Role selection */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2 font-sans">I want to…</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'mentee', emoji: '🌱', label: 'Find a Mentor', sub: 'Get guidance' },
              { value: 'mentor', emoji: '🤝', label: 'Be a Mentor', sub: 'Share your path' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRole(opt.value)}
                className={`border-2 rounded-xl py-4 text-center transition-colors ${
                  role === opt.value
                    ? 'border-coral bg-white'
                    : 'border-border-mid bg-white hover:border-border-mid'
                }`}
              >
                <div className="text-xl mb-1">{opt.emoji}</div>
                <div className="text-sm font-bold text-text-primary font-sans">{opt.label}</div>
                <div className="text-xs text-text-muted font-sans">{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-coral hover:bg-coral-dark disabled:opacity-50 text-white font-bold py-3 rounded-lg font-sans transition-colors"
        >
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-text-muted text-sm mt-5 font-sans">
        Already have an account?{' '}
        <Link to="/login" className="text-coral hover:underline">Log in</Link>
      </p>
    </div>
  )
}
```

- [ ] **Step 3: Verify login and signup pages render**

```bash
npm run dev
```
Visit `/login` and `/signup` — both should render with the Warm Human styling.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Login.jsx src/pages/Signup.jsx
git commit -m "feat: build Login and Signup pages"
```

---

## Task 11: Mentor Profile Form

**Files:** `src/pages/MentorProfile.jsx`

- [ ] **Step 1: Build MentorProfile.jsx**

```jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { getPricingTier } from '../lib/pricing'

const JOB_FUNCTIONS = [
  'Product Management', 'Engineering', 'Design', 'Data Science',
  'Marketing', 'Finance', 'Operations', 'Sales', 'Other',
]
const INDUSTRIES = [
  'Tech', 'Fintech', 'Healthcare', 'Media', 'Consulting',
  'E-commerce', 'Education', 'Other',
]

export default function MentorProfile() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    linkedin_url: '',
    job_function: '',
    industry: '',
    years_experience: '',
    bio: '',
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState(null)

  // Pre-populate if profile exists
  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase
        .from('mentor_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      if (data) {
        setForm({
          linkedin_url: data.linkedin_url || '',
          job_function: data.job_function || '',
          industry: data.industry || '',
          years_experience: data.years_experience?.toString() || '',
          bio: data.bio || '',
        })
      }
      setFetching(false)
    }
    loadProfile()
  }, [user.id])

  const previewTier = getPricingTier(
    form.years_experience ? parseInt(form.years_experience) : null
  )

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.from('mentor_profiles').upsert({
      user_id: user.id,
      linkedin_url: form.linkedin_url,
      job_function: form.job_function,
      industry: form.industry,
      years_experience: form.years_experience ? parseInt(form.years_experience) : null,
      bio: form.bio || null,
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      navigate('/dashboard')
    }
  }

  if (fetching) return null

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      <h2 className="font-serif text-2xl font-bold mb-2">Tell us about yourself</h2>
      <p className="text-text-muted text-sm mb-8 font-sans">
        This is what mentees see when browsing. You can update it anytime.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded mb-5 font-sans">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">
            LinkedIn Profile URL <span className="text-coral">*</span>
          </label>
          <input
            required
            type="url"
            value={form.linkedin_url}
            onChange={e => setForm(f => ({ ...f, linkedin_url: e.target.value }))}
            className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral"
            placeholder="https://linkedin.com/in/yourname"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">
              Function <span className="text-coral">*</span>
            </label>
            <select
              required
              value={form.job_function}
              onChange={e => setForm(f => ({ ...f, job_function: e.target.value }))}
              className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral"
            >
              <option value="">Select…</option>
              {JOB_FUNCTIONS.map(fn => <option key={fn}>{fn}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">
              Industry <span className="text-coral">*</span>
            </label>
            <select
              required
              value={form.industry}
              onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
              className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral"
            >
              <option value="">Select…</option>
              {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">
            Years of Experience <span className="text-coral">*</span>
          </label>
          <input
            required
            type="number"
            min="0"
            max="50"
            value={form.years_experience}
            onChange={e => setForm(f => ({ ...f, years_experience: e.target.value }))}
            className="w-28 border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral"
            placeholder="e.g. 8"
          />
          {previewTier && (
            <div className="mt-2 inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded px-3 py-2">
              <span className="text-sm font-bold text-coral font-sans">${previewTier} / session</span>
              <span className="text-xs text-text-muted font-sans">auto-assigned by experience</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">
            Short Bio <span className="text-text-muted font-normal">(optional)</span>
          </label>
          <textarea
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            rows={3}
            className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral resize-none"
            placeholder="Tell mentees what you can help with…"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-coral hover:bg-coral-dark disabled:opacity-50 text-white font-bold py-3 rounded-lg font-sans transition-colors"
        >
          {loading ? 'Saving…' : 'Submit for Review'}
        </button>
        <p className="text-center text-text-muted text-xs font-sans">
          Your profile will be reviewed within 24 hours before going live
        </p>
      </form>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Sign up as a mentor and complete the profile form. Should redirect to `/dashboard` after submit.

- [ ] **Step 3: Commit**

```bash
git add src/pages/MentorProfile.jsx
git commit -m "feat: build mentor profile onboarding form"
```

---

## Task 12: Mentee Profile Form

**Files:** `src/pages/MenteeProfile.jsx`

- [ ] **Step 1: Build MenteeProfile.jsx**

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const CAREER_STAGES = [
  { value: 'student', emoji: '🎓', label: 'Student' },
  { value: 'recent_grad', emoji: '📄', label: 'Recent Grad' },
  { value: 'entry_level', emoji: '💼', label: 'Entry-level (0–2 yrs)' },
  { value: 'career_pivot', emoji: '🔄', label: 'Career Pivot' },
  { value: 'other', emoji: '✳️', label: 'Other' },
]

export default function MenteeProfile() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [schoolOrRole, setSchoolOrRole] = useState('')
  const [careerStage, setCareerStage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!careerStage) { setError('Please select your career stage'); return }
    setError(null)
    setLoading(true)

    const { error } = await supabase.from('mentee_profiles').upsert({
      user_id: user.id,
      school_or_role: schoolOrRole || null,
      career_stage: careerStage,
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <h2 className="font-serif text-2xl font-bold mb-2">A bit about you</h2>
      <p className="text-text-muted text-sm mb-8 font-sans">
        This helps us match you with the right mentor.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded mb-5 font-sans">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">
            Current Role or School
          </label>
          <input
            value={schoolOrRole}
            onChange={e => setSchoolOrRole(e.target.value)}
            className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral"
            placeholder="e.g. Junior Analyst at Acme, or NYU Stern MBA"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-3 font-sans">
            Career Stage <span className="text-coral">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {CAREER_STAGES.map(stage => (
              <button
                key={stage.value}
                type="button"
                onClick={() => setCareerStage(stage.value)}
                className={`border-2 rounded-lg px-4 py-3 text-left transition-colors font-sans ${
                  careerStage === stage.value
                    ? 'border-coral bg-white'
                    : 'border-border-mid bg-white hover:border-border-mid'
                }`}
              >
                <span className="mr-2">{stage.emoji}</span>
                <span className="text-sm font-semibold text-text-primary">{stage.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-coral hover:bg-coral-dark disabled:opacity-50 text-white font-bold py-3 rounded-lg font-sans transition-colors"
        >
          {loading ? 'Saving…' : 'Continue →'}
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/MenteeProfile.jsx
git commit -m "feat: build mentee profile onboarding form"
```

---

## Task 13: Dashboard

**Files:** `src/pages/Dashboard.jsx`

- [ ] **Step 1: Build Dashboard.jsx**

```jsx
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

function MentorPendingDashboard({ mentorProfile }) {
  const navigate = useNavigate()
  const isRejected = mentorProfile?.approval_status === 'rejected'

  return (
    <div className="text-center py-16 px-6">
      <div className="text-5xl mb-5">{isRejected ? '❌' : '⏳'}</div>
      <h2 className="font-serif text-2xl font-bold mb-3">
        {isRejected ? 'Your application was not approved' : 'Your profile is under review'}
      </h2>
      {isRejected && mentorProfile?.rejection_reason && (
        <div className="max-w-sm mx-auto bg-red-50 border border-red-200 rounded-lg px-5 py-4 mb-5 text-left">
          <p className="text-xs uppercase tracking-wider text-red-500 font-sans mb-1">Reason</p>
          <p className="text-sm text-red-700 font-sans">{mentorProfile.rejection_reason}</p>
        </div>
      )}
      {!isRejected && (
        <p className="text-text-muted max-w-xs mx-auto font-sans text-sm leading-relaxed mb-6">
          We review all applications to ensure quality. You'll hear back within 24 hours.
        </p>
      )}

      {/* Profile summary */}
      {mentorProfile && (
        <div className="max-w-xs mx-auto border border-border-light rounded-xl p-5 bg-white text-left mb-6">
          <p className="text-xs uppercase tracking-widest text-text-muted font-sans mb-3">Your Profile</p>
          <div className="text-sm text-text-primary font-sans space-y-1">
            <div><span className="text-text-muted">Function:</span> {mentorProfile.job_function}</div>
            <div><span className="text-text-muted">Industry:</span> {mentorProfile.industry}</div>
            <div><span className="text-text-muted">Experience:</span> {mentorProfile.years_experience} years</div>
            <div><span className="text-text-muted">Rate:</span> <span className="text-coral font-bold">${mentorProfile.pricing_tier}/session</span></div>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate('/onboarding/mentor')}
        className="bg-coral hover:bg-coral-dark text-white font-bold px-7 py-2.5 rounded-lg font-sans text-sm transition-colors"
      >
        {isRejected ? 'Update & Resubmit' : 'Edit Profile'}
      </button>
    </div>
  )
}

function MenteeDashboard() {
  return (
    <div className="px-6 py-10 max-w-2xl mx-auto">
      <h2 className="font-serif text-xl font-bold mb-2">Welcome 👋</h2>
      <p className="text-text-muted text-sm mb-8 font-sans">
        Complete your AI intake to get matched with the right mentor.
      </p>
      <div className="flex gap-4">
        {/* Intake CTA */}
        <div className="flex-2 bg-white border-2 border-coral rounded-xl p-6">
          <p className="text-xs uppercase tracking-wider text-coral font-sans font-semibold mb-2">Next Step</p>
          <h3 className="font-serif text-lg font-bold mb-2">Complete your AI intake</h3>
          <p className="text-text-muted text-sm font-sans mb-5 leading-relaxed">
            Answer a few questions so we can match you with the right mentor. Takes 3 minutes.
          </p>
          <button
            disabled
            className="bg-coral text-white font-bold px-5 py-2.5 rounded-lg font-sans text-sm opacity-50 cursor-not-allowed"
            title="Coming in Sub-project 3"
          >
            Start Intake → <span className="font-normal text-xs">(coming soon)</span>
          </button>
        </div>
        {/* Browse — locked */}
        <div className="flex-1 bg-white border border-border-light rounded-xl p-6 opacity-50">
          <p className="text-xs uppercase tracking-wider text-text-muted font-sans mb-2">Locked</p>
          <h3 className="font-serif text-lg font-bold mb-2">Browse Mentors</h3>
          <p className="text-text-muted text-sm font-sans">Complete your intake first</p>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { profile, user } = useAuth()
  const [mentorProfile, setMentorProfile] = useState(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    async function load() {
      if (profile?.role === 'mentor') {
        const { data } = await supabase
          .from('mentor_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()
        setMentorProfile(data)
      }
      setFetching(false)
    }
    if (profile) load()
  }, [profile, user?.id])

  if (!profile || fetching) return null

  if (profile.role === 'mentor') {
    const status = mentorProfile?.approval_status
    if (status === 'approved') {
      // Scaffold for Sub-project 2+
      return (
        <div className="text-center py-16 font-sans text-text-muted">
          ✅ You're approved! Full mentor dashboard coming in Sub-project 2.
        </div>
      )
    }
    return <MentorPendingDashboard mentorProfile={mentorProfile} />
  }

  return <MenteeDashboard />
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Dashboard.jsx
git commit -m "feat: build role-aware dashboard"
```

---

## Task 14: Admin Approval Page

**Files:** `src/pages/AdminApproval.jsx`

- [ ] **Step 1: Build AdminApproval.jsx**

```jsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminApproval() {
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [rejectionInputs, setRejectionInputs] = useState({})
  const [actionLoading, setActionLoading] = useState({})

  async function loadPendingMentors() {
    const { data } = await supabase
      .from('mentor_profiles')
      .select('*, profiles(full_name, email)')
      .eq('approval_status', 'pending')
      .order('created_at', { ascending: true })
    setMentors(data || [])
    setLoading(false)
  }

  useEffect(() => { loadPendingMentors() }, [])

  async function approve(userId) {
    setActionLoading(prev => ({ ...prev, [userId]: true }))
    await supabase
      .from('mentor_profiles')
      .update({ approval_status: 'approved', rejection_reason: null })
      .eq('user_id', userId)
    setMentors(prev => prev.filter(m => m.user_id !== userId))
    setActionLoading(prev => ({ ...prev, [userId]: false }))
  }

  async function reject(userId) {
    const reason = rejectionInputs[userId] || null
    setActionLoading(prev => ({ ...prev, [userId]: true }))
    await supabase
      .from('mentor_profiles')
      .update({ approval_status: 'rejected', rejection_reason: reason })
      .eq('user_id', userId)
    setMentors(prev => prev.filter(m => m.user_id !== userId))
    setActionLoading(prev => ({ ...prev, [userId]: false }))
  }

  if (loading) return null

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="font-serif text-xl font-bold">Pending Mentor Applications</h2>
        <span className="text-xs font-bold text-coral bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full font-sans">
          {mentors.length}
        </span>
      </div>

      {mentors.length === 0 && (
        <p className="text-text-muted font-sans text-sm">No pending applications.</p>
      )}

      <div className="space-y-4">
        {mentors.map(mentor => (
          <div
            key={mentor.user_id}
            className="bg-white border border-border-light rounded-xl p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-bold text-text-primary font-sans">
                  {mentor.profiles?.full_name}
                </div>
                <div className="text-sm text-text-muted font-sans mt-0.5">
                  {mentor.job_function} · {mentor.industry} · {mentor.years_experience} yrs ·{' '}
                  <span className="text-coral font-semibold">${mentor.pricing_tier}/session</span>
                </div>
                {mentor.linkedin_url && (
                  <a
                    href={mentor.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline font-sans mt-1 inline-block"
                  >
                    LinkedIn →
                  </a>
                )}
                {mentor.bio && (
                  <p className="text-sm text-text-secondary font-sans mt-2 max-w-sm">{mentor.bio}</p>
                )}
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => approve(mentor.user_id)}
                  disabled={actionLoading[mentor.user_id]}
                  className="bg-success hover:opacity-90 disabled:opacity-50 text-white text-sm font-bold px-4 py-2 rounded-lg font-sans transition-opacity"
                >
                  Approve
                </button>
                <button
                  onClick={() => reject(mentor.user_id)}
                  disabled={actionLoading[mentor.user_id]}
                  className="border border-border-mid hover:border-text-muted text-text-muted text-sm px-4 py-2 rounded-lg font-sans transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>

            {/* Optional rejection reason */}
            <div className="mt-3">
              <input
                value={rejectionInputs[mentor.user_id] || ''}
                onChange={e => setRejectionInputs(prev => ({
                  ...prev,
                  [mentor.user_id]: e.target.value,
                }))}
                placeholder="Rejection reason (optional — shown to mentor)"
                className="w-full text-sm border border-border-light rounded px-3 py-2 font-sans text-text-secondary focus:outline-none focus:border-border-mid bg-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/AdminApproval.jsx
git commit -m "feat: build admin approval page"
```

---

## Task 15: End-to-End Smoke Test

Before deploying, manually verify the complete flow works with a real Supabase project.

- [ ] **Step 1: Ensure .env.local is populated**

Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set and the migration has been run in Supabase.

- [ ] **Step 2: Test mentor flow**

1. Go to `http://localhost:5173`
2. Click "Become a Mentor" → lands at `/signup?role=mentor`
3. Fill in name, email, password, "Be a Mentor" card selected → Create Account
4. Should redirect to `/onboarding/mentor`
5. Fill in LinkedIn URL, function, industry, YoE (try 8) → rate preview shows $100
6. Submit → redirects to `/dashboard` → shows "under review" state
7. Open Supabase dashboard → `mentor_profiles` table → verify row exists with `approval_status = 'pending'` and `pricing_tier = 100`

- [ ] **Step 3: Test admin flow**

1. In Supabase dashboard → `profiles` table → find your mentor user → set `is_admin = true`
2. Go to `http://localhost:5173/admin`
3. Should see the pending mentor application
4. Click Approve → row disappears

- [ ] **Step 4: Test mentee flow**

1. Sign up as mentee → complete profile → lands on dashboard → sees intake CTA

- [ ] **Step 5: Test reject + resubmit flow**

1. Sign in as your admin user → go to `/admin`
2. Click **Reject** on the pending mentor, enter a rejection reason → row disappears from admin queue
3. Sign in as the mentor → `/dashboard` → should show rejection state with the reason and "Update & Resubmit" button
4. Click "Update & Resubmit" → edit a field (e.g., bio) → submit
5. Sign in as admin → `/admin` → mentor should appear in pending queue again
6. Verify in Supabase: `approval_status = 'pending'`, `rejection_reason = null`

- [ ] **Step 6: Test protected routes**

1. Sign out → try to visit `/dashboard` → should redirect to `/login`
2. Sign in as mentor → try `/onboarding/mentee` → should redirect to `/dashboard`

- [ ] **Step 7: Commit smoke test pass**

```bash
git add -A
git commit -m "chore: all smoke tests passing, ready for deployment"
```

---

## Task 16: Deploy to Vercel

- [ ] **Step 1: Push all commits to GitHub**

```bash
git push origin main
```
If you're still on the `design/foundation-spec` branch, merge to main first:
```bash
git checkout main
git merge design/foundation-spec
git push origin main
```

- [ ] **Step 2: Connect Vercel**

1. Go to [vercel.com](https://vercel.com) → sign up / log in with GitHub
2. Click **New Project** → import `1j9c92/officehours`
3. Framework preset: **Vite** (auto-detected)
4. **Add environment variables** (this is critical — the site won't work without these):
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
5. Click **Deploy**
6. Expected: build succeeds, site is live at `https://officehours-*.vercel.app`

- [ ] **Step 3: Verify live site**

Open the Vercel URL → landing page loads → complete a test signup → confirm it works against the real Supabase project.

- [ ] **Step 4: Add Vercel URL to Supabase allowed origins** (important for auth)

1. Supabase dashboard → **Authentication** → **URL Configuration**
2. Set **Site URL** to your Vercel URL (e.g., `https://officehours-abc123.vercel.app`)
3. Add the Vercel URL to **Redirect URLs**

- [ ] **Step 5: Final commit**

```bash
git commit --allow-empty -m "chore: deployed to Vercel — Sub-project 1 complete"
git push origin main
```

---

## Done ✅

Sub-project 1 complete. What's working:
- Warm Human themed React app live on Vercel
- Supabase auth (email/password) with email verification
- `profiles`, `mentor_profiles`, `mentee_profiles` tables with RLS
- Pricing tier auto-assigned by DB trigger
- Approval status auto-reset on profile edit
- Mentor onboarding → pending approval flow
- Mentee onboarding → dashboard with locked intake CTA
- Admin approval/rejection with optional rejection reason
- Rejected mentors can see reason + resubmit

**Next:** Sub-project 2 — Mentor Onboarding (LinkedIn verification, availability setup)
