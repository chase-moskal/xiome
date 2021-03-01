
import {PlatformConfig} from "../types/PlatformConfig"

export function isPlatform(appId: string, config: PlatformConfig) {
	return config.platform.appDetails.appId === appId
}
