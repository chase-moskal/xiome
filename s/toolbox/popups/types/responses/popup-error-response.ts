
import {PopupFlag} from "../popup-flag.js"
import {PopupMessage} from "../popup-message.js"

export interface PopupErrorResponse extends PopupMessage {
	error: Error
	flag: PopupFlag.ErrorResponse
}
