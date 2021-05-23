
export class ValueChangeEvent<xParsedValue> extends CustomEvent<{value: xParsedValue}> {
	constructor(value: xParsedValue) {
		super("valuechange", {
			bubbles: true,
			composed: true,
			detail: {value},
		})
	}
}
