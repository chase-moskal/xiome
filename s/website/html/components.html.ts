
import pageHtml from "./partials/page.html.js"
import {XiomeWebsiteContext} from "../build-types.js"
import {html, untab} from "../../toolbox/hamster-html/html.js"

export default ({mode, base, ...options}: XiomeWebsiteContext) =>

pageHtml({
...options,
mode,
base,
pageName: "components",
headHtml: html`

${mode === "mock" || mode === "local"
	? html`<script defer type="module-shim" src="${base}/demos.js"></script>`
	: html`<script defer src="${base}/demos.bundle.min.js"></script>`}

`,
mainHtml: html`

<div class="page">
	<div class="explainer">
		<h2>browse for components you'd like to plug into your website</h2>
		<p>to install a component, copy the green html code into your website's html &lt;body&gt; section</p>
	</div>
	<ol class="componentgrid">
		<li>
			<div class="summary">
				<h3><span>my account</span><span> component</span></h3>
				<p>this component allows users to edit their profile</p>
				<code class="htmlcode codeblock">${untab(`
					<xiome-my-account></xiome-my-account>
				`).trim()}</code>
			</div>
			<div class="demo">
				<demo-xiome-my-account></demo-xiome-my-account>
			</div>
		</li>
		<li>
			<div class="summary">
				<h3><span>login panel</span><span> component</span></h3>
				<p>the component allows users to login or logout, and you control what's displayed in different states</p>
				<code class="htmlcode codeblock">${untab(`
					<xiome-login-panel show-logout>
						<p>You are logged in</p>
						<p slot=logged-out>You are logged out</p>
					</xiome-login-panel>
				`).trim()}</code>
			</div>
			<div class="demo">
				<demo-xiome-login-panel show-logout="show-logout">
					<p>You are logged in</p>
					<p slot="logged-out">You are logged out</p>
				</demo-xiome-login-panel>
			</div>
		</li>
		<li>
			<div class="summary">
				<h3><span>questions</span><span> component</span></h3>
				<p>a community board where users can post questions</p>
				<code class="htmlcode codeblock">${untab(`
					<xiome-questions board=default></xiome-questions>
				`).trim()}</code>
			</div>
			<div class="demo">
				<demo-xiome-questions></demo-xiome-questions>
			</div>
		</li>
		<li>
			<div class="summary">
				<h3><span>manage users</span><span> component</span></h3>
				<p>admins can ban naughty users with this handy search widget</p>
				<code class="htmlcode codeblock">${untab(`
					<xiome-manage-users></xiome-manage-users>
				`).trim()}</code>
			</div>
			<div class="demo">
				<demo-xiome-manage-users></demo-xiome-manage-users>
			</div>
		</li>
		<li>
			<div class="summary">
				<h3><span>permissions</span><span> component</span></h3>
				<p>admins can setup advanced roles and privileges</p>
				<code class="htmlcode codeblock">${untab(`
					<xiome-permissions></xiome-permissions>
				`).trim()}</code>
			</div>
			<div class="demo">
				<demo-xiome-permissions></demo-xiome-permissions>
			</div>
		</li>
	</ol>
	<h2 class="note">
		<p>more components coming soon</p>
	</h2>
</div>

`})
