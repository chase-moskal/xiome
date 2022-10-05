
ongoing refactors:
- reworked schema
  - `store.merchants.stripeAccounts` is now just `store.merchants`
  - `store.billing.customers` is now just `store.customers`

next up:
- [x] liaison
- [x] permissions interactions to role manager
- [x] stripe popups
- [x] services and api
- [x] models
- [ ] components
- [ ] testing
- [ ] integration into xiome, production, mocks, tests

after everything is back in place:
- rename
  - `roleManager.createRoleForNewSubscriptionTier` => `roleManager.createPrivateSystemRole`
- move
  - `get-stripe-id.ts` into `stripe/utils/`

refactors to consider later:
- why does the real stripe circuit contain frontend stripePopups? -- it feels wrong that `store3/backend/stripe/` imports from `store3/aspects/popups/`

------


services
- merchant
  - loadConnectStatus
  - loadConnectDetails
  - generateConnectSetupLink
  - generateStripeLoginLink
- customer
  - getPaymentMethodDetails
  - generateCustomerPortalLink
- subscription
  - catalog
    - listSubscriptionPlans
  - planning
    - addPlan
    - addTier
    - editPlan
    - editTier
  - shopping
    - fetchMySubscriptionDetails
    - buy
    - cancel
    - uncancel

(sub)models
- merchant
- customer
- subscription

components
- merchant
- 

------

```

store3/
  api.ts
  components.ts
  supermodel.ts
  tests.test.ts

  backend/
    database/
    policies/
    stripe/
    types/
    utils/
    services/
      merchant/
      customer/
      subscription/

  frontend/
    state.ts
    utils/
    models/
      merchant/
      customer/
      subscription/
    components/
      merchant/
      customer/
      subscription-planning/
      subscription-shopping/

  isomorphic/
  popups/
  testing/
  

```

------

```
aspects/

  connect/
    service.ts
    submodel.ts
    components/
      connect/
        xiome-connect.ts
        xiome-connect.css.ts

  billing/
    service.ts
    submodel.ts
    components/
      billing/
        xiome-billing.ts
        xiome-billing.css.ts

  subscriptions/
    submodel.ts
    services/
      fetching.ts
      shopping.ts
      planning.ts
      shopping-helpers/
        ...
      planning-helpers/
        ...
    components/
      subscriptions/
        xiome-subscriptions.ts
        xiome-subscriptions.css.ts
        helpers/
          ...
      subscription-planning/
        xiome-subscription-planning.ts
        helpers/
          planning-ui.ts

backend/
  api.ts
  database/
  policies/

frontend/
  model/
    model.ts
    utils/
      state.ts
      submodels.ts

isomorphic/
  concepts.ts
```
