
import {Suite, expect} from "cynic"

export default <Suite>{
	"managing the store": {
		"connect a stripe account": {
			"a user with merchant permissions": {
				async "can connect a stripe account"() {},
				async "can connect an incomplete stripe account"() {},
				async "can see the connect details set by another merchant"() {},
			},
			"a user with clerk permissions": {
				async "can see connect status, but not details"() {},
				async "cannot connect a stripe account"() {},
			},
			"a user with regular permissions": {
				async "cannot connect a stripe account"() {},
				async "can see connect status, but not details"() {},
			},
		},
		"login to stripe account": {
			"a user with merchant permissions": {
				async "can login to connected stripe account"() {},
				async "cannot login to unconnected stripe account"() {},
				async "can login to incomplete stripe account (missing banking info)"() {},
				async "can login to stripe account and complete it (add banking info)"() {},
				async "can login to stripe account and make it incomplete (delete banking info)"() {},
			},
			"a user with clerk permissions": {
				async "cannot login to stripe account"() {},
			},
			"a user with regular permissions": {
				async "cannot login to stripe account"() {},
			},
		},
		"pause and resume the store": {
			"a user with merchant permissions": {
				async "can pause and resume a store"() {},
			},
			"a user with clerk permissions": {
				async "can pause and resume a store"() {},
			},
			"a user with regular permissions": {
				async "cannot pause or resume the store"() {},
			},
		},
	},
	"subscription planning": {
		"a user with clerk permisisons": {
			async "can create a new subscription plan"() {},
			async "can create multiple plans, and the tiers aren't scrambled"() {},
			async "can view subscription plans made by other clerks"() {},
			async "can add a new tier to an existing plan"() {},
			async "can edit a plan"() {},
			async "can edit a tier"() {},
		},
		"a user with regular permissions": {
			async "can view subscription plans"() {},
			async "cannot create a new subscription plan"() {},
			async "cannot edit plans or tiers"() {},
		},
	},
	"billing": {
		"a user with regular permissions": {
			async "can add payment method"() {},
			async "can update payment method"() {},
			async "can delete payment method"() {},
		},
	},
	"subscription purchases": {
		"a user with regular permissions": {
			async "can purchase a subscription, with an existing payment method"() {},
			async "can purchase a subscription, while providing a new payment method"() {},
			async "can cancel and uncancel a subscription"() {},
			async "can upgrade a subscription to a higher tier"() {},
			async "can downgrade a subscription to a lower tier"() {},
		},
	},
	"interactions between billing + subscriptions": {
		"a user with regular permissions": {
			async "can update their payment method, for recurring billing on subscriptions"() {},
			async "can delete their payment method, ending recurring billing on subscriptions"() {},
			async "can add a payment method, reactivating recurring billing for subscriptions"() {},
		},
	},
}
