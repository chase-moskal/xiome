
import {XioButton} from "../xio-button.js"

export class PressEvent extends CustomEvent<XioButton> {
	constructor(button: XioButton) {
		super("press", {detail: button})
	}
}
