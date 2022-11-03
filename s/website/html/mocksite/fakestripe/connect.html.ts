
import {XiomeWebsiteContext} from "../../../build-types.js"
import {html} from "../../../../toolbox/hamster-html/html.js"
import fakestripePopupHtml from "../../partials/fakestripe-popup.html.js"

export default ({v}: XiomeWebsiteContext) => fakestripePopupHtml({
	name: "connect",
	contentHtml: html`
		<button class=complete>Setup complete account</button>
		<button class=incomplete>Setup incomplete account</button>
		<button class=cancel>Cancel and do nothing</button>
	`,
})
