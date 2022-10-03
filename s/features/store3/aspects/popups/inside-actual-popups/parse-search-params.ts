
export function parseSearchParams<xParams extends {}>() {
	return <xParams>Object.fromEntries(
		new URLSearchParams(window.location.search).entries()
	)
}
