
import {find} from "../../../toolbox/dbby/dbby-x.js"
import {asTopic} from "renraku/x/identities/as-topic.js"
import {PayTopicOptions} from "./types/pay-topic-options.js"
import {PayUserAuth} from "../api/policies/types/contexts/pay-user-auth.js"

export const stripeAccountsTopic = ({
			rando,
		}: PayTopicOptions) => asTopic<PayUserAuth>()({

	async getStripeAccountDetails({tables, access, stripeLiaison}) {
		const {userId} = access.user
		const {stripeAccountId} = await tables.billing.stripeAccounts.one(find({userId}))
		const details = await stripeLiaison.accounts.getStripeAccount(stripeAccountId)
		return details
	},

	async createAccountPopup({tables, access, app, stripeLiaison}): Promise<{
			popupUrl: string
		}> {

		const {appId} = app
		const {userId} = access.user

		const {stripeAccountId} = await tables.billing.stripeAccounts.assert({
			...find({userId}),
			make: async() => {
				const {stripeAccountId} = await stripeLiaison.accounts.createStripeAccount()
				return {userId, stripeAccountId, appId}
			},
		})

		const {stripeAccountLink} =
			await stripeLiaison.accounts
				.createAccountOnboardingLink({stripeAccountId})

		return {
			popupUrl: stripeAccountLink,
		}
	},
})
