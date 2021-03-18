
import {StripeAccounting} from "../types/stripe-accounting.js"
import {Rando} from "../../../../../../toolbox/get-rando.js"
import {find} from "../../../../../../toolbox/dbby/dbby-helpers.js"
import {AccountingTables} from "../../../mocks/tables/types/accounting-tables.js"

export function mockStripeAccounting({
			rando,
			mockSetupLink,
			accountingTables,
		}: {
			rando: Rando
			mockSetupLink: string
			accountingTables: AccountingTables
		}): StripeAccounting {

	return {
		async getStripeAccount(id: string) {
			return accountingTables.accounts.one(find({id}))
		},
		async createStripeAccount() {
			const id = rando.randomId()
			await accountingTables.accounts.create({
				id,
				email: "fake-stripe-email@xiome.io",
				charges_enabled: false,
				payouts_enabled: false,
				details_submitted: false,
			})
			return {stripeAccountId: id}
		},
		async createAccountOnboardingLink() {
			return {stripeAccountSetupLink: mockSetupLink}
		},
		async createAccountUpdateLink() {
			return {stripeAccountSetupLink: mockSetupLink}
		},
	}
}
