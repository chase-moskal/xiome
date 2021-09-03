
import {asApi} from "renraku/x/identities/as-api.js"
import {LivestreamApiOptions} from "./types/livestream-api-options.js"
import {makeLivestreamViewingService} from "./services/livestream-viewing-service.js"
import {makeLivestreamModerationService} from "./services/livestream-moderation-service.js"

export function livestreamApi(options: LivestreamApiOptions) {
	return asApi({
		livestreamViewingService: makeLivestreamViewingService(options),
		livestreamModerationService: makeLivestreamModerationService(options),
	})
}
