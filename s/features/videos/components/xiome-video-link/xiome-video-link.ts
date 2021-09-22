
import styles from "./xiome-video-link.css.js"
import {makeDacastModel} from "../../models/parts/dacast-model.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ComponentWithShare, mixinStyles, html} from "../../../../framework/component/component.js"

@mixinStyles(styles)
export class XiomeVideoLink extends ComponentWithShare<{
		dacastModel: ReturnType<typeof makeDacastModel>
	}> {

	get state() {
		return this.share.dacastModel.state
	}

	render() {
		return renderOp(this.state.accessOp, access => html`
			<p>DACAST</p>
		`)
	}
}
