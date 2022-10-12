
import {XiomeWebsiteContext} from "../../build-types.js"
import {html} from "../../../toolbox/hamster-html/html.js"
import mocksitePageHtml from "../partials/mocksite-page.html.js"

export default ({...options}: XiomeWebsiteContext) =>

mocksitePageHtml({
...options,
mainHtml: html`

	<section>
		<h2>store</h2>

		<h3>connect</h3>
		<xiome-store-connect></xiome-store-connect>
		<br/>
		<br/>

		<h3>customer-portal</h3>
		<xiome-store-customer-portal></xiome-store-customer-portal>
		<br/>
		<br/>

		
		<h3>subscription status</h3>
		<xiome-store-subscription-status></xiome-store-subscription-status>
		<br/>
		<br/>

		<h3>subscription catalog</h3>
		<xiome-store-subscription-catalog></xiome-store-subscription-catalog>
		<br/>
		<br/>

		<h3>subscription planning</h3>
		<xiome-store-subscription-planning></xiome-subscription-store-planning>

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
