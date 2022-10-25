
import {XiomeWebsiteContext} from "../../build-types.js"
import {html} from "../../../toolbox/hamster-html/html.js"
import mocksitePageHtml from "../partials/mocksite-page.html.js"

export default ({...options}: XiomeWebsiteContext) =>

mocksitePageHtml({
...options,
mainHtml: html`

	<section>
		<h2>store</h2>

		<h3>xiome-store-subscription-tier</h3>
		<xiome-store-subscription-tier></xiome-store-subscription-tier>
		<br/>
		<br/>

		<h3>xiome-store-subscription-catalog</h3>
		<xiome-store-subscription-catalog>
			<template slot="8653c3550b980652f33ab788bccd51c45d30c555c3b898f70418680c7e87f3ab">
				<p>alpha</p>
			</template>
		</xiome-store-subscription-catalog>
		<br/>
		<br/>

		<h3>xiome-store-connect</h3>
		<xiome-store-connect></xiome-store-connect>
		<br/>
		<br/>

		<h3>xiome-store-customer-portal</h3>
		<xiome-store-customer-portal></xiome-store-customer-portal>
		<br/>
		<br/>

		<h3>xiome-store-billing-area</h3>
		<xiome-store-billing-area></xiome-store-billing-area>
		<br/>
		<br/>

		
		<h3>xiome-store-subscription-status</h3>
		<xiome-store-subscription-status></xiome-store-subscription-status>
		<br/>
		<br/>

		<h3>xiome-store-subscription-planning</h3>
		<xiome-store-subscription-planning></xiome-store-subscription-planning>

	</section>
	<br/>
	<br/>

	<section>
		<h2>your account</h2>

		<xiome-login-panel show-logout="show-logout">
			<xiome-my-account>
				<xiome-store-subscription-status></xiome-store-subscription-status>
				<xiome-store-billing-area></xiome-store-billing-area>
			</xiome-my-account>
		</xiome-login-panel>

	</section>

`})
