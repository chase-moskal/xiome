
import {makeAppForm} from "./app-form.js"
import {AppDisplay} from "../../../types/apps/app-display.js"

type AppForm = ReturnType<typeof makeAppForm>

export function multipleAppForms({configureNewAppForm}: {
		configureNewAppForm: (app: AppDisplay) => AppForm
	}) {

	const weakMap = new WeakMap<AppDisplay, AppForm>()

	function getAppForm(app: AppDisplay) {
		let appForm: AppForm
		if (weakMap.has(app)) {
			appForm = weakMap.get(app)
		}
		else {
			appForm = configureNewAppForm(app)
			weakMap.set(app, appForm)
		}
		return appForm
	}

	return {getAppForm}
}
