
import {PlatformConfig} from "../types/platform-config"

export function isPlatform(appId: string, config: PlatformConfig) {
	return config.platform.appDetails.appId === appId
}
