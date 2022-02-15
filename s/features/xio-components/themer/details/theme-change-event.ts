
import {ThemeChangeDetail} from "./themer-types.js"

export class ThemeChangeEvent extends CustomEvent<ThemeChangeDetail> {
	constructor(detail: ThemeChangeDetail) {
		super("themechangeevent", {
			detail,
			bubbles: true,
		})
	}
}
