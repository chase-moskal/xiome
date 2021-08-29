
import {makeExampleModel} from "../model/example-model.js"
import {ModalSystem} from "../../../assembly/frontend/modal/types/modal-system.js"
import {ComponentWithShare, html, mixinStyles} from "../../../framework/component/component.js"

import styles from "./styles/example-component.css.js"

@mixinStyles(styles)
export class XiomeExample extends ComponentWithShare<{
		modals: ModalSystem
		exampleModel: ReturnType<typeof makeExampleModel>
	}> {

	render() {
		return html`
			<p>Example</p>
		`
	}
}
