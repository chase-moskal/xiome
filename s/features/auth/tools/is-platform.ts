
import {PlatformConfig} from "../../../assembly/backend/types/platform-config.js"

export function isPlatform(appId: string, config: PlatformConfig) {
	return config.platform.appDetails.appId === appId
}
