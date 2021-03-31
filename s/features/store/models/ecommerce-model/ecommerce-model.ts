
import {CacheData} from "./types/cache-data.js"
import {Service} from "../../../../types/service.js"
import {minute} from "../../../../toolbox/goodtimes/times.js"
import {StoreStatus} from "../../topics/types/store-status.js"
import {storeStatusTopic} from "../../topics/store-status-topic.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"
import {onesie} from "../../../../toolbox/onesie.js"

export function makeEcommerceModel({
		appId, storage, storeStatusService,
	}: {
		appId: string
		storage: FlexStorage
		storeStatusService: Service<typeof storeStatusTopic>
	}) {

	const cacheTime = minute * 5
	const cacheKey = `cache-store-status-${appId}`
	type Cache = CacheData<StoreStatus>

	function cacheIsValid(data: Cache) {
		let valid = false
		if (data) {
			const since = Date.now() - data.time
			if (since < cacheTime)
				valid = true
		}
		return valid
	}

	async function fetchAndWriteCache() {
		const storeStatus = await storeStatusService.checkStoreStatus()
		await storage.write<Cache>(cacheKey, {
			data: storeStatus,
			time: Date.now(),
		})
		return storeStatus
	}

	const fetchStoreStatus = onesie(async(
			{forceFresh}: {forceFresh: boolean} = {forceFresh: false}
		): Promise<StoreStatus> => {
		return forceFresh
			? fetchAndWriteCache()
			: (async() => {
				const cache = await storage.read<Cache>(cacheKey)
				return cacheIsValid(cache)
					? cache.data
					: fetchAndWriteCache()
			})()
	})

	return {fetchStoreStatus}
}
