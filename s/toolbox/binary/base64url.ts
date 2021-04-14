
function addEqualsPadding(base64: string) {
	return base64 + Array((4 - base64.length % 4) % 4 + 1).join("=")
}

export function encodeBase64url(binary: ArrayBuffer): string {
	return btoa(String.fromCharCode(...new Uint8Array(binary)))
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
}

export function decodeBase64url(base64: string): ArrayBuffer {
	return new Uint8Array(
		Array.from(
			atob(
				addEqualsPadding(
					base64
						.replace(/-/g, "+")
						.replace(/_/g, "/")
				)
			)
		)
		.map(character => character.charCodeAt(0))
	).buffer
}
