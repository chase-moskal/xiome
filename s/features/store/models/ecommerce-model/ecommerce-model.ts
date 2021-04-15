
import {Service} from "../../../../types/service.js"
import {onesie} from "../../../../toolbox/onesie.js"
import {minute} from "../../../../toolbox/goodtimes/times.js"
import {storeStatusTopic} from "../../topics/store-status-topic.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"
import {storageCache} from "../../../../toolbox/flex-storage/cache/storage-cache.js"
import {mobxify} from "../../../../framework/mobxify.js"
import {StoreStatus} from "../../topics/types/store-status.js"
import {loading} from "../../../../framework/loading/loading.js"
import {shopkeepingTopic} from "../../topics/shopkeeping-topic.js"

export function makeEcommerceModel({
		appId, storage, storeStatusService, shopkeepingService,
	}: {
		appId: string
		storage: FlexStorage
		storeStatusService: Service<typeof storeStatusTopic>
		shopkeepingService: Service<typeof shopkeepingTopic>
	}) {

	const state = mobxify({
		storeStatus: loading<StoreStatus>(),
	})

	const cache = storageCache({
		lifespan: 5 * minute,
		storage,
		storageKey: `cache-store-status-${appId}`,
		load: onesie(storeStatusService.checkStoreStatus),
	})

	async function fetchStoreStatus() {
		return state.storeStatus.actions.setLoadingUntil({
			promise: cache.read(),
			errorReason: "error loading store status",
		})
	}

	async function setEcommerceActive(ecommerceActive: boolean) {
		await shopkeepingService.setEcommerceActive({
			ecommerceActive,
		})
		return fetchStoreStatus()
	}

	return {
		fetchStoreStatus,
		setEcommerceActive,
		loadingViews: {
			get storeStatus() {
				return state.storeStatus.view
			},
		},
	}
}
