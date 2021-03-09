
import {PopupFlag} from "../popup-flag.js"
import {PopupMessage} from "../popup-message.js"

export interface PopupPayloadResponse<Payload extends {}> extends PopupMessage {
	payload: Payload
	flag: PopupFlag.PayloadResponse
}
