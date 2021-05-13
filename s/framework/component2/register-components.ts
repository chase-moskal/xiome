
import {dashify} from "../../toolbox/dashify.js"

export function registerComponents(
		components: {[name: string]: {new(): HTMLElement}}
	) {
	for (const [name, component] of Object.entries(components))
		customElements.define(dashify(name), component)
}
