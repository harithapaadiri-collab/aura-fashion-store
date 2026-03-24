# Aura Fashion Store

## Current State
Admin panel exists with product management (create, edit, delete). Authorization component handles role-based access (admin/user/guest). Backend exposes `assignCallerUserRole` and `isCallerAdmin` but no way to list registered users or their roles.

## Requested Changes (Diff)

### Add
- Backend: `getAllUsers` query returning all registered principals with their roles
- Frontend: User Management tab in the admin panel showing a table of users with their role and an action to promote/demote them

### Modify
- AdminPage: Add a tab switcher between "Products" and "Users"
- useQueries.ts: Add `useAllUsers` query hook and `useAssignRole` mutation hook

### Remove
- Nothing removed

## Implementation Plan
1. Add `getAllUsers` to backend returning `[(Principal, UserRole)]`
2. Add `useAllUsers` and `useAssignRole` hooks in useQueries.ts
3. Add Users tab to AdminPage with table: principal (truncated), role badge, promote/demote button
4. Admin can paste a principal and assign a role (for adding new admins by principal)
