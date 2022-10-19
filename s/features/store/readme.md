
xiome store feature
===================

> ⚠️ known deficiencies:
> - retry mechanisms that handle stripe rate-limiting is not implemented. it should be.
> - handling for closed stripe accounts is not implemented. it should be.

the store feature allows xiome community creators ("merchants") to sell subscriptions and digital products to customers.

- it's a stripe integration.
- as a platform, xiome has its own stripe account.
- merchants can connect one stripe account of their own as a connected stripe sub-account.
- xiome can take a fee on the sub-account transactions.

### subscriptions

- merchants can sell tiered subscription plans, which are awarded to customers as *roles* in the xiome permissions system.
- merchants can associate whatever privileges they want, to a subscription tier's role.

### digital products

- *coming soon*

<br/>

what conceptual features are expressed across the structure?
------------------------------------------------------------

#### `<xiome-store-connect>`
- interface for merchants to link their own stripe accounts to the xiome platform stripe account.

#### `<xiome-store-customer-portal>`
- allows the user to open the stripe customer portal, to manage their subscriptions, linked payment methods, view invoice history, etc.

#### `<xiome-store-subscription-catalog>`
- customer can purchase subscription tiers to earn a `role` in the permissions system.
- a customer can subscribe to only one tier for each plan (tiers are mutually-exclusive within a plan).

#### `<xiome-store-subscription-planning>`
- merchants can create subscription plans and tiers, set and edit pricing, etc.
- subscription plans can have many tiers.
- each tier is associated with its own `role` in the xiome permissions system.
- merchants can customize the role's privileges using the xiome permissions system (eg, a privilege could allow access through a paywall).
- plans and tiers are xiome concepts (not stripe).
- each tier is tied to a particular stripe product.
- each stripe subscription "belongs" to a plan (different plans may be billed on different days).

<br/>

how is the system structured?
-----------------------------

### backend
- **stripe liaison**  
  this is how we talk to stripe's api.
- **database schema**  
  this is how we store data about merchant/customer stripe account, subscriptions, etc.
- **api services**  
  the store exposes a bunch of renraku functions, just like other xiome feature apis.  
  each service has its own auth policy.  
- **stripe webhooks**  
  we run a microservice dedicated to listening for stripe events. this is how stripe notifies us when a user's subscription has changed (created, expired, updated, etc), or a payment has succeeded or failed.
- **backend utils**  
  the backend utils directory is a grab-bag of functions that may be used by api services, or the webhooks.

### frontend
- **models**  
  the brains behind the components. manages state, and actions like calling service functions.
- **components**  
  html components that merchants and customers interact with directly.

### systems that span frontend and backend
- **popups**  
  in many scenarios, we engage popups that are hosted on stripe's domain,  
  like when merchants link their stripe account, or customers purchase something, etc.  
  - often times, popups have a backend aspect, where our api has to talk with stripe to generate a session for the popup.
  - of course, each popup needs a frontend counterpart, to actually open the popup.
  - ⚠️ it's important to understand how stripe returns information from its popups.
    - stripe does *not* use postMessage.
    - instead, we provide stripe with return/success/canceled urls -- the stripe popup page will redirect the popup to the provided return url.
    - outside the store code, xiome has a special static html page, called the "return" page, hosted at `/popups/return`
    - our strategy is as follows:
      - xiome provides return urls like `https://xiome.io/popups/return?status=success`
      - where `?status=success` might be `?status=cancelled` or whatever
      - xiome's `/popups/return` page has one job: parse the querystring data, and return it via a postMessage back to the parent window
      - in short: xiome opens a popup at the stripe url, then stripe redirects the popup back to xiome's return page, and xiome's return page parses and sends the querystring data as a postMessage, and then it closes the popup.
    - xiome's return page is not store-specific: it will postMessage back any querystring. it doesn't live in the `store` feature, it lives in xiome's static website pages.
  - in mock mode, we use our own fake stripe popups, which are in `s/website/html/mocksite/fakestripe/`
