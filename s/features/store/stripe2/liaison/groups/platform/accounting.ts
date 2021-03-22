
import {LiaisonOptions} from "../../../types/liaison-options.js"

export function stripeLiaisonAccounting({stripe, returningLinks}: LiaisonOptions) {

	function prepareCreateAccountLink(
			type: "account_onboarding" | "account_update"
		) {
		return async function createAccountLink({stripeAccountId}: {
				stripeAccountId: string
			}) {
			const {url} = await stripe.accountLinks.create({
				type,
				account: stripeAccountId,
				return_url: returningLinks.accounting.return,
				refresh_url: returningLinks.accounting.refresh,
				collect: "eventually_due",
			})
			return {stripeAccountSetupLink: url}
		}
	}

	return {
		async getStripeAccount(id: string) {
			const account = await stripe.accounts.retrieve(id)
			return {
				id,
				email: account.email,
				charges_enabled: account.charges_enabled,
				payouts_enabled: account.payouts_enabled,
				details_submitted: account.details_submitted,
			}
		},
		async createStripeAccount(): Promise<{stripeAccountId: string}> {
			const {id} = await stripe.accounts.create({type: "standard"})
			return {stripeAccountId: id}
		},
		createAccountOnboardingLink: prepareCreateAccountLink("account_onboarding"),
		createAccountUpdateLink: prepareCreateAccountLink("account_update"),
	}
}
