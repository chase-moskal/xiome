
import {CommonBuildOptions} from "../../build-types.js"
import {html} from "../../../toolbox/hamster-html/html.js"
import mocksitePageHtml from "../partials/mocksite-page.html.js"

export default ({mode, base}: CommonBuildOptions) =>

mocksitePageHtml({
mode,
base,
headHtml: html`

	<style>
		hr {
			margin: 1em auto;
		}
		xiome-video-display {
			max-width: 32em;
		}
		xiome-video-display::part(iframe) {
			aspect-ratio: 16 / 9;
		}
		xiome-video-companion {
			color: green;
		}
	</style>

`,
mainHtml: html`

	<section>
		<h2>videos</h2>
		<xiome-video-hosting></xiome-video-hosting>
		<hr />
		<xiome-video-views></xiome-video-views>
		<hr />
		<xiome-video-display initially-hidden="initially-hidden" mock-embed="mock-embed" show-title="show-title">
			<p>video is on</p>
			<p slot="unprivileged">you are not privileged to view this video</p>
			<p slot="unavailable">this video is unavailable</p>
		</xiome-video-display>
		<xiome-video-companion initially-hidden="initially-hidden">
			<p>video companion</p>
			<p slot="unprivileged">you are not privileged to view this video</p>
			<p slot="unavailable">this video is unavailable</p>
		</xiome-video-companion>
		<xiome-video-display initially-hidden="initially-hidden" mock-embed="mock-embed" show-title="show-title" label="abc">
			<p slot="unprivileged">you are not privileged to view this video</p>
			<p slot="unavailable">this video is unavailable</p>
		</xiome-video-display>
	</section>
	<hr />
	<section>
		<h2>your account</h2>
		<xiome-login-panel show-logout="show-logout">
			<xiome-my-account></xiome-my-account>
		</xiome-login-panel>
	</section>

`})
