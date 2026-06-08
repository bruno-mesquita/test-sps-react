# TanStack Query Server-State Layer

**Date:** 2026-06-08  
**Status:** Approved

## Context

The app has TanStack Query v5 installed but unused. All data fetching is done manually — `useEffect` + `useState` in list pages, React Router loaders for detail pages, and inline try/catch for mutations. This creates: no caching (every navigation refetches), duplicated loading/error state boilerplate, and manual optimistic UI for destructive actions.

The goal is to introduce a proper server-state layer using TanStack Query that handles caching, background sync, optimistic updates, and all UI states, without duplicating server data into global client state (no Redux/Zustand for server data).

---

## Architecture

### QueryClient Singleton

A single `QueryClient` instance lives at `src/lib/queryClient.ts`. It is:
- Provided to the React tree via `QueryClientProvider` in `main.tsx`
- Imported directly by route loaders in `routes.tsx` for `prefetchQuery` calls

This avoids re-creating the client on each render and allows loaders to warm the cache before components mount.

```
src/lib/queryClient.ts   ← exported singleton
src/main.tsx             ← <QueryClientProvider client={queryClient}>
src/routes.tsx           ← loaders import queryClient and call prefetchQuery
```

### Query Key Factory

All query keys live in `src/queries/users.ts` under a single `userKeys` factory object. Keys model the domain hierarchy:

```ts
userKeys.all              → ['users']
userKeys.lists()          → ['users', 'list']
userKeys.detail(id)       → ['users', 'detail', id]
userKeys.attachments(id)  → ['users', id, 'attachments']
```

This lets invalidation be broad (`userKeys.all`) or surgical (`userKeys.detail(7)`).

### Query Functions

Raw async fetchers (no React) live alongside the key factory in `src/queries/users.ts`. They call the existing `api` axios instance from `src/lib/api.ts`. They return unwrapped data (not `AxiosResponse`) so hooks don't need to `.data` every result.

### React Hooks

Thin wrappers in `src/hooks/` compose query functions and keys into `useQuery` / `useMutation` calls. Pages import only hooks — never raw fetchers or key factories directly.

```
src/hooks/useUsers.ts           ← useUsers(), useUser(id)
src/hooks/useUserAttachments.ts ← useUserAttachments(userId)
src/hooks/useUserMutations.ts   ← all write hooks
```

---

## Query Hooks

### `useUsers()`
- Key: `userKeys.lists()`
- Fetches all users. Internally performs `Promise.all` with per-user attachment counts to match current Users.tsx behavior.
- `staleTime`: 30s

### `useUser(userId: number)`
- Key: `userKeys.detail(userId)`
- Fetches single user. Used by UserEdit (data already in cache from loader prefetch, so mount is instant).
- `staleTime`: 60s

### `useUserAttachments(userId: number)`
- Key: `userKeys.attachments(userId)`
- Fetches attachment list for one user. Separate from `useUser` so attachments can invalidate independently (upload/delete).
- `staleTime`: 30s

---

## Mutation Hooks

All mutations live in `src/hooks/useUserMutations.ts`.

### `useCreateUser()`
- POST `/users`
- On success: `invalidateQueries(userKeys.lists())`
- No optimistic update (new ID unknown until server responds)

### `useUpdateUser()`
- PUT `/users/:id`
- On success: `invalidateQueries(userKeys.lists())` + `invalidateQueries(userKeys.detail(id))`
- No optimistic update (field-level conflicts not worth the rollback complexity)

### `useDeleteUser()`
- DELETE `/users/:id`
- **Optimistic update:** removes user from `userKeys.lists()` cache immediately
- On error: rolls back via `context.previousUsers`
- On settled: `invalidateQueries(userKeys.lists())`

### `useRemovePhoto()`
- DELETE `/users/:id/photo`
- **Optimistic update:** sets `originalUrl: undefined, previewUrl: undefined` on `userKeys.detail(id)` cache
- On error: rolls back
- On settled: `invalidateQueries(userKeys.detail(id))`

### `useDeleteAttachment()`
- DELETE `/users/:id/attachments/:attachmentId`
- **Optimistic update:** removes attachment from `userKeys.attachments(userId)` cache
- On error: rolls back
- On settled: `invalidateQueries(userKeys.attachments(userId))`

### `useUploadAttachments(userId)`
- POST `/users/:id/attachments` (FormData)
- On success: `invalidateQueries(userKeys.attachments(userId))`
- No optimistic (file URLs unknown until server responds)

---

## Loader Integration (React Router)

Loaders in `routes.tsx` are kept but simplified — they now only warm the TanStack Query cache:

```ts
// routes.tsx
export async function userEditLoader({ params }) {
  const id = Number(params.userId);
  await Promise.all([
    queryClient.prefetchQuery({ queryKey: userKeys.detail(id), queryFn: () => fetchUser(id) }),
    queryClient.prefetchQuery({ queryKey: userKeys.attachments(id), queryFn: () => fetchUserAttachments(id) }),
  ]);
  return null; // components read from cache via useQuery
}
```

Components call `useQuery` (not `useLoaderData`). On first render the cache is already warm, so `isLoading` is false immediately.

---

## UI States

Every `useQuery` result exposes the following states. Pages must handle all of them:

| State | Condition | UI |
|---|---|---|
| Loading | `isLoading` (no cached data) | Skeleton or spinner |
| Error | `isError` | Error message + retry button (calls `refetch()`) |
| Empty | `data.length === 0` | Empty state message |
| Background refetch | `isFetching && !isLoading` | Subtle indicator (e.g. a small spinner in the header, not a full-page overlay) |
| Stale | `isStale` | Show existing data, background refetch in progress |

Stale data is always shown immediately (never blank while refetching). Background refetch indicator must not displace content.

---

## Pages Updated

| Page | Change |
|---|---|
| `Users.tsx` | Remove `useEffect`/`useState`; use `useUsers()` + `useDeleteUser()` |
| `UserEdit.tsx` | Remove `useLoaderData`; use `useUser(id)` + `useUserAttachments(id)` + `useUpdateUser()` + `useRemovePhoto()` |
| `UserCreate.tsx` | Replace manual try/catch loading state with `useCreateUser()` |
| `AttachmentsSection.tsx` | Use `useDeleteAttachment()` + `useUploadAttachments()` |
| `routes.tsx` | Loaders call `prefetchQuery` instead of fetching and returning data |

---

## What Is Not Changed

- `AuthContext.tsx` — auth token is client state, not server state. Stays in context.
- `UserService.ts` — kept as-is; query functions can call it or call `api` directly
- `api.ts` — axios instance with interceptors stays unchanged
- `UserForm` validation — React Hook Form + Zod unchanged

---

## Verification

1. `npm start` — app boots, QueryClientProvider in tree
2. Navigate to `/users` — list loads from cache if already visited, else fresh fetch
3. Navigate away and back within `staleTime` — no network request (DevTools confirms)
4. Navigate away and back after `staleTime` — background refetch fires, list updates without spinner
5. Delete a user — list updates immediately (optimistic), confirmed after server response
6. Delete photo — avatar clears immediately, server response confirms
7. Delete attachment — attachment disappears immediately, server confirms
8. Create user — redirects to list, new user appears (via invalidation)
9. Update user — redirects to list, updated data appears
10. Simulate network error on list fetch — error state shown, retry button works
11. Empty list (delete all users) — empty state shown, not a blank page
12. TanStack Query DevTools visible in dev mode — shows cache state, query status
