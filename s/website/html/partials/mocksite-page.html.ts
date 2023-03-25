
import {XiomeWebsiteContext} from "../../build-types.js"
import {mocksiteAppId} from "../../../mocksite-app-id.js"
import {html, HtmlTemplate} from "../../../toolbox/hamster-html/html.js"

export default ({v, mode, base, mainHtml, headHtml}: {
	mainHtml: HtmlTemplate
	headHtml?: HtmlTemplate
} & XiomeWebsiteContext) => html`

<!doctype html>
<html>
<head>

	<meta charset="utf-8"/>
	<meta name="viewport" content="width=device-width,initial-scale=1"/>
	<meta name="darkreader" content="dark"/>

	<title>xiome mocksite</title>

	${mode === "mock"
		? html`
			<xiome-mock mode="app"></xiome-mock>
			<script defer type="importmap-shim" src="${base}/importmap.json"></script>
			<script defer type="module-shim" src="${base}/xiome-mock.js"></script>
			<script defer type="module-shim" src="${base}/features/xio-components/playground.js"></script>
			<script defer src="${base}/../node_modules/es-module-shims/dist/es-module-shims.js"></script>
		`
		: html`
			<xiome-config
				app="${mocksiteAppId}"
				platform="http://localhost:8080"
				api-server="http://localhost:8000/"
				chat-server="ws://localhost:8001/"
			></xiome-config>
			<script defer type="importmap-shim" src="${base}/importmap.json"></script>
			<script defer type="module-shim" src="${base}/xiome.js"></script>
			<script defer type="module-shim" src="${base}/features/xio-components/playground.js"></script>
			<script defer src="${base}/../node_modules/es-module-shims/dist/es-module-shims.js"></script>
		`}

	<style>
		* {
			margin: 0;
			padding: 0;
		}
		html, body {
			color: #999;
			background: #333;
		}
		body {
			padding: 1em;
		}
		[initially-hidden] {
			display: none;
		}
		h1, h2 {
			opacity: 0.4;
		}
		h1 {
			font-size: 4em;
		}
		h2 {
			font-size: 3em;
			margin-top: 1em;
			margin-bottom: 0.5em;
		}
		xiome-store-subscription-status:not(:defined),
		xiome-store-billing-area:not(:defined){
			display: none
		}
	</style>

	${headHtml}
</head>

<body>
	<main>
		<h1>mock site</h1>
		${mainHtml}
	</main>
</body>
</html>

`
