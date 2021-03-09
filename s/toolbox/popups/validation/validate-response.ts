
import {PopupMessage} from "../types/popup-message.js"
import {PopupMessageEvent} from "../types/popup-message-event.js"

export function validateResponse({
	event,
	namespace,
	popupOrigin,
}: {
	namespace: string
	popupOrigin: string
	event: PopupMessageEvent<PopupMessage>
}): boolean {

	const relevant: boolean = !!event.data
		&& event.data.namespace === namespace

	const originsMatch = event.origin.toLowerCase() === popupOrigin.toLowerCase()

	if (relevant) {
		if (originsMatch)
			return true
		else
			console.warn(`message denied from origin "${event.origin}"`, event)
	}

	return false
}
