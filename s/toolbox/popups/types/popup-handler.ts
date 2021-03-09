
export interface PopupHandler<Payload> {
	promisedPayload: Promise<Payload>
	closePopup: () => void
}
