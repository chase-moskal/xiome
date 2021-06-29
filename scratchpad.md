
## launch

deployment
- [x] dockerized web server
- [x] dockerized node server
- [x] github action publishes docker images to github packages
- [x] write helm chart
- [x] github action publishes helm chart to stage cluster
- [ ] connect frontend to api server
- [ ] sendgrid email is ready
- [ ] production deployments

website
- [ ] rework alpha note
- [ ] refine about page
- [ ] basic components listing

systemic
- [ ] consider revised base41 format
- [ ] consider binary ids
- [ ] rename 'auth' to 'core'



## priorities for alpha launch

website

- [ ] refine about page
- [ ] rework alpha note
- [ ] components listing

refactors

- [ ] rename "auth" to core
  - possibly even split it up into different concerns

- [ ] consider revised base41 format
  - excludes "B" character, looks too similar to "8"

systemic

- [x] mechanism to mark some api features as development-only
  - dev-marked features work in local testing
  - dev-marked features work on staging cluster
  - dev-marked features are disabled on production cluster
  - DONE -- production script simply doesn't expose all the apis

- [ ] dbby binary data type
  - not sure if worth?

deployment

- [x] local dev in mock mode
  - clientside backend for rapid testing
  - can run local node app

- [ ] prerequisite setup
  - prepare server.ts
  - sendgrid account
  - k8s clusters
  - 

- [ ] staging deployment
  - github action, each master commit
  - to kubernetes cluster at https://staging.xiome.io/
  - use fake stripe testing keys

- [ ] production deployment
  - github action, each v tag
  - to kubernetes cluster at https://xiome.io/
  - use real secret keys



--------

## notes

- [x] autowatcher ingest new observables as they are set
   - not necessary; its impossible to get the child without accessing the parent

## work to launch

new concerns

- [x] we need configurable permissions for anons. anonymous must be a system role
  - merge app and access tokens?

- [x] renraku: validation of api method arguments? darkvalley?

- [x] fix gross generate nicknames dependency on fetchUser

systemic

- [x] base 42 ids for whole system
  - implement it
  - new ids for all hardcoded things, permissions, platform app, etc

- [ ] dbby binary data type
  - not sure if worth?

- [o] renames
  - `bankModel` => `storeSettingsModel`
  - `stripeConnectTopic` => `storeSettingsTopic`

- [x] fix share2 typings

- [x] refactor auth goblin
  - replace with new 'auth-mediator'
  - reconsider token store and broadcast channel implementation

ui infrastructure

- [ ] price displays
  - create a plan

- [x] system id displays 
  - design
  - implementation

feature dev for launch

- [x] store status togglability

- [x] prepare subscription plans for launch
  - availability toggle
  - just remove deactivation/deletion for now

- [ ] subscription purchases
  - design
  - implement

- [x] questions board
  - crude port from metalshop
  - fully integrate new permissions

- [ ] livestream
  - crude port from metalshop
  - fully integrate new permissions

- [ ] stripe testing
  - set stripe webhook testing
  - implement all webhook cycles

- [x] finish permissions ui
  - delete custom roles

- [x] admin user search and edit roles

- [ ] technician can disable an entire community/app

deployment

- [ ] mock deployment
  - to gh-pages at https://mock.xiome.io/

- [ ] staging deployment
  - to kubernetes cluster at https://staging.xiome.io/
  - use fake stripe testing keys

- [ ] production deployment
  - to kubernetes cluster at https://xiome.io/
  - use real keys





-------

- new store ui
  - set store status
  - subscription planning ui

- renames?
  - `bankModel` => `storeSettingsModel`
  - `stripeConnectTopic` => `storeSettingsTopic`





TODO - done
- proper error handling for when bank account isn't linked
  - backend
    - new topic `storeStatusTopic`
      - `storeStatusTopic.checkStoreStatus` returns `{available: boolean}`
      - new policy `prospect` -- hasn't entered the store yet, seeing if it's open!?
    - new function `shopkeepingTopic.setEcommerceActive` to set availability
  - frontend
    - new model `ecommerceModel` caches the above result to localstorage
    - other store models can ingest the ecommerceModel to check store availability

- in mock startup, mock link bank account to enable payments by default




## next steps

- mocksite in mockmode, no server

- ui components for subscriptions
  - manage subscriptions for sale
  - buy subscriptions

- brainstorming for digital sales
  - video sales: integrate with vimeo?
  - proof of purchase?




# big picture

### refactor subscriptions

- merge actions and flows into "subscription flows"
- split utilities
  - "stripe subscription utilities"
  - "store subscription utilities"



store/

  api/
    store-api.ts
    policies/
      store-policies.ts
    topics/
      accounting-topic.ts
      shopping-topic.ts
      shopkeeping-topic.ts
    shop-utilities/
      shop-utilities.ts

  stripe/
    liaison/
      stripe-liaison.ts
    webhooks/
      stripe-webhooks.ts
      flows/
        flows.ts
        helpers/
          webhook-helpers.ts
        utilities/
          webhook-utilities.ts








### subscriptions modeling

stripe stuff
- products
- prices
- subscriptions

billing tables
- customers
- subscriptions
  - PROBLEM: each subscription maps to multiple plans
- subscriptionPlans
  - each plan correlates to a stripeProductId

webhooks -- TODO
- checkout.session.completed
  - fulfillSubscription
  - updateSubscription
- customer.subscription.updated
  - respectSubscriptionChange

TODO:
- subscription planner topic
  - clerks can manage stripe products, prices









what happens stories
- when a clerk creates a subscription plan
- when a clerk updates a subscription plan
- when a clerk deletes a subscription plan
- when a customer buys a subscription
- when a customer updates their subscription
- when a customer ends their subscription
- when a clerk assigns a subscription role to a user
- when a clerk deletes a subscription role, or unassigns a user
- when a clerk assigns privileges to a subscription role

questions
- what is a subscription role?





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
- [x] policies
  - merchant
  - clerk
  - customer
- [ ] liaisons
  - platform stripe liaison (for linking accounts)
  - app stripe liaison (for store management and purchases)
- [ ] store topics
  - stripe-connect-topic
    - getStripeConnect
    - generateStripeConnectSetupLink
  - management-topic
    - createSubscriptionPlan
    - updateSubscriptionPlan
    - deleteSubscriptionPlan
  - storefront-topic
    - buySubscription
    - updateSubscription
    - endSubscription

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
