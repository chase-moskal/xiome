
import {PopupFlag} from "./types/popup-flag.js"
import {PopupHandler} from "./types/popup-handler.js"
import {PopupMessage} from "./types/popup-message.js"
import {validateResponse} from "./validate-response.js"
import {PopupMessageEvent} from "./types/popup-message-event.js"
import {centeredPopupFeatures} from "./centered-popup-features.js"
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

	// close the popup
	function closePopup() {
		window.removeEventListener("message", messageListener)
		popup.close()
	}

	// define the message listener, extract the payload as a promise
	const promisedPayload = new Promise<Payload>((resolve, reject) => {
		messageListener = (event: PopupMessageEvent<PopupMessage>) => {
			const message = event.data
			if (validateResponse({event, popupOrigin, namespace})) {
				try {

					// handle ready response by sending go request
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

					// handle result response
					else if (message.flag === PopupFlag.PayloadResponse) {
						const {payload} = <PopupPayloadResponse<Payload>>message
						closePopup()
						resolve(payload)
					}

					// handle an error
					else if (message.flag === PopupFlag.ErrorResponse) {
						const {error} = <PopupErrorResponse>message
						closePopup()
						reject(error)
					}

					// throw on unknown response
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

	// start listening for messages from the popup
	window.addEventListener("message", messageListener)

	// open the popup
	popup = window.open(
		popupLink,
		namespace,
		centeredPopupFeatures(),
	)

	// shift user focus onto the popup, of course
	popup.focus()

	// return the closer and the payload separately
	return {closePopup, promisedPayload}
}
