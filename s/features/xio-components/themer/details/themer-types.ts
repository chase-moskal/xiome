
import {ThemeChangeEvent} from "./theme-change-event.js"

export interface ThemeChangeDetail {
	dark: boolean
}

export interface ThemeChangeHandler {
	(event: ThemeChangeEvent): void
}
