
import {makeChatState} from "../state/chat-state.js"
import {ChatConnection} from "../../common/types/chat-concepts.js"

export function makeStatsFetcher({state, intervalDuration}: {
		intervalDuration: number
		state: ReturnType<typeof makeChatState>
	}) {
	let intervalId: NodeJS.Timer = undefined
	function clearStatsInterval() {
		clearInterval(intervalId)
		intervalId = undefined
	}
	return {
		startInterval(connection: ChatConnection) {
			clearStatsInterval()
			intervalId = setInterval(async() => {
				const stats = await connection.serverside.chatServer.getStats()
				state.writable.cache.roomStats = stats
			}, intervalDuration)
		},
		stopInterval: clearStatsInterval,
	}
}
