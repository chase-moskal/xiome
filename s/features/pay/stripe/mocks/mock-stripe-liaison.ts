
import {Rando} from "../../../../toolbox/get-rando.js"
import {mockStripeAccounts} from "../parts/accounts/mocks/mock-stripe-accounts.js"

export async function mockStripeLiaison({rando}: {rando: Rando}) {
	const accounts = mockStripeAccounts({
		rando,
		mockStripeAccountLink: "https://example.xiome.io/stripe",
	})
	return {accounts}
}
