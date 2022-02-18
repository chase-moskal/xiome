
import {XiomeWebsiteContext} from "../../build-types.js"
import {html} from "../../../toolbox/hamster-html/html.js"
import mocksitePageHtml from "../partials/mocksite-page.html.js"

export default ({...options}: XiomeWebsiteContext) =>

mocksitePageHtml({
...options,
mainHtml: html`

	<section>
		<h2>chat room "default"</h2>
		<xiome-chat></xiome-chat>
		<h2>chat room "default" again</h2>
		<xiome-chat></xiome-chat>
		<h2>chat room "lol"</h2>
		<xiome-chat room="lol"></xiome-chat>
	</section>

	<section>
		<h2>chat</h2>
		<xiome-login-panel show-logout="show-logout">
			<xiome-my-account></xiome-my-account>
		</xiome-login-panel>
	</section>

`})
