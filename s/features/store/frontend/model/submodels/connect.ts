
import {StoreServices} from "../../types.js"
import {StoreStateSystem} from "../../state.js"
import {ops} from "../../../../../framework/ops.js"
import {StripePopups} from "../../../popups/types.js"
import {StripeConnectStatus} from "../../../isomorphic/concepts.js"
import {storePrivileges} from "../../../isomorphic/privileges.js"

export function makeConnectSubmodel({
		stripePopups,
		services,
		stateSystem,
		reloadStore,
	}: {
		stripePopups: StripePopups,
		services: StoreServices
		stateSystem: StoreStateSystem
		reloadStore: () => Promise<void>
	}) {

	const state = stateSystem.snap.writable
	const {allowance} = stateSystem

	async function load() {
		state.stripeConnect.connectStatusOp = ops.none()
		state.stripeConnect.connectDetailsOp = ops.none()
		if (allowance.connectStripeAccount) {
			await ops.operation({
				promise: services.connect.loadConnectDetails(),
				setOp: op => {
					state.stripeConnect.connectStatusOp = ops.replaceValue(
						op,
						ops.value(op)?.connectStatus
					)
					state.stripeConnect.connectDetailsOp = ops.replaceValue(
						op,
						ops.value(op)?.connectDetails
					)
				},
			})
		}
		else {
			await ops.operation({
				promise: services.connect.loadConnectStatus(),
				setOp: op => state.stripeConnect.connectStatusOp = op,
			})
		}
	}

	return {
		load,

		get isOnboardingNeeded() {
			const {get} = stateSystem
			return get.connect.status === StripeConnectStatus.Unlinked
				|| !get.connect.details?.details_submitted
		},

		get isAllowedToOnboard() {
			const {get} = stateSystem
			const access = get.user.access

			if (!access?.user)
				return false

			if (!access.permit.privileges.includes(
					storePrivileges["control stripe account"]
				))
				return false

			return get.connect.status === StripeConnectStatus.Unlinked
				? true
				: access.user.userId === get.connect.details?.userId
		},

		async stripeAccountOnboarding() {
			const popupInfo =
				await services
					.connect
					.generatePopupForStripeAccountOnboarding()
			const result =
				await stripePopups
					.connect(popupInfo)
			if (result.details?.status === "return")
				await reloadStore()
		},

		async stripeLogin() {
			const connectStatus = ops.value(state.stripeConnect.connectStatusOp)
			const connectDetails = ops.value(state.stripeConnect.connectDetailsOp)
			if (connectStatus === StripeConnectStatus.Unlinked)
				throw new Error("no stripe account to generate login link for")
			if (!connectDetails)
				throw new Error("stripe connect details missing for login")
			const {stripeLoginLink, popupId} = await services.connect.generateStripeLoginLink()
			const {stripeAccountId} = connectDetails
			await stripePopups.login({stripeAccountId, stripeLoginLink, popupId})
			await reloadStore()
		},

		async pause() {
			await services.connect.pause()
			state.stripeConnect.connectStatusOp = ops.ready(StripeConnectStatus.Paused)
			if (allowance.manageStore)
			state.stripeConnect.connectDetailsOp = ops.ready({
					...ops.value(state.stripeConnect.connectDetailsOp),
					paused: true,
				})
		},

		async resume() {
			await services.connect.resume()
			state.stripeConnect.connectStatusOp = ops.ready(StripeConnectStatus.Ready)
			if (allowance.manageStore)
				state.stripeConnect.connectDetailsOp = ops.ready({
					...ops.value(state.stripeConnect.connectDetailsOp),
					paused: false,
				})
		},
	}
}
