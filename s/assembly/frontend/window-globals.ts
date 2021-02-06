
import {Await} from "../../types/fancy.js"
import {assembleXiome} from "../assemble-xiome.js"

declare global {
	interface Window {
		xiome: Await<ReturnType<typeof assembleXiome>>
	}
}
