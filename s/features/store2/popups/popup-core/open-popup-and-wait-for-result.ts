
import {Popups} from "../types.js"
import {centeredPopupFeatures} from "../../../../toolbox/popups/centered-popup-features.js"

export async function openPopupAndWaitForResult<xResult extends Popups.Result>({
		url,
		width = 260,
		height = 260,
		popupId,
		handleSecretMockCommand = async() => {},
	}: Popups.Parameters): Promise<xResult> {

	// TODO
	// - message origin checking should work properly

	const popup = window.open(url, "_blank", centeredPopupFeatures(width, height))

	return new Promise<xResult | undefined>(resolve => {
		function finish(result: xResult | undefined) {
			clearInterval(interval)
			window.removeEventListener("message", handleMessage)
			resolve(result)
		}
		function handleMessage(event: MessageEvent<any>) {
			const isFromSafeOrigin = event.origin === window.origin
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
				else if (isMatchingPopupId)
					finish(event.data)
				else
					console.error(`ignoring message for other popup "${event.data.popupId}":`, event.data)
			}
			else
				console.error(`ignoring message from origin "${event.origin}":`, event.data)
		}
		window.addEventListener("message", handleMessage)
		const interval = setInterval(() => {
			if (popup.closed)
				finish(undefined)
		}, 100)
	})
}
