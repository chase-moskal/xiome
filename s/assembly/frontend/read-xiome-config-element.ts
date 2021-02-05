
export function readXiomeConfigElement() {
	const xiomeConfig = document.querySelector("xiome-config")
	if (!xiomeConfig) throw new Error(`<xiome-config> is required`)

	const appToken = xiomeConfig.getAttribute("app-token")

	return {appToken}
}
