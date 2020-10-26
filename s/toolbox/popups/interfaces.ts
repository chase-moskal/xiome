
export interface PopupHandler<Payload> {
	promisedPayload: Promise<Payload>
	closePopup: () => void
}

export enum PopupFlag {

	// popup says "hey, i'm done loading"
	ReadyResponse,

	// host page says "ok popup, now get to work"
	GoRequest,

	// popup says "here's the result"
	PayloadResponse,

	// popup says "this terrible error occurred"
	ErrorResponse,
}

export interface PopupMessage {
	flag: PopupFlag
	namespace: string
}

export interface PopupReadyResponse extends PopupMessage {
	flag: PopupFlag.ReadyResponse
}

export interface PopupGoRequest<Parameters extends {}> extends PopupMessage {
	flag: PopupFlag.GoRequest
	parameters: Parameters
}

export interface PopupPayloadResponse<Payload extends {}> extends PopupMessage {
	payload: Payload
	flag: PopupFlag.PayloadResponse
}

export interface PopupErrorResponse extends PopupMessage {
	error: Error
	flag: PopupFlag.ErrorResponse
}

export interface PopupMessageEvent<Data extends {}> extends MessageEvent {
	data: Data
}
