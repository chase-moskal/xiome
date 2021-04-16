
import {Cache} from "./types/cache.js"
import {FlexStorage} from "../types/flex-storage.js"

export function storageCache<xData>({
		storage,
		lifespan,
		storageKey,
		load,
	}: {
		lifespan: number
		storageKey: string
		storage: FlexStorage
		load: () => Promise<xData>
	}) {

	async function getValidCache(): Promise<undefined | Cache<xData>> {
		let valid = false
		const cache = await storage.read<Cache<xData>>(storageKey)
		if (cache) {
			const since = Date.now() - cache.time
			const alive = since < lifespan
			if (alive)
				valid = true
		}
		return valid
			? cache
			: undefined
	}

	async function loadFreshAndWriteCache() {
		const data = await load()
		const time = Date.now()
		await storage.write<Cache<xData>>(storageKey, {data, time})
		return data
	}

	return {

		async read(): Promise<xData> {
			const cache = await getValidCache()
			return cache
				? cache.data
				: loadFreshAndWriteCache()
		},

		async readFresh(): Promise<xData> {
			return loadFreshAndWriteCache()
		},

		async readCached(): Promise<undefined | xData> {
			const cache = await getValidCache()
			return cache?.data
		},

		async clear(): Promise<void> {
			await storage.write<Cache<xData>>(storageKey, undefined)
		},

		async write(data: xData, time = Date.now()) {
			await storage.write<Cache<xData>>(storageKey, {data, time})
		},
	}
}
