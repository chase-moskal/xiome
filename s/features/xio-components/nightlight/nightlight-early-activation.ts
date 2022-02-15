
const nightlightSettingsKey = "nightlightSettings"
const nightlightDataAttributeName = "data-nightlight"
const sourceElement = document.documentElement

const data = window.localStorage.getItem(nightlightSettingsKey)

const settings = data
	? JSON.parse(data)
	: undefined

if (settings) {
	if (settings.night)
		sourceElement.setAttribute(nightlightDataAttributeName, "")
	else
		sourceElement.removeAttribute(nightlightDataAttributeName)
}
