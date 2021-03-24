
import {asTopic} from "renraku/x/identities/as-topic.js"

import {find} from "../../../toolbox/dbby/dbby-x.js"
import {StripeAccountDetails} from "./types/stripe-account-details.js"
import {MerchantAuth} from "../api/policies/types/contexts/merchant-auth.js"

export const stripeConnectTopic = () => asTopic<MerchantAuth>()({

	async getConnectDetails(
			{access, platformStripeLiaison, getTablesNamespacedForApp},
			{appId}: {appId: string},
		): Promise<undefined | StripeAccountDetails> {

		const {userId} = access.user
		const namespacedTables = await getTablesNamespacedForApp(appId)

		const existingAssociatedStripeAccount = await namespacedTables
			.merchant.stripeAccounts.one(find({userId}))

		if (existingAssociatedStripeAccount) {
			const id = existingAssociatedStripeAccount.stripeAccountId
			const account =
				await platformStripeLiaison.accounting
					.getStripeAccount(id)
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

	async generateConnectSetupLink(
			{access, platformStripeLiaison, getTablesNamespacedForApp},
			{appId}: {appId: string},
		) {

		const {userId} = access.user
		const namespacedTables = await getTablesNamespacedForApp(appId)

		const {stripeAccountId} = (
			await namespacedTables.merchant.stripeAccounts.assert({
				...find({userId}),
				make: async() => {
					const {id: stripeAccountId} =
						await platformStripeLiaison.accounting
							.createStripeAccount()
					await namespacedTables.merchant.stripeAccounts.create({
						userId,
						stripeAccountId,
					})
					return {userId, stripeAccountId, appId}
				},
			})
		)

		const setupLink =
			await platformStripeLiaison.accounting.createAccountSetupLink({
				account: stripeAccountId,
				type: "account_onboarding",
			})

		return {stripeAccountId, stripeAccountSetupLink: setupLink.url}
	},
})
