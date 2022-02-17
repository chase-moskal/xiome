
import pageHtml from "./partials/page.html.js"
import {html} from "../../toolbox/hamster-html/html.js"

export default ({mode, base}: {
	mode: string
	base: string
}) =>

pageHtml({
mode,
base,
pageName: "setup",
mainHtml: html`

<xiome-login-panel initially-hidden>
	<h2 slot=logged-out>
		login to setup your community
	</h2>
	<xiome-app-manager initially-hidden>
		<h2 slot=register-app-heading>
			create a new community
		</h2>
	</xiome-app-manager>
</xiome-login-panel>

`})
