
// import {pubsub} from "../../../toolbox/pubsub.js"
// import {makeTokenStore2} from "../../../features/auth/goblin/token-store2.js"
// import {memoryFlexStorage} from "../../../toolbox/flex-storage/memory-flex-storage.js"

// type TokenStorageListener = (iframeId: number) => void | Promise<void>

// export function mockApiOrigin() {
// 	const storage = memoryFlexStorage()
// 	const tokenChangeEvent = pubsub<TokenStorageListener>()

// 	let iframeCount = 0

// 	function mockTokenIframe(id_app: string) {
// 		const iframeId = iframeCount++
// 		const publishTokenChange = () => tokenChangeEvent.publish(iframeId)
// 		const tokenStore = makeTokenStore2({
// 			id_app,
// 			storage,
// 			publishAppTokenChange: publishTokenChange,
// 			publishAuthTokenChange: publishTokenChange,
// 		})
// 		return {
// 			tokenStore,
// 			onStorageEvent: (handler: () => void | Promise<void>) => {
// 				tokenChangeEvent.subscribe(id => {
// 					if (id !== iframeId) handler()
// 				})
// 			},
// 		}
// 	}

// 	return {mockTokenIframe}
// }
