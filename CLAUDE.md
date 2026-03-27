# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React test project (SPS React Test) implementing a user CRUD application. It consumes a backend API (`test-sps-server`) running at `http://localhost:3001` (configured via `.env`).

Requirements:
- SignIn page for authentication (token-based, any storage is acceptable)
- User listing and registration only accessible when authenticated
- Full user CRUD via the backend API

## Commands

```bash
npm start        # Start dev server (port 3000)
npm run build    # Production build
npm test         # Run tests in watch mode
npm test -- --watchAll=false  # Run tests once
```

## Architecture

- **Entry**: `src/index.js` — mounts the app with `RouterProvider`
- **Routing**: `src/routes.js` — uses React Router v6 `createBrowserRouter`
- **Pages**: `src/pages/` — one file per route (Home, SignIn, Users, UserEdit)
- **Services**: `src/services/UserService.js` — axios-based API client; only `list()` is implemented; all other CRUD methods throw `Not implemented`

## Key Patterns

- React Router v6 loaders: `UserEdit` uses `userLoader` exported from the same file and registered in `routes.js`
- API base URL comes from `REACT_APP_SERVER_URL` env var (set in `.env` to `http://localhost:3001`)
- `SignIn.js` page component is currently a stub — authentication logic is not yet implemented
- No global state management library is set up; auth token storage pattern is TBD
