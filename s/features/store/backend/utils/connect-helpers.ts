
import * as dbmage from "dbmage"

import {StoreApiOptions} from "../types/options.js"
import {StripeLiaison} from "../stripe/liaison/types.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {StripeConnectDetails} from "../../isomorphic/concepts.js"
import {makeStripePopupSpec} from "../../popups/make-stripe-popup-spec.js"
import {fetchStripeConnectDetails} from "./fetch-stripe-connect-details.js"
import {StoreConnectTables, StoreDatabaseUnconnected} from "../database/types/schema.js"

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

export async function assertStripeConnectAccount({
		access,
		stripeLiaison,
		storeDatabaseUnconnected,
		generateId,
	}: {
		access: AccessPayload
		stripeLiaison: StripeLiaison
		storeDatabaseUnconnected: StoreDatabaseUnconnected
		generateId: () => dbmage.Id
	}) {

	const {connectDetails} =
		await fetchStripeConnectDetails({storeDatabaseUnconnected})

	if (!connectDetails) {
		const {id: stripeAccountId} =
			await stripeLiaison
				.accounts
				.create({type: "standard"})

		await createNewConnectAccountRecordsAndSetActive({
			access,
			stripeAccountId,
			storeDatabaseUnconnected,
			generateId,
		})
	}

	return (
		await fetchStripeConnectDetails({storeDatabaseUnconnected})
	).connectDetails
}

async function activateConnectAccount({connectId, storeConnectTables}: {
		connectId: dbmage.Id
		storeConnectTables: StoreConnectTables
	}) {
	await storeConnectTables.active.update({
		conditions: false,
		upsert: {connectId},
	})
}

async function createNewConnectAccountRecordsAndSetActive({
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
		await activateConnectAccount({
			connectId,
			storeConnectTables: tables.connect,
		})
	})

	return {
		connectId,
		stripeAccountId,
	}
}
