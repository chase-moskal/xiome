
import {NightlightSettings} from "./nightlight-types.js"

export const nightlightStorageKey = "nightlightSettings"

export function nightlightSettingStorage() {
	return {

		save(settings: undefined | NightlightSettings) {
			if (settings)
				window.localStorage.setItem(
					nightlightStorageKey,
					JSON.stringify(settings),
				)
			else
				window.localStorage.removeItem(nightlightStorageKey)
		},

		load(): undefined | NightlightSettings {
			const data = window.localStorage.getItem(nightlightStorageKey)
			return data
				? JSON.parse(data)
				: undefined
		},
	}
}
