
import {PopupFlag} from "./types/popup-flag.js"
import {PopupMessage} from "./types/popup-message.js"
import {validateRequest} from "./validation/validate-request.js"
import {PopupMessageEvent} from "./types/popup-message-event.js"
import {PopupGoRequest} from "./types/requests/popup-go-request.js"
import {PopupReadyResponse} from "./types/responses/popup-ready-response.js"
import {PopupErrorResponse} from "./types/responses/popup-error-response.js"
import {PopupPayloadResponse} from "./types/responses/popup-payload-response.js"

export function setupManualPopup<xParameters, xPayload>({
			namespace,
			allowedOrigins,
		}: {
			namespace: string
			allowedOrigins: string[]
		}) {

	const opener: Window = window.opener
	if (!opener)
		throw new Error(`popup "${namespace}" cannot act standalone`)

	function sendResponse<xResponse extends PopupMessage>(
				targetOrigin: string,
				message: xResponse,
			) {
		opener.postMessage(message, targetOrigin)
	}

	return {
		respondError(targetOrigin: string, error: Error) {
			sendResponse<PopupErrorResponse>(targetOrigin, {
				error,
				namespace,
				flag: PopupFlag.ErrorResponse,
			})
		},
		respondPayload(targetOrigin: string, payload: xPayload) {
			sendResponse<PopupPayloadResponse<xPayload>>(targetOrigin, {
				namespace,
				payload: payload,
				flag: PopupFlag.PayloadResponse,
			})
		},
		sendReadyAndListenForGo(action: (targetOrigin: string, parameters: xParameters) => void) {

			window.addEventListener("message", async function goListener(
						event: PopupMessageEvent<PopupGoRequest<xParameters>>
					) {
				if (!validateRequest({
							namespace,
							event,
							allowedOrigins,
						}))
					return null
				window.removeEventListener("message", goListener)
				action(event.origin, event.data.parameters)
			})

			sendResponse<PopupReadyResponse>("*", {
				namespace,
				flag: PopupFlag.ReadyResponse,
			})
		},
	}
}
