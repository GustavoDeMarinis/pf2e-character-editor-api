# CLAUDE.md — pf2e-character-editor-api

## Project Overview
Backend REST API for a Pathfinder 2e character editor. Players & admins manage characters, ancestries, heritages, classes, weapons, armor, etc.

**Stack:** Node 20 · Express 4 · TypeScript (strict) · Prisma 6 · PostgreSQL · AJV (json-schema) · `json-schema-to-ts` · Jest + `@swc/jest` + `jest-mock-extended` · Winston · Helmet · bcrypt · JWT (cookie) · swagger-ui-express.

**Auth model:** access JWT in `access_token` cookie + opaque refresh token in `refresh_token` cookie (`<sessionId>:<rawToken>`, hashed in `Session`). CSRF middleware applied globally; enforces on non-safe methods (POST/PATCH/PUT/DELETE), exempts `/auth/signIn`, `/auth/signUp`, `/auth/refresh`. Roles: `Admin`, `Player`.

**Required env vars:** `DATABASE_URL`, `JWT_SECRET_KEY` (≥64 chars), `JWT_ACCESS_TOKEN_EXPIRY` (default `15m`), `REFRESH_TOKEN_EXPIRY_DAYS` (default `30`), `USER_DEFAULT_PASSWORD`, `ENV` (`local`|`prod`), `CORS_ORIGIN` (required in prod), `DOCS_ENABLED` (optional — enables `/api-docs` in prod).

## File Structure
```
prisma/
  schema.prisma
  seed.ts                              # entrypoint, calls seedLocal()
  migrations/<timestamp>_<name>/migration.sql
  seeders/local/
    local-seed.ts                      # orchestrator (await order matters)
    seed-<entity>.ts                   # exports <entity>Ids map + seedLocal<Entity>()
    utils/cuid-generator.ts
src/
  index.ts                             # boots app
  app.ts                               # express middleware chain
  router.ts                            # mounts /<entity> routers + /api-docs
  config.ts                            # env validation, exports `config`
  api/<entity>/
    <entity>.ts                        # service layer (DB)
    <entity>-api.ts                    # handlers (req → service → response)
    <entity>-api.schema.ts             # AJV schemas (`as const`)
    <entity>-api.types.ts              # FromSchema<...> types
    index.ts                           # express-promise-router + authorize()
    test/<entity>.test.ts              # service-layer unit tests
  swagger/
    config.ts                          # swaggerDocument, apiDocsMiddleware
    error.swagger.ts                   # commonErrorsResponseSchema
    security.swagger.ts                # cookieAuth scheme
    <entity>/<entity>.swagger.ts       # paths object: <entity>Paths
  middleware/
    error-handler.ts                   # globalErrorHandler (AJV+Prisma+ErrorResult)
    request-id.ts, request-logger.ts
    security/{authorization,csrf,rate-limit}.ts
    validators/{ajv-validator,ajv-validator-error}.ts
  integrations/prisma/prisma-client.ts # singleton, global cache in non-prod
  testing/
    fakes.ts                           # getFake<Entity>() helpers
    mock-prisma.ts                     # jest.mock + DeepMockProxy
    mock-pagination.ts                 # mockCount(model, n)
  types/express.d.ts                   # Request augmentation (req.auth, req.id)
  utils/
    shared-types.ts                    # ErrorCode, ErrorResult, SearchResult, PaginationOptions
    http-response-factory.ts           # createGet/Post/Patch/Delete/ErrorResponse
    pagination.ts                      # getPaginationOptions, getQueryCount (via aggregate)
    pagination.types.ts                # paginationRequestPropertySchema, etc.
    schema.types.ts                    # CommonDeserializationOptions
    sorting.ts                         # handleSort("-name,foo.bar") → orderBy[]
    exceptions.ts                      # isErrorResult
    logging.ts                         # logError/Warning/Info/Debug (winston)
    global-const.ts                    # pinned cuid maps (weaponGroupIds, traitIds, armorGroupIds)
    regexs.ts                          # checkInputPasswordFormat
issues/ISSUE-*.md                      # backlog; each has Implementation Checklist
.claude/                               # tool settings (do not write business logic here)
```

## Naming Conventions
- **Module folder & route prefix:** `kebab-case` (`armor-base`, `character-class`, `weapon-base`). Mounted as `/armor-base`, etc.
- **Files:** `kebab-case.ts`. Service = `<entity>.ts`. Handlers = `<entity>-api.ts`. Schemas = `<entity>-api.schema.ts`. Types = `<entity>-api.types.ts`. Swagger = `<entity>.swagger.ts`. Test = `<entity>.test.ts`.
- **Prisma models:** `PascalCase` singular (`Heritage`, `WeaponBase`). FK columns: `<relation>Id` (`ancestryId`, `weaponGroupId`).
- **DB / TS fields:** `camelCase` (`hitPoints`, `armorClass`, `createdAt`).
- **Enums:** `PascalCase` type, `PascalCase` values (`Rarity.Common`, `UserRole.Admin`, `Attribute.Strength`).
- **AJV schema exports:** `<entity><Op>RequestBodySchema` / `<entity><Op>ResponseSchema` / `<entity>RequestParamsSchema` / `<entity>SearchRequestQuerySchema`. GET-and-POST share `<entity>GetPostResponseSchema`.
- **Type exports:** `<Entity><Op>RequestBody`, `<Entity><Op>Response`, `<Entity>RequestParams`, `<Entity>SearchRequestQuery`.
- **Service exports:** `search<Entities>`, `get<Entity>`, `insert<Entity>`, `update<Entity>`, `delete<Entity>`. Handlers: `handleSearch<Entity>`, `handleGet<Entity>`, etc.
- **Selects / args / result type:** `<entity>Select`, `<entity>Args` (built via `Prisma.validator<...DefaultArgs>()({ select })`), `<Entity>Result = Prisma.<Entity>GetPayload<typeof <entity>Args>`.
- **Swagger paths constant:** `<entity>Paths`, keyed by route literal (`"/heritage"`, `"/heritage/{heritageId}"`).
- **Seeder id maps:** `<entity>Ids` (camelCase keys). Pinned cuid strings — do not regenerate.

## Code Patterns

### Service layer (`src/api/<entity>/<entity>.ts`)
```ts
const subService = "<entity>/service";

export const <entity>Select = { id: true, createdAt: true, updatedAt: true, deletedAt: true, name: true, /* …, nested: { select: { name: true } } */ };
export const <entity>Args = Prisma.validator<Prisma.<Entity>DefaultArgs>()({ select: <entity>Select });
export type <Entity>Result = Prisma.<Entity>GetPayload<typeof <entity>Args>;

type <Entity>ToInsert = Pick<Prisma.<Entity>UncheckedCreateInput, …> & { traitIds: string[]; /* M:N FK arrays carry an `Ids` suffix */ };
```
- **Search:** `(search, { skip, take }, sort?) → Promise<SearchResult<T> | ErrorResult>`. Strip `isActive` and array-FK filters from `search`, build `Prisma.<Entity>WhereInput`, apply `where.deletedAt = !isActive ? { not: null } : null` only when `isActive !== undefined`. Stripped array-FK filters must be re-attached as relational clauses (not spread directly): `traits: { every: { id: { in: traitIds } } }` for M:N, `attributeBoost: { hasEvery: attributeBoost }` for scalar arrays. Call `findMany({ select, skip, take, orderBy: handleSort(sort), where })` then `getQueryCount(prisma.<entity>, where)`. Log with `logDebug({ subService, message, details: { count, filter: where } })`.
- **Get by id:** uses `findUniqueOrThrow({ where: { id }, select: <entity>Select })`. Prisma `P2025` is caught by the global error handler and maps to 404. **Does NOT filter `deletedAt`** — soft-deleted records are still reachable by direct id lookup. Soft-delete only hides records from `search`. Do not change this in new modules.
- **Insert:** validates FKs first with `findUnique({ select: { id: true }, where: { id: fkId } })` → return `ErrorCode.NotFound` (404) if missing. Then checks name conflict using `findFirst({ select: { id: true, deletedAt: true }, where: { name, /* scope FKs if needed e.g. ancestryId */ } })` — return `ErrorCode.DataConflict` (409) only if `existing && !existing.deletedAt` (leaving deleted records available for reactivation). Build `data` with `traits: { connect: traitIds.map((id) => ({ id })) }`, return `prisma.<entity>.create({ select, data })`. FK-not-found is always **404**, not 400. See [src/api/heritage/heritage.ts:96](src/api/heritage/heritage.ts#L96).
- **Update:** typed as `Pick<Prisma.<Entity>UncheckedUpdateInput, …> & { traitIds?: string[] }`, optional `reactivate?: false` param sets `deletedAt = null`. Use `set` (not `connect`) for M:N replacements: `traits: { set: traitIds?.map((id) => ({ id })) }`. Returns raw Prisma model — handler responds 204 with no body.
- **Delete** is **soft-only**: load `{ deletedAt: true }`, return `ErrorCode.NotFound` if missing or already-deleted, then `update({ data: { deletedAt: new Date() } })`. Never `prisma.<entity>.delete()`.
- **Owner-scoped operations (user-owned entities only — e.g. Character, not catalog entities like Heritage/Ancestry):** pass `callerAuth: { userId, role }` to service functions. Branch on `role !== UserRole.Admin` to add `OR: [{ createdByUserId }, { assignedUserId }]` for searches, or call `isOwner()` to gate get/update/delete. Do not apply this pattern to content-catalog entities. See [src/api/character/character.ts:117](src/api/character/character.ts#L117).

### Route handlers (`<entity>-api.ts`)
Thin: validate, call service, hand to factory. Five handlers per CRUD entity. Each is `async (req, res): Promise<Response<<Op>Response> | Response<ErrorResponse>>`. Tests cover the service layer only — do not add handler-level or integration tests.
```ts
const { pageOffset, pageLimit, sort, ...query } = validateJSONSchemaObject<HeritageSearchRequestQuery>(heritageSearchRequestQuerySchema, req.query);
const pagination = getPaginationOptions({ pageLimit, pageOffset });
const results = await searchHeritages(query, pagination, sort);
return createGetArrayResponse<HeritageResult>(res, results, { pagination });
```
Use `createGetResponse` / `createPostResponse(req, res, …)` (sets Location header, returns 201) / `createPatchResponse` (204) / `createDeleteResponse` (204). Never `res.json` directly. See [src/api/heritage/heritage-api.ts](src/api/heritage/heritage-api.ts).

### AJV schemas (`<entity>-api.schema.ts`)
Every schema is `… as const`. Build a `commonXProperties` const for shared fields, spread into `searchResponse.items.properties` and `getPostResponseSchema.properties`. Required schemas per module: `searchRequestQuery`, `searchResponse`, `requestParams`, `getPostResponse`, `postRequestBody`, `patchRequestBody`. Pagination: spread `paginationRequestPropertySchema` / `paginationResponsePropertySchema` from [src/utils/pagination.types.ts](src/utils/pagination.types.ts). Ids use `{ type: "string", checkIdIsCuid: true }` (custom AJV keyword in [src/middleware/validators/ajv-validator.ts:25](src/middleware/validators/ajv-validator.ts#L25)). PATCH bodies use `anyOf: [{ required: ["a"] }, …]` to require ≥ 1 field. Datetimes use `format: "date-time"` or `format: "date-time-nullable"`. Enums via `Object.values(<Enum>)`. AJV is configured with `coerceTypes: "array"` — query strings are automatically coerced: repeated params (`?traitIds=a&traitIds=b`) become arrays, numeric strings become numbers (`pageOffset`), and `"true"`/`"false"` become booleans (`isActive`). No manual parsing needed in handlers.

### Types (`<entity>-api.types.ts`)
One-liner exports only:
```ts
export type HeritagePostRequestBody = FromSchema<typeof heritagePostRequestBodySchema, CommonDeserializationOptions>;
```
GET and POST responses both use `<entity>GetPostResponseSchema`. Request-params types omit `CommonDeserializationOptions`.

### Router (`<entity>/index.ts`)
`Router()` from `express-promise-router`. Each route: `authorize({ roles: [...] })` then handler. Mounting in [src/router.ts](src/router.ts) is `router.use("/<kebab-entity>", <entity>Router)`.

**Go-forward auth rule for new domain entities (Hard Rule #8):** GET / GET-by-id = `[Admin, Player]`. POST / PATCH / DELETE = `[Admin]` only. Heritage is the canonical reference.

Existing modules split into two categories:
- **Intentional `[Admin, Player]` with service-layer guards** — do not change: `character` (owner-scoped via `callerAuth`/`isOwner`; Players may only mutate their own), `user` (self-service; service guards enforce same-user-only).
- **Auth drift — should be Admin-only but aren't** (legacy, see Inconsistencies #4): `ancestry`, `character-class`, `weapon-base`, `armor-base`, `language`, `skill`. Do not propagate this pattern into new modules.

Other auth tiers in this codebase:
- **Public** (no `authorize()`): `/auth/signIn`, `/auth/signUp`.
- **Rate-limited public:** `/auth/refresh`.
- **Authenticated, no role gate** (`authorize()` with no `roles` arg): `/auth/me`, `/auth/sessions*`, `/auth/signOut`.
- `/api-docs` is wrapped in `rejectDocsInProd` + `apiDocsMiddleware`.

### Seeders (`prisma/seeders/local/seed-<entity>.ts`)
1. Export an `<entity>Ids` const map of pinned cuids (generated via `npm run generate-cuid`).
2. `build<Local><Entity>()` returns `Prisma.<Entity>UncheckedCreateInput[]` referencing other seeders' id maps for FKs.
3. `export const seedLocal<Entity> = async (): Promise<{ <entity>: …[] }> => { … }`. Choose flavor based on data shape:
   - **Scalar-only rows** (no relational `connect` clauses): `prisma.<entity>.createMany({ data })` — traits, users, classes.
   - **Rows with relational `connect` clauses** (any M:N or FK relation in data): `prisma.$transaction(items.map(i => prisma.<entity>.create({ data: i })))` — ancestries (languages connect), heritages (ancestry FK), armorBases (armorGroup FK).
4. Add an **awaited** call in [prisma/seeders/local/local-seed.ts](prisma/seeders/local/local-seed.ts) — order matters (parents before children: users → traits → languages → ancestries → heritages → classes → characters → weapon stack → armor stack → skills → actions).

### Swagger (`src/swagger/<entity>/<entity>.swagger.ts`)
Per operation: object with `tags: ["<Entity>"]`, `description` (markdown), `operationId`, `security: [securitySchema]`, `parameters` (read each from `<schema>.properties.<name>`), optional `requestBody`, `responses: { "200"|"201"|"204": …, ...commonErrorsResponseSchema }`. Path-id parameters live in a shared `parameterId.parameters`, spread into the `/{id}` route entry. Export `<entity>Paths` and register it in [src/swagger/config.ts](src/swagger/config.ts) by importing + spreading into `swaggerDocument.paths`.

### Tests (`src/api/<entity>/test/<entity>.test.ts`)
**Service-layer unit tests only.** No handler-level or integration tests. Uses `prismaMock` from [src/testing/mock-prisma.ts](src/testing/mock-prisma.ts) (deep-mocked, reset before each test). Add `getFake<Entity>(partial?)` to [src/testing/fakes.ts](src/testing/fakes.ts) when introducing a new model. Count via `mockCount(prismaMock.<entity>, n)`. Cases always covered:
- `search`: returns items, handles empty.
- `get`: returns by id; throws when `findUniqueOrThrow` rejects.
- `insert`: happy path; FK not-found returns 404 `ErrorCode.NotFound` (when applicable); duplicate-name returns 409 `ErrorCode.DataConflict` (when applicable).
- `update`: happy path; not-found (when service guards it).
- `delete`: soft-deletes; 404 when missing; 404 when already deleted.

## Hard Rules
1. **CUID ids only** — `id String @id @default(cuid())`. AJV id params validated with `checkIdIsCuid: true`.
2. **Standard timestamps on every model:** `createdAt`, `updatedAt`, `deletedAt: DateTime?`.
3. **Soft-delete only.** Never call `prisma.x.delete()`. Use `update({ data: { deletedAt: new Date() } })`. Soft-delete hides records from `search` (via `isActive` filter) but NOT from `get` by id.
4. **Reads use explicit select; mutations may return raw.** `search` and `get` always declare and pass `<entity>Select`. `update` and `delete` may return raw Prisma types — their handlers respond 204 with no body, so the raw type is never sent to the client.
5. **No `any`.** TS `strict` is on. Use Prisma generics (`Prisma.<Entity>WhereUniqueInput`, `Prisma.<Entity>UncheckedCreateInput`, etc.). Accepted legacy exceptions: `getQueryCount` in `pagination.ts` and `mockCount` in `testing/mock-pagination.ts`.
6. **Errors flow as `ErrorResult`,** never thrown from services. Handlers pass them to `createXResponse`, which routes to `createErrorResponse` and maps `ErrorCode → StatusCode`. Throwing is reserved for AJV validation and Prisma errors caught by `globalErrorHandler`.
7. **Validate at the edge** with `validateJSONSchemaObject<T>(schema, raw)` — never trust `req.body`/`req.params`/`req.query` directly.
8. **Mutations are role-gated.** New domain CRUD: GET = `[Admin, Player]`, POST/PATCH/DELETE = `[Admin]` (heritage is the reference).
9. **All M:N FK arrays in request bodies use the `Ids` suffix** (`traitIds`, `languageIds`). Service strips them and emits `connect` (on create) / `set` (on update).
10. **No new files outside the module template.** A new entity = `src/api/<e>/{e.ts, e-api.ts, e-api.schema.ts, e-api.types.ts, index.ts, test/e.test.ts}` + `src/swagger/<e>/<e>.swagger.ts` + `prisma/seeders/local/seed-<e>.ts` + a fake in `src/testing/fakes.ts`.
11. **Logging is structured.** `logDebug/Info/Warning/Error({ subService, message, details })`. Never `console.log` outside `config.ts` boot errors.
12. **Cuids in seeders are pinned.** Reusing or rotating an id breaks downstream FKs in other seeders. Generate new ones via `npm run generate-cuid`.
13. **FK-not-found is always 404**, never 400. Return `{ code: ErrorCode.NotFound, message: "<Entity> not found" }` when a required FK target does not exist.
14. **Schema migrations require user confirmation.** When a Schema & Migration checklist section is executed, edit `prisma/schema.prisma` only. Do NOT run `prisma migrate dev` — stop and tell the user to run `npx prisma migrate dev --name <name>`.
15. **`findFirst` for name-conflict checks**, not `findMany`. Pattern: `prisma.<entity>.findFirst({ select: { id: true, deletedAt: true }, where: { name: value } })` — then check `if (existing && !existing.deletedAt)` in code. Do NOT filter `deletedAt` in the query; selecting it lets you distinguish active conflicts (409) from soft-deleted ones (no conflict — could be reactivated). **Scope by parent FK when the entity is parented** (e.g., Heritage → `where: { name, ancestryId }`); use global scope for standalone entities (e.g., Language → `where: { name }` only). Use `findMany` only when you explicitly need all matching records for a different reason.

## Issue Execution Protocol
- Issues live in `issues/ISSUE-*.md` and end with an **Implementation Checklist** grouped by section (Schema & Migration / Module Scaffold / Router Wiring / … / Seeder / Swagger / Testing / Final Verification).
- When the user says **"Implement section N"** or **"Implement [section name]"**, execute ONLY that section's checkboxes.
- Do not modify files outside the section's scope unless the section explicitly requires it.
- Do not refactor unrelated code, fix unrelated bugs, or rename anything not listed.
- **Hard Rules are non-negotiable and override issue text.** If an issue contradicts a Hard Rule, stop and ask the user before proceeding.
- If the issue text contradicts existing code/conventions (but not a Hard Rule), follow the issue and surface the conflict in the response.
- Mark checklist items `[x]` only after the corresponding code/test/doc is in place.
- Never run `prisma migrate dev` automatically — that's a user-confirmed step (see Hard Rule #14). `npm test` and `npx tsc --noEmit` are pre-allowed.
- When unsure, ask before guessing (see below).

> **Constraints Format:** When generating or reviewing issues, all design decisions must be stated as non-negotiable constraints, not as deliberation. Wrong: "Decide: either (a) nullable ancestryId or (b) separate model. Recommended: (b)." Right: "Versatile Heritages are OUT OF SCOPE. ancestryId is REQUIRED, never nullable." If a decision hasn't been made yet, ask the user — don't embed options into the issue.

> **Expected Behavior Snapshots:** Issues should include an **Expected Behavior Snapshots** section with example request/response pairs for the happy path and key error cases. When executing a section, use these snapshots as the source of truth for response shape, status codes, and error messages. When writing tests, derive assertions from these snapshots. Format:
> ```
> POST /heritage (201):
> Request:  { "name": "Rock Dwarf", "ancestryId": "clx_dwarf", "rarity": "Common", "traitIds": [] }
> Response: { "id": "...", "name": "Rock Dwarf", "ancestryId": "clx_dwarf", "rarity": "Common", "traits": [] }
>
> POST /heritage — ancestry not found (404):
> Request:  { "name": "Rock Dwarf", "ancestryId": "nonexistent", "rarity": "Common", "traitIds": [] }
> Response: { "error": { "code": 404, "message": "Ancestry not found" } }
>
> POST /heritage — duplicate name within ancestry (409):
> Request:  { "name": "Rock Dwarf", "ancestryId": "clx_dwarf", "rarity": "Common", "traitIds": [] }
> Response: { "error": { "code": 409, "message": "A heritage with that name already exists for this ancestry" } }
>
> POST /heritage — missing token (401):
> Response: { "error": { "message": "jwt expired" } }    ← token missing/invalid
>
> POST /heritage — Player role (403):
> Response: { "error": { "message": "Forbidden" } }      ← valid token, wrong role
> ```

### Reference File Map
Open these files as read references before executing the corresponding checklist section. Do not modify reference files unless the section explicitly targets them.

| Checklist Section | Files to have open (as reference) |
|---|---|
| **Schema & Migration** | `prisma/schema.prisma` |
| **Module Scaffold** | `src/api/heritage/heritage.ts`, `src/api/heritage/heritage-api.ts`, `src/api/heritage/heritage-api.schema.ts`, `src/api/heritage/heritage-api.types.ts`, `src/api/heritage/index.ts`, `src/utils/shared-types.ts`, `src/utils/pagination.types.ts`, `src/utils/schema.types.ts` |
| **Router Wiring** | `src/router.ts`, `src/api/heritage/index.ts` |
| **Parent Entity Integration** (e.g. Ancestry Integration, Character Integration) | The parent entity's `<entity>.ts` and `<entity>-api.schema.ts` — e.g. `src/api/ancestry/ancestry.ts`, `src/api/ancestry/ancestry-api.schema.ts` |
| **Seeder** | `prisma/seeders/local/local-seed.ts`, `prisma/seeders/local/seed-ancestry.ts`, `src/utils/global-const.ts` |
| **Swagger Documentation** | `src/swagger/config.ts`, `src/swagger/heritage/heritage.swagger.ts`, `src/swagger/error.swagger.ts`, `src/swagger/security.swagger.ts` |
| **Testing** | `src/testing/fakes.ts`, `src/testing/mock-prisma.ts`, `src/testing/mock-pagination.ts`, `src/api/heritage/test/heritage.test.ts` |
| **Final Verification** | No reference files needed. Run `npm test` and `npx tsc --noEmit`; visit `/api-docs` and confirm the new tag renders. |

**When executing a Parent Entity Integration section**, the changes to the parent module follow a fixed three-step pattern:
1. **`<parent>.ts`** — extend `<parent>Select` with the new child under a nested select: `heritages: { select: { id: true, name: true, rarity: true } }`.
2. **`<parent>-api.schema.ts`** — add the child to `common<Parent>Properties`, then add the field name to the `required` array in both the search-response schema and the get/post-response schema.
3. **`<parent>-api.types.ts`** — no manual changes; `FromSchema` picks up the schema change automatically.

### Issue Generation Protocol
When asked to generate or draft a new issue, follow this structure exactly:

1. **Objective** — what and why, 2–3 sentences max.
2. **Data model** — exact Prisma schema additions as a code block. Both sides of every relation, `@@index` on every FK.
3. **API surface** — route table with method, path, auth (`Admin` / `Admin+Player` / `Authenticated` (any valid token, no role gate) / `Public`), and one-line description.
4. **Constraints** — every decision stated as a fact, not a question. Out-of-scope items listed explicitly (e.g. "Versatile Heritages are OUT OF SCOPE for this issue").
5. **Expected Behavior Snapshots** — at least one happy-path per route, one FK-not-found 404 (if applicable), one duplicate-name 409 (if applicable), one 401 (missing/invalid token), one 403 (valid token, wrong role).
6. **Depends on** — issue IDs that must be completed first.
7. **Acceptance criteria** — observable, testable outcomes (endpoint responses, migration runs, `/api-docs` renders), not implementation details.
8. **Implementation Checklist** — sequenced, grouped by concern (use the section names from the Reference File Map above), granular enough that each checkbox is one Claude execution unit. Each group must be independently executable via "Implement section N".
9. **Reference File Map** (optional override) — only include if this issue's sections deviate from the global map above.

Never embed unresolved decisions. If information is missing, ask the user before writing the issue.

## When You're Unsure — Ask, Don't Assume

### During implementation
- **Cross-cutting changes:** "Should this change apply to module X too, or scope to Y only?"
- **Auth scope for a new mutation:** "Admin-only (heritage pattern) or Admin+Player (legacy pattern)?"
- **FK validation depth:** "Should `<service>` return 404 on a missing FK, or rely on Prisma `P2003` via the global handler?"
- **Soft-delete semantics on lookup:** "The issue says `get<Entity>` should return 404 for deleted records — should I add a `deletedAt: null` check, or follow the existing modules where `get` returns the record regardless?"
- **Migration shape:** "Required column or optional with backfill seed?"
- **Seed data scope:** "Just the Player Core entries from the issue, or all currently-supported books?"
- **Schema bug encountered mid-work** (e.g. `hitpoints` vs `hitPoints`): "Fix in-place here or open as ISSUE-06 follow-up?"
- **Cross-section bleed:** "This checkbox requires changing a file that belongs to a different section — should I do it here or flag it?"

### During issue authoring
- **Issue content gap:** "The issue doesn't specify the response shape for this error case — should I infer from the heritage module or ask?"
- **Versatile/cross-cutting domain decisions** (e.g. multi-ancestry heritage, cross-class feats): "Defer to a follow-up issue and note in swagger, or model now?"
- **Owner-scoped access on a new entity:** "Is this a user-owned entity (apply `callerAuth`/`isOwner` pattern) or a content catalog (no ownership, Admin-gated mutations only)?"

## Inconsistencies Found
Flagged so they don't get copy-pasted into new modules. Ordered by severity.

### Runtime bugs (fix before merging)
1. **`hitpoints` vs `hitPoints` mismatch** ([src/api/character/character.ts:48](src/api/character/character.ts#L48), [src/api/ancestry/ancestry.ts:28](src/api/ancestry/ancestry.ts#L28)) — the Prisma column is `hitPoints` but selects reference `hitpoints` (lowercase). Breaks at runtime. Tracked in ISSUE-06.
2. **`prisma/seed.ts` does not await `seedLocal()`** ([prisma/seed.ts](prisma/seed.ts)) — async seeders may exit before completing. The `main()` function calls `seedLocal()` without `await`. Do not propagate this in new seeders.
3. **`format: "date-time-nullable"` is not a registered AJV format.** It appears in schemas (e.g. `heritageSearchRequestQuerySchema`) but [ajv-validator.ts](src/middleware/validators/ajv-validator.ts) only registers `checkIdIsCuid`. AJV silently skips unknown formats, so `deletedAt` receives no format check. Needs investigation — may require registering a custom format.

### Security / auth
4. **Authorization drift on mutations.** Only `heritage` enforces admin-only POST/PATCH/DELETE. `ancestry` ([src/api/ancestry/index.ts:25](src/api/ancestry/index.ts#L25)), `character-class`, `weapon-base`, `armor-base`, `language`, `skill` all allow `Player` to mutate. **For new modules, follow the heritage rule (Hard Rule #8).**

### Schema / data bugs
5. **Wrong path-param names.** [src/api/ancestry/index.ts](src/api/ancestry/index.ts) uses `:characterId` for ancestry routes; [src/api/language/index.ts](src/api/language/index.ts) uses `:characterId` for language routes. Should be `:ancestryId`, `:languageId`. Validators don't catch this because the schemas read from `req.params` by name after AJV coercion.
6. **Character POST schema** ([src/api/character/character-api.schema.ts:309](src/api/character/character-api.schema.ts#L309)) lists `classDc` in `required` but never declares it in `properties`. Same schema lists `createdUserId`/`assignedUserId` in response `required` but properties define `createdByUser`/`assignedUser` (nested objects, not plain ids).
7. **`seed-heritage.ts` is missing Elf, Halfling, Gnome heritages** that the issue checklist marks `[x]` ([prisma/seeders/local/seed-heritage.ts:19](prisma/seeders/local/seed-heritage.ts#L19) only seeds Human, Goblin — Dwarf entries are declared in `heritageIds` but not built). Confirm with user before adding.

### Cosmetic / low severity
8. **Inconsistent test filename casing.** [src/api/character-class/test/characterClass.test.ts](src/api/character-class/test/characterClass.test.ts) is camelCase; everything else is kebab-case. New tests use kebab-case (`<entity>.test.ts`).
9. **`getQueryCount` and `mockCount` accept `any`** — pragmatic legacy, but new utility code should avoid `any`.
10. **`config.LOCAL_SALT_ROUNDS` is named "local" but applies in prod too** ([src/config.ts:38](src/config.ts#L38)) — minor naming bug.
