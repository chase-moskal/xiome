
import {PopupMessage} from "../types/popup-message.js"
import {PopupMessageEvent} from "../types/popup-message-event.js"

export function validateRequest({namespace, event, allowedOrigins}: {
			namespace: string
			allowedOrigins: string[]
			event: PopupMessageEvent<PopupMessage>
		}): boolean {

	const relevant: boolean = !!event.data
		&& event.data.namespace === namespace

	if (relevant) {
		if (allowedOrigins.includes(event.origin))
			return true
		else
			console.warn(`message denied from origin "${event.origin}"`, event)
	}

	return false
}
