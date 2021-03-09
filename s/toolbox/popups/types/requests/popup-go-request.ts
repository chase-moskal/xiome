
import {PopupFlag} from "../popup-flag.js"
import {PopupMessage} from "../popup-message.js"

export interface PopupGoRequest<Parameters extends {}> extends PopupMessage {
	flag: PopupFlag.GoRequest
	parameters: Parameters
}
