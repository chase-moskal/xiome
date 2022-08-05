
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
		src="/features/store2/popups/inside-actual-popups/run-popup.js"
	></script>
</head>
<body>
	<h1>fake stripe ${name}</h1>
	${contentHtml}
</body>
</html>

`
