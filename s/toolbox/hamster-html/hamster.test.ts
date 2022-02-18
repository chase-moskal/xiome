
import {nap} from "@chasemoskal/snapstate"
import {Suite, assert, expect} from "cynic"
import {html, HtmlTemplate, render, unsanitized, untab} from "./html.js"
import {hashVersioner} from "./versioning/hash-versioner.js"

export default <Suite>{
	"ergonomics": {
		async "null and undefined injections do nothing"() {
			const expectedResult = "hello world"
			expect(html`hello${null} world`.toString()).equals(expectedResult)
			expect(html`hello${undefined} world`.toString()).equals(expectedResult)
			expect(html`hello${""} world`.toString()).equals(expectedResult)
		},
	},
	"async": {
		async "injected promises are resolved"() {
			const expectedResult = "hello world!"
			const promise = Promise.resolve("world!")
			expect(await html`hello ${promise}`.render()).equals(expectedResult)
		},
		async "injected promises can be nested"() {
			const expectedResult = "hello world!"
			const promise1 = Promise.resolve("world!")
			const promise2 = Promise.resolve(html`${promise1}`)
			expect(await html`hello ${promise2}`.render()).equals(expectedResult)
		},
		async "injected promises are sanitized"() {
			const promise = Promise.resolve("<script>")
			expect((await html`hello ${promise}`.render()).includes("<script>")).not.ok()
		},
		async "non-promise values can be rendered via async render"() {
			expect(await html`hello ${"world!"}`.render()).equals("hello world!")
		},
		async "multiple injections are ordered correctly"() {
			expect(await html`hello ${"world"}, ${"lmao"}`.render())
				.equals("hello world, lmao")
			const slowPromise = nap(10).then(() => "hello")
			const fastPromise = Promise.resolve("world")
			expect(await html`${slowPromise} ${fastPromise}!`.render())
				.equals("hello world!")
		},
	},
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
	"versioning": {
		async "adds file hash to url"() {
			const v = hashVersioner({root: "x"})
			const url = "xiome.bundle.min.js"
			const result = await v(url)
			assert(
				/(\S+)\?v=\S{64}/.test(result),
				"url is versioned with hash",
			)
		},
		async "adds file hash to url that already has a querystring"() {
			const v = hashVersioner({root: "x"})
			const url = "xiome.bundle.min.js?lol=rofl"
			const result = await v(url)
			assert(
				/(\S+)\?lol=rofl&v=\S{64}/.test(result),
				"url is versioned with hash",
			)
		},
	},
	"untab": {
		async "handles string without any tabbing"() {
			expect(untab("lol")).equals("lol")
		},
		async "removes leading tabs from input"() {
			const result1 = untab(`
				lol
			`)
			const result2 = untab(`
				lol
				rofl
			`)
			expect(result1).equals("\nlol\n")
			expect(result2).equals("\nlol\nrofl\n")
		},
		async "retains nested tabbing"() {
			expect(
				untab(`
					lol
						rofl
							kek
					lmao
				`)
			).equals("\nlol\n\trofl\n\t\tkek\nlmao\n")
			expect(
				untab(`
					lol

						rofl\n\t\t
							kek
					lmao
				`)
			).equals("\nlol\n\n\trofl\n\n\t\tkek\nlmao\n")
		},
	},
	"unsanitized": {
		async "unsanitized values are not sanitized"() {
			const value = "script"
			const result = html`${unsanitized(value)}`
			expect(result.toString()).equals(value)
		},
	},
}
