
# shortlist

- [x] stabilize basic logins
- [ ] fix setProfile and permissions shenanigans
  - [ ] refactors
    - [x] rename auth processors
    - [ ] `constrainTables` should be replaced with `getAuthTables` which composes `constrainTables` and hardbacked permissions tables
  - [ ] integrate hardbacked permissions authtables across the board
  - [ ] implement setProfile by querying the hardbacked tables
  - [ ] rename dbby-hardcoded into dbby-hardbacked?
- [ ] implement platform logins and profile stuff
- [ ] implement app logins and profile stuff

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

---------------------------

# todo list

feature code migration
- [ ] `core`
  - [x] core model implemented
  - [ ] implement auth api
  - [ ] implement apps api
  - [ ] complete core api implementation
  - [ ] migrate popups
  - [ ] all code migrated and structured
  - [ ] reasonable core tests pass
- [ ] `questions`
- [ ] `videos`
- [ ] `pay`
- [ ] search metalshop for any missing code to migrate

new features and systemic changes
- [ ] new permissions system is flexible and cool
- [ ] google avatar can be used, but no longer default
- [ ] new statistics tracking system

website frontends
- [ ] structuring to fit two websites into this repo
- [ ] https://crochet.dev
- [ ] https://feature.farm

k8s
- [ ] new repo structure
- [ ] new microservice dockerization
- [ ] complete code migration and finalization

ci/cd
- [ ] github actions for all deployments and releases to stage
- [ ] production

make it beautiful
- [ ] product is complete
- [ ] backups
- [ ] 2x security pass
- [ ] launch

clientele
- [ ] website refactor in new monorepo, github actions
- [ ] deploy new website
- [ ] register client app, implement features
- [ ] launch

--------

spread the word
- [ ] reddit announcement draft
- [ ] low-key solicit some interns and beta users into discord
- [ ] start streaming, make a good video presentation, get more devs
- [ ] reddit announcement
