
import {XiomeWebsiteContext} from "../../build-types.js"
import {html, HtmlTemplate} from "../../../toolbox/hamster-html/html.js"

export default ({v, mode, base, pageName, pageSubtitle, mainHtml, headHtml}: {
	pageName: string
	mainHtml: HtmlTemplate
	pageSubtitle?: string
	headHtml?: HtmlTemplate
} & XiomeWebsiteContext) => html`

<html>
<head>

	<meta charset="utf-8"/>
	<meta name="viewport" content="width=device-width,initial-scale=1"/>
	<meta name="darkreader" content="dark"/>
	<title>xiome.io${pageSubtitle && " – " + pageSubtitle}</title>
	<link rel="stylesheet" href="${v(`${base}/styles.css`)}"/>
	<link rel="icon" type="image/png" href="${base}/favicon.png"/>

	${(() => {
		if (mode === "mock") return html`
			<xiome-mock mode="platform"></xiome-mock>
			<script defer type="importmap-shim" src="${base}/importmap.json"></script>
			<script defer type="module-shim" src="${base}/xiome-mock.js"></script>
			<script defer src="${base}/../node_modules/es-module-shims/dist/es-module-shims.js"></script>
		`
		else if (mode === "local") return html`
			<xiome-config
				app="77772a748c61250b85b84b6fcee3d2c5f9b3b62afa29adf1afbcfe73c0a7217f"
				platform="http://localhost:8080"
				api-server="http://localhost:8000/"
				chat-server="ws://localhost:8001/"
			></xiome-config>
			<script defer type="importmap-shim" src="${base}/importmap.json"></script>
			<script defer type="module-shim" src="${base}/xiome-mock.js"></script>
			<script defer src="${base}/../node_modules/es-module-shims/dist/es-module-shims.js"></script>
		`
		else return html`
			<script>
				const config = document.createElement("xiome-config")
				config.setAttribute("app", "77772a748c61250b85b84b6fcee3d2c5f9b3b62afa29adf1afbcfe73c0a7217f")
				switch (window.location.hostname) {
					case "xiome.io": {
						config.setAttribute("platform", "https://xiome.io")
						break
					}
					case "stage.xiome.io": {
						config.setAttribute("platform", "https://stage.xiome.io")
						document.documentElement.className += " stage"
						break
					}
					case "localhost": {
						config.setAttribute("platform", "http://localhost:8080")
						config.setAttribute("api-server", "http://localhost:8000/")
						config.setAttribute("chat-server", "ws://localhost:8001/")
						break
					}
					default: {
						throw new Error("unknown xiome hostname")
					}
				}
				document.head.appendChild(config)
			</script>
			<script defer="defer" src="${v(`${base}/xiome.bundle.min.js`)}"></script>
		`
	})()}

	${headHtml}
</head>

<body data-page="${pageName}">
	<div class="stageplate">
		<p class="angry">oops!</p>
		<p>you've wandered onto our developer testing stage!</p>
		<p>it looks like the real thing, but it's a sham!</p>
		<br/>
		<p>go back to the real <a href="https://xiome.io/">xiome.io</a></p>
	</div>
	<header class="siteheader">
		<div>
			<h1>
				<span class="title">Xiome</span>
				<span class="prerelease">
					<span class="prerelease-tag">alpha</span>
					<span class="prerelease-note">for experimentation only</span>
				</span>
			</h1>
			<nav>
				<a href="${base}/">learn</a>
				<a href="${base}/setup">setup</a>
				<a href="${base}/components">components</a>
			</nav>
		</div>
		<xio-menu sticky initially-hidden>
			<xio-menu-item>
				<xiome-my-avatar></xiome-my-avatar>
				<xiome-login-panel slot="panel" show-logout>
					<xiome-my-account></xiome-my-account>
				</xiome-login-panel>
			</xio-menu-item>
		</xio-menu>
	</header>
	<main>
		${mainHtml}
	</main>
	<footer class="sitefooter">
		<p>
			<a target="_blank" href="mailto:hello@xiome.io">hello@xiome.io</a>
			<span>—</span> send us an email
		</p>
		<p>
			<a target="_blank" href="https://github.com/chase-moskal/xiome#readme">xiome on github</a>
			<span>—</span> collaborate with developers</p>
		<p>
			<a target="_blank" href="https://discord.gg/rcfSjwGFYn">xiome on discord</a>
			<span>—</span> chat with us, we're here to help!
		</p>
		<br/>
		<small>
			<p><a target="_blank" href="${base}/legal">policies and terms of service</a></p>
		</small>
	</footer>
</body>
</html>

`
