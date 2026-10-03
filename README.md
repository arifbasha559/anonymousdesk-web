# AnonymousDesk — Frontend

Professional React SPA for the AnonymousDesk confidential discourse platform.

## Stack

- **React 18** + **Vite 5**
- **Tailwind CSS v4** (design tokens from AnonymousDesk X-Dense / Light)
- **react-router-dom** — client routing
- **react-icons** — icons
- **axios** — HTTP client with token refresh interceptor
- **zustand** — auth + theme + notifications state
- **js-cookie** — secure token storage (SameSite=Strict)

## Design fidelity

UI matches the provided Stitch designs:

- 3-column desktop layout (sidebar · feed · right rail)
- Dark (default) and light themes
- Typography: Inter, headline/body/label scales
- Primary `#1d9bf0`, tertiary amber for verified/karma
- Security chrome (CONFIDENTIAL badges, ZK banners, scrubbing notices)

## API

All requests go to `/api/v1` (proxied to `http://localhost:4000` in dev).

Set `VITE_API_URL` to override (e.g. `https://api.example.com/api/v1`).

### Auth security

- Access + refresh tokens stored in cookies (`SameSite=Strict`, `Secure` on HTTPS)
- Automatic silent refresh on 401
- Tokens cleared on logout / refresh failure
- No tokens in `localStorage` (XSS-resistant)

## Scripts

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run preview
```

## Pages

| Route | Auth | Description |
|-------|------|-------------|
| `/login` | public | Sign in |
| `/register` | public | Create anonymous identity |
| `/` | required | Home feed |
| `/posts/:id` | required | Post detail + replies |
| `/compose` | required | Create dilemma |
| `/notifications` | required | Notification inbox |
| `/profile` | required | Karma & identity |
| `/settings` | required | Theme, privacy, logout |
| `/search` | required | Search posts/tags |

## Backend routes used

See API documentation for full request/response shapes. Frontend covers:

- Auth: register, login, refresh, revoke, profile industry
- Posts: list, get, create, upvote, delete, report, replies
- Replies: helpful, delete, report
- Notifications: list, mark read, mark all
- Users: me/karma, me/profile
