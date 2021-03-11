
import {asTopic} from "renraku/x/identities/as-topic.js"

import {find} from "../../../toolbox/dbby/dbby-x.js"
import {StripeAccountDetails} from "./types/stripe-account-details.js"
import {MerchantAuth} from "../api/policies/types/contexts/merchant-auth.js"

export const stripeAccountsTopic = () => asTopic<MerchantAuth>()({

	async getStripeAccountDetails({
					access,
					stripeLiaison,
					getTablesNamespacedForApp,
				},
				{appId}: {appId: string}
			): Promise<undefined | StripeAccountDetails> {

		const {userId} = access.user
		const namespacedTables = await getTablesNamespacedForApp(appId)

		const existingAssociatedStripeAccount = await namespacedTables.merchant.stripeAccounts
			.one(find({userId}))

		if (existingAssociatedStripeAccount) {
			const account = await stripeLiaison.accounts
				.getStripeAccount(existingAssociatedStripeAccount.stripeAccountId)
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

	async generateAccountSetupLink({access, stripeLiaison, getTablesNamespacedForApp}, {appId}: {
				appId: string
			}) {

		const {userId} = access.user
		const namespacedTables = await getTablesNamespacedForApp(appId)

		const {stripeAccountId} = await namespacedTables.merchant.stripeAccounts.assert({
			...find({userId}),
			make: async() => {
				const {stripeAccountId} = await stripeLiaison.accounts
					.createStripeAccount()
				await namespacedTables.merchant.stripeAccounts.create({
					appId,
					userId,
					stripeAccountId,
				})
				return {userId, stripeAccountId, appId}
			},
		})

		const {stripeAccountSetupLink} = await stripeLiaison.accounts
			.createAccountUpdateLink({stripeAccountId})

		return {stripeAccountId, stripeAccountSetupLink}
	},
})
