
import {StripeAccounts} from "../types/stripe-accounts.js"
import {Rando} from "../../../../../../toolbox/get-rando.js"

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
