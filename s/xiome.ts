
import "menutown"
import "./toolbox/mobx-necessary-hack.js"
import "./assembly/frontend/window-globals.js"

import {demos} from "./assembly/demos.js"
import {assembleXiome} from "./assembly/assemble-xiome.js"
import {registerComponents} from "./framework/component2/component2.js"
import {readXiomeConfigElement} from "./assembly/frontend/read-xiome-config-element.js"

void async function xiome() {
	const xiome = await assembleXiome(readXiomeConfigElement())
	document.body.prepend(xiome.modalsElement)
	registerComponents(xiome.components)
	window.xiome = xiome

	if (/^((stage\.|)xiome\.io|localhost)$/.test(window.location.hostname))
		await demos()
}()
