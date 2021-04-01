
import {asTopic} from "renraku/x/identities/as-topic.js"

import {find} from "../../../toolbox/dbby/dbby-x.js"
import {StripeConnectOptions} from "./types/stripe-connect-options.js"
import {StripeAccountDetails} from "./types/stripe-account-details.js"
import {MerchantAuth} from "../api/policies/types/contexts/merchant-auth.js"

export const stripeConnectTopic = ({
			accountReturningLinks,
		}: StripeConnectOptions) => asTopic<MerchantAuth>()({

	async getConnectDetails(
			{access, stripeLiaisonForPlatform, getTablesNamespacedForApp},
			{appId}: {appId: string},
		): Promise<undefined | StripeAccountDetails> {

		const {userId} = access.user
		const namespacedTables = await getTablesNamespacedForApp(appId)

		const existingAssociatedStripeAccount = await namespacedTables
			.merchant.stripeAccounts.one(find({userId}))

		if (existingAssociatedStripeAccount) {
			const id = existingAssociatedStripeAccount.stripeAccountId
			const account = await stripeLiaisonForPlatform.accounts.retrieve(id)
			return {
				email: account.email,
				stripeAccountId: account.id,
				payouts_enabled: account.payouts_enabled,
				details_submitted: account.details_submitted,
			}
		}
		else {
			return undefined
		}
	},

	async generateConnectSetupLink(
			{access, stripeLiaisonForPlatform, getTablesNamespacedForApp},
			{appId}: {appId: string},
		) {

		const {userId} = access.user
		const namespacedTables = await getTablesNamespacedForApp(appId)

		const {stripeAccountId} = (
			await namespacedTables.merchant.stripeAccounts.assert({
				...find({userId}),
				make: async() => {
					const {id: stripeAccountId} = await stripeLiaisonForPlatform
						.accounts.create({type: "standard"})
					return {userId, stripeAccountId}
				},
			})
		)

		const {url: stripeAccountSetupLink} = await stripeLiaisonForPlatform
			.accountLinks.create({
				account: stripeAccountId,
				collect: "eventually_due",
				type: "account_onboarding",
				return_url: accountReturningLinks.return,
				refresh_url: accountReturningLinks.refresh,
			})

		return {stripeAccountId, stripeAccountSetupLink}
	},
})
