
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {StoreServiceOptions} from "../types/options.js"
import {StripeConnectStatus} from "../../isomorphic/concepts.js"
import {requiredPrivilege} from "../utils/required-privilege.js"
import {assertStripeConnectAccount, createConnectPopup} from "../utils/connect-helpers.js"
import {makeStripePopupSpec} from "../../popups/make-stripe-popup-spec.js"
import {fetchStripeConnectDetails} from "../utils/fetch-stripe-connect-details.js"
import {determineConnectStatus} from "../../isomorphic/utils/determine-connect-status.js"

export const makeConnectService = (options: StoreServiceOptions) =>
renraku
.service()
.policy(options.storePolicies.guest)
.expose(({access, stripeLiaison, storeDatabaseUnconnected, checker}) => ({

	async loadConnectStatus() {
		const {connectDetails} =
			await fetchStripeConnectDetails({storeDatabaseUnconnected})

		return determineConnectStatus(connectDetails)
	},

	...requiredPrivilege(checker, "manage store", {

		async pause() {
			const {connectDetails} =
				await fetchStripeConnectDetails({storeDatabaseUnconnected})

			const {stripeAccountId} = connectDetails
			const connectStatus = determineConnectStatus(connectDetails)

			if (connectStatus !== StripeConnectStatus.Ready)
				throw new renraku.ApiError(
					400,
					"cannot pause non-ready stripe account",
				)

			else
				await storeDatabaseUnconnected
					.tables
					.connect
					.accounts
					.update({
						...dbmage.find({stripeAccountId}),
						write: {paused: true},
					})
		},

		async resume() {
			const {connectDetails} =
				await fetchStripeConnectDetails({storeDatabaseUnconnected})

			const {stripeAccountId} = connectDetails
			const connectStatus = determineConnectStatus(connectDetails)

			if (connectStatus !== StripeConnectStatus.Paused)
				throw new renraku.ApiError(
					400,
					"cannot resume non-paused stripe account"
				)

			else
				await storeDatabaseUnconnected
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
			const {connectDetails} =
				await fetchStripeConnectDetails({storeDatabaseUnconnected})

			return {
				connectDetails,
				connectStatus: determineConnectStatus(connectDetails),
			}
		},

		async generatePopupForStripeAccountOnboarding() {
			const {stripeAccountId} = await assertStripeConnectAccount({
				access,
				stripeLiaison,
				storeDatabaseUnconnected,
				generateId: options.generateId,
			})
			return createConnectPopup({
				options,
				stripeLiaison,
				stripeAccountId,
				type: "account_onboarding",
			})
		},

		async generatePopupForStripeAccountUpdate() {
			const {stripeAccountId} = await assertStripeConnectAccount({
				access,
				stripeLiaison,
				storeDatabaseUnconnected,
				generateId: options.generateId,
			})
			return createConnectPopup({
				options,
				stripeLiaison,
				stripeAccountId,
				type: "account_update",
			})
		},

		// async generateConnectPopup() {
		// 	const {connectDetails} =
		// 		await fetchStripeConnectDetails({storeDatabaseUnconnected})

		// 	if (connectDetails) {
		// 		if (isUserOwnerOfStripeAccount(access, connectDetails))
		// 			return connectAccountUpdate({
		// 				options,
		// 				stripeLiaison,
		// 				connectDetails,
		// 			})
		// 		else
		// 			throw new renraku.ApiError(
		// 				401,
		// 				"unauthorized to update stripe account"
		// 			)
		// 	}
		// 	else {
		// 		const userId = dbmage.Id.fromString(access.user.userId)
		// 		const accountAlreadyExistsForUser =
		// 			await storeDatabaseUnconnected
		// 				.tables
		// 				.connect
		// 				.accounts
		// 				.readOne(dbmage.find({userId}))
		// 		return accountAlreadyExistsForUser
		// 			? connectAccountUpdate({
		// 				connectDetails,
		// 				options,
		// 				stripeLiaison,
		// 			})
		// 			: connectAccountOnboarding({
		// 				access,
		// 				options,
		// 				stripeLiaison,
		// 				storeDatabaseUnconnected,
		// 			})
		// 	}
		// },

		async generateStripeLoginLink() {
			const {connectDetails} =
				await fetchStripeConnectDetails({storeDatabaseUnconnected})

			const stripeAccountId = connectDetails?.stripeAccountId
			return !stripeAccountId
				? undefined
				: {
					stripeLoginLink: `https://dashboard.stripe.com/b/${stripeAccountId}`,
					popupId: (
						makeStripePopupSpec
							.login(options)
							.popupId
					),
				}
		},
	}),
}))
