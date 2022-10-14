
import {XiomeWebsiteContext} from "../../../build-types.js"
import {html} from "../../../../toolbox/hamster-html/html.js"
import fakestripePopupHtml from "../../partials/fakestripe-popup.html.js"

export default ({v}: XiomeWebsiteContext) => fakestripePopupHtml({
	name: "customer portal",
	contentHtml: html`
		<ul>
			<li>
				<button class=success>create new successful default payment method</button>
			</li>
			<li>
				<button class=failure>create new failing default payment method</button>
			</li>
			<li>
				<button class=detach>remove all payment methods</button>
			</li>
			<li>
				<button class=cancel>Cancel</button>
			</li>
		</ul>
	`,
})
