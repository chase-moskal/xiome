
import { html, render } from "./html.js";
import { Suite, assert, expect } from "cynic";

export default <Suite>{
	"santization": {
		"sanitization occurs by default": async () => {
			const input = html`${"<div></div>"}`
			const output = "&lt;div&gt;&lt;/div&gt;"

			assert(render(input)===output,"sanitization does not occur")
		},
		"nested html functions must not be sanitized": async () => {
			const input = html`${html`<div></div>`}`
			const output = "<div></div>"
	
			assert(render(input)===output, "nested html function is sanitized")
		}
	},
	"nesting": {
		"multiple html functions can be nested": async () => {
			const input = html`${html`${html`${html`<div></div>`}`}`}`
			const output = "<div></div>"

			expect(render(input)).equals(output)
		}
	}
}
