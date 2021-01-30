
export class ValueChangeEvent<xParsedValue> extends CustomEvent<xParsedValue> {
	constructor(value: xParsedValue) {
		super("valuechange", {
			bubbles: true,
			composed: true,
			detail: value,
		})
	}
}
