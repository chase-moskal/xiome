
import {apiContext} from "renraku/x/api/api-context.js"
import {StoreServiceOptions, StripeConnectDetails} from "../../types/store-concepts.js"
import {StoreAuth, StoreMeta} from "../../types/store-metas-and-auths.js"

export const makeConnectService = (
		options: StoreServiceOptions
	) => apiContext<StoreMeta, StoreAuth>()({

	async policy(meta, request) {
		const auth = await options.storePolicy(meta, request)
		auth.checker.requirePrivilege("connect stripe account")
		return auth
	},

	expose: {

		async loadConnectDetails(
				{stripeLiaison, storeTables}
			): Promise<undefined | StripeConnectDetails> {
			const existingAssociatedStripeAccount = await storeTables
				.merchant.stripeAccounts.one({conditions: false})
			if (existingAssociatedStripeAccount) {
				const id = existingAssociatedStripeAccount.stripeAccountId
				const timeLinked = existingAssociatedStripeAccount.timeLinked
				const account = await stripeLiaison.accounts.retrieve(id)
				return {
					email: account.email,
					stripeAccountId: account.id,
					payouts_enabled: account.payouts_enabled,
					details_submitted: account.details_submitted,
					timeLinked,
				}
			}
			else {
				return undefined
			}
		},

		async generateConnectSetupLink({access, stripeLiaison, storeTables}) {
			const {userId} = access.user
			const {stripeAccountId} = (
				await storeTables.merchant.stripeAccounts.assert({
					conditions: false,
					make: async() => {
						const {id: stripeAccountId} = await stripeLiaison
							.accounts.create({type: "standard"})
						return {userId, stripeAccountId, timeLinked: Date.now()}
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

		async disconnect() {
			throw new Error("TODO implement stripe disconnect")
		},
	},
})
