
import {StripeAccounts} from "../types/stripe-accounts.js"
import {Rando} from "../../../../../../toolbox/get-rando.js"
import {find} from "../../../../../../toolbox/dbby/dbby-x.js"
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
		async getStripeAccount(id: string) {
			return tables.accounts.one(find({id}))
		},
		async createStripeAccount() {
			const id = rando.randomId()
			await tables.accounts.create({
				id,
				charges_enabled: false,
				payouts_enabled: false,
			})
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
