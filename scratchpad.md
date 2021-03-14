
# big picture

how the store works
- subscriptions
  - subscriptions are tied to the core permissions system
  - each subscription plan is bould to a role
  - all subscription-oriented roles are marked as "hard" as they must be managed by the system
- products
  - digital product ownership is kept separately by the store system

store feature refactor
- [x] big braining
  - roles/userhasroles/userhasprivileges should be marked `hard`, because they are being managed by the system, they may not be directly manipulated by admins or other app staff
- [x] rename 'pay' feature to 'store'
- [ ] policies
  - merchant
  - customer
  - manager
- [ ] liaisons
  - platform stripe liaison (for linking accounts)
  - app stripe liaison (for store management and purchases)
- [ ] topics
  - merchant link topic
    - getLinkedAccount
    - createAccountOnboardingLink
    - createAccountUpdateLink
  - store manager topic
    - createSubscriptionPlan
    - updateSubscriptionPlan
    - deleteSubscriptionPlan
  - store customer topic
    - buySubscription
    - updateSubscription
    - endSubscription
  - gifting topic
    - giftSubscription

ALPHA 10

- [ ] cash money 3
  - bank links
  - customize subscriptions
  - users can buy subscriptions
  - handle changes to ongoing subscriptions.. what ifs:
    - price changes?
      - maybe we can send emails notifying about price changes?
    - subscription plan is deleted?
      - maybe subscription plans are undeletable?
    - role is fucking deleted?
      - maybe roles with ongoing subscribers are undeletable?
  - subscriptions play nice with gift periods

- [ ] basic features 2
  - gravatars
  - port basic questions board
  - port livestream

- [ ] deployments 4
  - settle on repo strategy for continuous deployments
  - master deploy to `testing.xiome.io`
  - tags deploy to `xiome.io`

- [ ] components page 1
  - utilitarian design for devs to use

BETA 7

- [ ] feature: video paywall 2
  - strategy for digital sales
  - serving videos, eg vimeo vs own media server

- [ ] security features 2
  - api rate-limiting and etc
  - "logout all devices" button
    - security measure if user leaks a login or refresh token
    - invalidates all existing login and refresh tokens

- [ ] systemic upgrades and fixes 3
  - binary system ids
  - organize source code
  - fix and clean testing
  - fix table namespacing
  - improve clientside error handling
    - invalid tokens
    - cannot connect to xiome

GAMMA 6

- [ ] feature: community forums 4
  - users can have discussions, probably replaces questions board

- [ ] pretty components page 2
  - might include fancy no-code configuration to customize snippets
  - might include interactive of the configured component







----

## current payment works

bank account linking
- [ ] complete the popup/return workflow
- [ ] test it

subscription system
- [ ] create and manage subscription plans
  - entirely disabled until successful stripe link
  - a subscription plan is associated with one role

features for premium
- [ ] permissions
  - features can declare hard-coded permissions

------

## payments and premium

- [ ] link sub stripe accounts
  - [ ] 

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
  - [x] app admin management
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
