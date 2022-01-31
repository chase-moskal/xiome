
import * as renraku from "renraku"
import {Id, find} from "dbmage"

import {MerchantRow} from "../../types/store-schema.js"
import {requiredPrivilege} from "./helpers/required-privilege.js"
import {determineConnectStatus} from "./helpers/utils/determine-connect-status.js"
import {fetchStripeConnectDetails} from "./helpers/fetch-stripe-connect-details.js"
import {StoreServiceOptions, StripeConnectStatus} from "../../types/store-concepts.js"

export const makeConnectService = (
	options: StoreServiceOptions
) => renraku.service()

.policy(options.storePolicy)

.expose(({access, stripeLiaison, database, checker}) => ({

	...requiredPrivilege(checker, "manage store", {

		async loadConnectStatus() {
			const connectDetails = await fetchStripeConnectDetails({
				stripeLiaison,
				storeTables: database.tables.store,
			})
			return determineConnectStatus(connectDetails)
		},

		async pause() {
			const connectDetails = await fetchStripeConnectDetails({
				stripeLiaison,
				storeTables: database.tables.store,
			})
			const connectStatus = determineConnectStatus(connectDetails)
			if (connectStatus !== StripeConnectStatus.Ready)
				throw new renraku.ApiError(400, "cannot pause non-ready stripe account")
			else {
				await database.tables.store.merchants.stripeAccounts.update({
					...find({stripeAccountId: connectDetails.stripeAccountId}),
					write: {paused: true},
				})
			}
		},

		async resume() {
			const connectDetails = await fetchStripeConnectDetails({
				stripeLiaison,
				storeTables: database.tables.store,
			})
			const connectStatus = determineConnectStatus(connectDetails)
			if (connectStatus !== StripeConnectStatus.Paused)
				throw new renraku.ApiError(400, "cannot resume non-paused stripe account")
			else {
				await database.tables.store.merchants.stripeAccounts.update({
					...find({stripeAccountId: connectDetails.stripeAccountId}),
					write: {paused: false},
				})
			}
		},
	}),

	...requiredPrivilege(checker, "control stripe account", {

		async loadConnectDetails() {
			const connectDetails = await fetchStripeConnectDetails({
				stripeLiaison,
				storeTables: database.tables.store,
			})
			return {
				connectDetails,
				connectStatus: determineConnectStatus(connectDetails),
			}
		},

		async generateConnectSetupLink() {
			const connectDetails = await fetchStripeConnectDetails({
				storeTables: database.tables.store,
				stripeLiaison,
			})
			let stripeAccountId = connectDetails?.stripeAccountId
			if (!stripeAccountId) {
				const stripeAccount = await stripeLiaison
					.accounts.create({type: "standard"})
				stripeAccountId = stripeAccount.id
				const row: MerchantRow = {
					stripeAccountId,
					time: Date.now(),
					userId: Id.fromString(access.user.userId),
					paused: false,
				}
				await database.tables.store.merchants.stripeAccounts.create(row)
			}
			const {url: stripeAccountSetupLink} = await stripeLiaison
				.accountLinks.create({
					account: stripeAccountId,
					collect: "currently_due",
					type: "account_onboarding",
					return_url: options.accountReturningLinks.return,
					refresh_url: options.accountReturningLinks.refresh,
				})
			return {stripeAccountId, stripeAccountSetupLink}
		},

		async generateStripeLoginLink() {
			const connectDetails = await fetchStripeConnectDetails({
				storeTables: database.tables.store,
				stripeLiaison,
			})
			let stripeAccountId = connectDetails?.stripeAccountId
			if (!stripeAccountId)
				throw new renraku.ApiError(404, "no such connected stripe account")
			const {url} = await stripeLiaison.accounts.createLoginLink(stripeAccountId)
			return url
		},
	}),
}))
