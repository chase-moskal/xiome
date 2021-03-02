
import {asTopic} from "renraku/x/identities/as-topic.js"

import {find} from "../../../toolbox/dbby/dbby-x.js"
import {PayUserAuth} from "../api/policies/types/contexts/pay-user-auth.js"

export const stripeAccountsTopic = () => asTopic<PayUserAuth>()({

	async getStripeAccountDetails({tables, access, stripeLiaison}) {
		const {userId} = access.user

		const existingAssociatedStripeAcocunt = await tables.billing.stripeAccounts
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

	async createAccountPopup({tables, access, app, stripeLiaison}) {
		const {appId} = app
		const {userId} = access.user

		const {stripeAccountId} = await tables.billing.stripeAccounts.assert({
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
