
export class EnterPressEvent extends CustomEvent<undefined> {
	constructor() {
		super("enterpress", {
			bubbles: true,
			composed: true,
			detail: undefined,
		})
	}
}
