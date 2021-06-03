
import {Topic} from "renraku/x/types/primitives/topic.js"
import {HttpRequest} from "renraku/x/types/http/http-request.js"

export interface ServiceParts<xMeta, xAuth, xTopic extends Topic<xAuth>> {
	policy: (meta: xMeta, request: HttpRequest) => Promise<xAuth>
	expose: xTopic
}
