# The Unbound Minds Collective — Project State

Last updated: 2026-09-22

## Stack
Vite + React SPA, Tailwind CSS v4, PocketBase for backend.

## Pages & Routes
- `/` — Home (hero, pillars, upcoming sessions, what-we-are-not)
- `/community` — Discussion forum with category tabs, post creation, mod hide/unhide
- `/resources` — Four tabbed sections: LGBTQ+, Kink/BDSM, ENM/Poly directories + Education Hub
- `/sessions` — Upcoming & past sessions with Q&A submission and display
- `/ai-guide` — Curated self-care reflection guide with hard-coded crisis detection (no external API)
- `/suggestion-box` — Community topic suggestion form (anon option)
- `/facilitators` — Facilitator spotlight directory + self-managed profile form
- `/crisis` — Crisis resources page with 8 crisis services
- `/profile` — Member profile edit (display name, bio, identity interests, notifications)
- `/auth` — Sign in / sign up with invite code support
- `/admin` — Admin dashboard (members, moderation queue, invite codes, audit log, supporters, suggestions)
- `/facilitator-console` — Session management and Q&A review for facilitators/moderators
- `*` — 404 page

## Components
- `src/components/RoleBadge.jsx` — role pill badge (member/moderator/facilitator/guest_facilitator/admin)
- `src/contexts/AuthContext.jsx` — auth state, PocketBase auth listener, logout
- `src/layouts/SiteLayout.jsx` — nav (desktop + mobile hamburger), footer with disclaimer and supporters
- `src/lib/pb.js` — PocketBase singleton

## Design
- Dark warm palette: bg #1a1614, surface #241f1c, accent #c4956a (terracotta), sage #7fa892
- Fonts: Cormorant Garamond (display), Jost (body)
- Tailwind v4 with custom color tokens in tailwind.config.cjs

## Collections expected in PocketBase
- `members` — id, name, display_name, email, role, bio, identity_interests, notification_preferences
- `posts` — id, title, content, category, author_id, author_name, hidden, created
- `sessions` — id, title, description, session_date, topic_tags, status, facilitator_id, facilitator_name, published
- `qa_submissions` — id, session_id, question, submitter_id, status (pending/approved/rejected), reviewed_by
- `invite_codes` — id, code, role_grant, used, used_by, created_by
- `audit_log` — id, action, target_id, performed_by, new_value, created
- `member_actions` — id, member_id, action, performed_by
- `suggestions` — id, topic, details, community_focus, submitter_id, anonymous, status
- `facilitator_profiles` — id, member_id, display_name, bio, specialty_tags, website, podcast_url, book_url, practice_url, twitter, instagram, linkedin, approved
- `supporters` — id, name, description, tier, website, active

## Key rules
- All imports from `react-router` (not react-router-dom)
- PocketBase: `new PocketBase()` no args
- Tailwind v4: shadow-sm not shadow, rounded-sm not rounded
- No external AI API calls in AIGuide — fully hard-coded content
- Crisis detection in AIGuide uses simple string includes check
- All external links: target="_blank" rel="noopener noreferrer"
- No hardcoded root-absolute paths except /static/
