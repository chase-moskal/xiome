
import {XioCheckbox} from "../xio-checkbox.js"

export class CheckEvent extends CustomEvent<XioCheckbox> {
	constructor(checkbox: XioCheckbox) {
		super("press", {detail: checkbox})
	}
}
