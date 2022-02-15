
import {NightlightChangeEvent} from "./nightlight-change-event.js"

export interface NightlightChangeDetail {
	night: boolean
}

export interface NightlightChangeHandler {
	(event: NightlightChangeEvent): void
}

export interface NightlightSettings {
	night: boolean
}
