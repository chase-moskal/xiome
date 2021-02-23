
import {Rando} from "../../../../toolbox/get-rando.js"
import {StripeAccountLiaison} from "../types/stripe-account-liaison.js"

export function mockStripeAccountLiaison({
			rando,
			mockStripeAccountLink,
		}: {
			rando: Rando
			mockStripeAccountLink: string
		}): StripeAccountLiaison {

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
