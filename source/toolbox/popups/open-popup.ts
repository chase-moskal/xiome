
import {validateResponse} from "./validate-response.js"
import {centeredPopupFeatures} from "./centered-popup-features.js"
import {PopupHandler, PopupErrorResponse, PopupFlag, PopupMessage, PopupMessageEvent, PopupGoRequest, PopupPayloadResponse} from "./interfaces.js"

export function openPopup<Parameters, Payload>({
	namespace,
	popupPath,
	parameters,
	popupOrigin,
}: {
	namespace: string
	popupPath: string
	popupOrigin: string
	parameters: Parameters
}): PopupHandler<Payload> {

	// chop the leading slash off the path
	if (popupPath.startsWith("/")) popupPath = popupPath.slice(1)

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
		`${popupOrigin}/${popupPath}`,
		namespace,
		centeredPopupFeatures(),
		true,
	)

	// shift user focus onto the popup, of course
	popup.focus()

	// return the closer and the payload separately
	return {closePopup, promisedPayload}
}
