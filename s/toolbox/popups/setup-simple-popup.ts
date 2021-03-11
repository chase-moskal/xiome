
import {PopupFlag} from "./types/popup-flag.js"
import {PopupMessage} from "./types/popup-message.js"
import {validateRequest} from "./validation/validate-request.js"
import {PopupMessageEvent} from "./types/popup-message-event.js"
import {PopupGoRequest} from "./types/requests/popup-go-request.js"
import {PopupReadyResponse} from "./types/responses/popup-ready-response.js"
import {PopupErrorResponse} from "./types/responses/popup-error-response.js"
import {PopupPayloadResponse} from "./types/responses/popup-payload-response.js"

export function setupSimplePopup<Parameters, Payload>({
			namespace,
			allowedOrigins,
			action,
		}: {
			namespace: string
			allowedOrigins: string[]
			action: (parameters: Parameters) => Promise<Payload>
		}) {

	const opener: Window = window.opener

	if (!opener) {
		console.log("popup running in standalone debug mode")
		window["action"] = action
		console.log("window.action is now available for debugging")
		return
	}

	opener.postMessage(<PopupReadyResponse>{
		namespace,
		flag: PopupFlag.ReadyResponse,
	}, "*")

	window.addEventListener("message", async function goListener(
				event: PopupMessageEvent<PopupGoRequest<Parameters>>
			) {

		if (!validateRequest({namespace, event, allowedOrigins}))
			return null

		// stop listening (only listen once, it's a one-off)
		window.removeEventListener("message", goListener)

		function sendResponse<Response extends PopupMessage>(message: Response) {
			opener.postMessage(message, event.origin)
		}

		try {
			sendResponse<PopupPayloadResponse<Payload>>({
				namespace,
				payload: await action(event.data.parameters),
				flag: PopupFlag.PayloadResponse,
			})
		}
		catch (error) {
			console.warn(error)
			sendResponse<PopupErrorResponse>({
				error,
				namespace,
				flag: PopupFlag.ErrorResponse,
			})
		}
	})
}
