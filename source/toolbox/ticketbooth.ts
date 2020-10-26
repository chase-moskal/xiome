
export function makeTicketbooth() {
	let currentTicket = 0
	return {
		get ticket() {
			return currentTicket
		},
		pullTicket() {
			return ++currentTicket
		},
		pullSession() {
			const sessionTicket = ++currentTicket
			const sessionStillValid = () => sessionTicket === currentTicket
			return sessionStillValid
		},
	}
}
