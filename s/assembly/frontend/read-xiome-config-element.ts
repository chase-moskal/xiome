
import {XiomeConfig} from "./types/xiome-config.js"

export function readXiomeConfigElement(): XiomeConfig {
	const xiomeConfig = document.querySelector("xiome-config")
	if (!xiomeConfig) throw new Error(`<xiome-config> is required`)

	const attribute = (attr: string) =>
		xiomeConfig.getAttribute(attr) ?? undefined

	const fresh = {
		mock: attribute("mock"),
		appId: attribute("app"),
		apiOrigin: attribute("api"),
		platformOrigin: attribute("platform"),
	}

	const mock: undefined | "app" | "platform" =
		fresh.mock === undefined
			? undefined
			: fresh.mock === "platform"
				? "platform"
				: "app"

	return mock
		? {mock}
		: {
			appId: fresh.appId,
			apiOrigin: fresh.apiOrigin,
			platformOrigin: fresh.platformOrigin,
		}
}
