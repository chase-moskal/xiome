
import {NightlightChangeDetail} from "./nightlight-types.js"

export class NightlightChangeEvent extends CustomEvent<NightlightChangeDetail> {
	constructor(detail: NightlightChangeDetail) {
		super("nightlightChange", {
			detail,
			bubbles: true,
		})
	}
}
