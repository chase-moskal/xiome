
import {html} from "../../../../../../../framework/component.js"

export function renderXiomeConfig(appId: string) {
	const h = (syntax: string, s: string) => html`<span data-syntax=${syntax}>${s}</span>`
	const tag = (s: string) => h("tag", s)
	const attr = (s: string) => h("attr", s)
	const data = (s: string) => h("data", s)
	const glue = (s: string) => h("glue", s)
	const quote = glue(`"`)
	const noquote = ""

	const bundle_link = "https://xiome.io/xiome.bundle.min.js"

	return html`
		${glue(`<`)}${tag(`script`)} ${attr(`async`)} ${attr(`defer`)} ${attr(`src`)}${glue(`=`)}${quote}${data(bundle_link)}${quote}${glue(`>`)}${glue(`</`)}${tag(`script`)}${glue(`>`)}
		<br/>
		${glue(`<`)}${tag(`xiome-config`)} ${attr(`app`)}${glue(`=`)}${quote}${data(appId)}${quote}${glue(`>`)}${glue(`</`)}${tag(`xiome-config`)}${glue(`>`)}
	`
}
