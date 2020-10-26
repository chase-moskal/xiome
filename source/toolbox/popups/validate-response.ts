
import {PopupMessageEvent, PopupMessage} from "./interfaces.js"

export function validateResponse({
	event,
	namespace,
	popupOrigin,
}: {
	namespace: string
	popupOrigin: string
	event: PopupMessageEvent<PopupMessage>
}): boolean {

	// is this message from our popup? or somewhere else?
	const relevant: boolean = !!event.data
		&& event.data.namespace === namespace

	// is this message from the origin we're expecting?
	const originsMatch = event.origin.toLowerCase() === popupOrigin.toLowerCase()

	// only process the relevant messages, and warn if origins don't match
	if (relevant) {
		if (originsMatch) return true
		else console.warn(`message denied from origin "${event.origin}"`)
	}

	return false
}
