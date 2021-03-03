
import {asTopic} from "renraku/x/identities/as-topic.js"

import {find} from "../../../toolbox/dbby/dbby-x.js"
import {PayAppOwnerAuth} from "../api/policies/types/contexts/pay-app-owner-auth.js"

export const stripeAccountsTopic = () => asTopic<PayAppOwnerAuth>()({

	async getStripeAccountDetails({
				access,
				stripeLiaison,
				getTablesNamespacedForApp,
			},
			{appId}: {appId: string}
		) {
		const {userId} = access.user
		const namespacedTables = await getTablesNamespacedForApp(appId)

		const existingAssociatedStripeAcocunt = await namespacedTables.merchant.stripeAccounts
			.one(find({userId}))

		if (existingAssociatedStripeAcocunt) {
			const account = await stripeLiaison.accounts
				.getStripeAccount(existingAssociatedStripeAcocunt.stripeAccountId)
			return {
				stripeAccountId: account.id,
				email: account.email,
				payoutsEnabled: account.payouts_enabled,
				detailsSubmitted: account.details_submitted,
			}
		}
		else {
			return undefined
		}
	},

	async createAccountPopup({access, stripeLiaison, getTablesNamespacedForApp}, {appId}: {
				appId: string
			}) {
		const {userId} = access.user
		const namespacedTables = await getTablesNamespacedForApp(appId)

		const {stripeAccountId} = await namespacedTables.merchant.stripeAccounts.assert({
			...find({userId}),
			make: async() => {
				const {stripeAccountId} = await stripeLiaison.accounts
					.createStripeAccount()
				return {userId, stripeAccountId, appId}
			},
		})

		const {stripeAccountLink} = await stripeLiaison.accounts
			.createAccountOnboardingLink({stripeAccountId})

		return {stripeAccountLink}
	},
})
