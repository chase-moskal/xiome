
import {ChatPersistence, ClientRecord} from "../../../common/types/chat-concepts.js"

export function makeChatServerGlobalist({clientRecords, persistence}: {
		persistence: ChatPersistence
		clientRecords: Set<ClientRecord>
	}) {
	return {
		async broadcast(action: (record: ClientRecord) => void) {
			for (const record of clientRecords.values())
				if (record.auth)
					action(record)
		},
	}
}
