
import {html, HtmlTemplate} from "../../../toolbox/hamster-html/html.js"

export default ({name, contentHtml}: {
	name: string
	contentHtml: HtmlTemplate
}) => html`

<!doctype html>
<html>
<head>
	<meta charset="utf-8"/>
	<meta name="viewport" content="width=device-width,initial-scale=1"/>
	<title>fake stripe ${name}</title>
	<script
		defer
		type=module
		src="../../features/store/popups/inside-actual-popups/run-popup.js"
	></script>
	<style>
		html, body {
			background: #444;
			color: #aaa;
			height: 100%;
		}
		h1 {
			font-size: 1.1em;
		}
	</style>
</head>
<body>
	<h1>fake stripe ${name}</h1>
	${contentHtml}
</body>
</html>

`
