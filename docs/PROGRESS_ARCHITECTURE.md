# Progress Storage Architecture

**Last updated:** 2025-07-26

## Current state

Progress is stored in `localStorage` under `aiCourseProgress`. An export/import
bridge (Phase 13, ` REMEDIATION_LOG.md`) lets users manually download and upload
a JSON file, but this is fragile:

- **CCleaner / "clear browsing data"** wipes `localStorage` silently.
- **Browser updates / resets** can clear it without warning.
- **Shared machines** — multiple users overwrite each other's progress.
- **No cross-device** — progress on one device doesn't follow the user to another.
- **No accountability** —quiz scores can't be verified or shared (e.g., for a certificate).

The export/import bridge is a pragmatic fallback for the static-file
architecture, but it is **not** a substitute for per-user, server-side storage.

## Target architecture

```
[ Browser ]                          [ Supabase (BaaS) ]
                                     
  course JS ── read/write ──►  auth.js  ──►  auth + progress tables
     │                                │
     └── fallback to localStorage      ├── Google OAuth
        when not logged in             ├── GitHub OAuth
                                        ├── Email OTP
                                        └── PostgreSQL (progress JSON)
```

### Why Supabase

- **Browser-only SDK** — add one `<script>` tag, no build step, keeps the
  static-file architecture.
- **Free tier** covers 50K monthly active users. No credit card required.
- **PostgreSQL** — store progress as a JSONB column in a `progress` table
  keyed by `user_id`.
- **Social OAuth providers** built in (Google, GitHub, Microsoft, Apple, plus
  email OTP — no password to lose).
- **Row-Level Security** — users can only read/write their own row, enforced
  at the database level, not just in client code.
- **Open source** — can self-host if needed.

### Schema (migration SQL)

```sql
-- Supabase projects ship with auth.users automatically.
-- We add one table for per-user progress:

CREATE TABLE public.progress (
  user_id     UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data        JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Row-level security: each user sees only their own row
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own progress"
  ON public.progress
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Auto-update updated_at on every write
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER progress_touch
  BEFORE UPDATE ON public.progress
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
```

### Data structure (JSONB column `data`)

```json
{
  "version": "2.3.0",
  "completedLessons": ["ai_introduction", "ml_introduction"],
  "scores": { "ai_introduction": 80, "ml_introduction": 60 },
  "weakAreas": ["Overfitting"],
  "timeSpent": 3600,
  "confidenceLevels": { "ai_introduction": 80 },
  "currentLessonId": "neural_networks_intro",
  "learningPath": "builder"
}
```

This is the same shape the export/import bridge already uses (`main.js` →
`exportProgress()`), so no data migration is needed — just sync instead of
download.

### Setup guide (10 minutes)

1. **Create a Supabase project** at [supabase.com](https://supabase.com) (free).
2. **Get the project URL and anon key** from Project Settings > API.
3. **Run the migration SQL** above in the SQL Editor.
4. **Enable social OAuth providers** in Auth > Providers:
   - Google: paste OAuth client ID + secret (from Google Cloud Console)
   - GitHub: paste OAuth app client ID + secret (from GitHub Developer Settings)
   - Email: enable Email OTP (no password needed; users get a magic link)
5. **Add the config file** `auth-config.json` in the repo root:
   ```json
   {
     "supabaseUrl": "https://YOUR-PROJECT.supabase.co",
     "supabaseAnonKey": "YOUR-ANON-KEY"
   }
   ```
   Add `auth-config.json` to `.gitignore` so keys don't leak into git.
6. The course automatically detects the config file, loads the Supabase SDK,
   and shows a login button in the header. If `auth-config.json` is absent,
   it falls back to localStorage (the export/import bridge stays available).

## Implementation (auth.js)

The `auth.js` module (loaded in `index.html` after `main.js`) does:

1. **On boot**: fetch `auth-config.json`. If absent → skip auth, `localStorage` only.
2. **If config present**: load the Supabase SDK from CDN. Show a "Sign in" button
   in the header.
3. **On sign-in**: call `supabase.auth.signInWithOAuth({ provider: 'google' })`
   (or GitHub, or email OTP).
4. **After OAuth redirect**: read the session, fetch progress from the `progress`
   table, merge with any local progress (local wins if newer), and replace the
   in-memory state.
5. **On every `saveProgress()`**: if logged in, `supabase.from('progress').upsert(...)`
   in addition to `localStorage`. If offline, the localStorage copy + export/import
   bridge covers the gap.
6. **On sign-out**: clear in-memory session, keep local progress, prompt export.

### Fallback chain (defense in depth)

```
1. Supabase (server-side)  ← primary; logged-in users
2. localStorage            ← always works; fallback if offline / no account
3. Export/import .json     ← manual esccape hatch; CCleaner defense
```

No single point of failure. Users without an account still get localStorage +
export. Users with an account get automatic server-side sync. Users on a shared
machine get separate accounts.

## What needs to be built (future work)

- [x] **`docs/PROGRESS_ARCHITECTURE.md`** — this document.
- [ ] **`auth.js`** — the module described above.
- [ ] **`auth-config.example.json`** — template for the config file (committed; real
  file is gitignored).
- [ ] **`.gitignore` update** — add `auth-config.json`.
- [ ] **Update `index.html`** — load `auth.js` + add the login button placeholder.
- [ ] **Update `main.js`** — call `auth.syncProgress()` after every `saveProgress()`.
- [ ] **Supabase project provisioning** — create the project, run the migration,
  enable OAuth providers, plug into `auth-config.json`.
- [ ] **Test with a real Google sign-in** — verify sync end-to-end.