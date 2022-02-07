
import "./assembly/frontend/types/window-globals.js"

import {assembleXiomeMock} from "./assembly/assemble-mocks.js"
import {readXiomeMock} from "./assembly/frontend/read-xiome-mock.js"
import {registerComponents} from "./framework/component.js"

void async function xiomeMock() {
	const xiome = await assembleXiomeMock(readXiomeMock())
	document.body.prepend(xiome.modalsElement)
	registerComponents(xiome.components)
	window.xiome = xiome
}()
