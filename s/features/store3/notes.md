
ongoing refactors:
- reworked schema
  - `store.merchants.stripeAccounts` is now just `store.merchants`
  - `store.billing.customers` is now just `store.customers`

next up:
- [x] liaison
- [x] permissions interactions to role manager
- [x] stripe popups
- [ ] services and api

after everything is back in place:
- renames
  - `roleManager.createRoleForNewSubscriptionTier` => `roleManager.createPrivateSystemRole`

refactors to consider later:
- consider adding backend/frontend dirs into `aspects/popups`
- why does the real stripe circuit contain frontend stripePopups? -- it feels wrong that `store3/backend/stripe/` imports from `store3/aspects/popups/`

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
