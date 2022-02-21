
import "./frontend/types/window-globals.js"

import {assembleXiome} from "./assemble-xiome.js"
import {registerComponents} from "../framework/component.js"
import {readXiomeConfig} from "./frontend/read-xiome-config.js"

export async function installXiome(config = readXiomeConfig()) {
	const xiome = await assembleXiome(config)
	document.body.prepend(xiome.modalsElement)
	registerComponents(xiome.components)
	window.xiome = xiome
	return xiome
}
