
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {StoreServiceOptions} from "../types/options.js"
import {StripeConnectStatus} from "../../isomorphic/concepts.js"
import {requiredPrivilege} from "../utils/required-privilege.js"
import {makeStripePopupSpec} from "../../popups/make-stripe-popup-spec.js"
import {fetchStripeConnectDetails} from "../utils/fetch-stripe-connect-details.js"
import {determineConnectStatus} from "../../isomorphic/utils/determine-connect-status.js"

export const makeConnectService = (options: StoreServiceOptions) =>
renraku
.service()
.policy(options.storePolicies.guest)
.expose(({access, stripeLiaison, storeDatabase, checker}) => ({

	async loadConnectStatus() {
		const {connectDetails} = await fetchStripeConnectDetails({
			stripeLiaison,
			storeTables: storeDatabase.tables,
		})
		return determineConnectStatus(connectDetails)
	},

	...requiredPrivilege(checker, "manage store", {

		async pause() {
			const {connectDetails} = await fetchStripeConnectDetails({
				stripeLiaison,
				storeTables: storeDatabase.tables,
			})

			const {stripeAccountId} = connectDetails
			const connectStatus = determineConnectStatus(connectDetails)

			if (connectStatus !== StripeConnectStatus.Ready)
				throw new renraku.ApiError(
					400,
					"cannot pause non-ready stripe account",
				)

			else
				await storeDatabase
					.tables
					.connect
					.accounts
					.update({
						...dbmage.find({stripeAccountId}),
						write: {paused: true},
					})
		},

		async resume() {
			const {connectDetails} = await fetchStripeConnectDetails({
				stripeLiaison,
				storeTables: storeDatabase.tables,
			})

			const {stripeAccountId} = connectDetails
			const connectStatus = determineConnectStatus(connectDetails)

			if (connectStatus !== StripeConnectStatus.Paused)
				throw new renraku.ApiError(
					400,
					"cannot resume non-paused stripe account"
				)

			else
				await storeDatabase
					.tables
					.connect
					.accounts
					.update({
						...dbmage.find({stripeAccountId}),
						write: {paused: false},
					})
		},
	}),

	...requiredPrivilege(checker, "control stripe account", {

		async loadConnectDetails() {
			const {connectDetails} = await fetchStripeConnectDetails({
				stripeLiaison,
				storeTables: storeDatabase.tables,
			})
			return {
				connectDetails,
				connectStatus: determineConnectStatus(connectDetails),
			}
		},

		async generateConnectSetupLink() {
			const {connectDetails} = await fetchStripeConnectDetails({
				storeTables: storeDatabase.tables,
				stripeLiaison,
			})

			let stripeAccountId = connectDetails?.stripeAccountId

			if (!stripeAccountId) {
				const stripeAccount = await stripeLiaison
					.accounts
					.create({type: "standard"})

				const connectId = options.generateId()
				stripeAccountId = stripeAccount.id

				await storeDatabase.transaction(async({tables}) => {
					await tables
						.connect
						.accounts
						.create({
							connectId,
	
							stripeAccountId,
							charges_enabled: false,
							payouts_enabled: false,
							details_submitted: false,
							email: undefined,
	
							time: Date.now(),
							paused: false,
							userId: dbmage.Id.fromString(access.user.userId),
						})
					await tables
						.connect
						.active
						.update({
							conditions: false,
							whole: {connectId},
						})
				})
			}

			const {popupId, ...urls} =
				makeStripePopupSpec
					.connect(options)

			const {url: stripeAccountSetupLink} =
				await stripeLiaison
					.accountLinks
					.create({
						account: stripeAccountId,
						type: "account_onboarding",
						...urls,
					})

			return {popupId, stripeAccountId, stripeAccountSetupLink}
		},

		async generateStripeLoginLink() {
			const {connectDetails} = await fetchStripeConnectDetails({
				storeTables: storeDatabase.tables,
				stripeLiaison,
			})
			const stripeAccountId = connectDetails?.stripeAccountId
			return !stripeAccountId
				? undefined
				: {
					stripeLoginLink: `https://dashboard.stripe.com/b/${stripeAccountId}`,
					popupId: makeStripePopupSpec
						.login(options)
						.popupId,
				}
		},
	}),
}))
