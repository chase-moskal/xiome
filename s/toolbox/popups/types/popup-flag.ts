
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
