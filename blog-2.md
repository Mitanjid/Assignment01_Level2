# How `Pick` and `Omit` Keep Your TypeScript Code DRY

## Introduction

Every large codebase eventually runs into the same problem: you have one master interface that describes a complete entity, but different parts of the application need only a *slice* of it. The instinctive solution — copy the interface and remove the fields you do not need — creates duplicated type definitions that drift out of sync the moment someone updates the original. TypeScript's `Pick` and `Omit` utility types solve this problem elegantly by letting you derive specialized types directly from a single source of truth.

---

## The Problem: Interface Duplication

Imagine a `User` interface that represents everything stored in your database:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  role: "admin" | "editor" | "viewer";
}
```

Now consider three common needs:

- A **public profile** — `id`, `name`, and `role` only (never expose `passwordHash`)
- A **creation form** — `name`, `email`, and `passwordHash` only (no `id` or `createdAt` yet)
- An **admin update payload** — everything except `id` and `createdAt`

Without utility types, you copy-paste and modify:

```typescript
// ❌ Duplicated — drifts out of sync when User changes
interface PublicProfile {
  id: number;
  name: string;
  role: "admin" | "editor" | "viewer";
}
```

If you later rename `role` to `userRole` in `User`, `PublicProfile` still says `role` and nobody notices until runtime.

---

## `Pick` — Select Only What You Need

`Pick<Type, Keys>` constructs a new type by selecting a subset of keys from an existing type.

```typescript
type PublicProfile = Pick<User, "id" | "name" | "role">;

// Equivalent to:
// {
//   id: number;
//   name: string;
//   role: "admin" | "editor" | "viewer";
// }
```

Now `PublicProfile` is *derived* from `User`. If `User` changes, `PublicProfile` updates automatically — and TypeScript will flag any usage that breaks.

```typescript
type CreateUserPayload = Pick<User, "name" | "email" | "passwordHash">;

function createUser(payload: CreateUserPayload): User {
  // payload.id  → Compile error: Property 'id' does not exist on type 'CreateUserPayload'
  return { ...payload, id: Date.now(), createdAt: new Date(), role: "viewer" };
}
```

---

## `Omit` — Exclude What You Do Not Need

`Omit<Type, Keys>` is the mirror image: it constructs a type with *all* keys of the original *except* the ones you specify. This reads more naturally when you want to keep most fields and drop a few.

```typescript
type AdminUpdatePayload = Omit<User, "id" | "createdAt">;

// Equivalent to:
// {
//   name: string;
//   email: string;
//   passwordHash: string;
//   role: "admin" | "editor" | "viewer";
// }

function updateUser(id: number, payload: AdminUpdatePayload): void {
  // Update logic — id comes from the route, not the body
}
```

When `User` gains a new field like `lastLoginAt: Date`, `AdminUpdatePayload` automatically includes it. No manual synchronization required.

---

## Combining with Other Utilities

`Pick` and `Omit` compose naturally with `Partial` and `Required` for even more precise slices:

```typescript
// A patch payload — id is fixed, all other fields are optional
type PatchUserPayload = Partial<Omit<User, "id" | "createdAt">>;

function patchUser(id: number, changes: PatchUserPayload): void {
  // changes.name might be undefined — caller only sends what changed
}
```

---

## `Pick` vs `Omit` — Choosing the Right Tool

| Situation | Use |
|---|---|
| You want a small subset of a large interface | `Pick` — list what you *want* |
| You want most of an interface minus a few sensitive fields | `Omit` — list what you *reject* |
| The source interface is large and growing | `Omit` — less maintenance as fields are added |
| You need an explicit contract of allowed fields | `Pick` — documents intent clearly |

---

## Conclusion

`Pick` and `Omit` are the TypeScript equivalent of a single source of truth for your data shapes. Instead of maintaining five slightly-different versions of the same interface, you maintain one authoritative definition and derive every specialization from it. When the source changes, all derived types update instantly and the compiler catches every breakage. This is what DRY (Don't Repeat Yourself) looks like at the type level — less duplication, less drift, and far fewer surprises at runtime.
