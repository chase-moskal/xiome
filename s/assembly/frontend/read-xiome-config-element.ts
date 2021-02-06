
import {XiomeConfig} from "./types/xiome-config.js"

export function readXiomeConfigElement(): XiomeConfig {
	const xiomeConfig = document.querySelector("xiome-config")
	if (!xiomeConfig) throw new Error(`<xiome-config> is required`)

	const fresh = {
		mock: xiomeConfig.getAttribute("mock"),
		appToken: xiomeConfig.getAttribute("app-token"),
		apiOrigin: xiomeConfig.getAttribute("api-origin"),
	}

	const mock: undefined | "app" | "platform" =
		fresh.mock === null
			? undefined
			: fresh.mock === "platform"
				? "platform"
				: "app"

	return mock
		? {mock}
		: {
			appToken: fresh.appToken,
			apiOrigin: fresh.apiOrigin,
		}
}
