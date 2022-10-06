
import {Popups} from "../types.js"
import {centeredPopupFeatures} from "../../../../toolbox/popups/centered-popup-features.js"
import {isSafeOriginForPopupReturn} from "../utils/is-safe-origin-for-popup-return.js"

export async function openPopupAndWaitForResult<xDetails = void>({
		url,
		width = 480,
		height = 640,
		popupId,
		handleSecretMockCommand = async() => {},
	}: Popups.Parameters) {

	const popup = window.open(url, "_blank", centeredPopupFeatures(width, height))

	return new Promise<Popups.Result<xDetails>>(resolve => {

		function finish(result: Popups.Result<xDetails>) {
			clearInterval(interval)
			window.removeEventListener("message", handleMessage)
			resolve(result)
		}

		function handleMessage(event: MessageEvent<any>) {
			const isFromSafeOrigin = isSafeOriginForPopupReturn(event.origin)
			const isMatchingPopupId = event.data?.popupId === popupId
			const isSecretMockCommand = event.data.secretMockCommand === true

			if (isFromSafeOrigin) {
				if (isSecretMockCommand)
					handleSecretMockCommand(event.data).then(() => {
						popup.postMessage(<Popups.SecretMockResponse>{
							secretMockCommand: true,
							commandId: event.data.commandId,
						}, "*")
					})
				else if (isMatchingPopupId) {
					const {popupId, ...details} = event.data
					finish({popupId, details})
				}
				else
					console.warn(`ignoring message for other popup "${event.data.popupId}":`, event.data)
			}
			else
				console.warn(`ignoring message from origin "${event.origin}":`, event.data)
		}

		window.addEventListener("message", handleMessage)

		const interval = setInterval(() => {
			if (popup.closed)
				finish({popupId})
		}, 100)
	})
}
