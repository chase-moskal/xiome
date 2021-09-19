
export function mockDacastSdk({goodApiKey}: {goodApiKey: string}) {
	return {
		async verifyApiKey(apiKey: string) {
			return apiKey === goodApiKey
		}
	}
}
