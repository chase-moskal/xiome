
import {StripeAccounts} from "../types/stripe-accounts.js"
import {Rando} from "../../../../../../toolbox/get-rando.js"
import {find} from "../../../../../../toolbox/dbby/dbby-helpers.js"
import {MockStripeTables} from "../../../mocks/tables/types/mock-stripe-tables.js"

export function mockStripeAccounts({
			rando,
			mockStripeTables,
			mockStripeAccountSetupLink
		}: {
			rando: Rando
			mockStripeTables: MockStripeTables
			mockStripeAccountSetupLink: string
		}): StripeAccounts {

	return {
		async getStripeAccount(id: string) {
			return mockStripeTables.accounts.one(find({id}))
		},
		async createStripeAccount() {
			const id = rando.randomId()
			await mockStripeTables.accounts.create({
				id,
				email: "fake-stripe-email@xiome.io",
				charges_enabled: false,
				payouts_enabled: false,
				details_submitted: false,
			})
			return {stripeAccountId: id}
		},
		async createAccountOnboardingLink() {
			return {stripeAccountSetupLink: mockStripeAccountSetupLink}
		},
		async createAccountUpdateLink() {
			return {stripeAccountSetupLink: mockStripeAccountSetupLink}
		},
	}
}
