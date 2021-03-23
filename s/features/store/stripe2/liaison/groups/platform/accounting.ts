
import {Stripe} from "stripe"
import {LiaisonOptions} from "../../../types/liaison-options.js"

export function stripeLiaisonAccounting({
		stripe,
		returningLinks
	}: LiaisonOptions) {
	return {

		async getStripeAccount(id: string): Promise<Stripe.Account> {
			return stripe.accounts.retrieve(id)
		},

		async createStripeAccount(): Promise<Stripe.Account> {
			return stripe.accounts.create({type: "standard"})
		},

		async createAccountSetupLink({account, type}: {
				account: string
				type: "account_onboarding" | "account_update"
			}): Promise<Stripe.AccountLink> {
			return stripe.accountLinks.create({
				type,
				account,
				collect: "eventually_due",
				return_url: returningLinks.accounting.return,
				refresh_url: returningLinks.accounting.refresh,
			})
		}
	}
}
