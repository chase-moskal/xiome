
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
		<br/>
		<br/>
		<xiome-billing>
			<h3>billing panel</h3>
		</xiome-billing>
		<br/>
		<br/>
		<h3>subscriptions</h3>
		<xiome-subscriptions></xiome-subscriptions>
		<br/>
		<br/>
		<h3>subscription planning</h3>
		<xiome-subscription-planning></xiome-subscription-planning>
	</section>
	<br/>
	<br/>
	<section>
		<h2>your account</h2>
		<xiome-login-panel show-logout="show-logout">
			<xiome-my-account></xiome-my-account>
		</xiome-login-panel>
	</section>

`})
