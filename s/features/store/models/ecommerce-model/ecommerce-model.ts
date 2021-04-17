
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

export function makeEcommerceModel({
		appId, storage, statusCheckerService, statusTogglerService,
	}: {
		appId: string
		storage: FlexStorage
		statusCheckerService: Service<typeof statusCheckerTopic>
		statusTogglerService: Service<typeof statusTogglerTopic>
	}) {

	const state = mobxify({
		storeStatus: loading<StoreStatus>(),
	})

	const cache = storageCache({
		lifespan: 5 * minute,
		storage,
		storageKey: `cache-store-status-${appId}`,
		load: onesie(statusCheckerService.getStoreStatus),
	})

	async function fetchStoreStatus(forceFresh: boolean = false) {
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

	let initialized = false
	async function initialize() {
		if (!initialized) {
			initialized = true
			await fetchStoreStatus()
		}
	}

	return {
		initialize,
		fetchStoreStatus,
		enableEcommerce,
		disableEcommerce,
		async accessChange() {
			await fetchStoreStatus(true)
		},
		loadingViews: {
			get storeStatus() {
				return state.storeStatus.view
			},
		},
	}
}