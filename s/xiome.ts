
import "menutown"
import "./toolbox/mobx-necessary-hack.js"
import "./assembly/frontend/window-globals.js"

import {assembleXiome} from "./assembly/assemble-xiome.js"
import {registerComponents} from "./framework/component.js"
import {readXiomeConfigElement} from "./assembly/frontend/read-xiome-config-element.js"

void async function xiome() {
	const xiome = await assembleXiome(readXiomeConfigElement())
	registerComponents(xiome.components)
	window.xiome = xiome
}()
