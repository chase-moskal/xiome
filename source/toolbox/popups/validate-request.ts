
import {verifyCors} from "renraku/dist/verify-cors.js"
import {CorsPermissions} from "crosscall/dist/types.js"
import {PopupMessageEvent, PopupMessage} from "./interfaces.js"

export function validateRequest({namespace, event, cors}: {
	namespace: string
	cors: CorsPermissions
	event: PopupMessageEvent<PopupMessage>,
}): boolean {
	const {origin, data: message} = event

	// is this message intended for this popup?
	const relevant: boolean = !!event.data
		&& event.data.namespace === namespace

	// only process the relevant messages, warn if origins fails cors
	if (relevant) {
		if (verifyCors({cors, origin})) return true
		else console.warn(`message denied, from origin "${origin}"`, message)
	}

	return false
}
