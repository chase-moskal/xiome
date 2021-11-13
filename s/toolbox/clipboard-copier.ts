
export function makeClipboardCopier({setCopied}: {
		setCopied: (copied: boolean) => void
	}) {

	let copyTimeout: any

	return {

		async copy(text: string) {
			try {
				await navigator.clipboard.writeText(text)
			}
			catch (error) {
				console.error("failed to copy to clipboard", error)
			}

			if (copyTimeout)
				clearTimeout(copyTimeout)

			setCopied(true)

			copyTimeout = setTimeout(
				() => {
					setCopied(false)
					copyTimeout = undefined
				},
				1000,
			)
		},
	}
}
