
import {XiomeWebsiteContext} from "../../../build-types.js"
import {html} from "../../../../toolbox/hamster-html/html.js"
import fakestripePopupHtml from "../../partials/fakestripe-popup.html.js"

export default ({v}: XiomeWebsiteContext) => fakestripePopupHtml({
	name: "checkout-payment-method",
	contentHtml: html`
		<button class=success>Link working card</button>
		<button class=failure>Link failing card</button>
		<button class=cancel>Cancel</button>
	`,
})
