
import {html, render} from "./html.js"
import {Suite, assert, expect} from "cynic"

export default <Suite>{
	"santization": {
		"sanitization occurs by default": async () => {
			const input = html`${"<div></div>"}`
			const output = "&lt;div&gt;&lt;/div&gt;"

			assert(render(input)===output,"sanitization should occur, but doesn't")
		}
	},
	"nesting": {
		"nested html functions must not be sanitized": async () => {
			const input = html`${html`<div></div>`}`
			const output = "<div></div>"
	
			assert(render(input)===output, "nested html function is sanitized")
		},
		"multiple html functions can be nested": async () => {
			const input = html`${html`${html`${html`<div></div>`}`}`}`
			const output = "<div></div>"

			expect(render(input)).equals(output)
		},
		"nested injected values are sanitized": async () => {
			const input = html`${html`${`<script></script>`}`}`
			const output = "&lt;script&gt;&lt;/script&gt;"

			assert(render(input)===output, "nested injected values are not sanitized")
		}
	},
	"arrays": {
		async "arrays of values are joined together cleanly"() {
			const items = ["alpha", "bravo"]
			const output = render(html`${items}`)
			assert(output === "alphabravo", "arrays should be cleanly joined")
		},
	},
}
