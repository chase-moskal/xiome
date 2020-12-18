
import {PlatformConfig} from "../auth-types.js"

export function isPlatform(appId: string, config: PlatformConfig) {
	return config.platform.app.appId === appId
}
