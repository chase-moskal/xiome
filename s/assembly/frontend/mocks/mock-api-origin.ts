
import {pubsub} from "../../../toolbox/pubsub.js"
import {memoryStorage} from "../../../toolbox/json-storage.js"
import {makeTokenStore2} from "../../../features/auth/goblin/token-store2.js"

type TokenStorageListener = (iframeId: number) => void | Promise<void>

export function mockApiOrigin() {
	const storage = memoryStorage()
	const storageEvent = pubsub<TokenStorageListener>()

	let iframeCount = 0

	function mockTokenIframe() {
		const iframeId = iframeCount++
		const tokenStore = makeTokenStore2({
			storage,
			publishMockStorageEvent: () => storageEvent.publish(iframeId),
		})
		return {
			tokenStore,
			onStorageEvent: (handler: () => void | Promise<void>) => {
				storageEvent.subscribe(id => {
					if (id !== iframeId) handler()
				})
			},
		}
	}

	return {mockTokenIframe}
}
