
import * as dbmage from "dbmage"

import {StoreApiOptions} from "../types/options.js"
import {StripeLiaison} from "../stripe/liaison/types.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {StripeConnectDetails} from "../../isomorphic/concepts.js"
import {StoreDatabaseUnconnected} from "../database/types/schema.js"
import {makeStripePopupSpec} from "../../popups/make-stripe-popup-spec.js"

export async function createNewConnectAccountRecordsAndSetActive({
		access,
		stripeAccountId,
		storeDatabaseUnconnected,
		generateId,
	}: {
		access: AccessPayload
		stripeAccountId: string
		storeDatabaseUnconnected: StoreDatabaseUnconnected
		generateId: () => dbmage.Id
	}) {

	const connectId = generateId()
	const userId = dbmage.Id.fromString(access.user.userId)

	await storeDatabaseUnconnected.transaction(async({tables}) => {
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

				userId,
				paused: false,
				time: Date.now(),
			})
		await tables
			.connect
			.active
			.update({
				conditions: false,
				whole: {connectId},
			})
	})

	return {
		connectId,
		stripeAccountId,
	}
}

export function isUserOwnerOfStripeAccount(
		access: AccessPayload,
		connectDetails: StripeConnectDetails
	) {
	return access.user.userId === connectDetails.userId
}

export async function createConnectPopup({
		type,
		options,
		stripeLiaison,
		stripeAccountId,
	}: {
		type: "account_onboarding" | "account_update"
		stripeAccountId: string
		options: StoreApiOptions
		stripeLiaison: StripeLiaison
	}) {

	const {popupId, ...urls} =
		makeStripePopupSpec
			.connect(options)

	const {url: stripeAccountSetupLink} =
		await stripeLiaison
			.accountLinks
			.create({
				type,
				account: stripeAccountId,
				...urls,
			})

	return {
		popupId,
		stripeAccountId,
		stripeAccountSetupLink,
	}
}

export async function connectAccountOnboarding({
		access,
		options,
		stripeLiaison,
		storeDatabaseUnconnected,
	}: {
		access: AccessPayload
		options: StoreApiOptions
		stripeLiaison: StripeLiaison
		storeDatabaseUnconnected: StoreDatabaseUnconnected
	}) {

	const {id: stripeAccountId} = await stripeLiaison
		.accounts
		.create({type: "standard"})

	await createNewConnectAccountRecordsAndSetActive({
		access,
		stripeAccountId,
		storeDatabaseUnconnected,
		generateId: options.generateId,
	})

	return createConnectPopup({
		options,
		stripeLiaison,
		stripeAccountId,
		type: "account_onboarding",
	})
}

export async function connectAccountUpdate({
		options,
		stripeLiaison,
		connectDetails,
	}: {
		options: StoreApiOptions
		stripeLiaison: StripeLiaison
		connectDetails: StripeConnectDetails
	}) {

	return createConnectPopup({
		options,
		stripeLiaison,
		type: "account_update",
		stripeAccountId: connectDetails.stripeAccountId,
	})
}
