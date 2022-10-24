
import {XiomeWebsiteContext} from "../../build-types.js"
import {html} from "../../../toolbox/hamster-html/html.js"
import mocksitePageHtml from "../partials/mocksite-page.html.js"

export default ({...options}: XiomeWebsiteContext) =>

mocksitePageHtml({
...options,
mainHtml: html`

	<section>
		<h2>store</h2>

		<h3>subscription catalog TWO</h3>
		<template>
			<p>ASD</p>
		</template>
		<xiome-store-subscription-catalog-two>
			<template data-name=alpha>
				<p>alpha</p>
			</template>
			<template data-name=bravo>
				<p>bravo</p>
			</template>
		</xiome-store-subscription-catalog-two>
		<br/>
		<br/>

		<h3>connect</h3>
		<xiome-store-connect></xiome-store-connect>
		<br/>
		<br/>

		<h3>customer-portal</h3>
		<xiome-store-customer-portal></xiome-store-customer-portal>
		<br/>
		<br/>

		<h3>billing-area</h3>
		<xiome-store-billing-area></xiome-store-billing-area>
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
