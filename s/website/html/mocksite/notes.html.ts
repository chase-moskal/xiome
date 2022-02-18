
import {XiomeWebsiteContext} from "../../build-types.js"
import {html} from "../../../toolbox/hamster-html/html.js"
import mocksitePageHtml from "../partials/mocksite-page.html.js"

export default ({...options}: XiomeWebsiteContext) =>

mocksitePageHtml({
...options,
mainHtml: html`

	<section>
		<h2>notes</h2>
		<xiome-notes-indicator></xiome-notes-indicator>
		<xiome-notes></xiome-notes>
	</section>
	<section>
		<h2>your account</h2>
		<xiome-login-panel show-logout="show-logout">
			<xiome-my-account></xiome-my-account>
		</xiome-login-panel>
	</section>

`})
