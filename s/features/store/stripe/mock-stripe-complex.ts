
import {Rando} from "../../../toolbox/get-rando.js"
import {find} from "../../../toolbox/dbby/dbby-helpers.js"
import {StoreTables} from "../api/tables/types/store-tables.js"
import {mockStripeLiaison} from "./mocks/mock-stripe-liaison.js"
import {AuthTables} from "../../auth/tables/types/auth-tables.js"
import {mockStripeTables} from "./mocks/tables/mock-stripe-tables.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {mockStripeAccounting} from "./parts/accounts/mocks/mock-stripe-accounting.js"

export async function mockStripeComplex({rando, tableStorage}: {
			rando: Rando
			tableStorage: FlexStorage
		}) {

	const {accountingTables, getConnectedTables} =
		await mockStripeTables({tableStorage})

	const accounting = mockStripeAccounting({
		rando,
		accountingTables,
		mockSetupLink: "https://example.xiome.io/stripe",
	})

	const mockStripeOperations = {
		linkBankWithExistingStripeAccount: async(stripeAccountId: string) => {
			await accountingTables.accounts.update({
				...find({id: stripeAccountId}),
				write: {
					payouts_enabled: true,
					details_submitted: true,
				},
			})
		},
	}

	return {
		accounting,
		mockStripeOperations,
		getLiaison({stripeConnectAccountId, tables}: {
					stripeConnectAccountId: string
					tables: StoreTables & AuthTables
				}) {
			const connectedTables = getConnectedTables(stripeConnectAccountId)
			return mockStripeLiaison({rando, tables, connectedTables})
		},
	}
}
