
import {XiomeWebsiteContext} from "../../build-types.js"
import {html} from "../../../toolbox/hamster-html/html.js"

export default ({v}: XiomeWebsiteContext) => html`

<!doctype html>
<html>
<head>
	<meta charset="utf-8"/>
	<meta name="viewport" content="width=device-width,initial-scale=1"/>
	<script>
		const searchParams = new URLSearchParams(window.location.search)
		const result = Object.fromEntries(searchParams.entries())
		if (window.opener) {
			window.opener.postMessage(result, "*")
			window.close()
		}
		else {
			console.log("debug popup result", result)
		}
	</script>
</head>
<body>
	<p>loading...</p>
</body>
</html>

`
