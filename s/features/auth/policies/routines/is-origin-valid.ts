
import {App} from "../../types/tokens/app.js"
import {HttpRequest} from "renraku/x/types/http/http-request.js"

export function isOriginValid(request: HttpRequest, app: App): boolean {
	return !!request.headers.origin
		&& app.origins.some(origin => origin === request.headers.origin)
}
