
import {validateRequest} from "./validate-request.js"
import {CorsPermissions} from "crosscall/dist/types.js"
import {PopupMessage, PopupReadyResponse, PopupFlag, PopupMessageEvent, PopupGoRequest, PopupPayloadResponse, PopupErrorResponse} from "./interfaces.js"

export function setupPopup<Parameters, Payload>({
	cors,
	action,
	namespace,
}: {
	namespace: string
	cors: CorsPermissions
	action: (parameters: Parameters) => Promise<Payload>
}) {
	const opener: Window = window.opener
	if (!opener) {
		console.log("popup running in standalone debug mode")
		window["action"] = action
		console.log("window.action is now available for debugging")
		return
	}

	function broadcastReadyResponse(response: PopupReadyResponse) {
		opener.postMessage(response, "*")
	}

	// send the ready response
	broadcastReadyResponse({
		namespace,
		flag: PopupFlag.ReadyResponse
	})

	// listen for the go request from the host page, and trigger the action
	window.addEventListener("message", async function goListener(
		event: PopupMessageEvent<PopupGoRequest<Parameters>>
	) {

		// don't continue unless the request is validated
		if (!validateRequest({namespace, event, cors})) return null

		// stop listening (only listen once, it's a one-off)
		window.removeEventListener("message", goListener)

		// extract parameters out of the go request
		const {parameters} = event.data

		function sendResponse<Response extends PopupMessage>(message: Response) {
			opener.postMessage(message, event.origin)
		}

		function sendPayload(payload: Payload) {
			sendResponse<PopupPayloadResponse<Payload>>({
				payload,
				namespace,
				flag: PopupFlag.PayloadResponse,
			})
		}

		function sendError(error: Error) {
			sendResponse<PopupErrorResponse>({
				error,
				namespace,
				flag: PopupFlag.ErrorResponse,
			})
		}

		// run the action, send back the payload or the error
		try {
			sendPayload(await action(parameters))
		}
		catch (error) {
			console.warn(error)
			sendError(error)
		}
	})
}
