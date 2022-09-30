export interface ConfirmActionOptions {
	message: string
	title: string
	loadingMessage: string
	cancelButtonLabel?: string
	confirmButtonLabel?: string
	actionWhenConfirmed: () => Promise<void>
}
