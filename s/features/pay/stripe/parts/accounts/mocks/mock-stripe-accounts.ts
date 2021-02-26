
import {StripeAccounts} from "../types/stripe-accounts.js"
import {Rando} from "../../../../../../toolbox/get-rando.js"
import {MockStripeTables} from "../../../mocks/tables/types/mock-stripe-tables.js"

export function mockStripeAccounts({
			rando,
			tables,
			mockStripeAccountLink,
		}: {
			rando: Rando
			tables: MockStripeTables
			mockStripeAccountLink: string
		}): StripeAccounts {

	return {
		async createStripeAccount() {
			const id = rando.randomId()
			tables.accounts.create({id})
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
