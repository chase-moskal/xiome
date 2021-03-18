
import {Rando} from "../../../toolbox/get-rando.js"
import {mockStripeLiaison} from "./mocks/mock-stripe-liaison.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {mockStripeTables} from "./mocks/tables/mock-stripe-tables.js"
import {mockStripeAccounts} from "./parts/accounts/mocks/mock-stripe-accounts.js"

export function prepareMockStripeComplex({rando, tableStorage}: {
			rando: Rando,
			tableStorage: FlexStorage
		}) {

	const mockStripeTables = mockStripeTables({tableStorage})

	const accounts = mockStripeAccounts({
		rando,
		mockStripeTables,
		mockStripeAccountSetupLink: "https://example.xiome.io/stripe",
	})

	return {
		accounts,
		async makeStripeLiaison() {

		}
	}

	return async function({tables}) {
		return mockStripeLiaison({rando, tables, tableStorage})
	}
}
