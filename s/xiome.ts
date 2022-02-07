
import "./assembly/frontend/types/window-globals.js"

import {assembleXiome} from "./assembly/assemble-xiome.js"
import {registerComponents} from "./framework/component.js"
import {readXiomeConfig} from "./assembly/frontend/read-xiome-config.js"

void async function xiome() {
	const xiome = await assembleXiome(readXiomeConfig())
	document.body.prepend(xiome.modalsElement)
	registerComponents(xiome.components)
	window.xiome = xiome
}()
