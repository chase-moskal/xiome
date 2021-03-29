
import {Stripe} from "stripe"
import {LiaisonOptions} from "../types/liaison-options.js"

export function stripeLiaisonForPlatform({stripe}: LiaisonOptions) {
	return {
		accounts: {
			async create(params: Stripe.AccountCreateParams) {
				return stripe.accounts.create(params)
			},
			async retrieve(id: string) {
				return stripe.accounts.retrieve(id)
			},
		},
		accountLinks: {
			async create(params: Stripe.AccountLinkCreateParams) {
				return stripe.accountLinks.create(params)
			},
		},
	}
}
