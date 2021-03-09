
import {PopupFlag} from "../popup-flag.js"
import {PopupMessage} from "../popup-message.js"

export interface PopupReadyResponse extends PopupMessage {
	flag: PopupFlag.ReadyResponse
}
