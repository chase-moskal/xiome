
import {XiomeWebsiteContext} from "../../../build-types.js"
import {html} from "../../../../toolbox/hamster-html/html.js"

export default ({v}: XiomeWebsiteContext) => html`

<!doctype html>
<html>
<head>
	<meta charset="utf-8"/>
	<meta name="viewport" content="width=device-width,initial-scale=1"/>
	<title>Fake Stripe Connect</title>
	<script
		defer
		type=module
		src="/features/store2/popups/inside-actual-popups/run-popup.js"
	></script>
</head>
<body>
	<h1>Fake Stripe Connect</h1>
	<button class=complete>Setup complete account</button>
	<button class=incomplete>Setup incomplete account</button>
	<button class=cancel>Cancel and do nothing</button>
</body>
</html>

`
