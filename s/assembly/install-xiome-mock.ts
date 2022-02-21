
import "./frontend/types/window-globals.js"

import {assembleXiomeMock} from "./assemble-mocks.js"
import {readXiomeMock} from "./frontend/read-xiome-mock.js"
import {registerComponents} from "../framework/component.js"

export async function installXiomeMock(config = readXiomeMock()) {
	const xiome = await assembleXiomeMock(config)
	document.body.prepend(xiome.modalsElement)
	registerComponents(xiome.components)
	window.xiome = xiome
	return xiome
}
