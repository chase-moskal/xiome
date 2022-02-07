
import {Suite, assert, expect} from "cynic"
import {html, HtmlTemplate, render} from "./html.js"

export default <Suite>{
	"sanitization": async() => {
		const isSanitized = (t: HtmlTemplate) => !render(t).includes("<script>")
		return {
			async "template itself is not sanitized"() {
				expect(!isSanitized(html`<script></script>`)).ok()
			},
			async "injected values are sanitized"() {
				expect(isSanitized(html`${"<script>"}`)).ok()
			},
			async "nested injected values are sanitized"() {
				expect(isSanitized(html`${html`${"<script>"}`}`)).ok()
			},
			async "injected array values are sanitized"() {
				expect(isSanitized(html`${["<script>"]}`)).ok()
			},
			async "object keys are sanitized"() {
				expect(isSanitized(html`${{"<script>": true}}`)).ok()
			},
			async "object values are sanitized"() {
				expect(isSanitized(html`${{a: "<script>"}}`)).ok()
			},
			async "object toString result is sanitized"() {
				expect(isSanitized(html`${{toString() {return "<script>"}}}`)).ok()
			},
		}
	},
	"nesting": {
		"nested html functions must not be sanitized": async () => {
			const input = html`${html`<div></div>`}`
			const output = "<div></div>"
			assert(render(input) === output, "nested html function is sanitized")
		},
		"multiple html functions can be nested": async () => {
			const input = html`${html`${html`${html`<div></div>`}`}`}`
			const output = "<div></div>"
			expect(render(input)).equals(output)
		},
		"nested injected values are sanitized": async () => {
			const input = html`${html`${`<script></script>`}`}`
			const output = "&lt;script&gt;&lt;/script&gt;"
			assert(render(input) === output, "nested injected values are not sanitized")
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
