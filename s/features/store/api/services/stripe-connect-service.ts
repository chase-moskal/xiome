
import {apiContext} from "renraku/x/api/api-context.js"

import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {StoreServiceOptions} from "../types/store-options.js"
import {StripeAccountDetails} from "./types/stripe-account-details.js"
import {MerchantAuth, MerchantMeta} from "../policies/types/store-metas-and-auths.js"

export const makeStripeConnectService = (
		options: StoreServiceOptions
	) => apiContext<MerchantMeta, MerchantAuth>()({

	policy: options.storePolicies.merchantPolicy,

	expose: {

		async getConnectDetails(
				{access, stripeLiaison, storeTables},
			): Promise<undefined | StripeAccountDetails> {

			const {userId} = access.user

			const existingAssociatedStripeAccount = await storeTables
				.merchant.stripeAccounts.one(find({userId}))

			if (existingAssociatedStripeAccount) {
				const id = existingAssociatedStripeAccount.stripeAccountId
				const account = await stripeLiaison.accounts.retrieve(id)
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
				{access, stripeLiaison, storeTables},
			) {

			const {userId} = access.user

			const {stripeAccountId} = (
				await storeTables.merchant.stripeAccounts.assert({
					...find({userId}),
					make: async() => {
						const {id: stripeAccountId} = await stripeLiaison
							.accounts.create({type: "standard"})
						return {userId, stripeAccountId}
					},
				})
			)

			const {url: stripeAccountSetupLink} = await stripeLiaison
				.accountLinks.create({
					account: stripeAccountId,
					collect: "eventually_due",
					type: "account_onboarding",
					return_url: options.accountReturningLinks.return,
					refresh_url: options.accountReturningLinks.refresh,
				})

			return {stripeAccountId, stripeAccountSetupLink}
		},
	},
})
