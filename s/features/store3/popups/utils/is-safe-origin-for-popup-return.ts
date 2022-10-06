
import {popupTrustedOrigins} from "../../../../assembly/constants.js"

export function isSafeOriginForPopupReturn(o: string) {
	return popupTrustedOrigins.includes(o)
}
