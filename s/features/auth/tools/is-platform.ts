
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"

export function isPlatform(appId: string, config: SecretConfig) {
	return config.platform.appDetails.appId === appId
}
