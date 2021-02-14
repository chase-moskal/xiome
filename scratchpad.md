
## todo

- [x] theory: advanced privileges and claims
  - bans, and premium, which have an expiry
  - stats like joinedDate
- [x] proper app tokens, also fetches
- [ ] core functionality
  - [x] improved xio-text-input
  - [x] app ui, can update homepage
  - [x] refactor app creation forms
  - [x] profile display and editing
  - [x] app basic stats
  - [ ] app admin management
  - [ ] app admin can ban users
- [ ] port all metalshop features
- [ ] separate platform repo and establish orchestration and ci/cd

## permissions explained

permissions model
- topic methods can require certain privileges in an access token
- privileges have labels like `edit_any_profile`
- roles have labels like `fancy_person`
- multiple privileges can be assigned to each role
- multiple roles can be assigned to each user
- when a user gets an access token, it's packed with the roles and privileges said user has

hardcoded vs customizable permissions
- there's a core set of permisisons that are hardcoded into the permisisons tables
  - sets out the concept of `admin` and enables them to customize their app's permissions
- on top of that, there's a layer of customizable permissions
- we know the platform app id on startup
- [ ] PROBLEM: we can't hardcode every app id upon startup
  - we don't have a mechanism to constrain the permissions tables but also provide the hardcoded fallback values for every app id
  - notice that there's no problem here for the platform app: we know the platform app's id from the config, so we can initialize the hardcoded permissions to use this appid
  - the problem is that the other apps are not hardcoded, not known at startup
  - how can we obtain an app's customizable permissions, but also the universal defaults (cannot be hardcoded)
  - possible solutions:
    - a new dbby fallback mechanism of some kind
    - a new processing step which dynamically adds a special hardcoded fallback layer for all non-platform apps
    - (BIGBRAIN) getTables function now dynamically provides tables, conditionally hardcoding permissions

apps vs platform
- all permissisons tables are constrained by appid

## topic auth processing explained

- we use `processAuth` on every topic to preprocess each request's `meta` information into usable request payload information
- `processAuth` requires you to specify an "auth processor", which determines how that meta information is processed. examples of auth processsors include:
  - `processRequestForAnon` process auth for an anonymous user, on any app (platform app or otherwise)
    - provides app payload
    - provides constrained tables
  - `processRequestForUser` process auth for an authenticated user, on any app (platform app or otherwise)
    - extends processRequestForAnon above
    - addition: throws error if access token isn't valid
    - addition: provides access payload
  - `prepareUserOnPlatform` process auth for authenticated user, but only allow access to the platform
    - extends processRequestForUser above
    - addition: throws error if the app being accessed isn't the platform app (only allows requests for platform app)
- a `constrainTables` function is given to the auth processors
  - this specially prepared function will return the database table accessors our topic needs
  - this function is primed ahead of time to provide only the tables we need
  - this function also hardbacks the privilege tables
