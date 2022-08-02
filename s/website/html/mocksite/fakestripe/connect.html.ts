
import {XiomeWebsiteContext} from "../../../build-types.js"
import {html} from "../../../../toolbox/hamster-html/html.js"

export default ({v}: XiomeWebsiteContext) => html`

<!doctype html>
<html>
<head>
	<meta charset="utf-8"/>
	<meta name="viewport" content="width=device-width,initial-scale=1"/>
	<title>Fake Stripe Connect</title>
</head>
<body>
	<h1>Fake Stripe Connect</h1>
	<button class=return>Return (connect link succeeded)</button>
	<button class=refresh>Refresh (account connect link invalid)</button>

	<script>
		const {return_url, refresh_url} = Object.fromEntries(
			new URLSearchParams(window.location.search).entries()
		)
		document.querySelector("button.return").onclick = () => {
			window.location.href = return_url
		}
		document.querySelector("button.refresh").onclick = () => {
			window.location.href = refresh_url
		}
	</script>
</body>
</html>

`
