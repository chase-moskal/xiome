
import {Service} from "../../../../types/service.js"
import {onesie} from "../../../../toolbox/onesie.js"
import {minute} from "../../../../toolbox/goodtimes/times.js"
import {storeStatusTopic} from "../../topics/store-status-topic.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"
import {storageCache} from "../../../../toolbox/flex-storage/cache/storage-cache.js"

export function makeEcommerceModel({
		appId, storage, storeStatusService,
	}: {
		appId: string
		storage: FlexStorage
		storeStatusService: Service<typeof storeStatusTopic>
	}) {

	const cache = storageCache({
		lifespan: 5 * minute,
		storage,
		storageKey: `cache-store-status-${appId}`,
		load: onesie(storeStatusService.checkStoreStatus),
	})

	return {
		fetchStoreStatus: cache.read,
	}
}
