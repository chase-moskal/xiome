
import {XiomeWebsiteContext} from "../../../build-types.js"
import {html} from "../../../../toolbox/hamster-html/html.js"

export default ({v}: XiomeWebsiteContext) => html`

<!doctype html>
<html>
<head>
	<meta charset="utf-8"/>
	<meta name="viewport" content="width=device-width,initial-scale=1"/>
	<title>Fake Stripe Checkout</title>
</head>
<body>
	<h1>Fake Stripe Checkout</h1>
	<button class=success>Succeed with Purchase</button>
	<button class=cancel>Cancel Purchase</button>

	<script>
		const {success_url, cancel_url} = Object.fromEntries(
			new URLSearchParams(window.location.search).entries()
		)
		document.querySelector("button.success").onclick = () => {
			window.location.href = success_url
		}
		document.querySelector("button.cancel").onclick = () => {
			window.location.href = cancel_url
		}
	</script>
</body>
</html>

`
