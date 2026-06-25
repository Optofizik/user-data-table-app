# UsersTable

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.17.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Starts the Angular development server. |
| `npm run build` | Builds the production bundle into `dist/users-table`. |
| `npm run watch` | Builds continuously with the development configuration. |
| `npm test` | Runs Angular unit tests through the configured Vitest builder. |
| `npm run ng -- <args>` | Runs Angular CLI commands through the local project version. |

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Application architecture

The application follows a feature-first Clean Architecture layout under `src/app`.

```text
src/app/
  core/           # singletons: interceptors, guards, error handlers, base API client
  shared/         # reusable dumb components, directives, pipes
  layout/         # AppShell, header, sidebar
  features/
    users/
      data/       # API services, DTOs, mappers
      domain/     # entities/models, interfaces
      state/      # Signal-based state services (stores)
      ui/         # smart + dumb components
      users.routes.ts
  app.config.ts
  app.routes.ts
  app.component.ts
```

Layering rules:

- `ui` depends on `state` and `domain`.
- `state` coordinates use cases and depends on `data` and `domain`.
- `data` owns API calls, DTOs, and mapping into `domain` models.
- `domain` is framework-light and does not depend on `ui`, `state`, or `data`.
- Dependencies flow inward through the feature: `UI -> State -> Data -> Domain`; reverse dependencies are not allowed.
- `core` is for app-wide singletons only. Feature-specific services stay inside their feature folder.
- `shared` contains reusable presentation utilities only and must not depend on feature code.
- `layout` contains application shell components and may compose feature routes, but should not contain feature business logic.

## Signal flow

The users feature keeps state in a single Signal-based store. Components render
readonly signals and emit user intent back to the store.

```mermaid
flowchart TD
  Toolbar["UsersToolbarComponent<br/>search and filters"] -->|setSearch / setActiveFilter / setAgeFilter| Store["UsersStore<br/>private writable signals"]
  Table["UsersTableComponent<br/>sort and infinite scroll"] -->|setSort / loadMore| Store
  Page["UsersPageComponent"] -->|load on init| Store
  Store -->|HttpClient request| Api["UsersApiService<br/>data layer"]
  Api -->|mock JSON mapped to User[]| Store
  Store --> Search["debouncedSearchQuery<br/>250 ms"]
  Search --> Filtered["filteredUsers computed"]
  Store --> Filtered
  Filtered --> Sorted["sortedUsers computed"]
  Sorted --> Visible["visibleUsers computed"]
  Visible --> Page
  Store --> Page
  Page --> Toolbar
  Page --> Table
```

State rules:

- Writable signals are private inside `UsersStore`.
- Public store members are readonly signals or computed selectors.
- Filtering, sorting, pagination, loading, and error state are centralized in the store.
- UI components stay controlled and stateless: inputs render current state, outputs report user intent.

## Decisions log

### Pure signals for feature state

The users feature uses Angular Signals for local feature state because the state
graph is synchronous and UI-driven: search text, filters, sort, pagination, and
derived row sets. Signals keep the dependency graph explicit through `signal`,
`computed`, and `effect`, and avoid introducing a global store library for a
feature that does not need cross-app event orchestration.

RxJS is limited to integration points where it is already the platform contract:
`HttpClient` responses and the `toObservable(...).pipe(debounceTime(...))`
bridge used for search debounce. Persistent feature state remains signal-owned.

### Custom infinite scroll

The app uses a small `appInfiniteScroll` directive instead of a full virtual
scroll or third-party infinite-scroll package. The dataset is modest, the UI only
needs page-reveal behavior, and the current table is rendered by NG-ZORRO. A
sentinel-based `IntersectionObserver` keeps the behavior framework-native,
dependency-light, and independent from table internals.

The directive suppresses emissions while disabled and emits again when re-enabled
if the sentinel is still visible, which prevents loading from stalling after a
page append.

### Search debounce strategy

The toolbar emits every keystroke immediately so the input stays controlled by
the parent/store. The expensive part is delayed in the store:

- `searchQuery` reflects the text box immediately.
- `debouncedSearchQuery` updates after 250 ms of typing inactivity.
- `normalizedSearch` trims and lowercases once in a `computed`.
- Each loaded user gets a precomputed lowercased `searchText`.
- `filteredUsers -> sortedUsers -> visibleUsers` recomputes only when the signals each selector reads change.

This keeps typing responsive while preventing the full filter/sort chain from
running on every keypress.

## Performance

Search and large-list rendering are kept cheap by design (see
[`users.store.ts`](src/app/features/users/state/users.store.ts)):

- **Debounced search.** The search box updates `searchQuery` immediately, but
  filtering reads a `debouncedSearchQuery` (`toObservable → debounceTime(250) →
  toSignal`). Filtering therefore runs at most once per typing pause, not on
  every keystroke.
- **Normalize once, not per row.** The debounced term is trimmed + lowercased a
  single time in a `computed`, and each user carries a precomputed lowercased
  `searchText`. Matching a keystroke is then one `includes` per row with no
  repeated `.toLowerCase()` or string allocation.
- **Memoized selectors.** `filteredUsers → sortedUsers → visibleUsers` are
  chained `computed`s. Each recomputes only when a signal it reads actually
  changes, and the chain short-circuits when an upstream result is unchanged
  (e.g. changing only `loadedCount` re-slices but does not re-filter or re-sort).
- **Small DOM.** `visibleUsers` exposes only the paginated slice revealed by
  infinite scroll, so the rendered row count stays bounded regardless of the
  1,000+ row dataset.
- **OnPush + signals.** All components use `OnPush`; signal reads register
  fine-grained dependencies, so change detection runs precisely where data
  changed instead of dirty-checking the whole tree.

## Mock data

The application is seeded with a dataset of 1,000 users at
[`src/assets/mocks/users.json`](src/assets/mocks/users.json) (served at
`/assets/mocks/users.json`). Each record has the following shape:

```jsonc
{
  "id": "e3745417-332c-47b2-ab17-e2327576309c", // GUID
  "firstName": "Mei",
  "lastName": "Robinson",
  "dob": "1998-01-10",                          // date of birth, yyyy-MM-dd
  "phone": "+1 (982) 564-1101",
  "active": false                                // boolean
}
```

### Regenerating the dataset

The dataset is reproducible with [json-generator.com](https://json-generator.com/).
Paste the template below and generate (it produces between 1,000 and 1,200 users):

```js
[
  '{{repeat(1000, 1200)}}',
  {
    id: '{{guid()}}',
    firstName: '{{firstName()}}',
    lastName: '{{surname()}}',
    dob: '{{date(new Date(1950, 0, 1), new Date(2005, 0, 1), "yyyy-MM-dd")}}',
    phone: '+1 {{phone()}}',
    active: '{{bool()}}'
  }
]
```

Save the output to `src/assets/mocks/users.json`. The committed file was produced
with an equivalent local generator that mirrors this template (GUID `id`,
`dob` formatted `yyyy-MM-dd` between 1950 and 2005, US-formatted `phone`,
boolean `active`).

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
