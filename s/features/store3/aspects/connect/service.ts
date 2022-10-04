
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {StoreServiceOptions} from "../../backend/types/options.js"
import {StripeConnectStatus} from "../../isomorphic/concepts.js"
import {makeStripePopupSpec} from "../popups/make-stripe-popup-spec.js"
import {requiredPrivilege} from "../../backend/utils/required-privilege.js"
import {MerchantRow} from "../../backend/database/types/rows/merchant-rows.js"
import {determineConnectStatus} from "../../isomorphic/utils/determine-connect-status.js"
import {fetchStripeConnectDetails} from "../../backend/utils/fetch-stripe-connect-details.js"

export const makeConnectService = (
	options: StoreServiceOptions
) => renraku.service()

.policy(options.storePolicies.storePolicy)

.expose(({access, stripeLiaison, storeDatabase, checker}) => ({

	async loadConnectStatus() {
		const connectDetails = await fetchStripeConnectDetails({
			stripeLiaison,
			storeTables: storeDatabase.tables,
		})
		return determineConnectStatus(connectDetails)
	},

	...requiredPrivilege(checker, "manage store", {

		async pause() {
			const connectDetails = await fetchStripeConnectDetails({
				stripeLiaison,
				storeTables: storeDatabase.tables,
			})
			const connectStatus = determineConnectStatus(connectDetails)
			if (connectStatus !== StripeConnectStatus.Ready)
				throw new renraku.ApiError(400, "cannot pause non-ready stripe account")
			else {
				await storeDatabase.tables.merchants.update({
					...dbmage.find({stripeAccountId: connectDetails.stripeAccountId}),
					write: {paused: true},
				})
			}
		},

		async resume() {
			const connectDetails = await fetchStripeConnectDetails({
				stripeLiaison,
				storeTables: storeDatabase.tables,
			})
			const connectStatus = determineConnectStatus(connectDetails)
			if (connectStatus !== StripeConnectStatus.Paused)
				throw new renraku.ApiError(400, "cannot resume non-paused stripe account")
			else {
				await storeDatabase.tables.merchants.update({
					...dbmage.find({stripeAccountId: connectDetails.stripeAccountId}),
					write: {paused: false},
				})
			}
		},
	}),

	...requiredPrivilege(checker, "control stripe account", {

		async loadConnectDetails() {
			const connectDetails = await fetchStripeConnectDetails({
				stripeLiaison,
				storeTables: storeDatabase.tables,
			})
			return {
				connectDetails,
				connectStatus: determineConnectStatus(connectDetails),
			}
		},

		async generateConnectSetupLink() {
			const connectDetails = await fetchStripeConnectDetails({
				storeTables: storeDatabase.tables,
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
					userId: dbmage.Id.fromString(access.user.userId),
					paused: false,
				}
				await storeDatabase.tables.merchants.create(row)
			}
			const {popupId, ...urls} = makeStripePopupSpec.connect(options)
			const {url: stripeAccountSetupLink} = await stripeLiaison
				.accountLinks.create({
					account: stripeAccountId,
					type: "account_onboarding",
					...urls,
				})
			return {popupId, stripeAccountId, stripeAccountSetupLink}
		},

		async generateStripeLoginLink() {
			const connectDetails = await fetchStripeConnectDetails({
				storeTables: storeDatabase.tables,
				stripeLiaison,
			})
			const stripeAccountId = connectDetails?.stripeAccountId
		
			if (!stripeAccountId)
				return undefined

			const {popupId} = makeStripePopupSpec.login(options)
			return {
				popupId,
				stripeLoginLink: `https://dashboard.stripe.com/b/${stripeAccountId}`,
			}
		},
	}),
}))
