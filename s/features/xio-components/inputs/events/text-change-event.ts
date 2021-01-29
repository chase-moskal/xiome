
export class TextChangeEvent extends CustomEvent<undefined> {
	constructor() {
		super("textchange", {
			bubbles: true,
			composed: true,
			detail: undefined,
		})
	}
}
