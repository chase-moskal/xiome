
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"

export function isPlatform(id_app: string, config: SecretConfig) {
	return config.platform.appDetails.id_app === id_app
}
