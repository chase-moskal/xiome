
import {PopupFlag} from "./types/popup-flag.js"
import {PopupHandler} from "./types/popup-handler.js"
import {PopupMessage} from "./types/popup-message.js"
import {PopupMessageEvent} from "./types/popup-message-event.js"
import {centeredPopupFeatures} from "./centered-popup-features.js"
import {validateResponse} from "./validation/validate-response.js"
import {PopupGoRequest} from "./types/requests/popup-go-request.js"
import {PopupErrorResponse} from "./types/responses/popup-error-response.js"
import {PopupPayloadResponse} from "./types/responses/popup-payload-response.js"

export function openPopup<Parameters, Payload>({
			popupLink,
			namespace,
			parameters,
		}: {
			popupLink: string
			namespace: string
			parameters: Parameters
		}): PopupHandler<Payload> {

	const popupOrigin = new URL(popupLink).origin

	// scope these variables high up, so we can return closePopup
	let popup: Window
	let messageListener: (event: PopupMessageEvent<PopupMessage>) => void

	function closePopup() {
		window.removeEventListener("message", messageListener)
		popup.close()
	}

	const promisedPayload = new Promise<Payload>((resolve, reject) => {
		messageListener = (event: PopupMessageEvent<PopupMessage>) => {
			const message = event.data
			if (validateResponse({event, popupOrigin, namespace})) {
				try {

					if (message.flag === PopupFlag.ReadyResponse) {
						popup.postMessage(
							<PopupGoRequest<Parameters>>{
								namespace,
								parameters,
								flag: PopupFlag.GoRequest,
							},
							popupOrigin
						)
					}

					else if (message.flag === PopupFlag.PayloadResponse) {
						const {payload} = <PopupPayloadResponse<Payload>>message
						closePopup()
						resolve(payload)
					}

					else if (message.flag === PopupFlag.ErrorResponse) {
						const {error} = <PopupErrorResponse>message
						closePopup()
						reject(error)
					}

					else {
						closePopup()
						throw new Error("unknown popup message flag")
					}
				}
				catch (error) {
					closePopup()
					reject(error)
				}
			}
		}
	})

	window.addEventListener("message", messageListener)

	popup = window.open(
		popupLink,
		namespace,
		centeredPopupFeatures(),
	)

	popup.focus()

	return {closePopup, promisedPayload}
}
