
import {XiomeWebsiteContext} from "../../build-types.js"
import {html} from "../../../toolbox/hamster-html/html.js"
import mocksitePageHtml from "../partials/mocksite-page.html.js"

export default ({...options}: XiomeWebsiteContext) =>

mocksitePageHtml({
...options,
mainHtml: html`

	<section>
		<h2>store</h2>
		<xiome-store-connect></xiome-store-connect>
	</section>
	<section>
		<h2>your account</h2>
		<xiome-login-panel show-logout="show-logout">
			<xiome-my-account></xiome-my-account>
		</xiome-login-panel>
	</section>
	<section>
		<h2>permissions</h2>
		<xiome-permissions></xiome-permissions>
		<h3>all privileges</h3>
		<xiome-privileges></xiome-privileges>
	</section>

`})
