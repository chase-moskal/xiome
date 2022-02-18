
import {XiomeWebsiteContext} from "../../build-types.js"
import {html} from "../../../toolbox/hamster-html/html.js"
import mocksitePageHtml from "../partials/mocksite-page.html.js"

export default ({...options}: XiomeWebsiteContext) =>

mocksitePageHtml({
...options,
headHtml: html`

	<style>
		xiome-video-display {
			max-width: 480px;
		}
	</style>

`,
mainHtml: html`

	<xiome-login-panel show-logout="show-logout">
		<section>
			<h2>your account</h2>
			<xiome-my-account></xiome-my-account>
		</section>
	</xiome-login-panel>
	<section>
		<h2>notes</h2>
		<xiome-notes-button></xiome-notes-button>
		<xiome-notes></xiome-notes>
	</section>
	<section>
		<h2>example</h2>
		<xiome-example></xiome-example>
	</section>
	<section>
		<h2>avatars</h2>
		<xio-avatar></xio-avatar>
		<xio-avatar spec='{"type": "simple", "value": 0.0}'></xio-avatar>
		<xio-avatar spec='{"type": "simple", "value": 0.1}'></xio-avatar>
		<xio-avatar spec='{"type": "simple", "value": 0.2}'></xio-avatar>
		<xio-avatar spec='{"type": "simple", "value": 0.3}'></xio-avatar>
		<xio-avatar spec='{"type": "simple", "value": 0.4}'></xio-avatar>
		<xio-avatar spec='{"type": "simple", "value": 0.5}'></xio-avatar>
		<xio-avatar spec='{"type": "simple", "value": 0.6}'></xio-avatar>
		<xio-avatar spec='{"type": "simple", "value": 0.8}'></xio-avatar>
		<xio-avatar spec='{"type": "simple", "value": 0.9}'></xio-avatar>
	</section>
	<section>
		<h2>chat</h2>
		<xiome-chat></xiome-chat>
	</section>
	<section>
		<h2>videos</h2>
		<h3>video hosting</h3>
		<xiome-video-hosting></xiome-video-hosting>
		<h3>video display</h3>
		<xiome-video-display mock-embed="mock-embed" show-title="show-title"></xiome-video-display>
	</section>
	<section>
		<h2>playground</h2>
		<xio-playground></xio-playground>
	</section>
	<section>
		<h2>questions</h2>
		<xiome-questions></xiome-questions>
	</section>
	<section>
		<h2>manage users</h2>
		<xiome-manage-users></xiome-manage-users>
	</section>
	<section>
		<h2>permissions</h2>
		<xiome-permissions></xiome-permissions>
		<h3>all privileges</h3>
		<xiome-privileges></xiome-privileges>
	</section>
	<section>
		<h2>ecommerce settings</h2>
		<xiome-ecommerce></xiome-ecommerce>
	</section>
	<section>
		<h2>subscription plans</h2>
		<xiome-subscription-planner></xiome-subscription-planner>
	</section>

`})
