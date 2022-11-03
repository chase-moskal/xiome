
import {XiomeWebsiteContext} from "../../../build-types.js"
import {html} from "../../../../toolbox/hamster-html/html.js"
import fakestripePopupHtml from "../../partials/fakestripe-popup.html.js"

export default ({v}: XiomeWebsiteContext) => fakestripePopupHtml({
	name: "checkout",
	contentHtml: html`
		<button class=success>Succeed with Purchase</button>
		<button class=failure>fail purchase</button>
		<button class=cancel>Cancel Purchase</button>
	`,
})
