
import {Service} from "../../../../types/service.js"
import {onesie} from "../../../../toolbox/onesie.js"
import {minute} from "../../../../toolbox/goodtimes/times.js"
import {statusCheckerTopic} from "../../topics/status-checker-topic.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"
import {storageCache} from "../../../../toolbox/flex-storage/cache/storage-cache.js"
import {mobxify} from "../../../../framework/mobxify.js"
import {StoreStatus} from "../../topics/types/store-status.js"
import {loading} from "../../../../framework/loading/loading.js"
import {statusTogglerTopic} from "../../topics/status-toggler-topic.js"
import {PlanningSituation} from "../subscription-planning-model/types/planning-situation.js"
import {shopkeepingTopic} from "../../topics/shopkeeping-topic.js"
import {AccessPayload} from "../../../auth/types/tokens/access-payload.js"
import {isAllowedToPlanSubscriptions} from "../subscription-planning-model/helpers/is-allowed-to-plan-subscriptions.js"
import {SubscriptionPlanDraft} from "../../api/tables/types/drafts/subscription-plan-draft.js"

//
// state
//

function storeModelState() {
	const state = mobxify({
		access: <AccessPayload>undefined,
		storeStatus: loading<StoreStatus>(),
		subscriptionPlanning: {
			situation: <PlanningSituation.Any>{
				mode: PlanningSituation.Mode.LoggedOut,
			},
			setSubscriptionSituation(situation: PlanningSituation.Any) {
				state.subscriptionPlanning.situation = situation
			},
		},
		setAccess(access: AccessPayload) {
			state.access = access
		},
	})
	return state
}

//
// types
//

type StoreModelState = ReturnType<typeof storeModelState>

interface StoreModelOptions {
	state: StoreModelState
	appId: string
	storage: FlexStorage
	shopkeepingService: Service<typeof shopkeepingTopic>
	statusCheckerService: Service<typeof statusCheckerTopic>
	statusTogglerService: Service<typeof statusTogglerTopic>
}

//
// helpers
//

function createLoadingThatStartsReady() {
	const load = loading<void>()
	load.actions.setReady()
	return load
}

//
// subscription planning model
//

function makeSubscriptionPlanningModel({
		state, shopkeepingService,
	}: StoreModelOptions) {

	let activated = false

	const loadPlans = onesie(async function() {
		if (state.subscriptionPlanning.situation.mode === PlanningSituation.Mode.Privileged) {
			await state.subscriptionPlanning.situation.loadingPlans.actions.setLoadingUntil({
				errorReason: "failed to load subscription plans",
				promise: shopkeepingService.listSubscriptionPlans(),
			})
		}
	})

	async function activate() {
		activated = true
		await loadPlans()
	}

	async function update() {
		const access = state.access
		const storeStatus = state.storeStatus.view.payload
		const isStoreInitialized = storeStatus !== undefined
			&& storeStatus !== StoreStatus.Uninitialized
		state.subscriptionPlanning.setSubscriptionSituation(
			isStoreInitialized
				? access
					? isAllowedToPlanSubscriptions(access)
						? {
							mode: PlanningSituation.Mode.Privileged,
							loadingPlans: loading(),
							loadingPlanCreation: createLoadingThatStartsReady(),
						}
						: {mode: PlanningSituation.Mode.Unprivileged}
					: {mode: PlanningSituation.Mode.LoggedOut}
				: {mode: PlanningSituation.Mode.StoreUninitialized}
		)
	}

	function getSituationMode() {
		return state.subscriptionPlanning.situation.mode
	}

	function requirePrivilegedSituation() {
		if (state.subscriptionPlanning.situation.mode !== PlanningSituation.Mode.Privileged)
			throw new Error("not privileged for subscription planning")
		return state.subscriptionPlanning.situation
	}

	function getLoadingViews() {
		const situation = requirePrivilegedSituation()
		return {
			loadingPlans: situation.loadingPlans.view,
			loadingPlanCreation: situation.loadingPlanCreation.view,
		}
	}

	async function createPlan(draft: SubscriptionPlanDraft) {
		const situation = requirePrivilegedSituation()
		async function action() {
			const plan = await shopkeepingService.createSubscriptionPlan({draft})
			const existingPlans = situation.loadingPlans.view.payload
			const newPlans = [...existingPlans, plan]
			situation.loadingPlans.actions.setReady(newPlans)
		}
		return situation.loadingPlanCreation.actions.setLoadingUntil({
			errorReason: "error creating subscription plan",
			promise: action(),
		})
	}

	async function deactivatePlan(subscriptionPlanId: string) {
		const situation = requirePrivilegedSituation()
		return situation.loadingPlans.actions.setLoadingUntil({
			errorReason: "error occurred",
			promise: shopkeepingService
				.deactivateSubscriptionPlan({subscriptionPlanId})
				.then(shopkeepingService.listSubscriptionPlans)
		})
	}

	async function deletePlan(subscriptionPlanId: string) {
		const situation = requirePrivilegedSituation()
		return situation.loadingPlans.actions.setLoadingUntil({
			errorReason: "error occurred",
			promise: shopkeepingService
				.deleteSubscriptionPlan({subscriptionPlanId})
				.then(shopkeepingService.listSubscriptionPlans)
		})
	}

	return {
		activate,
		update,
		getSituationMode,
		getLoadingViews,
		createPlan,
		deactivatePlan,
		deletePlan,
	}
}

//
// ecommerce model
//

function makeEcommerceModel({
		state,
		appId, storage, statusCheckerService, statusTogglerService,
	}: StoreModelOptions) {

	const cache = storageCache({
		lifespan: 5 * minute,
		storage,
		storageKey: `cache-store-status-${appId}`,
		load: onesie(statusCheckerService.getStoreStatus),
	})

	async function fetchStoreStatus(forceFresh = false) {
		return state.storeStatus.actions.setLoadingUntil({
			promise: forceFresh
				? cache.readFresh()
				: cache.read(),
			errorReason: "error loading store status",
		})
	}

	async function enableEcommerce() {
		await statusTogglerService.enableEcommerce()
		state.storeStatus.actions.setReady(StoreStatus.Enabled)
	}

	async function disableEcommerce() {
		await statusTogglerService.disableEcommerce()
		state.storeStatus.actions.setReady(StoreStatus.Disabled)
	}

	const initialize = (() => {
		let done = false
		return async function() {
			if (!done) {
				done = true
				await fetchStoreStatus()
			}
		}
	})()

	return {
		initialize,
		enableEcommerce,
		disableEcommerce,
		fetchStoreStatus,
		loadingViews: {
			get storeStatus() {
				return state.storeStatus.view
			}
		},
	}
}

//
// bank model
//

function makeBankModel(state: StoreModelState) {
	return {}
}

export async function makeStoreModel(options: StoreModelOptions) {
	const state = storeModelState()

	const bankModel = makeBankModel(state)
	const ecommerceModel = makeEcommerceModel(options)
	const subscriptionPlanningModel = makeSubscriptionPlanningModel(options)

	await ecommerceModel.initialize()

	return {
		bankModel,
		ecommerceModel,
		subscriptionPlanningModel,
		async accessChange(access: AccessPayload) {
			state.access = access
			await subscriptionPlanningModel.update()
		}
	}
}
