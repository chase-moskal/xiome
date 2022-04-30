
## Todo

- [x] remodel each subscription tier to be a new stripe product
- [ ] further remodeling
  - each plan is a different subscription
  - plans define the currency being used
  - tiers can have different pricepoints
- [ ] adapt existing ui for new pricing modeling
  - price editing is back, ui needs to provide for it
  - tier pricing can now be monthly or yearly, make this editable
  - plans no longer have roles, only tiers. ui shouldn't display this anymore
- [ ] rework fulfillment in stripe webhooks, based on stripe subscription updates
- [ ] add customer portal integration
- [ ] stripe timestamps are in *seconds*, make sure we're not treating them as *milliseconds*

## Stripe Questions

- what happens when a subscription is updated so that it has zero items? does it remain active?
- does the billing customer portal support multiple subscriptions?

## Customer portal

when should we create the customer portal config?
- in connect service `generateConnectSetup`
  - when the stripe account is created

how should the customer access the customer portal?
- the billing panel should become an access point for the customer portal
- we need a popup for this

how should the merchant customize the customer portal?
- we may need a `<xiome-store-portal-config>` component

## User-initiated actions

+ purchase a subscription tier
  - no subscription
    * checkout session for new subscription
  - subscription.status "incomplete"
    * update subscription items
  - subscription.status "incomplete_expired"
    * checkout session for new subscription
  - subscription.status "trialing"
    * update subscription items
  - subscription.status "active"
    * update subscription items
  - subscription.status "past_due"
    * update subscription items
  - subscription.status "canceled"
    * checkout session for new subscription
  - subscription.status "unpaid"
    * checkout session for new subscription

+ cancel a plan
  - no subscription
  - subscription.status "incomplete"
  - subscription.status "incomplete_expired"
  - subscription.status "trialing"
  - subscription.status "active"
  - subscription.status "past_due"
  - subscription.status "canceled"
  - subscription.status "unpaid"

+ update payment method
  - no subscription
  - subscription.status "incomplete"
  - subscription.status "incomplete_expired"
  - subscription.status "trialing"
  - subscription.status "active"
  - subscription.status "past_due"
  - subscription.status "canceled"
  - subscription.status "unpaid"

+ disconnect payment method
  - no subscription
  - subscription.status "incomplete"
  - subscription.status "incomplete_expired"
  - subscription.status "trialing"
  - subscription.status "active"
  - subscription.status "past_due"
  - subscription.status "canceled"
  - subscription.status "unpaid"

## Stripe webhooks

+ checkout payment method
  - no subscription
  - subscription.status "incomplete"
  - subscription.status "incomplete_expired"
  - subscription.status "trialing"
  - subscription.status "active"
  - subscription.status "past_due"
  - subscription.status "canceled"
  - subscription.status "unpaid"

+ checkout subscription
  - no subscription
  - subscription.status "incomplete"
  - subscription.status "incomplete_expired"
  - subscription.status "trialing"
  - subscription.status "active"
  - subscription.status "past_due"
  - subscription.status "canceled"
  - subscription.status "unpaid"

+ invoice.paid
  - no subscription
  - subscription.status "incomplete"
  - subscription.status "incomplete_expired"
  - subscription.status "trialing"
  - subscription.status "active"
  - subscription.status "past_due"
  - subscription.status "canceled"
  - subscription.status "unpaid"

+ invoice.payment_failed
  - no subscription
  - subscription.status "incomplete"
  - subscription.status "incomplete_expired"
  - subscription.status "trialing"
  - subscription.status "active"
  - subscription.status "past_due"
  - subscription.status "canceled"
  - subscription.status "unpaid"
