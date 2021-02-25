
import {Rando} from "../../../../../toolbox/get-rando.js"
import {StripeAccounts} from "../types/stripe-accounts.js"

export function mockStripeAccounts({
			rando,
			mockStripeAccountLink,
		}: {
			rando: Rando
			mockStripeAccountLink: string
		}): StripeAccounts {

	return {
		async createStripeAccount() {
			return {stripeAccountId: rando.randomId()}
		},
		async createAccountOnboardingLink() {
			return {stripeAccountLink: mockStripeAccountLink}
		},
		async createAccountUpdateLink() {
			return {stripeAccountLink: mockStripeAccountLink}
		},
	}
}
