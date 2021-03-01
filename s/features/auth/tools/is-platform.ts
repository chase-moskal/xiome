
import {PlatformConfig} from "../types/auth-types.js"

export function isPlatform(appId: string, config: PlatformConfig) {
	return config.platform.appDetails.appId === appId
}
