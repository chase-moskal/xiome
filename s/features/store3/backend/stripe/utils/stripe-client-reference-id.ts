
export const stripeClientReferenceId = {

	build({appId, userId}: {appId: string, userId: string}) {
		return `${appId} ${userId}`
	},

	parse(client_reference_id: string) {
		const [appId, userId] = client_reference_id.split(" ")
		return {appId, userId}
	}
}
