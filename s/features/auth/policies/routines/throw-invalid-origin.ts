
import {App} from "../../types/App"
import {ApiError} from "renraku/x/api/api-error.js"
import {HttpRequest} from "renraku/x/types/http/http-request.js"

export function throwInvalidOrigin(request: HttpRequest, app: App) {

	if (!request.headers.origin)
		throw new ApiError(400, "origin header required")

	const valid = app.origins
		.some(origin => origin === request.headers.origin)

	if (!valid)
		throw new ApiError(403, "invalid origin")
}
