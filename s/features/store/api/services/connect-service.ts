
import {apiContext} from "renraku/x/api/api-context.js"

import {StoreServiceOptions} from "../../types/store-concepts.js"
import {requiredPrivilege} from "./helpers/required-privilege.js"
import {StoreAuth, StoreMeta} from "../../types/store-metas-and-auths.js"
import {determineConnectStatus} from "./helpers/utils/determine-connect-status.js"
import {fetchStripeConnectDetails} from "./helpers/fetch-stripe-connect-details.js"

export const makeConnectService = (
		options: StoreServiceOptions
	) => apiContext<StoreMeta, StoreAuth>()({

	policy: options.storePolicy,

	expose: {

		...requiredPrivilege("manage store", {

			async loadConnectStatus({stripeLiaison, storeTables}) {
				const connectDetails = await fetchStripeConnectDetails({stripeLiaison, storeTables})
				return determineConnectStatus(connectDetails)
			},
		}),

		...requiredPrivilege("connect stripe account", {

			async loadConnectDetails({stripeLiaison, storeTables}) {
				const connectDetails = await fetchStripeConnectDetails({stripeLiaison, storeTables})
				return {
					connectDetails,
					connectStatus: determineConnectStatus(connectDetails)
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
		}),
	},
})
