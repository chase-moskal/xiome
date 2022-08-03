
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

	<button class=complete>Setup complete account</button>
	<button class=incomplete>Setup incomplete account</button>
	<button class=cancel>Cancel and do nothing</button>

	<script>
		const {popupId, return_url, refresh_url} = Object.fromEntries(
			new URLSearchParams(window.location.search).entries()
		)

		let commandId = 0
		const waitingForResponses = new Map()

		async function postSecretCommand(type) {
			const currentCommandId = commandId++
			window.opener.postMessage({
				type,
				commandId: currentCommandId,
				secretMockCommand: true,
			}, "*")
			return new Promise(resolve => {
				waitingForResponses.set(currentCommandId, resolve)
			})
		}

		window.addEventListener("message", event => {
			const isFromParent = event.source === window.opener
			const isSecretMockCommand = event.data.secretMockCommand === true
			if (isFromParent && isSecretMockCommand) {
				const resolve = waitingForResponses.get(event.data.commandId) ?? (() => {})
				resolve()
			}
		})

		document.querySelector("button.complete").onclick = async() => {
			await postSecretCommand("complete")
			window.location.href = return_url
		}

		document.querySelector("button.incomplete").onclick = async() => {
			await postSecretCommand("incomplete")
			window.location.href = return_url
		}

		document.querySelector("button.cancel").onclick = async() => {
			window.location.href = refresh_url
		}
	</script>
</body>
</html>

`
