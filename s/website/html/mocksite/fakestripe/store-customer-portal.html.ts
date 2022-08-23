
import {XiomeWebsiteContext} from "../../../build-types.js"
import {html} from "../../../../toolbox/hamster-html/html.js"
import fakestripePopupHtml from "../../partials/fakestripe-popup.html.js"

export default ({v}: XiomeWebsiteContext) => fakestripePopupHtml({
	name: "customer portal",
	contentHtml: html`
	`,
})
