
import {ModalSystem} from "../types/modal-system.js"

export function prepareAlert(
		confirm: ModalSystem["confirm"]
	): ModalSystem["alert"] {

	return async({
			title,
			body = null,
			button = {label: "ok", vibe: "neutral"},
			focusNthElement = 1,
			blanketClickMeansNo = true,
		}) => {

		await confirm({
			title,
			body,
			blanketClickMeansNo,
			yes: button,
			no: null,
		})
	}
}
