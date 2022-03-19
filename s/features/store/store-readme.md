
# how the xiome store feature works

- api services
  - billing-service
  - connect-service
  - subscription-planning-service
  - subscription-shopping-service
- frontend models
  - store-model
  - connect-submodel
  - billing-submodel
  - subscription-planning-submodel
- components
  - xiome-store-connect
  - xiome-subscription-planning
  - xiome-subscription-shopping
  - xiome-billing
- popups
  - bank
  - checkout
- stripe
  - liaison
  - webhooks
  - mock-stripe-circuit
- testing
  - store-test-setup
  - store-quick-setup

## todos

subscription planning
- [x] planning validation
- [ ] add new tiers
- [ ] decommission plans and tiers

billing
- [ ] link card
- [ ] unlink card
- [ ] update card

subscription shopping
- [ ] list plans and tiers
- [ ] purchase tiers
- [ ] cancel plans

