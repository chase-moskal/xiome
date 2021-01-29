
import {AppTokenDisplay} from "./app-token-display.js"

export interface AppDisplay {
	appId: string
	label: string
	home: string
	tokens: AppTokenDisplay[]
}
