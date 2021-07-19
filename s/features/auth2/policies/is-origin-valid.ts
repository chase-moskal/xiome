
import {HttpRequest} from "renraku/x/types/http/http-request.js"

export function isOriginValid(request: HttpRequest, origins: string[]): boolean {
	return !!request.headers.origin
		&& origins.some(origin => origin === request.headers.origin)
}
