
import {pubsub} from "../../../toolbox/pubsub.js"
import {memoryStorage} from "../../../toolbox/json-storage.js"
import {makeTokenStore2} from "../../../features/auth/goblin/token-store2.js"

type TokenStorageListener = (iframeId: number) => void | Promise<void>

export function mockApiOrigin() {
	const storage = memoryStorage()
	const tokenChangeEvent = pubsub<TokenStorageListener>()

	let iframeCount = 0

	function mockTokenIframe(appId: string) {
		const iframeId = iframeCount++
		const publishTokenChange = () => tokenChangeEvent.publish(iframeId)
		const tokenStore = makeTokenStore2({
			appId,
			storage,
			publishAppTokenChange: publishTokenChange,
			publishAuthTokenChange: publishTokenChange,
		})
		return {
			tokenStore,
			onStorageEvent: (handler: () => void | Promise<void>) => {
				tokenChangeEvent.subscribe(id => {
					if (id !== iframeId) handler()
				})
			},
		}
	}

	return {mockTokenIframe}
}
